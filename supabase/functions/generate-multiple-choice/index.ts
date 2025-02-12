
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

    // Generate options using OpenAI with a more focused prompt
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
            content: "Generate 3 plausible but incorrect multiple-choice options. Be concise and direct."
          },
          {
            role: "user",
            content: `Q: ${flashcard.question}
            A: ${flashcard.answer}
            
            Return in this format:
            {
              "options": [
                {"content": "wrong1", "explanation": "brief why wrong"},
                {"content": "wrong2", "explanation": "brief why wrong"},
                {"content": "wrong3", "explanation": "brief why wrong"}
              ]
            }`
          }
        ],
        temperature: 0.3, // Lower temperature for more focused responses
        max_tokens: 250 // Limit token count for faster responses
      }),
    });

    const aiResponse = await response.json();
    
    let generatedOptions;
    try {
      const content = aiResponse.choices[0].message.content;
      const cleanContent = content.replace(/```json\n|\n```|`/g, '');
      generatedOptions = JSON.parse(cleanContent);
    } catch (error) {
      console.error('Error parsing AI response:', error);
      console.error('Raw AI response:', aiResponse.choices[0].message.content);
      throw new Error('Failed to parse AI response');
    }

    // Insert both correct and incorrect options in a single operation
    const allOptions = [
      {
        flashcard_id: flashcardId,
        content: flashcard.answer,
        is_correct: true,
        explanation: null,
      },
      ...generatedOptions.options.map((option: any) => ({
        flashcard_id: flashcardId,
        content: option.content,
        is_correct: false,
        explanation: option.explanation,
      }))
    ];

    const { error: insertError } = await supabase
      .from('multiple_choice_options')
      .insert(allOptions);

    if (insertError) throw insertError;

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
