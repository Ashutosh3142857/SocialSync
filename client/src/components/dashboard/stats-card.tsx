import { Card, CardContent } from "@/components/ui/card";
import { BarChart2, Eye, Heart, Share2, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: 'views' | 'engagements' | 'shares' | 'followers';
  className?: string;
}

export function StatsCard({ title, value, change = 0, icon, className }: StatsCardProps) {
  const formatNumber = (num: number | string): string => {
    const n = typeof num === 'string' ? parseFloat(num) : num;
    
    if (n >= 1000) {
      return (n / 1000).toFixed(1) + 'k';
    }
    
    return n.toString();
  };

  const getIcon = () => {
    switch (icon) {
      case 'views':
        return (
          <div className="flex-shrink-0 bg-primary rounded-md p-3">
            <Eye className="text-white h-5 w-5" />
          </div>
        );
      case 'engagements':
        return (
          <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
            <Heart className="text-white h-5 w-5" />
          </div>
        );
      case 'shares':
        return (
          <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
            <Share2 className="text-white h-5 w-5" />
          </div>
        );
      case 'followers':
        return (
          <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
            <UserPlus className="text-white h-5 w-5" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className={cn("bg-white overflow-hidden", className)}>
      <CardContent className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          {getIcon()}
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">
                  {formatNumber(value)}
                </div>
                {change !== 0 && (
                  <div 
                    className={cn(
                      "ml-2 flex items-baseline text-sm font-semibold",
                      change > 0 ? "text-green-600" : "text-red-600"
                    )}
                  >
                    {change > 0 ? 
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg> :
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    }
                    <span className="sr-only">{change > 0 ? "Increased by" : "Decreased by"}</span>
                    {Math.abs(change)}%
                  </div>
                )}
              </dd>
            </dl>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
