import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PLATFORMS } from "@/lib/constants";

interface PlatformAuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  platform: string;
  onSaveKeys: (keys: Record<string, string>) => void;
}

export function PlatformAuthDialog({
  open,
  onOpenChange,
  platform,
  onSaveKeys,
}: PlatformAuthDialogProps) {
  const { toast } = useToast();
  const [keys, setKeys] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const platformConfig = {
    twitter: {
      name: "Twitter/X",
      fields: [
        { id: "apiKey", label: "API Key", required: true },
        { id: "apiSecret", label: "API Secret", required: true },
        { id: "accessToken", label: "Access Token", required: true },
        { id: "accessTokenSecret", label: "Access Token Secret", required: true },
      ],
    },
    facebook: {
      name: "Facebook",
      fields: [
        { id: "appId", label: "App ID", required: true },
        { id: "appSecret", label: "App Secret", required: true },
      ],
    },
    instagram: {
      name: "Instagram",
      fields: [
        { id: "appId", label: "App ID", required: true },
        { id: "appSecret", label: "App Secret", required: true },
      ],
    },
    linkedin: {
      name: "LinkedIn",
      fields: [
        { id: "clientId", label: "Client ID", required: true },
        { id: "clientSecret", label: "Client Secret", required: true },
      ],
    },
  };

  const config = platformConfig[platform as keyof typeof platformConfig];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if all required fields are filled
    const missingFields = config.fields
      .filter(field => field.required && !keys[field.id])
      .map(field => field.label);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing required fields",
        description: `Please fill in: ${missingFields.join(", ")}`,
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulating API call to validate keys
    setTimeout(() => {
      onSaveKeys(keys);
      setIsSubmitting(false);
      onOpenChange(false);
      
      toast({
        title: "API Keys Saved",
        description: `Your ${config.name} API keys have been securely saved.`,
      });
    }, 1500);
  };

  const handleChange = (id: string, value: string) => {
    setKeys(prev => ({
      ...prev,
      [id]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            Connect to {config?.name || PLATFORMS[platform]?.name || platform}
          </DialogTitle>
          <DialogDescription>
            Enter your API keys to connect to {config?.name || PLATFORMS[platform]?.name || platform}.
            These keys are used to authorize SocialSync to interact with your account.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-md flex items-start space-x-3 text-sm">
            <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-amber-800">Your keys are stored securely</p>
              <p className="text-amber-700 mt-1">
                Your API keys are encrypted and stored securely. They are only used to authenticate with
                the {config?.name} API and are never shared with third parties.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {config?.fields.map((field) => (
              <div key={field.id} className="grid gap-1.5">
                <Label htmlFor={field.id}>
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </Label>
                <div className="relative">
                  <Input
                    id={field.id}
                    type="password"
                    placeholder={`Enter your ${field.label}`}
                    value={keys[field.id] || ""}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    required={field.required}
                    className="pl-8"
                  />
                  <Key className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Keys"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}