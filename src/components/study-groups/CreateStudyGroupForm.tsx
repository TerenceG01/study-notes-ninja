
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  subject: z.string().min(1, "Subject is required").max(100),
  description: z.string().max(500).optional(),
});

interface CreateStudyGroupFormProps {
  onSuccess?: () => void;
}

interface StudyGroup {
  id: string;
  name: string;
  subject: string;
  description: string | null;
  created_by: string;
  created_at: string;
}

interface CreateStudyGroupParams {
  p_name: string;
  p_subject: string;
  p_description: string;
  p_user_id: string;
}

interface AddGroupMemberParams {
  p_group_id: string;
  p_user_id: string;
  p_role: string;
}

export const CreateStudyGroupForm = ({ onSuccess }: CreateStudyGroupFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      subject: "",
      description: "",
    },
  });

  const createGroupMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      if (!user?.id) throw new Error("User not authenticated");

      const { data, error: groupError } = await supabase
        .rpc<StudyGroup, CreateStudyGroupParams>('create_study_group', {
          p_name: values.name,
          p_subject: values.subject,
          p_description: values.description || '',
          p_user_id: user.id
        });

      if (groupError) throw groupError;
      if (!data) throw new Error("Failed to create study group");

      const { error: memberError } = await supabase
        .rpc<null, AddGroupMemberParams>('add_group_member', {
          p_group_id: data.id,
          p_user_id: user.id,
          p_role: 'admin'
        });

      if (memberError) throw memberError;

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-groups'] });
      toast({
        title: "Study group created",
        description: "Your study group has been created successfully.",
      });
      form.reset();
      onSuccess?.();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error creating study group",
        description: error.message,
      });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createGroupMutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group Name</FormLabel>
              <FormControl>
                <Input placeholder="Study group name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Mathematics, History" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Brief description of your study group"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={createGroupMutation.isPending}
        >
          {createGroupMutation.isPending && (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          )}
          Create Study Group
        </Button>
      </form>
    </Form>
  );
};
