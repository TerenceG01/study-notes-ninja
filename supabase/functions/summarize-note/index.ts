
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple in-memory cache
const summaryCache = new Map();

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, level } = await req.json();
    
    // Generate a cache key based on content and summary level
    const cacheKey = `${level}_${btoa(content.substring(0, 100))}`;
    
    // Check if we have a cached result
    if (summaryCache.has(cacheKey)) {
      console.log("Using cached summary result");
      return new Response(JSON.stringify({ summary: summaryCache.get(cacheKey) }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Define summarization levels with optimized instructions
    const levelInstructions = {
      brief: "Summarize this text very concisely, reducing it to about 30% of its original length. Focus only on the most crucial points.",
      medium: "Summarize this text moderately, reducing it to about 50% of its original length. Include main points and some supporting details.",
      detailed: "Provide a detailed summary of this text, reducing it to about 70% of its original length. Include main points and important supporting details."
    };

    const prompt = `${levelInstructions[level]} Format the output with bullet points for key takeaways at the top, followed by a coherent paragraph summary. Maintain academic language and technical accuracy.`;

    console.log(`Generating ${level} summary for content of length ${content.length}`);
    
    // Use gpt-4o-mini for faster response time
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Using the smaller, faster model
        messages: [
          {
            role: 'system',
            content: 'You are an expert at summarizing academic content while maintaining accuracy and clarity. Be concise and efficient.'
          },
          {
            role: 'user',
            content: `${prompt}\n\nText to summarize:\n${content}`
          }
        ],
        max_tokens: 1000, // Limiting tokens for faster response
        temperature: 0.3, // Lower temperature for more deterministic output
      }),
    });

    const data = await response.json();
    const summary = data.choices[0].message.content;
    
    // Store in cache (limit cache size to prevent memory issues)
    if (summaryCache.size > 50) {
      // Remove oldest entry if cache gets too large
      const firstKey = summaryCache.keys().next().value;
      summaryCache.delete(firstKey);
    }
    summaryCache.set(cacheKey, summary);

    return new Response(JSON.stringify({ summary }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error generating summary:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
