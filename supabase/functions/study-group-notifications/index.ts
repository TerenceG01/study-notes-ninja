
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface NotificationRequest {
  type: "new_member" | "new_reminder" | "new_note" | "description_update";
  email: string;
  groupName: string;
  details?: {
    memberName?: string;
    reminderTitle?: string;
    noteTitle?: string;
    newDescription?: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, email, groupName, details }: NotificationRequest = await req.json();
    
    console.log(`Sending ${type} notification to ${email} for group ${groupName}`);
    
    let subject = '';
    let htmlContent = '';
    
    // Generate email content based on notification type
    switch (type) {
      case "new_member":
        subject = `New member joined ${groupName}`;
        htmlContent = `
          <h1>New Member Alert</h1>
          <p>Hi there,</p>
          <p>${details?.memberName || "A new member"} has joined your study group <strong>${groupName}</strong>.</p>
          <p>Log in to connect with them and collaborate on your studies!</p>
        `;
        break;
        
      case "new_reminder":
        subject = `New reminder in ${groupName}`;
        htmlContent = `
          <h1>New Reminder Added</h1>
          <p>Hi there,</p>
          <p>A new reminder "${details?.reminderTitle}" has been added to your study group <strong>${groupName}</strong>.</p>
          <p>Log in to check the details and stay on top of your study schedule!</p>
        `;
        break;
        
      case "new_note":
        subject = `New note shared in ${groupName}`;
        htmlContent = `
          <h1>New Study Note Shared</h1>
          <p>Hi there,</p>
          <p>A new note "${details?.noteTitle}" has been shared in your study group <strong>${groupName}</strong>.</p>
          <p>Log in to view the note and enhance your study materials!</p>
        `;
        break;
        
      case "description_update":
        subject = `${groupName} description updated`;
        htmlContent = `
          <h1>Group Description Updated</h1>
          <p>Hi there,</p>
          <p>The description for <strong>${groupName}</strong> has been updated.</p>
          <p>New description: "${details?.newDescription}"</p>
          <p>Log in to see what else is new in your study group!</p>
        `;
        break;
        
      default:
        throw new Error("Invalid notification type");
    }
    
    // Add common footer
    htmlContent += `
      <p>Thanks for using Study Notes Ninja!</p>
      <p>If you didn't expect this notification, you can safely ignore this email.</p>
    `;

    const emailResponse = await resend.emails.send({
      from: "Study Groups <onboarding@resend.dev>",
      to: [email],
      subject: subject,
      html: htmlContent,
    });

    console.log("Notification email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in study-group-notifications function:", error);
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
