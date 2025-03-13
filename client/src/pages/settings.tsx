import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ThemePreview } from "@/components/settings/theme-preview";
import { ThemeTransition, disableThemeTransitions } from "@/components/settings/theme-transition";
import { ContrastChecker } from "@/components/settings/contrast-checker";
import { ColorPaletteGenerator } from "@/components/settings/color-palette-generator";
import { ThemeReset } from "@/components/settings/theme-reset";

type ThemeType = "light" | "dark" | "system";

export default function Settings() {
  const { toast } = useToast();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<ThemeType>("light");
  const [previewTheme, setPreviewTheme] = useState<ThemeType>("light");
  
  // Dialog state
  const [showThemePreview, setShowThemePreview] = useState(false);
  const [showContrastChecker, setShowContrastChecker] = useState(false);
  const [showColorPalette, setShowColorPalette] = useState(false);
  const [showThemeReset, setShowThemeReset] = useState(false);
  
  // Theme configuration state
  const [primaryColor, setPrimaryColor] = useState("#6366f1");
  const [enableTransitions, setEnableTransitions] = useState(true);
  
  const { data: user } = useQuery({
    queryKey: ['/api/user'],
  });
  
  // Load the theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeType;
    if (savedTheme) {
      setSelectedTheme(savedTheme);
      setPreviewTheme(savedTheme);
      applyTheme(savedTheme);
    }
    
    // Check for saved primary color
    const savedPrimaryColor = localStorage.getItem('primaryColor');
    if (savedPrimaryColor) {
      setPrimaryColor(savedPrimaryColor);
    }
    
    // Check if transitions are enabled
    const transitionsEnabled = localStorage.getItem('enableTransitions');
    if (transitionsEnabled !== null) {
      setEnableTransitions(transitionsEnabled === 'true');
    }
  }, []);
  
  // Function to apply the theme to the document
  const applyTheme = (theme: ThemeType) => {
    const root = window.document.documentElement;
    
    // Use the transition disabler if transitions should be skipped
    if (!enableTransitions) {
      disableThemeTransitions(() => {
        // Remove all previous theme classes
        root.classList.remove('light', 'dark');
        
        if (theme === 'system') {
          // Check system preference
          const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
          root.classList.add(systemPreference);
        } else {
          // Apply the selected theme
          root.classList.add(theme);
        }
      });
    } else {
      // Remove all previous theme classes
      root.classList.remove('light', 'dark');
      
      if (theme === 'system') {
        // Check system preference
        const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        root.classList.add(systemPreference);
      } else {
        // Apply the selected theme
        root.classList.add(theme);
      }
    }
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
  };
  
  // Handler for theme selection
  const handleThemeChange = (theme: ThemeType) => {
    setSelectedTheme(theme);
    setPreviewTheme(theme);
    applyTheme(theme);
    
    toast({
      title: "Theme updated",
      description: `Theme has been changed to ${theme}.`,
    });
  };
  
  // Handler for theme preview
  const handlePreviewTheme = (theme: ThemeType) => {
    setPreviewTheme(theme);
  };
  
  // Handler for applying previewed theme
  const handleApplyPreviewedTheme = () => {
    setSelectedTheme(previewTheme);
    applyTheme(previewTheme);
    setShowThemePreview(false);
    
    toast({
      title: "Theme updated",
      description: `Theme has been changed to ${previewTheme}.`,
    });
  };
  
  // Handler for resetting theme to default
  const handleResetTheme = () => {
    const defaultTheme: ThemeType = "light";
    const defaultPrimaryColor = "#6366f1";
    
    // Reset all theme settings
    setSelectedTheme(defaultTheme);
    setPreviewTheme(defaultTheme);
    setPrimaryColor(defaultPrimaryColor);
    setEnableTransitions(true);
    
    // Apply default theme
    applyTheme(defaultTheme);
    
    // Reset local storage
    localStorage.setItem('theme', defaultTheme);
    localStorage.setItem('primaryColor', defaultPrimaryColor);
    localStorage.setItem('enableTransitions', 'true');
    
    toast({
      title: "Theme reset",
      description: "Theme settings have been reset to default values.",
    });
  };
  
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
    <ThemeTransition>
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
              
              {/* Theme Preview Dialog */}
              <Dialog open={showThemePreview} onOpenChange={setShowThemePreview}>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Theme Preview</DialogTitle>
                    <DialogDescription>
                      Preview how your theme will look before applying it
                    </DialogDescription>
                  </DialogHeader>
                  <ThemePreview 
                    theme={previewTheme} 
                    onApply={handleApplyPreviewedTheme} 
                    onCancel={() => setShowThemePreview(false)}
                  />
                </DialogContent>
              </Dialog>
              
              {/* Contrast Checker Dialog */}
              <Dialog open={showContrastChecker} onOpenChange={setShowContrastChecker}>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Accessibility Contrast Checker</DialogTitle>
                    <DialogDescription>
                      Check if your color scheme meets accessibility standards
                    </DialogDescription>
                  </DialogHeader>
                  <ContrastChecker 
                    primaryColor={primaryColor} 
                    backgroundColor={selectedTheme === 'dark' ? '#171717' : '#ffffff'} 
                  />
                </DialogContent>
              </Dialog>
              
              {/* Color Palette Generator Dialog */}
              <Dialog open={showColorPalette} onOpenChange={setShowColorPalette}>
                <DialogContent className="sm:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Custom Color Palette Generator</DialogTitle>
                    <DialogDescription>
                      Create and customize a color palette for your theme
                    </DialogDescription>
                  </DialogHeader>
                  <ColorPaletteGenerator />
                </DialogContent>
              </Dialog>
              
              {/* Theme Reset Dialog */}
              <Dialog open={showThemeReset} onOpenChange={setShowThemeReset}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reset Theme</DialogTitle>
                    <DialogDescription>
                      This will reset all theme customizations to default settings
                    </DialogDescription>
                  </DialogHeader>
                  <ThemeReset onReset={handleResetTheme} />
                </DialogContent>
              </Dialog>
            
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
                          <div 
                            className={`border rounded-md p-4 flex flex-col items-center space-y-2 bg-white cursor-pointer ${selectedTheme === 'light' ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200'}`}
                            onClick={() => handleThemeChange('light')}
                          >
                            <div className="h-20 w-full bg-white rounded"></div>
                            <span className="text-sm font-medium">Light</span>
                          </div>
                          <div 
                            className={`border rounded-md p-4 flex flex-col items-center space-y-2 bg-gray-900 cursor-pointer ${selectedTheme === 'dark' ? 'border-primary ring-2 ring-primary/20' : 'border-gray-700'}`}
                            onClick={() => handleThemeChange('dark')}
                          >
                            <div className="h-20 w-full bg-gray-800 rounded"></div>
                            <span className="text-sm font-medium text-white">Dark</span>
                          </div>
                          <div 
                            className={`border rounded-md p-4 flex flex-col items-center space-y-2 bg-gradient-to-b from-white to-gray-900 cursor-pointer ${selectedTheme === 'system' ? 'border-primary ring-2 ring-primary/20' : 'border-gray-300'}`}
                            onClick={() => handleThemeChange('system')}
                          >
                            <div className="h-20 w-full bg-gradient-to-b from-white to-gray-800 rounded"></div>
                            <span className="text-sm font-medium">System</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-6">
                          <div>
                            <Label htmlFor="enable-transitions">Smooth Theme Transitions</Label>
                            <p className="text-sm text-gray-500">Enable smooth animations when changing themes</p>
                          </div>
                          <Switch 
                            id="enable-transitions" 
                            checked={enableTransitions}
                            onCheckedChange={(checked) => {
                              setEnableTransitions(checked);
                              localStorage.setItem('enableTransitions', checked.toString());
                              toast({
                                title: checked ? "Transitions enabled" : "Transitions disabled",
                                description: checked 
                                  ? "Theme changes will now animate smoothly" 
                                  : "Theme changes will now happen instantly",
                              });
                            }}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                          <div>
                            <Button 
                              variant="outline" 
                              className="w-full"
                              onClick={() => setShowThemePreview(true)}
                            >
                              Preview Theme Before Applying
                            </Button>
                          </div>
                          <div>
                            <Button 
                              variant="outline"
                              className="w-full"
                              onClick={() => setShowThemeReset(true)}
                            >
                              One-Click Theme Reset
                            </Button>
                          </div>
                        </div>
                        
                        <div className="mt-6">
                          <h4 className="text-md font-medium mb-2">Additional Theme Options</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Button 
                              variant="outline" 
                              className="w-full justify-start"
                              onClick={() => setShowContrastChecker(true)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z" />
                                <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
                              </svg>
                              Accessibility Color Contrast Checker
                            </Button>
                            <Button 
                              variant="outline" 
                              className="w-full justify-start"
                              onClick={() => setShowColorPalette(true)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 12c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2Z" />
                                <path d="M12 6c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6Z" />
                                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2Z" />
                              </svg>
                              Custom Color Palette Generator
                            </Button>
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
  </ThemeTransition>
  );
}
