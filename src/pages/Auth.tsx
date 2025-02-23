
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { NavigationBar } from "@/components/navigation/NavigationBar";
import { BookOpen, PenLine, Brain, Users } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check for confirmation email success
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const type = hashParams.get('type');
    
    if (type === 'recovery' || type === 'signup') {
      navigate('/profile');
      toast({
        title: "Email confirmed!",
        description: "Your email has been confirmed. Welcome!",
      });
    }
  }, [navigate, toast]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin + '/auth#signup'
      }
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error signing up",
        description: error.message,
      });
    } else {
      toast({
        title: "Success!",
        description: "Please check your email to confirm your account.",
      });
    }
    setLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error signing in",
        description: error.message,
      });
    } else {
      navigate("/profile");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      <main className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="container grid lg:grid-cols-2 gap-8 px-4 py-8 items-center max-w-6xl mx-auto">
          {/* Auth Form */}
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-3xl font-bold tracking-tight">Welcome back</CardTitle>
              <CardDescription className="text-base">
                Sign in to your account or create a new one
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value="signin">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">Email</Label>
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signin-password">Password</Label>
                      <Input
                        id="signin-password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full"
                      />
                    </div>
                    <Button type="submit" className="w-full" size="lg" disabled={loading}>
                      {loading ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                </TabsContent>
                <TabsContent value="signup">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full"
                      />
                    </div>
                    <Button type="submit" className="w-full" size="lg" disabled={loading}>
                      {loading ? "Signing up..." : "Sign Up"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Animated Features */}
          <div className="hidden lg:flex flex-col gap-6">
            <div className="space-y-8">
              <h2 className="text-3xl font-bold tracking-tight text-primary animate-fade-in">
                Study Smarter with StudyNotes
              </h2>
              
              {/* Feature Cards */}
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-lg bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-[fadeSlideIn_0.5s_ease-out_forwards]">
                  <div className="p-2 rounded-full bg-primary/10">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Smart Note Taking</h3>
                    <p className="text-muted-foreground">Create and organize your study notes with ease</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-[fadeSlideIn_0.5s_ease-out_200ms_forwards]">
                  <div className="p-2 rounded-full bg-primary/10">
                    <PenLine className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">AI-Powered Summaries</h3>
                    <p className="text-muted-foreground">Generate concise summaries of your notes automatically</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-[fadeSlideIn_0.5s_ease-out_400ms_forwards]">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Brain className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Flashcard Generation</h3>
                    <p className="text-muted-foreground">Convert your notes into interactive flashcards</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-[fadeSlideIn_0.5s_ease-out_600ms_forwards]">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Study Groups</h3>
                    <p className="text-muted-foreground">Collaborate with peers in interactive study groups</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Auth;
