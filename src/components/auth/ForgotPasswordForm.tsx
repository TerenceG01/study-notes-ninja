
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Mail } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

interface ForgotPasswordFormProps {
  onBackToSignIn: () => void;
}

export function ForgotPasswordForm({ onBackToSignIn }: ForgotPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { t } = useLanguage();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      // Get the current window location to use as redirect URL
      const origin = window.location.origin;
      
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${origin}/reset-password`,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      setEmailSent(true);
      toast.success("Password reset instructions sent to your email");
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button 
        variant="ghost" 
        size="sm" 
        className="mb-2 px-0 flex items-center gap-1 text-muted-foreground"
        onClick={onBackToSignIn}
      >
        <ArrowLeft className="h-4 w-4" />
        {t("backToSignIn")}
      </Button>

      {emailSent ? (
        <div className="space-y-4">
          <Alert>
            <AlertDescription className="flex flex-col items-center text-center py-4">
              <Mail className="h-12 w-12 text-primary mb-2" />
              <h3 className="text-lg font-medium">{t("checkYourEmail")}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {t("resetInstructions")}
              </p>
            </AlertDescription>
          </Alert>
          <div className="text-sm text-center text-muted-foreground">
            <p>{t("didntReceiveEmail")}</p>
            <Button
              variant="link"
              className="p-0 h-auto text-primary"
              onClick={() => form.handleSubmit(onSubmit)()}
              disabled={isLoading}
            >
              {t("tryAgain")}
            </Button>
          </div>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("email")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("enterYourEmail")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className="text-sm text-muted-foreground">
              {t("enterEmailForReset")}
            </p>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t("sending") : t("sendResetLink")}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}
