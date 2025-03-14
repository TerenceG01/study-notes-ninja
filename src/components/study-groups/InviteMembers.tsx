
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Copy, Mail } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const emailFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

interface InviteMembersProps {
  groupId: string;
}

export const InviteMembers = ({ groupId }: InviteMembersProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [inviteCode, setInviteCode] = useState<string | null>(null);

  // Fetch group name for the email
  const { data: groupData } = useQuery({
    queryKey: ['study-group', groupId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('study_groups')
        .select('name')
        .eq('id', groupId)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const form = useForm<z.infer<typeof emailFormSchema>>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const createInviteMutation = useMutation({
    mutationFn: async ({ email, withCode }: { email?: string; withCode: boolean }) => {
      if (!user?.id) throw new Error("User not authenticated");

      // First create the invite in the database
      const { data, error } = await supabase
        .from('study_group_invites')
        .insert({
          group_id: groupId,
          email: email || null,
          created_by: user.id,
        })
        .select('invite_code')
        .single();

      if (error) throw error;
      
      // If email is provided and we have group data, send the invitation email
      if (email && data.invite_code && groupData) {
        try {
          // Show a loading toast while sending the email
          const loadingToastId = toast({
            title: "Sending invitation...",
            description: "Please wait while we send the invitation email.",
          }).id;
          
          // Add a timeout to make sure the invite is registered in the database
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const emailResponse = await supabase.functions.invoke('send-group-invite', {
            body: {
              email,
              inviteCode: data.invite_code,
              groupName: groupData.name,
            },
          });

          // Dismiss the loading toast
          toast.dismiss(loadingToastId);

          if (emailResponse.error) {
            console.error("Error sending invitation email:", emailResponse.error);
            throw new Error('Failed to send invitation email. Please try again later.');
          }
          
          console.log("Email response:", emailResponse);
        } catch (emailError) {
          console.error("Network or email sending error:", emailError);
          throw new Error('Network error while sending invitation. The invite was created successfully but the email could not be sent. The user can still join using the generated invite link.');
        }
      }

      if (withCode) setInviteCode(data.invite_code);
      return data;
    },
    onSuccess: (_, variables) => {
      if (variables.email) {
        toast({
          title: "Invite sent",
          description: `An invitation has been sent to ${variables.email}`,
        });
        form.reset();
      }
    },
    onError: (error) => {
      console.error("Invitation error:", error);
      toast({
        variant: "destructive",
        title: "Error sending invite",
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof emailFormSchema>) => {
    createInviteMutation.mutate({ email: values.email, withCode: false });
  };

  const generateInviteLink = () => {
    createInviteMutation.mutate({ withCode: true });
  };

  const copyInviteLink = async () => {
    if (!inviteCode) return;
    const inviteLink = `${window.location.origin}/study-groups/join/${inviteCode}`;
    await navigator.clipboard.writeText(inviteLink);
    toast({
      title: "Copied to clipboard",
      description: "The invite link has been copied to your clipboard.",
    });
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Invite by Email</FormLabel>
                <FormControl>
                  <div className="flex gap-2">
                    <Input placeholder="student@example.com" {...field} />
                    <Button 
                      type="submit" 
                      disabled={createInviteMutation.isPending}
                    >
                      {createInviteMutation.isPending && (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      )}
                      <Mail className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>

      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Or share an invite link:</p>
        {inviteCode ? (
          <div className="flex gap-2">
            <Input 
              value={`${window.location.origin}/study-groups/join/${inviteCode}`}
              readOnly
            />
            <Button variant="secondary" onClick={copyInviteLink}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button
            variant="secondary"
            onClick={generateInviteLink}
            disabled={createInviteMutation.isPending}
          >
            {createInviteMutation.isPending && (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            )}
            Generate Invite Link
          </Button>
        )}
      </div>
    </div>
  );
};
