import { cn } from "@/lib/utils";
import { type PlatformType } from "@shared/schema";
import { Twitter, Instagram, Facebook, Linkedin } from "lucide-react";

interface SocialIconProps {
  platform: string;
  className?: string;
}

export function SocialIcon({ platform, className }: SocialIconProps) {
  const getIcon = () => {
    switch (platform) {
      case 'twitter':
        return <Twitter className={cn("text-blue-400", className)} />;
      case 'instagram':
        return <Instagram className={cn("text-pink-500", className)} />;
      case 'facebook':
        return <Facebook className={cn("text-blue-600", className)} />;
      case 'linkedin':
        return <Linkedin className={cn("text-blue-500", className)} />;
      default:
        return null;
    }
  };

  return getIcon();
}

interface SocialBadgeProps {
  platform: string;
  className?: string;
}

export function SocialBadge({ platform, className }: SocialBadgeProps) {
  return (
    <div className={cn("h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center", className)}>
      <SocialIcon platform={platform} className="text-lg" />
    </div>
  );
}
