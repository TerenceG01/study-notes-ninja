
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
    <Card className="w-full animate-[fadeSlideIn_0.5s_ease-out_200ms_forwards]">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl">Profile Information</CardTitle>
        <CardDescription>Update your profile details and manage your account</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6 mb-8">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-primary/10">
              <User className="h-8 w-8 text-primary" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{user?.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <PenLine className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {username ? `@${username}` : "No username set"}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="pl-8"
              />
              <User className="h-4 w-4 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
            <p className="text-sm text-muted-foreground">
              This is your public display name
            </p>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={loading} className="min-w-[120px]">
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
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
