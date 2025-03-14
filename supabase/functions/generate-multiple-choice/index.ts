
import "https://deno.land/x/xhr@0.1.0/mod.ts";
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

    // First, delete any existing options for this flashcard
    await supabase
      .from('multiple_choice_options')
      .delete()
      .eq('flashcard_id', flashcardId);

    // Fetch the flashcard
    const { data: flashcard, error: flashcardError } = await supabase
      .from('flashcards')
      .select('*')
      .eq('id', flashcardId)
      .single();

    if (flashcardError) throw flashcardError;

    // Generate options using OpenAI with a more focused prompt
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4-1106-preview",
        messages: [
          {
            role: "system",
            content: "You will generate exactly 4 plausible but incorrect multiple-choice options. Return ONLY a JSON object with no additional text, formatting, or markdown."
          },
          {
            role: "user",
            content: `Generate 4 incorrect but plausible answer options for this question. The correct answer is: "${flashcard.answer}"
            Question: "${flashcard.question}"
            
            Return the options in this exact JSON format (no markdown, no additional text):
            {"options":[{"content":"wrong1","explanation":"why wrong"},{"content":"wrong2","explanation":"why wrong"},{"content":"wrong3","explanation":"why wrong"},{"content":"wrong4","explanation":"why wrong"}]}`
          }
        ],
        temperature: 0.3,
        max_tokens: 500,
        response_format: { type: "json_object" }  // Force JSON response
      }),
    });

    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${errorText}`);
    }

    const aiResponse = await openAIResponse.json();
    console.log('Raw AI response:', JSON.stringify(aiResponse));

    if (!aiResponse.choices?.[0]?.message?.content) {
      throw new Error('Unexpected OpenAI response format');
    }

    let generatedOptions;
    try {
      // Parse the content directly since we're using response_format: json_object
      generatedOptions = JSON.parse(aiResponse.choices[0].message.content);
      
      if (!generatedOptions?.options?.length) {
        throw new Error('Invalid options format in response');
      }
    } catch (error) {
      console.error('Error parsing AI response:', error);
      console.error('Raw AI response content:', aiResponse.choices[0].message.content);
      throw new Error(`Failed to parse AI response: ${error.message}`);
    }

    // Insert both correct and incorrect options in a single operation
    const allOptions = [
      {
        flashcard_id: flashcardId,
        content: flashcard.answer,
        is_correct: true,
        explanation: null,
      },
      ...generatedOptions.options.slice(0, 4).map((option: any) => ({
        flashcard_id: flashcardId,
        content: option.content,
        is_correct: false,
        explanation: option.explanation,
      }))
    ];

    // Insert the new options
    const { error: insertError } = await supabase
      .from('multiple_choice_options')
      .insert(allOptions);

    if (insertError) throw insertError;

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: error.stack
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
