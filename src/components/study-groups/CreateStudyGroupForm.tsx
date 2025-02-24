
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

const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  subject: z.string().min(1, "Subject is required").max(100),
  description: z.string().max(500).optional(),
});

export interface CreateStudyGroupFormProps {
  onSubmit: (data: { name: string; description: string }) => Promise<void>;
  onCancel: () => void;
  initialSubject?: string;
}

export const CreateStudyGroupForm = ({ onSubmit, onCancel, initialSubject }: CreateStudyGroupFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      subject: initialSubject || "",
      description: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    await onSubmit({
      name: values.name,
      description: values.description || "",
    });
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            Create Group
          </Button>
        </div>
      </form>
    </Form>
  );
};
