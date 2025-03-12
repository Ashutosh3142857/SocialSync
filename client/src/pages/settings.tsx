import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { User } from "lucide-react";

export default function Settings() {
  const { toast } = useToast();
  const [passwordVisible, setPasswordVisible] = useState(false);
  
  const { data: user } = useQuery({
    queryKey: ['/api/user'],
  });
  
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    });
  };
  
  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Password updated",
      description: "Your password has been updated successfully.",
    });
  };
  
  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Notification settings updated",
      description: "Your notification preferences have been saved.",
    });
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        
        <div className="mt-6">
          <Tabs defaultValue="profile">
            <TabsList className="mb-6">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your profile details and personal information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveProfile} className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={user?.avatarUrl} alt={user?.fullName} />
                        <AvatarFallback>
                          <User className="h-12 w-12" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <Button variant="outline" type="button">Change Avatar</Button>
                        <p className="mt-2 text-sm text-gray-500">
                          JPG, GIF or PNG. 1MB max.
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input id="fullName" defaultValue={user?.fullName} />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input id="username" defaultValue={user?.username} />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue={user?.email} />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <select id="timezone" className="w-full p-2 border rounded-md">
                          <option value="UTC-8">Pacific Time (UTC-8)</option>
                          <option value="UTC-5">Eastern Time (UTC-5)</option>
                          <option value="UTC+0">UTC</option>
                          <option value="UTC+1">Central European Time (UTC+1)</option>
                          <option value="UTC+5:30">Indian Standard Time (UTC+5:30)</option>
                          <option value="UTC+8">China Standard Time (UTC+8)</option>
                          <option value="UTC+9">Japan Standard Time (UTC+9)</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea id="bio" rows={4} placeholder="Tell us about yourself" />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button type="submit">Save Changes</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="password">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSavePassword} className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <div className="relative">
                          <Input 
                            id="current-password" 
                            type={passwordVisible ? "text" : "password"} 
                            placeholder="••••••••" 
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <div className="relative">
                          <Input 
                            id="new-password" 
                            type={passwordVisible ? "text" : "password"} 
                            placeholder="••••••••" 
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <div className="relative">
                          <Input 
                            id="confirm-password" 
                            type={passwordVisible ? "text" : "password"} 
                            placeholder="••••••••" 
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={passwordVisible}
                          onCheckedChange={setPasswordVisible}
                          id="show-password"
                        />
                        <Label htmlFor="show-password">Show password</Label>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button type="submit">Update Password</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>
                    Configure how and when you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveNotifications} className="space-y-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium">Email Notifications</h3>
                        <div className="mt-4 space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="email-post-published">Post Published</Label>
                              <p className="text-sm text-gray-500">Receive an email when your scheduled posts are published</p>
                            </div>
                            <Switch id="email-post-published" defaultChecked />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="email-analytics">Analytics Reports</Label>
                              <p className="text-sm text-gray-500">Receive weekly analytics reports for your content</p>
                            </div>
                            <Switch id="email-analytics" defaultChecked />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="email-mentions">Mentions & Comments</Label>
                              <p className="text-sm text-gray-500">Get notified when someone mentions or comments on your posts</p>
                            </div>
                            <Switch id="email-mentions" />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium">Push Notifications</h3>
                        <div className="mt-4 space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="push-post-published">Post Published</Label>
                              <p className="text-sm text-gray-500">Receive a push notification when your scheduled posts are published</p>
                            </div>
                            <Switch id="push-post-published" defaultChecked />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="push-performance">Performance Alerts</Label>
                              <p className="text-sm text-gray-500">Get notified about significant changes in your content performance</p>
                            </div>
                            <Switch id="push-performance" />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button type="submit">Save Preferences</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>Application Preferences</CardTitle>
                  <CardDescription>
                    Customize your SocialSync experience
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium">Appearance</h3>
                      <div className="mt-4 space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="border rounded-md p-4 flex flex-col items-center space-y-2 bg-white cursor-pointer border-primary">
                            <div className="h-20 w-full bg-white rounded"></div>
                            <span className="text-sm font-medium">Light</span>
                          </div>
                          <div className="border rounded-md p-4 flex flex-col items-center space-y-2 bg-gray-900 cursor-pointer">
                            <div className="h-20 w-full bg-gray-800 rounded"></div>
                            <span className="text-sm font-medium text-white">Dark</span>
                          </div>
                          <div className="border rounded-md p-4 flex flex-col items-center space-y-2 bg-gradient-to-b from-white to-gray-900 cursor-pointer">
                            <div className="h-20 w-full bg-gradient-to-b from-white to-gray-800 rounded"></div>
                            <span className="text-sm font-medium">System</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium">Default Settings</h3>
                      <div className="mt-4 space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="default-platform">Default Platform</Label>
                          <select id="default-platform" className="w-full p-2 border rounded-md">
                            <option value="">All Platforms</option>
                            <option value="twitter">Twitter</option>
                            <option value="instagram">Instagram</option>
                            <option value="facebook">Facebook</option>
                            <option value="linkedin">LinkedIn</option>
                          </select>
                          <p className="text-sm text-gray-500">Select the default platform for new posts</p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="default-time">Default Posting Time</Label>
                          <Input id="default-time" type="time" defaultValue="09:00" />
                          <p className="text-sm text-gray-500">Set the default time for scheduling new posts</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium">Data & Privacy</h3>
                      <div className="mt-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="analytics-consent">Analytics Consent</Label>
                            <p className="text-sm text-gray-500">Allow SocialSync to collect usage data to improve the service</p>
                          </div>
                          <Switch id="analytics-consent" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="marketing-consent">Marketing Communications</Label>
                            <p className="text-sm text-gray-500">Receive updates about new features and promotions</p>
                          </div>
                          <Switch id="marketing-consent" defaultChecked />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button>Save Preferences</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
