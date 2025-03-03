
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Brain, Lightbulb, Sparkles, Users, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { AuthDialog } from "../components/auth/AuthDialog";
import { NavigationBar } from "@/components/navigation/NavigationBar";
import { cn } from "@/lib/utils";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authTab, setAuthTab] = useState<"sign-in" | "sign-up">("sign-up");
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({
    hero: false,
    features: false,
    howItWorks: false,
    testimonials: false,
    cta: false,
  });

  // Control animation visibility as components enter viewport
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    const sections = ['hero', 'features', 'howItWorks', 'testimonials', 'cta'];
    sections.forEach(section => {
      const element = document.getElementById(section);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const handleGetStarted = () => {
    if (user) {
      navigate('/notes');
    } else {
      setAuthTab("sign-up");
      setShowAuthDialog(true);
    }
  };

  const handleSignIn = () => {
    setAuthTab("sign-in");
    setShowAuthDialog(true);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <NavigationBar />
      
      {/* Hero Section */}
      <section id="hero" className="relative pt-20 lg:pt-28 overflow-hidden">
        <div className="container px-4 sm:px-6 mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-center text-center">
            <div 
              className={cn(
                "space-y-8 max-w-2xl mx-auto transition-all duration-1000 transform",
                isVisible.hero ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              )}
            >
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20">
                <Sparkles className="w-4 h-4 mr-2" />
                Smart Note-Taking for Students
              </div>
              
              <div className="relative">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="block mb-2">Transform Notes into</span>
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-blue-500">
                    Lasting Knowledge
                  </span>
                </h1>
                
                {/* Animated floating shapes */}
                <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
                  <div className="animate-float-slow absolute -top-4 -left-8 w-16 h-16 rounded-full bg-primary/10"></div>
                  <div className="animate-float-medium absolute top-1/4 right-8 w-20 h-20 rounded-full bg-secondary/20"></div>
                  <div className="animate-float-fast absolute bottom-0 left-1/4 w-12 h-12 rounded-full bg-primary/5"></div>
                  <div className="animate-spin-slow absolute top-1/3 right-1/4 w-8 h-8 rounded-md bg-secondary/10"></div>
                </div>
              </div>
              
              <p className="text-lg md:text-xl text-muted-foreground">
                The intelligent note-taking platform designed for students. Organize, collaborate, 
                and excel with AI-powered study tools.
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="rounded-full bg-primary hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-primary/25"
                  onClick={handleGetStarted}
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="rounded-full border-primary/20 hover:bg-primary/5"
                  onClick={handleSignIn}
                >
                  Sign In
                </Button>
              </div>
              
              <div className="flex items-center justify-center text-sm text-muted-foreground">
                <span className="inline-block w-4 h-4 rounded-full bg-green-500 mr-2"></span>
                No credit card required • Free plan available
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="container px-4 sm:px-6 mx-auto max-w-7xl">
          <div 
            className={cn(
              "text-center mb-16 transition-all duration-700",
              isVisible.features ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            )}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to <span className="text-primary">Excel</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform combines powerful tools to help you study smarter, not harder.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <FeatureCard 
                key={index} 
                feature={feature} 
                index={index} 
                isVisible={isVisible.features}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section id="howItWorks" className="py-24 bg-secondary/20">
        <div className="container px-4 sm:px-6 mx-auto max-w-7xl">
          <div 
            className={cn(
              "flex flex-col items-center text-center space-y-8 max-w-2xl mx-auto transition-all duration-700",
              isVisible.howItWorks ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            )}
          >
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20">
              <Lightbulb className="w-4 h-4 mr-2" />
              How It Works
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold">
              Supercharge Your Study Process
            </h2>
            
            <p className="text-lg text-muted-foreground">
              Our platform uses AI to help you create better study materials, understand complex topics,
              and retain information more effectively.
            </p>
            
            <div className="w-full max-w-md space-y-6 mt-8">
              {steps.map((step, index) => (
                <div 
                  key={index} 
                  className={cn(
                    "flex items-start gap-5 text-left transition-all duration-700 delay-300",
                    isVisible.howItWorks ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
                  )}
                  style={{ transitionDelay: `${index * 150 + 300}ms` }}
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white font-bold shrink-0 animate-pulse-slow">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <Button 
              className="mt-8 rounded-full"
              onClick={handleGetStarted}
            >
              Start Taking Notes
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section id="testimonials" className="py-24">
        <div className="container px-4 sm:px-6 mx-auto max-w-7xl text-center">
          <div 
            className={cn(
              "transition-all duration-700",
              isVisible.testimonials ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            )}
          >
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20 mb-4">
              <Users className="w-4 h-4 mr-2" />
              Student Success Stories
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-16">
              Join Thousands of Students Already Excelling
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className={cn(
                  "bg-card p-8 rounded-xl shadow-sm border border-border/50 hover:shadow-md transition-all duration-500",
                  "flex flex-col h-full transform",
                  isVisible.testimonials 
                    ? "opacity-100 translate-y-0" 
                    : "opacity-0 translate-y-20"
                )}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="text-primary mb-4">
                  {Array(5).fill(0).map((_, i) => (
                    <span key={i} className="text-lg">★</span>
                  ))}
                </div>
                <p className="text-foreground mb-6 flex-grow italic">"{testimonial.quote}"</p>
                <div className="flex items-center mt-auto">
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center font-bold text-primary mr-3">
                    {testimonial.name[0]}
                  </div>
                  <div className="text-left">
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section id="cta" className="py-20 bg-gradient-to-r from-primary/10 to-secondary/20 relative overflow-hidden">
        <div className="container px-4 sm:px-6 mx-auto max-w-7xl text-center relative z-10">
          <div 
            className={cn(
              "transition-all duration-700",
              isVisible.cta ? "opacity-100 scale-100" : "opacity-0 scale-95"
            )}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Study Experience?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join our community of students and start taking smarter notes today.
            </p>
            <Button 
              size="lg" 
              className="rounded-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-primary/25"
              onClick={handleGetStarted}
            >
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 -z-0">
          <div className="animate-float-slow absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-primary/5"></div>
          <div className="animate-float-medium absolute bottom-1/4 right-1/4 w-40 h-40 rounded-full bg-secondary/10"></div>
          <div className="animate-float-fast absolute top-3/4 left-3/4 w-24 h-24 rounded-full bg-primary/5"></div>
        </div>
      </section>
      
      <AuthDialog 
        open={showAuthDialog} 
        onOpenChange={setShowAuthDialog}
        defaultTab={authTab}
      />
    </div>
  );
};

// Feature data
const features = [
  {
    icon: <BookOpen className="h-8 w-8 text-primary" />,
    title: "Smart Organization",
    description: "Automatically organize your notes by subject, topic, and importance.",
  },
  {
    icon: <Brain className="h-8 w-8 text-primary" />,
    title: "AI-Powered Insights",
    description: "Get intelligent summaries and study recommendations based on your notes.",
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: "Collaborative Study",
    description: "Share notes and study together with classmates in real-time.",
  },
  {
    icon: <Zap className="h-8 w-8 text-primary" />,
    title: "Quick Capture",
    description: "Capture your thoughts quickly with our intuitive editor and mobile app.",
  },
];

// How it works steps
const steps = [
  {
    title: "Take Notes Your Way",
    description: "Capture ideas with our flexible editor that adapts to your style.",
  },
  {
    title: "Get AI Enhancements",
    description: "Our AI tools help organize, summarize, and improve your notes.",
  },
  {
    title: "Study Smarter",
    description: "Generate flashcards, summaries, and study materials automatically.",
  },
];

// Testimonial data
const testimonials = [
  {
    quote: "This app has completely transformed how I study for exams. The AI summaries save me hours of review time!",
    name: "Emily K.",
    role: "Medical Student",
  },
  {
    quote: "The collaborative features helped our study group stay organized during our entire senior project.",
    name: "James L.",
    role: "Engineering Major",
  },
  {
    quote: "I used to struggle keeping my notes organized. Now everything is searchable and I can actually find what I need.",
    name: "Sarah T.",
    role: "Psychology Student",
  },
];

// Feature card component
const FeatureCard = ({ 
  feature, 
  index, 
  isVisible 
}: { 
  feature: typeof features[0], 
  index: number,
  isVisible: boolean
}) => {
  return (
    <div 
      className={cn(
        "p-6 rounded-xl border border-border hover:shadow-md hover:border-primary/20 transition-all duration-500 bg-card",
        "transform",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div className="mb-4 text-primary">{feature.icon}</div>
      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
      <p className="text-muted-foreground">{feature.description}</p>
    </div>
  );
};

export default Index;
