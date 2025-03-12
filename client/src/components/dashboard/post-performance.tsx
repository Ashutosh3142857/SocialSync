import { SocialBadge } from "@/components/ui/social-icon";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Clock } from "lucide-react";
import { Post, PlatformPost } from "@shared/schema";

interface PostWithPlatforms extends Post {
  platforms: PlatformPost[];
}

export function PostPerformance() {
  const { data: recentPosts = [], isLoading } = useQuery<PostWithPlatforms[]>({
    queryKey: ['/api/performance'],
  });

  const formatTimeAgo = (date: Date | null) => {
    if (!date) return "";
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  const getFirstPlatform = (post: PostWithPlatforms) => {
    if (post.platforms && post.platforms.length > 0) {
      const platformPost = post.platforms[0];
      const account = platformPost.socialAccountId;
      return account === 1 ? "twitter" : 
             account === 2 ? "instagram" : 
             account === 3 ? "facebook" : "linkedin";
    }
    return "twitter";
  };

  const getMetrics = (post: PostWithPlatforms) => {
    if (post.platforms && post.platforms.length > 0) {
      return post.platforms[0].metrics || {};
    }
    return {};
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg leading-6 font-medium text-gray-900">Recent Post Performance</h2>
        <Link href="/analytics" className="text-sm font-medium text-primary hover:text-blue-600">
          View all
        </Link>
      </div>
      
      {isLoading ? (
        <div className="mt-4 text-center text-gray-500">
          Loading post performance...
        </div>
      ) : (
        <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {recentPosts.map((post) => {
            const metrics = getMetrics(post);
            return (
              <Card key={post.id} className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center">
                    <SocialBadge platform={getFirstPlatform(post)} />
                    <div className="ml-4 flex-1 truncate">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {post.content}
                      </p>
                      <p className="text-xs text-gray-500">
                        <Clock className="inline-block h-3 w-3 mr-1" /> 
                        {post.createdAt ? formatTimeAgo(post.createdAt) : ""}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-4 sm:px-6">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Views</p>
                      <p className="text-lg font-semibold text-gray-900">{metrics.views?.toLocaleString() || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        {getFirstPlatform(post) === 'linkedin' ? 'Reactions' : 'Likes'}
                      </p>
                      <p className="text-lg font-semibold text-gray-900">{metrics.likes?.toLocaleString() || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        {getFirstPlatform(post) === 'linkedin' ? 'Comments' : 'Shares'}
                      </p>
                      <p className="text-lg font-semibold text-gray-900">{metrics.shares?.toLocaleString() || 0}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium text-gray-500">Engagement Rate</p>
                      <p className={`text-sm font-semibold ${
                        (metrics.engagementRateChange || 0) >= 0 
                          ? "text-green-600" 
                          : "text-yellow-600"
                      }`}>
                        {metrics.engagementRate || 0}%
                        <span className="text-xs text-gray-400">
                          {` (${(metrics.engagementRateChange || 0) >= 0 ? '+' : ''}${metrics.engagementRateChange || 0}%)`}
                        </span>
                      </p>
                    </div>
                    <div className="mt-2">
                      <Progress 
                        value={Math.min((metrics.engagementRate || 0) * 10, 100)} 
                        className="h-2 bg-gray-200"
                        indicatorClassName={`${
                          (metrics.engagementRate || 0) > 5 
                            ? "bg-green-500" 
                            : (metrics.engagementRate || 0) > 3 
                              ? "bg-yellow-500" 
                              : "bg-red-500"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}

          {recentPosts.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500">
              No published posts to show performance metrics.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
