
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

type FormData = z.infer<typeof formSchema>;

export const CreateStudyGroupForm = ({ onSuccess }: CreateStudyGroupFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      subject: "",
      description: "",
    },
  });

  const createGroupMutation = useMutation({
    mutationFn: async (values: FormData) => {
      if (!user?.id) throw new Error("User not authenticated");

      const { data: groupData, error: groupError } = await supabase.rpc('create_study_group', {
        p_name: values.name,
        p_subject: values.subject,
        p_description: values.description || '',
        p_user_id: user.id
      });

      if (groupError) throw groupError;
      if (!groupData) throw new Error("Failed to create study group");

      const { error: memberError } = await supabase.rpc('add_group_member', {
        p_group_id: groupData.id,
        p_user_id: user.id,
        p_role: 'admin'
      });

      if (memberError) throw memberError;

      return groupData;
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
        description: error instanceof Error ? error.message : "An error occurred",
      });
    },
  });

  const onSubmit = (values: FormData) => {
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
