
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface TestimonialsSectionProps {
  isVisible: boolean;
}

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

export const TestimonialsSection = ({ isVisible }: TestimonialsSectionProps) => {
  return (
    <section id="testimonials" className="py-24 relative">
      {/* Creative element - hexagon pattern */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden opacity-20">
        <div className="honeycomb" aria-hidden="true">
          {Array.from({ length: 20 }).map((_, i) => (
            <div 
              key={i} 
              className="honeycomb-cell"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${40 + Math.random() * 30}px`,
                height: `${40 + Math.random() * 30}px`,
                opacity: 0.1 + Math.random() * 0.3
              }}
            />
          ))}
        </div>
      </div>
      
      <div className="container px-4 sm:px-6 mx-auto max-w-7xl text-center">
        <div 
          className={cn(
            "transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
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
                "flex flex-col h-full transform relative",
                isVisible 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-20"
              )}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Quote mark decoration */}
              <div className="absolute -top-4 -left-2 text-6xl text-primary/10">"</div>
              <div className="absolute -bottom-8 -right-2 text-6xl text-primary/10">"</div>
              
              <div className="text-primary mb-4">
                {Array(5).fill(0).map((_, i) => (
                  <span key={i} className="text-lg">★</span>
                ))}
              </div>
              <p className="text-foreground mb-6 flex-grow italic relative z-10">"{testimonial.quote}"</p>
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
  );
};
