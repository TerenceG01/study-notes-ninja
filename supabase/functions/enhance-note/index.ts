
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
    const { content, title, enhanceType } = await req.json();
    
    let systemPrompt = "";
    if (enhanceType === "grammar") {
      systemPrompt = "You are a helpful assistant specialized in correcting grammar, spelling, and punctuation. Preserve the original meaning and content while fixing errors.";
    } else if (enhanceType === "structure") {
      systemPrompt = "You are a helpful assistant specialized in improving document structure. Add appropriate headings, bullet points, numbered lists, and paragraphs where needed. Organize the content logically without changing the meaning.";
    } else {
      // Default case in case an invalid enhanceType is passed
      systemPrompt = "You are a helpful assistant specialized in improving document quality. Preserve the original meaning while making it more readable.";
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Please enhance the following note titled "${title}":\n\n${content}` }
        ],
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to enhance note');
    }
    
    const enhancedContent = data.choices[0].message.content;

    return new Response(JSON.stringify({ enhancedContent }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in enhance-note function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
