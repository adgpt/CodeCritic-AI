import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/lib/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { User, Mail, MapPin, Globe, Twitter, Github, Linkedin, Edit2, Save, X } from 'lucide-react';

export function UserProfile() {
  const { profile, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [location, setLocation] = useState(profile?.location || '');
  const [website, setWebsite] = useState(profile?.website || '');
  const [twitter, setTwitter] = useState(profile?.twitter || '');
  const [github, setGithub] = useState(profile?.github || '');
  const [linkedin, setLinkedin] = useState(profile?.linkedin || '');
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const { toast } = useToast();
  
  // Update local state when profile changes
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setBio(profile.bio || '');
      setLocation(profile.location || '');
      setWebsite(profile.website || '');
      setTwitter(profile.twitter || '');
      setGithub(profile.github || '');
      setLinkedin(profile.linkedin || '');
    }
  }, [profile]);

  const handleSave = async () => {
    if (!profile) return;
    
    // Validate fullName
    if (!fullName.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Name cannot be empty. Please enter a valid name."
      });
      return;
    }
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ 
          full_name: fullName.trim(),
          bio: bio.trim(),
          location: location.trim(),
          website: website.trim(),
          twitter: twitter.trim(),
          github: github.trim(),
          linkedin: linkedin.trim()
        })
        .eq('id', profile.id);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update profile. Please try again."
        });
        throw error;
      }
      
      // Update the profile in AuthContext
      const { data: updatedProfile, error: fetchError } = await supabase
        .from('user_profiles')
        .select()
        .eq('id', profile.id)
        .single();
        
      if (!fetchError && updatedProfile) {
        // The AuthContext will handle the profile update in its subscription
      }
      
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully."
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred while updating your profile."
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await signOut();
      toast({
        title: "Success",
        description: "You have been logged out successfully."
      });
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log out. Please try again."
      });
    } finally {
      setLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
              <User className="h-10 w-10 text-muted-foreground" />
            </div>
            <CardTitle className="mb-2">No Profile Data Available</CardTitle>
            <CardDescription className="mb-6">Your profile information is not yet available or still loading.</CardDescription>
            <div className="space-y-4">
              <div className="h-10 bg-muted rounded-md animate-pulse"></div>
              <div className="h-10 bg-muted rounded-md animate-pulse w-3/4 mx-auto"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              {profile.avatar_url ? (
                <AvatarImage src={profile.avatar_url} alt={profile.full_name || 'User'} />
              ) : (
                <AvatarFallback>
                  <User className="h-8 w-8" />
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              {isEditing ? (
                <div className="flex items-center space-x-2">
                  <Input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-[200px]"
                  />
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    size="sm"
                    className="h-8"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    {saving ? 'Saving...' : 'Save'}
                  </Button>
                  <Button
                    onClick={() => setIsEditing(false)}
                    variant="ghost"
                    size="sm"
                    className="h-8"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <CardTitle>{profile.full_name}</CardTitle>
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="ghost"
                    size="sm"
                    className="h-8"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <div className="flex items-center text-muted-foreground">
                <Mail className="h-4 w-4 mr-1" />
                <span>{profile.email}</span>
              </div>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            disabled={loggingOut}
            variant="destructive"
          >
            {loggingOut ? 'Logging out...' : 'Logout'}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location" className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" /> Location
                  </Label>
                  <Input
                    id="location"
                    placeholder="Your location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="website" className="flex items-center">
                    <Globe className="h-4 w-4 mr-1" /> Website
                  </Label>
                  <Input
                    id="website"
                    placeholder="https://yourwebsite.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Social Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="twitter" className="flex items-center">
                      <Twitter className="h-4 w-4 mr-1" /> Twitter
                    </Label>
                    <Input
                      id="twitter"
                      placeholder="@username"
                      value={twitter}
                      onChange={(e) => setTwitter(e.target.value)}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="github" className="flex items-center">
                      <Github className="h-4 w-4 mr-1" /> GitHub
                    </Label>
                    <Input
                      id="github"
                      placeholder="username"
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="linkedin" className="flex items-center">
                      <Linkedin className="h-4 w-4 mr-1" /> LinkedIn
                    </Label>
                    <Input
                      id="linkedin"
                      placeholder="username"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
              
              {isEditing && (
                <div className="flex justify-end">
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="account" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Provider</Label>
                  <div className="mt-1 p-2 bg-muted rounded-md">{profile.provider}</div>
                </div>
                
                <div>
                  <Label>Member Since</Label>
                  <div className="mt-1 p-2 bg-muted rounded-md">
                    {new Date(profile.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <div>
                <Label>Last Updated</Label>
                <div className="mt-1 p-2 bg-muted rounded-md">
                  {new Date(profile.updated_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4">
        <CardDescription>
          Update your profile information to help others know you better.
        </CardDescription>
        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            variant="outline"
          >
            <Edit2 className="h-4 w-4 mr-2" /> Edit Profile
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}