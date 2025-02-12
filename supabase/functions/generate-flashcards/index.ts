
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { noteId, content, title } = await req.json();

    // Initialize OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert at creating high-quality flashcards for learning. Create 3-5 question-answer pairs from the given note. Format should be focused on key concepts and their explanations.'
          },
          {
            role: 'user',
            content: `Create flashcards from this note titled "${title}": ${content}`
          }
        ],
      }),
    });

    const aiResponse = await response.json();
    const flashcardsText = aiResponse.choices[0].message.content;

    // Create a deck
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: deck, error: deckError } = await supabaseClient
      .from('flashcard_decks')
      .insert([{
        title: `Flashcards for: ${title}`,
        description: `Generated from note: ${title}`,
        user_id: (await supabaseClient.auth.getUser(req.headers.get('Authorization')?.split('Bearer ')[1] ?? '')).data.user?.id
      }])
      .select()
      .single();

    if (deckError) throw deckError;

    // Parse AI response and create flashcards
    const lines = flashcardsText.split('\n').filter(line => line.trim());
    const flashcards = [];
    let currentQuestion = '';

    for (const line of lines) {
      if (line.startsWith('Q:') || line.startsWith('Question:')) {
        if (currentQuestion) {
          currentQuestion = '';
        }
        currentQuestion = line.replace(/^(Q:|Question:)\s*/, '').trim();
      } else if ((line.startsWith('A:') || line.startsWith('Answer:')) && currentQuestion) {
        const answer = line.replace(/^(A:|Answer:)\s*/, '').trim();
        flashcards.push({
          deck_id: deck.id,
          question: currentQuestion,
          answer: answer,
          note_id: noteId,
          has_multiple_choice_options: false // Initialize as false
        });
        currentQuestion = '';
      }
    }

    if (flashcards.length > 0) {
      const { data: insertedFlashcards, error: flashcardsError } = await supabaseClient
        .from('flashcards')
        .insert(flashcards)
        .select();

      if (flashcardsError) throw flashcardsError;

      // Generate multiple choice options for each flashcard
      for (const flashcard of insertedFlashcards) {
        await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/generate-multiple-choice`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ flashcardId: flashcard.id }),
        });
      }
    }

    return new Response(
      JSON.stringify({ success: true, deckId: deck.id, flashcardsCount: flashcards.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
