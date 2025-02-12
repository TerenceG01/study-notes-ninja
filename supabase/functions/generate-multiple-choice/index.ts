
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { flashcardId } = await req.json();

    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch the flashcard
    const { data: flashcard, error: flashcardError } = await supabase
      .from('flashcards')
      .select('*')
      .eq('id', flashcardId)
      .single();

    if (flashcardError) throw flashcardError;

    // Generate options using OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that generates plausible but incorrect multiple-choice options for flashcards. Generate 3 incorrect options that are similar enough to be challenging but definitely wrong. Return ONLY valid JSON, no markdown formatting or backticks."
          },
          {
            role: "user",
            content: `Generate 3 plausible but incorrect multiple choice options for this flashcard:
            Question: ${flashcard.question}
            Correct Answer: ${flashcard.answer}
            
            Return a JSON object with this exact structure (no markdown, no backticks):
            {
              "options": [
                {
                  "content": "incorrect option 1",
                  "explanation": "why this is wrong"
                },
                {
                  "content": "incorrect option 2",
                  "explanation": "why this is wrong"
                },
                {
                  "content": "incorrect option 3",
                  "explanation": "why this is wrong"
                }
              ]
            }`
          }
        ],
      }),
    });

    const aiResponse = await response.json();
    
    // Extract and parse the content, handling potential markdown formatting
    let generatedOptions;
    try {
      const content = aiResponse.choices[0].message.content;
      // Remove any potential markdown formatting or backticks
      const cleanContent = content.replace(/```json\n|\n```|`/g, '');
      generatedOptions = JSON.parse(cleanContent);
    } catch (error) {
      console.error('Error parsing AI response:', error);
      console.error('Raw AI response:', aiResponse.choices[0].message.content);
      throw new Error('Failed to parse AI response');
    }

    // Insert the correct answer first
    const { error: insertError } = await supabase
      .from('multiple_choice_options')
      .insert({
        flashcard_id: flashcardId,
        content: flashcard.answer,
        is_correct: true,
        explanation: null,
      });

    if (insertError) throw insertError;

    // Insert the incorrect options
    const incorrectOptions = generatedOptions.options.map((option: any) => ({
      flashcard_id: flashcardId,
      content: option.content,
      is_correct: false,
      explanation: option.explanation,
    }));

    const { error: incorrectInsertError } = await supabase
      .from('multiple_choice_options')
      .insert(incorrectOptions);

    if (incorrectInsertError) throw incorrectInsertError;

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
