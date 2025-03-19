
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface TestimonialsSectionProps {
  isVisible: boolean;
}

// Testimonial data
const testimonials = [
  {
    name: "Emily K.",
    role: "medicalStudent",
  },
  {
    name: "James L.",
    role: "engineeringMajor",
  },
  {
    name: "Sarah T.",
    role: "psychologyStudent",
  },
];

export const TestimonialsSection = ({ isVisible }: TestimonialsSectionProps) => {
  const { t } = useLanguage();
  
  return (
    <section id="testimonials" className="py-16 min-h-[80vh] flex items-center">
      <div className="container px-4 sm:px-6 mx-auto max-w-7xl text-center">
        <div 
          className={cn(
            "transition-all duration-700 transform",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
          )}
        >
          <div className={cn(
            "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20 mb-4 transition-all duration-500",
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
          )}>
            <Users className="w-4 h-4 mr-2" />
            {t("studentSuccessStories")}
          </div>
          
          <h2 className={cn(
            "text-3xl md:text-4xl font-bold mb-16 transition-all duration-700 delay-100",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}>
            {t("joinThousands")}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className={cn(
                "bg-card p-8 rounded-xl shadow-sm border border-border/50 hover:shadow-md transition-all duration-700",
                "flex flex-col h-full",
                isVisible 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-20"
              )}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className={cn(
                "text-primary mb-4 transition-all duration-500",
                isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"
              )} style={{ transitionDelay: `${index * 200 + 200}ms` }}>
                {Array(5).fill(0).map((_, i) => (
                  <span key={i} className="text-lg">★</span>
                ))}
              </div>
              <p className={cn(
                "text-foreground mb-6 flex-grow italic transition-all duration-700",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
              )} style={{ transitionDelay: `${index * 200 + 300}ms` }}>
                {index === 0 ? t("testimonial1") : 
                 index === 1 ? t("testimonial2") : 
                 t("testimonial3")}
              </p>
              <div className={cn(
                "flex items-center mt-auto transition-all duration-700",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
              )} style={{ transitionDelay: `${index * 200 + 400}ms` }}>
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center font-bold text-primary mr-3">
                  {testimonial.name[0]}
                </div>
                <div className="text-left">
                  <p className="font-medium">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role === "medicalStudent" ? t("medicalStudent") :
                     testimonial.role === "engineeringMajor" ? t("engineeringMajor") :
                     t("psychologyStudent")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
