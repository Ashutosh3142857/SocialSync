import React from "react";
import MetricCard from "@/components/dashboard/MetricCard";
import EngagementChart from "@/components/dashboard/EngagementChart";
import UpcomingPosts from "@/components/dashboard/UpcomingPosts";
import QuickPostCreator from "@/components/dashboard/QuickPostCreator";
import PlatformInsights from "@/components/dashboard/PlatformInsights";
import { useQuery } from "@tanstack/react-query";
import { DashboardMetrics } from "@/types";

const Dashboard: React.FC = () => {
  const { data: metrics, isLoading } = useQuery<DashboardMetrics>({
    queryKey: ["/api/dashboard/metrics"],
  });

  // Prepare metrics for display
  const metricCards = [
    {
      title: "Scheduled Posts",
      value: metrics?.scheduledPosts || 0,
      change: metrics?.scheduledPostsChange || 0,
    },
    {
      title: "Post Engagement",
      value: metrics?.engagement || 0,
      change: metrics?.engagementChange || 0,
    },
    {
      title: "Profile Visits",
      value: metrics?.profileVisits || 0,
      change: metrics?.profileVisitsChange || 0,
    },
    {
      title: "New Followers",
      value: metrics?.newFollowers || 0,
      change: metrics?.newFollowersChange || 0,
    },
  ];

  return (
    <div>
      {/* Dashboard Overview */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {isLoading ? (
          // Loading state for metric cards
          [...Array(4)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
          ))
        ) : (
          // Render actual metric cards
          metricCards.map((metric, index) => (
            <MetricCard
              key={index}
              title={metric.title}
              value={metric.value}
              change={metric.change}
            />
          ))
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Engagement Chart */}
        <div className="lg:col-span-2">
          <EngagementChart />
        </div>

        {/* Upcoming Posts */}
        <div>
          <UpcomingPosts />
        </div>
      </div>

      {/* Quick Post Creator */}
      <QuickPostCreator />

      {/* Platform Insights */}
      <PlatformInsights />
    </div>
  );
};

export default Dashboard;
