
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface InviteEmailRequest {
  email: string;
  inviteCode: string;
  groupName: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, inviteCode, groupName }: InviteEmailRequest = await req.json();
    const inviteUrl = `${new URL(req.url).origin}/study-groups/join/${inviteCode}`;

    console.log("Sending invite email to:", email, "for group:", groupName);

    const emailResponse = await resend.emails.send({
      from: "Study Groups <onboarding@resend.dev>",
      to: [email],
      subject: `Invitation to join ${groupName} study group`,
      html: `
        <h1>You've been invited to join a study group!</h1>
        <p>You've been invited to join the <strong>${groupName}</strong> study group.</p>
        <p>Click the link below to join:</p>
        <a href="${inviteUrl}">${inviteUrl}</a>
        <p>This invitation link will expire in 7 days.</p>
        <p>If you didn't expect this invitation, you can safely ignore this email.</p>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-group-invite function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
