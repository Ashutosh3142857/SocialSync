import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SiTwitter, SiInstagram, SiLinkedin, SiFacebook } from "react-icons/si";
import { Image, Video, Link as LinkIcon, Smile, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { queryClient } from "@/lib/queryClient";

interface PlatformButtonProps {
  platform: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

const PlatformButton: React.FC<PlatformButtonProps> = ({ platform, icon, active, onClick }) => (
  <Button
    variant={active ? "default" : "outline"}
    size="sm"
    className={`inline-flex items-center rounded-full ${active ? "text-white" : "text-gray-700"}`}
    onClick={onClick}
  >
    <span className="mr-1.5">{icon}</span>
    {platform}
  </Button>
);

const QuickPostCreator: React.FC = () => {
  const { toast } = useToast();
  const [content, setContent] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["Facebook"]);
  const [visibility, setVisibility] = useState("public");

  const createPostMutation = useMutation({
    mutationFn: async (data: { content: string; platforms: string[]; visibility: string }) => {
      return apiRequest("POST", "/api/posts", data);
    },
    onSuccess: () => {
      toast({
        title: "Post scheduled successfully!",
        description: "Your post has been scheduled to be published.",
        variant: "default",
      });
      setContent("");
      queryClient.invalidateQueries({ queryKey: ["/api/posts/upcoming"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to schedule post",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handlePostNow = () => {
    if (!content.trim()) {
      toast({
        title: "Empty content",
        description: "Please enter some content for your post.",
        variant: "destructive",
      });
      return;
    }

    if (selectedPlatforms.length === 0) {
      toast({
        title: "No platform selected",
        description: "Please select at least one platform.",
        variant: "destructive",
      });
      return;
    }

    createPostMutation.mutate({
      content,
      platforms: selectedPlatforms,
      visibility,
    });
  };

  const togglePlatform = (platform: string) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-gray-900">Quick Post Creator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Platform Selector */}
        <div className="flex flex-wrap gap-2">
          <PlatformButton
            platform="Twitter"
            icon={<SiTwitter className="text-blue-500" />}
            active={selectedPlatforms.includes("Twitter")}
            onClick={() => togglePlatform("Twitter")}
          />
          <PlatformButton
            platform="Instagram"
            icon={<SiInstagram className="text-pink-500" />}
            active={selectedPlatforms.includes("Instagram")}
            onClick={() => togglePlatform("Instagram")}
          />
          <PlatformButton
            platform="Facebook"
            icon={<SiFacebook className="text-blue-600" />}
            active={selectedPlatforms.includes("Facebook")}
            onClick={() => togglePlatform("Facebook")}
          />
          <PlatformButton
            platform="LinkedIn"
            icon={<SiLinkedin className="text-blue-700" />}
            active={selectedPlatforms.includes("LinkedIn")}
            onClick={() => togglePlatform("LinkedIn")}
          />
        </div>
        
        {/* Text Area */}
        <div>
          <Textarea
            rows={4}
            className="w-full placeholder-gray-400"
            placeholder="What would you like to share today?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        
        {/* Media Upload */}
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="inline-flex items-center">
            <Image className="mr-1.5 h-4 w-4 text-gray-500" />
            Image
          </Button>
          <Button variant="outline" size="sm" className="inline-flex items-center">
            <Video className="mr-1.5 h-4 w-4 text-gray-500" />
            Video
          </Button>
          <Button variant="outline" size="sm" className="inline-flex items-center">
            <LinkIcon className="mr-1.5 h-4 w-4 text-gray-500" />
            Link
          </Button>
          <Button variant="outline" size="sm" className="inline-flex items-center">
            <Smile className="mr-1.5 h-4 w-4 text-gray-500" />
            Emoji
          </Button>
        </div>
        
        {/* Post Preview */}
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex items-center space-x-2 mb-3">
            <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-xs text-gray-600">YC</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Your Company Page</p>
              <p className="text-xs text-gray-500">Preview</p>
            </div>
          </div>
          <p className="text-sm text-gray-800 mb-3">
            {content || "Your post preview will appear here."}
          </p>
          <div className="relative h-40 rounded-lg bg-gray-200 flex items-center justify-center">
            <Image className="text-gray-400 h-8 w-8" />
            <span className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
              Add Image
            </span>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="inline-flex items-center">
              <Clock className="mr-1.5 h-4 w-4" />
              Schedule
            </Button>
            <Select value={visibility} onValueChange={setVisibility}>
              <SelectTrigger className="h-9 w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button 
            onClick={handlePostNow}
            disabled={createPostMutation.isPending}
            className="inline-flex items-center text-white bg-primary hover:bg-primary/90"
          >
            {createPostMutation.isPending ? "Posting..." : "Post Now"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickPostCreator;
