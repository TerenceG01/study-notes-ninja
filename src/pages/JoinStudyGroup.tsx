
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const JoinStudyGroup = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const joinGroup = async () => {
      if (!user || !code) return;

      try {
        const { data, error } = await supabase
          .rpc('join_group_with_invite', { p_invite_code: code });

        if (error) throw error;

        toast({
          title: "Welcome!",
          description: "You've successfully joined the study group.",
        });

        navigate(`/study-groups/${data}`);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error joining group",
          description: error instanceof Error ? error.message : "Failed to join group",
        });
        navigate('/study-groups');
      }
    };

    joinGroup();
  }, [code, user, navigate, toast]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Joining study group...</p>
      </div>
    </div>
  );
};

export default JoinStudyGroup;
