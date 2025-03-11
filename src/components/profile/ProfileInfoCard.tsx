
import { User, Mail, PenLine, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileInfoCardProps {
  user: any;
  username: string;
  loading: boolean;
  setUsername: (username: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export function ProfileInfoCard({
  user,
  username,
  loading,
  setUsername,
  onSubmit,
}: ProfileInfoCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-lg sm:text-xl">Profile Information</CardTitle>
        <CardDescription className="text-xs sm:text-sm">Update your profile details and manage your account</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-4 sm:mb-8">
          <Avatar className="h-16 w-16 sm:h-20 sm:w-20 mx-auto sm:mx-0">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-primary/10">
              <User className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1 justify-center sm:justify-start">
              <Mail className="h-4 w-4 text-muted-foreground hidden sm:inline" />
              <span className="text-xs sm:text-sm text-muted-foreground">{user?.email}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 justify-center sm:justify-start">
              <PenLine className="h-4 w-4 text-muted-foreground hidden sm:inline" />
              <span className="text-xs sm:text-sm text-muted-foreground">
                {username ? `@${username}` : "No username set"}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 sm:space-y-6">
          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="username" className="text-xs sm:text-sm">Username</Label>
            <div className="relative">
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="pl-8 text-xs sm:text-sm py-1.5 sm:py-2"
              />
              <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              This is your public display name
            </p>
          </div>

          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={loading} 
              className="min-w-[100px] sm:min-w-[120px] text-xs sm:text-sm py-1.5 sm:py-2"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
