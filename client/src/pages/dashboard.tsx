import { useState } from "react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { AnalyticsChart } from "@/components/dashboard/analytics-chart";
import { PlatformChart } from "@/components/dashboard/platform-chart";
import { UpcomingPosts } from "@/components/dashboard/upcoming-posts";
import { PostPerformance } from "@/components/dashboard/post-performance";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RealTimeAnalytics } from "@/components/dashboard/real-time-analytics";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Edit, Plus, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { CreatePostDialog } from "@/components/posts/create-post-dialog";

export default function Dashboard() {
  const [showCreatePost, setShowCreatePost] = useState(false);
  
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/stats'],
  });

  const { data: analyticsData = [], isLoading: analyticsLoading } = useQuery({
    queryKey: ['/api/analytics'],
  });
  
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Button variant="secondary" asChild>
              <Link href="/connections">
                <Plus className="h-4 w-4 mr-2" />
                Connect Platform
              </Link>
            </Button>
            <Button onClick={() => setShowCreatePost(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Create Post
            </Button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Stats Overview */}
        <div className="mt-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900">Performance Overview</h2>
          <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard 
              title="Total Views" 
              value={statsLoading ? "..." : stats?.views || 0}
              change={stats?.viewsChange || 0}
              icon="views"
            />
            <StatsCard 
              title="Engagements" 
              value={statsLoading ? "..." : stats?.engagements || 0}
              change={stats?.engagementsChange || 0}
              icon="engagements"
            />
            <StatsCard 
              title="Shares" 
              value={statsLoading ? "..." : stats?.shares || 0}
              change={stats?.sharesChange || 0}
              icon="shares"
            />
            <StatsCard 
              title="New Followers" 
              value={statsLoading ? "..." : stats?.followers || 0}
              change={stats?.followersChange || 0}
              icon="followers"
            />
          </div>
        </div>
        
        {/* Analytics Charts */}
        <div className="mt-8">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {!analyticsLoading && analyticsData.length > 0 && (
              <>
                <AnalyticsChart 
                  title="Engagement Metrics" 
                  data={analyticsData[0]?.analytics || []}
                />
                <PlatformChart 
                  title="Platform Performance" 
                  data={analyticsData}
                />
              </>
            )}
          </div>
        </div>
        
        {/* Upcoming Posts */}
        <div className="mt-8">
          <UpcomingPosts />
        </div>
        
        {/* Recent Post Performance */}
        <div className="mt-8">
          <PostPerformance />
        </div>
        
        {/* Quick Actions */}
        <QuickActions />
      </div>
      
      <CreatePostDialog open={showCreatePost} onOpenChange={setShowCreatePost} />
    </div>
  );
}
