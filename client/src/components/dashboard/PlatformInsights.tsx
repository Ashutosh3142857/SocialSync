import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SiTwitter, SiInstagram, SiLinkedin, SiFacebook } from "react-icons/si";
import { ArrowUp, ArrowDown } from "lucide-react";
import { PlatformInsight } from "@/types";
import { cn } from "@/lib/utils";

interface PlatformCardProps {
  platform: PlatformInsight;
}

const PlatformCard: React.FC<PlatformCardProps> = ({ platform }) => {
  const PlatformIcon = () => {
    switch (platform.name.toLowerCase()) {
      case "twitter":
        return <SiTwitter className="text-blue-500 text-lg" />;
      case "instagram":
        return <SiInstagram className="text-pink-500 text-lg" />;
      case "linkedin":
        return <SiLinkedin className="text-blue-700 text-lg" />;
      case "facebook":
        return <SiFacebook className="text-blue-600 text-lg" />;
      default:
        return null;
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
          <PlatformIcon />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{platform.name}</p>
          <p className="text-xs text-gray-500">{platform.handle}</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-500">Followers</p>
          <p className="text-lg font-semibold text-gray-900">{platform.followers}</p>
          <div className={cn(
            "text-xs flex items-center",
            platform.followerChange >= 0 ? "text-emerald-500" : "text-red-500"
          )}>
            {platform.followerChange >= 0 ? 
              <ArrowUp className="h-3 w-3" /> : 
              <ArrowDown className="h-3 w-3" />
            }
            <span>{Math.abs(platform.followerChange)}%</span>
          </div>
        </div>
        <div>
          <p className="text-xs text-gray-500">Engagement</p>
          <p className="text-lg font-semibold text-gray-900">{platform.engagement}%</p>
          <div className={cn(
            "text-xs flex items-center",
            platform.engagementChange >= 0 ? "text-emerald-500" : "text-red-500"
          )}>
            {platform.engagementChange >= 0 ? 
              <ArrowUp className="h-3 w-3" /> : 
              <ArrowDown className="h-3 w-3" />
            }
            <span>{Math.abs(platform.engagementChange)}%</span>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-xs text-gray-500 mb-1">Top Performing Content</p>
        <p className="text-sm text-gray-800">"{platform.topContent}" - {platform.topMetric}</p>
      </div>
    </div>
  );
};

const PlatformInsights: React.FC = () => {
  const [timeframe, setTimeframe] = useState("7days");
  
  const { data: insights, isLoading } = useQuery<PlatformInsight[]>({
    queryKey: ["/api/insights", { timeframe }],
  });

  return (
    <Card className="mt-8">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium text-gray-900">Platform Insights</CardTitle>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="h-9 w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4 animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                    <div className="h-6 bg-gray-200 rounded w-12"></div>
                    <div className="h-3 bg-gray-200 rounded w-8"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                    <div className="h-6 bg-gray-200 rounded w-12"></div>
                    <div className="h-3 bg-gray-200 rounded w-8"></div>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-32"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {insights?.map((platform) => (
              <PlatformCard key={platform.id} platform={platform} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlatformInsights;
