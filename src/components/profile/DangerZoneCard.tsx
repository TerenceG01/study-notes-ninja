
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface DangerZoneCardProps {
  onSignOut: () => Promise<void>;
}

export function DangerZoneCard({ onSignOut }: DangerZoneCardProps) {
  return (
    <Card className="w-full animate-[fadeSlideIn_0.5s_ease-out_600ms_forwards]">
      <CardHeader>
        <CardTitle className="text-xl text-destructive">Danger Zone</CardTitle>
        <CardDescription>Manage your account settings and preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          variant="destructive"
          className="w-full sm:w-auto"
          onClick={onSignOut}
        >
          Sign Out
        </Button>
      </CardContent>
    </Card>
  );
}
