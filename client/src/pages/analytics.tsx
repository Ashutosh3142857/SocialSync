import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SocialIcon } from "@/components/ui/social-icon";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Button } from "@/components/ui/button";
import { 
  Bar, 
  BarChart, 
  CartesianGrid, 
  Legend, 
  Line, 
  LineChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from "recharts";
import { TIME_RANGES, CHART_COLORS } from "@/lib/constants";
import { Download, BarChart2 } from "lucide-react";
import { formatNumber } from "@/lib/utils";

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("7");
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  
  const { data: analyticsData = [], isLoading } = useQuery({
    queryKey: ['/api/analytics'],
  });

  const { data: stats } = useQuery({
    queryKey: ['/api/stats'],
  });

  // Function to transform the data for line chart
  const getEngagementData = () => {
    if (!analyticsData.length || !selectedAccount) return [];
    
    const accountData = analyticsData.find(
      account => account.platform === selectedAccount
    );
    
    if (!accountData) return [];
    
    return accountData.analytics.map(item => ({
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      Engagements: item.metrics.engagements || 0,
      Views: item.metrics.views || 0,
      Followers: item.metrics.followers || 0,
    }));
  };

  // Function to transform the data for platform comparison
  const getPlatformComparisonData = () => {
    if (!analyticsData.length) return [];
    
    return analyticsData.map(platform => ({
      name: platform.platform.charAt(0).toUpperCase() + platform.platform.slice(1),
      Engagement: platform.analytics[0]?.metrics.engagements || 0,
      Reach: platform.analytics[0]?.metrics.views || 0,
      Growth: platform.analytics[0]?.metrics.dailyGrowth * 100 || 0,
    }));
  };

  // Function to get account options
  const getAccountOptions = () => {
    if (!analyticsData.length) return [];
    
    return analyticsData.map(account => ({
      value: account.platform,
      label: account.accountName,
    }));
  };

  const accountOptions = getAccountOptions();
  
  // Set first account as default if none selected
  if (accountOptions.length && !selectedAccount) {
    setSelectedAccount(accountOptions[0].value);
  }

  const engagementData = getEngagementData();
  const platformComparisonData = getPlatformComparisonData();

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Select
              value={timeRange}
              onValueChange={setTimeRange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                {TIME_RANGES.map(range => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Summary Stats */}
        <div className="mt-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900">Performance Overview</h2>
          <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard 
              title="Total Views" 
              value={isLoading ? "..." : stats?.views || 0}
              change={stats?.viewsChange || 0}
              icon="views"
            />
            <StatsCard 
              title="Engagements" 
              value={isLoading ? "..." : stats?.engagements || 0}
              change={stats?.engagementsChange || 0}
              icon="engagements"
            />
            <StatsCard 
              title="Shares" 
              value={isLoading ? "..." : stats?.shares || 0}
              change={stats?.sharesChange || 0}
              icon="shares"
            />
            <StatsCard 
              title="New Followers" 
              value={isLoading ? "..." : stats?.followers || 0}
              change={stats?.followersChange || 0}
              icon="followers"
            />
          </div>
        </div>
        
        {/* Platform Comparison */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Platform Comparison</CardTitle>
              <CardDescription>
                Compare performance metrics across all connected platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    Loading platform data...
                  </div>
                ) : platformComparisonData.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    No platform data available
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={platformComparisonData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Engagement" fill={CHART_COLORS.primary} name="Engagement" />
                      <Bar dataKey="Reach" fill={CHART_COLORS.secondary} name="Reach" />
                      <Bar dataKey="Growth" fill={CHART_COLORS.success} name="Growth %" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Account-specific Analytics */}
        <div className="mt-8">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row justify-between sm:items-center">
              <div>
                <CardTitle>Account Performance</CardTitle>
                <CardDescription>
                  Detailed analytics for a specific social media account
                </CardDescription>
              </div>
              <div className="mt-4 sm:mt-0">
                <Select
                  value={selectedAccount || ""}
                  onValueChange={setSelectedAccount}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accountOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center">
                          <SocialIcon platform={option.value} className="mr-2 h-4 w-4" />
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="engagement">
                <TabsList className="mb-6">
                  <TabsTrigger value="engagement">Engagement</TabsTrigger>
                  <TabsTrigger value="followers">Followers</TabsTrigger>
                  <TabsTrigger value="reach">Reach</TabsTrigger>
                </TabsList>
                
                <TabsContent value="engagement">
                  <div className="h-80">
                    {isLoading ? (
                      <div className="flex items-center justify-center h-full">
                        Loading engagement data...
                      </div>
                    ) : engagementData.length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        No engagement data available
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={engagementData}
                          margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="Engagements" 
                            stroke={CHART_COLORS.primary} 
                            activeDot={{ r: 8 }} 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="followers">
                  <div className="h-80">
                    {isLoading ? (
                      <div className="flex items-center justify-center h-full">
                        Loading followers data...
                      </div>
                    ) : engagementData.length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        No followers data available
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={engagementData}
                          margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="Followers" 
                            stroke={CHART_COLORS.success} 
                            activeDot={{ r: 8 }} 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="reach">
                  <div className="h-80">
                    {isLoading ? (
                      <div className="flex items-center justify-center h-full">
                        Loading reach data...
                      </div>
                    ) : engagementData.length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        No reach data available
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={engagementData}
                          margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="Views" 
                            stroke={CHART_COLORS.secondary} 
                            activeDot={{ r: 8 }} 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Best Performing Content */}
        <div className="mt-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Best Performing Content</CardTitle>
              <CardDescription>
                Your top performing posts across all platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="py-8 text-center">Loading top content...</div>
              ) : (
                <div className="space-y-6">
                  {analyticsData.length === 0 ? (
                    <div className="py-8 text-center">No content performance data available</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {analyticsData.slice(0, 3).map((platform, index) => (
                        <Card key={index} className="bg-gray-50">
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-2 mb-3">
                              <SocialIcon platform={platform.platform} className="h-5 w-5" />
                              <span className="font-medium">{platform.accountName}</span>
                            </div>
                            <p className="text-sm mb-4 line-clamp-2">
                              {index === 0 
                                ? "Top 10 productivity hacks for remote teams" 
                                : index === 1 
                                  ? "New product launch: Summer collection"
                                  : "Industry trends for Q3 2023"}
                            </p>
                            <div className="flex justify-between text-sm">
                              <div className="text-center">
                                <div className="font-medium">{formatNumber(platform.analytics[0]?.metrics.views || 0)}</div>
                                <div className="text-xs text-gray-500">Views</div>
                              </div>
                              <div className="text-center">
                                <div className="font-medium">{formatNumber(platform.analytics[0]?.metrics.engagements || 0)}</div>
                                <div className="text-xs text-gray-500">Engagements</div>
                              </div>
                              <div className="text-center">
                                <div className="font-medium">{formatNumber(platform.analytics[0]?.metrics.shares || 0)}</div>
                                <div className="text-xs text-gray-500">Shares</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
