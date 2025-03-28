import { UserProfile } from '@/components/UserProfile';
import { Separator } from '@/components/ui/separator';

export default function Profile() {
  return (
    <div className="container mx-auto py-8">
      <div className="space-y-0.5">
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings and profile information.
        </p>
      </div>
      <Separator className="my-6" />
      <UserProfile />
    </div>
  );
}