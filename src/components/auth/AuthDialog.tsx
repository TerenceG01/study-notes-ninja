
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { useLanguage } from "@/contexts/LanguageContext";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export function AuthDialog({
  open,
  onOpenChange,
  defaultTab = "sign-in",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: "sign-in" | "sign-up";
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>, mode: "sign-in" | "sign-up") => {
    setIsLoading(true);
    try {
      const { error } = mode === "sign-in"
        ? await supabase.auth.signInWithPassword({
            email: values.email,
            password: values.password,
          })
        : await supabase.auth.signUp({
            email: values.email,
            password: values.password,
          });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success(mode === "sign-in" ? "Signed in successfully!" : "Account created successfully!");
      onOpenChange(false);
      navigate("/notes");
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToSignIn = () => {
    setShowForgotPassword(false);
  };

  // If showing forgot password form, render that instead of the regular tabs
  if (showForgotPassword) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("resetYourPassword")}</DialogTitle>
          </DialogHeader>
          <ForgotPasswordForm onBackToSignIn={handleBackToSignIn} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("welcomeToStudyNotes")}</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sign-in">{t("signIn")}</TabsTrigger>
            <TabsTrigger value="sign-up">{t("getStartedFree")}</TabsTrigger>
          </TabsList>
          <TabsContent value="sign-in">
            <Form {...form}>
              <form onSubmit={form.handleSubmit((values) => onSubmit(values, "sign-in"))} className="space-y-4">
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
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("password")}</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder={t("enterYourPassword")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button 
                    type="button" 
                    variant="link" 
                    className="p-0 h-auto text-sm text-primary"
                    onClick={() => setShowForgotPassword(true)}
                  >
                    {t("forgotPassword")}
                  </Button>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? t("signingIn") : t("signIn")}
                </Button>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="sign-up">
            <Form {...form}>
              <form onSubmit={form.handleSubmit((values) => onSubmit(values, "sign-up"))} className="space-y-4">
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
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("password")}</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder={t("createPassword")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? t("creatingAccount") : t("createAccount")}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
