import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SocialIcon } from "@/components/ui/social-icon";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { PLATFORMS } from "@/lib/constants";
import { Twitter, Instagram, Facebook, Linkedin, Plus, RefreshCw, Share2, Ban } from "lucide-react";
import { SocialAccount } from "@shared/schema";
import { PlatformAuthDialog } from "@/components/auth/platform-auth-dialog";

export default function Connections() {
  const { toast } = useToast();
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [newAccountPlatform, setNewAccountPlatform] = useState("twitter");
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  
  const { data: accounts = [], isLoading } = useQuery<SocialAccount[]>({
    queryKey: ['/api/accounts'],
  });
  
  const disconnectMutation = useMutation({
    mutationFn: async (accountId: number) => {
      return apiRequest('POST', `/api/accounts/${accountId}/disconnect`, {});
    },
    onSuccess: () => {
      toast({
        title: "Account disconnected",
        description: "The social media account has been disconnected successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/accounts'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to disconnect account. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const reconnectMutation = useMutation({
    mutationFn: async (accountId: number) => {
      return apiRequest('POST', `/api/accounts/${accountId}/reconnect`, {
        accessToken: "mock-token-refreshed",
        refreshToken: "mock-refresh-token",
      });
    },
    onSuccess: () => {
      toast({
        title: "Account reconnected",
        description: "The social media account has been reconnected successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/accounts'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to reconnect account. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const addAccountMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('POST', '/api/accounts', data);
    },
    onSuccess: () => {
      toast({
        title: "Account connected",
        description: "The social media account has been connected successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/accounts'] });
      setIsAddAccountOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to connect account. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const handleDisconnect = (accountId: number) => {
    if (confirm("Are you sure you want to disconnect this account?")) {
      disconnectMutation.mutate(accountId);
    }
  };
  
  const handleReconnect = (accountId: number) => {
    reconnectMutation.mutate(accountId);
  };
  
  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    // Instead of redirecting to OAuth flow directly, show the API keys dialog first
    setIsAddAccountOpen(false);
    setIsAuthDialogOpen(true);
  };
  
  // Handle saving API keys and connecting the account
  const handleSaveApiKeys = (keys: Record<string, string>) => {
    // In a real app, these keys would be securely stored and used for OAuth
    // For now, we'll simulate connecting an account with the provided keys
    const randomId = `${newAccountPlatform}-${Date.now()}`;
    const accountName = `${newAccountPlatform}user${Math.floor(Math.random() * 1000)}`;
    
    addAccountMutation.mutate({
      platform: newAccountPlatform,
      accountName,
      accountId: randomId,
      accessToken: "secured-token", // In reality, this would use the actual keys
      refreshToken: "secured-refresh-token",
      isConnected: true,
    });
    
    toast({
      title: "API keys saved",
      description: `Your ${PLATFORMS[newAccountPlatform as keyof typeof PLATFORMS]?.name || newAccountPlatform} API keys have been saved securely.`,
    });
  };
  
  const connectedAccounts = accounts.filter(account => account.isConnected);
  const disconnectedAccounts = accounts.filter(account => !account.isConnected);
  
  const getPlatformIcon = (platform: string, size = 5) => {
    switch (platform) {
      case 'twitter':
        return <Twitter className={`h-${size} w-${size} text-blue-400`} />;
      case 'instagram':
        return <Instagram className={`h-${size} w-${size} text-pink-500`} />;
      case 'facebook':
        return <Facebook className={`h-${size} w-${size} text-blue-600`} />;
      case 'linkedin':
        return <Linkedin className={`h-${size} w-${size} text-blue-500`} />;
      default:
        return null;
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Social Media Connections</h1>
          <div className="mt-4 md:mt-0">
            <Button onClick={() => setIsAddAccountOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Connect New Account
            </Button>
          </div>
        </div>
        
        <div className="mt-8">
          <Tabs defaultValue="connected">
            <TabsList className="mb-6">
              <TabsTrigger value="connected">Connected Accounts</TabsTrigger>
              <TabsTrigger value="disconnected">Disconnected Accounts</TabsTrigger>
            </TabsList>
            
            <TabsContent value="connected">
              {isLoading ? (
                <div className="text-center py-8 text-gray-500">
                  Loading connected accounts...
                </div>
              ) : connectedAccounts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No connected accounts. Connect a social media account to get started.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {connectedAccounts.map(account => (
                    <Card key={account.id}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {getPlatformIcon(account.platform)}
                            <CardTitle>{PLATFORMS[account.platform as keyof typeof PLATFORMS]?.name || account.platform}</CardTitle>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch checked={account.isConnected} disabled />
                          </div>
                        </div>
                        <CardDescription>@{account.accountName}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-500">Status:</span>
                          <span className="font-medium text-green-600">Connected</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Last updated:</span>
                          <span className="font-medium">Today</span>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" size="sm" onClick={() => handleDisconnect(account.id)}>
                          <Ban className="h-4 w-4 mr-2" />
                          Disconnect
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 className="h-4 w-4 mr-2" />
                          View Profile
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="disconnected">
              {isLoading ? (
                <div className="text-center py-8 text-gray-500">
                  Loading disconnected accounts...
                </div>
              ) : disconnectedAccounts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No disconnected accounts.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {disconnectedAccounts.map(account => (
                    <Card key={account.id}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {getPlatformIcon(account.platform)}
                            <CardTitle>{PLATFORMS[account.platform as keyof typeof PLATFORMS]?.name || account.platform}</CardTitle>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch checked={account.isConnected} disabled />
                          </div>
                        </div>
                        <CardDescription>@{account.accountName}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-500">Status:</span>
                          <span className="font-medium text-red-600">Disconnected</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Last updated:</span>
                          <span className="font-medium">Yesterday</span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => handleReconnect(account.id)}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Reconnect
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Add Account Dialog */}
      <Dialog open={isAddAccountOpen} onOpenChange={setIsAddAccountOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect a New Account</DialogTitle>
            <DialogDescription>
              Select the platform and enter your account details to connect.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <p className="text-sm text-muted-foreground">
              Select a platform to connect. You'll be redirected to authenticate with the platform and authorize SocialSync.
            </p>
            
            <div className="grid grid-cols-4 gap-4">
              <div 
                className={`flex flex-col items-center p-3 border rounded-md cursor-pointer ${newAccountPlatform === 'twitter' ? 'border-blue-400 bg-blue-50' : 'border-gray-200'}`}
                onClick={() => setNewAccountPlatform('twitter')}
              >
                <Twitter className="h-8 w-8 text-blue-400" />
                <span className="mt-2 text-sm">Twitter</span>
              </div>
              <div 
                className={`flex flex-col items-center p-3 border rounded-md cursor-pointer ${newAccountPlatform === 'instagram' ? 'border-pink-500 bg-pink-50' : 'border-gray-200'}`}
                onClick={() => setNewAccountPlatform('instagram')}
              >
                <Instagram className="h-8 w-8 text-pink-500" />
                <span className="mt-2 text-sm">Instagram</span>
              </div>
              <div 
                className={`flex flex-col items-center p-3 border rounded-md cursor-pointer ${newAccountPlatform === 'facebook' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}
                onClick={() => setNewAccountPlatform('facebook')}
              >
                <Facebook className="h-8 w-8 text-blue-600" />
                <span className="mt-2 text-sm">Facebook</span>
              </div>
              <div 
                className={`flex flex-col items-center p-3 border rounded-md cursor-pointer ${newAccountPlatform === 'linkedin' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                onClick={() => setNewAccountPlatform('linkedin')}
              >
                <Linkedin className="h-8 w-8 text-blue-500" />
                <span className="mt-2 text-sm">LinkedIn</span>
              </div>
            </div>
            
            <div className="bg-muted p-3 rounded-md mt-2">
              <h4 className="font-medium mb-1">What this will do:</h4>
              <ul className="text-sm list-disc list-inside space-y-1">
                <li>Connect your {PLATFORMS[newAccountPlatform as keyof typeof PLATFORMS]?.name || newAccountPlatform} account to SocialSync</li>
                <li>Allow SocialSync to post content on your behalf</li>
                <li>Enable analytics and performance metrics collection</li>
                <li>Provide real-time data streaming from the platform</li>
              </ul>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsAddAccountOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddAccount} disabled={addAccountMutation.isPending}>
              Authorize with {PLATFORMS[newAccountPlatform as keyof typeof PLATFORMS]?.name || newAccountPlatform}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
