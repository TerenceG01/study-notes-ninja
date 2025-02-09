
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, level } = await req.json();

    // Define summarization levels
    const levelInstructions = {
      brief: "Summarize this text very concisely, reducing it to about 30% of its original length. Focus only on the most crucial points.",
      medium: "Summarize this text moderately, reducing it to about 50% of its original length. Include main points and some supporting details.",
      detailed: "Provide a detailed summary of this text, reducing it to about 70% of its original length. Include main points and important supporting details."
    };

    const prompt = `${levelInstructions[level]} Format the output with bullet points for key takeaways at the top, followed by a coherent paragraph summary. Maintain academic language and technical accuracy.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert at summarizing academic content while maintaining accuracy and clarity.'
          },
          {
            role: 'user',
            content: `${prompt}\n\nText to summarize:\n${content}`
          }
        ],
      }),
    });

    const data = await response.json();
    const summary = data.choices[0].message.content;

    return new Response(JSON.stringify({ summary }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
