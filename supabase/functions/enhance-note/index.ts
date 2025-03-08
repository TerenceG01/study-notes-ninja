
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
    
    // Determine if content contains HTML
    const containsHtml = content.includes('<') && content.includes('>');
    console.log("Input content contains HTML:", containsHtml);
    
    let systemPrompt = "";
    if (enhanceType === "grammar") {
      systemPrompt = "You are a helpful assistant specialized in correcting grammar, spelling, and punctuation. Preserve the original meaning, structure, and formatting while fixing errors.";
    } else if (enhanceType === "structure") {
      // If content contains HTML, we need a different approach for structure enhancement
      if (containsHtml) {
        systemPrompt = `You are a helpful assistant that specializes in improving document structure.

Your task is to improve the structure and readability of HTML content while preserving ALL existing HTML tags and formatting.

Guidelines:
1. PRESERVE ALL EXISTING HTML TAGS exactly as they are - never output raw markdown like **, ##, or * symbols
2. Organize content with proper HTML heading tags (<h1>, <h2>, etc.)
3. Use proper HTML for lists:
   - Unordered lists with <ul> and <li> tags
   - Ordered lists with <ol> and <li> tags
4. Create proper paragraphs with <p> tags
5. Maintain all existing styling and formatting tags (<strong>, <em>, etc.)
6. DO NOT convert HTML to markdown or plain text
7. The returned content MUST be valid HTML that works in a WYSIWYG editor

Return the improved version with the same HTML structure but better organization.`;
      } else {
        // For plain text content without HTML
        systemPrompt = "You are a helpful assistant specialized in improving document structure. Format the content using proper HTML tags. Add appropriate headings (<h1>, <h2>, etc.), bullet points (<ul><li>), numbered lists (<ol><li>), and paragraphs (<p>) where needed. Do not use markdown syntax like ** or # - use proper HTML tags instead.";
      }
    } else {
      // Fallback for any unexpected enhanceType values
      systemPrompt = "You are a helpful assistant. Review the document and make minor improvements while preserving the original meaning and formatting. If the content contains HTML, preserve all HTML tags and structure.";
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
    
    let enhancedContent = data.choices[0].message.content;
    
    // Ensure enhanced content is properly formatted with HTML, not markdown
    if (enhanceType === "structure" && !containsHtml) {
      // If original content didn't have HTML but we're enhancing structure,
      // make sure we don't return markdown symbols
      enhancedContent = enhancedContent
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
        .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
        .replace(/^# (.*?)$/gm, '<h1>$1</h1>') // H1
        .replace(/^## (.*?)$/gm, '<h2>$1</h2>') // H2
        .replace(/^### (.*?)$/gm, '<h3>$1</h3>') // H3
        .replace(/^- (.*?)$/gm, '<li>$1</li>') // List items
        .replace(/<li>(.*?)<\/li>/g, '<ul><li>$1</li></ul>') // Wrap list items in ul
        .replace(/<\/ul><ul>/g, ''); // Fix consecutive lists
    }
    
    console.log("Content enhanced successfully. Contains HTML:", enhancedContent.includes("<"));

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
