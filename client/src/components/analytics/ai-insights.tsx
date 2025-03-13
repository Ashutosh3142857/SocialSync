import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, TrendingUp, BarChart2, Target, Download, ArrowUpRight, 
  ArrowDownRight, Calendar, AlertTriangle, Lightbulb, Zap, Filter,
  ChevronDown, ScanSearch, Sparkles, RefreshCcw 
} from 'lucide-react';
import { SocialBadge } from "@/components/ui/social-icon";
import { 
  AreaChart, Area, BarChart, Bar, LineChart, Line, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';
import { formatNumber, getGrowthClassName, getGrowthIndicator } from '@/lib/utils';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import { CHART_COLORS } from '@/lib/constants';

interface InsightItem {
  id: string;
  type: 'opportunity' | 'risk' | 'trend';
  title: string;
  description: string;
  metric?: string;
  change?: number;
  platforms: string[];
  timeframe: string;
  confidenceScore: number;
  actionable: boolean;
  timestamp: Date;
}

interface AudienceSegment {
  name: string;
  value: number;
  percent: number;
  growth: number;
  color: string;
}

interface TopPerformer {
  id: number;
  content: string;
  platform: string;
  metric: string;
  value: number;
  growth: number;
  publishedAt: Date;
}

interface CompetitorMetric {
  name: string;
  followers: number;
  followersGrowth: number;
  engagement: number;
  engagementGrowth: number;
  postFrequency: number;
  postFrequencyGrowth: number;
}

interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  platforms: string[];
  category: 'content' | 'timing' | 'audience' | 'engagement';
}

export function AIInsights() {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [timeframe, setTimeframe] = useState<string>("30d");
  
  // Sample data for the insights
  const [insights, setInsights] = useState<InsightItem[]>([
    {
      id: "insight-1",
      type: "opportunity",
      title: "Engagement spike potential on LinkedIn",
      description: "Your professional audience is most active on Tuesdays. Shifting your posting schedule could increase engagement by up to 24%.",
      change: 24,
      platforms: ["linkedin"],
      timeframe: "Last 30 days",
      confidenceScore: 89,
      actionable: true,
      timestamp: new Date()
    },
    {
      id: "insight-2",
      type: "risk",
      title: "Declining reach on Instagram",
      description: "Your Instagram reach has decreased by 18% this month compared to last month, potentially due to algorithm changes.",
      metric: "Reach",
      change: -18,
      platforms: ["instagram"],
      timeframe: "This month vs last month",
      confidenceScore: 92,
      actionable: true,
      timestamp: subDays(new Date(), 2)
    },
    {
      id: "insight-3",
      type: "trend",
      title: "Video content outperforming other formats",
      description: "Video posts are generating 2.7x more engagement than image or text posts across all platforms.",
      change: 170,
      platforms: ["twitter", "facebook", "instagram", "linkedin"],
      timeframe: "Last 90 days",
      confidenceScore: 95,
      actionable: true,
      timestamp: subDays(new Date(), 5)
    }
  ]);
  
  // Sample data for engagement over time
  const engagementData = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i);
    return {
      date: format(date, 'MMM dd'),
      twitter: Math.floor(Math.random() * 500) + 100,
      linkedin: Math.floor(Math.random() * 300) + 200,
      facebook: Math.floor(Math.random() * 400) + 150,
      instagram: Math.floor(Math.random() * 600) + 300,
    };
  });
  
  // Sample data for audience segments
  const audienceSegments: AudienceSegment[] = [
    { name: "Tech Professionals", value: 3450, percent: 32, growth: 8.4, color: "#8884d8" },
    { name: "Marketing Specialists", value: 2830, percent: 26, growth: 12.7, color: "#82ca9d" },
    { name: "Business Leaders", value: 1975, percent: 18, growth: 5.2, color: "#ffc658" },
    { name: "Creatives", value: 1420, percent: 13, growth: -2.3, color: "#ff8042" },
    { name: "Students", value: 1200, percent: 11, growth: 15.8, color: "#0088fe" }
  ];
  
  // Sample data for peak engagement times
  const peakEngagementTimes = [
    {
      day: "Monday",
      twitter: "11:00 AM - 1:00 PM",
      linkedin: "8:00 AM - 10:00 AM",
      facebook: "1:00 PM - 3:00 PM",
      instagram: "6:00 PM - 8:00 PM"
    },
    {
      day: "Tuesday",
      twitter: "12:00 PM - 2:00 PM",
      linkedin: "10:00 AM - 12:00 PM",
      facebook: "2:00 PM - 4:00 PM",
      instagram: "7:00 PM - 9:00 PM"
    },
    {
      day: "Wednesday",
      twitter: "10:00 AM - 12:00 PM",
      linkedin: "11:00 AM - 1:00 PM",
      facebook: "1:00 PM - 3:00 PM",
      instagram: "8:00 PM - 10:00 PM"
    },
    {
      day: "Thursday",
      twitter: "9:00 AM - 11:00 AM",
      linkedin: "3:00 PM - 5:00 PM",
      facebook: "4:00 PM - 6:00 PM",
      instagram: "7:00 PM - 9:00 PM"
    },
    {
      day: "Friday",
      twitter: "8:00 AM - 10:00 AM",
      linkedin: "2:00 PM - 4:00 PM",
      facebook: "12:00 PM - 2:00 PM",
      instagram: "5:00 PM - 7:00 PM"
    },
    {
      day: "Saturday",
      twitter: "12:00 PM - 2:00 PM",
      linkedin: "10:00 AM - 12:00 PM",
      facebook: "10:00 AM - 12:00 PM",
      instagram: "2:00 PM - 4:00 PM"
    },
    {
      day: "Sunday",
      twitter: "3:00 PM - 5:00 PM",
      linkedin: "4:00 PM - 6:00 PM",
      facebook: "5:00 PM - 7:00 PM",
      instagram: "6:00 PM - 8:00 PM"
    }
  ];
  
  // Sample data for top performers
  const topPerformers: TopPerformer[] = [
    {
      id: 1,
      content: "10 Ways to Boost Your Productivity While Working from Home",
      platform: "linkedin",
      metric: "engagement",
      value: 845,
      growth: 32.7,
      publishedAt: subDays(new Date(), 7)
    },
    {
      id: 2,
      content: "Announcing our new partnership with Industry Leader XYZ",
      platform: "twitter",
      metric: "shares",
      value: 326,
      growth: 48.2,
      publishedAt: subDays(new Date(), 5)
    },
    {
      id: 3,
      content: "Behind the scenes at our annual team retreat",
      platform: "instagram",
      metric: "impressions",
      value: 4892,
      growth: 15.4,
      publishedAt: subDays(new Date(), 12)
    }
  ];
  
  // Sample data for competitor analysis
  const competitorMetrics: CompetitorMetric[] = [
    {
      name: "Your Brand",
      followers: 25600,
      followersGrowth: 5.8,
      engagement: 3.2,
      engagementGrowth: 0.4,
      postFrequency: 5.2,
      postFrequencyGrowth: 0.5
    },
    {
      name: "Competitor A",
      followers: 37800,
      followersGrowth: 3.2,
      engagement: 2.1,
      engagementGrowth: -0.2,
      postFrequency: 3.8,
      postFrequencyGrowth: -0.7
    },
    {
      name: "Competitor B",
      followers: 18200,
      followersGrowth: 7.9,
      engagement: 4.5,
      engagementGrowth: 1.2,
      postFrequency: 6.7,
      postFrequencyGrowth: 1.5
    },
    {
      name: "Industry Average",
      followers: 24500,
      followersGrowth: 4.3,
      engagement: 2.8,
      engagementGrowth: 0.1,
      postFrequency: 4.9,
      postFrequencyGrowth: 0.2
    }
  ];
  
  // Sample data for AI recommendations
  const aiRecommendations: AIRecommendation[] = [
    {
      id: "rec-1",
      title: "Increase video content frequency",
      description: "Based on your audience engagement patterns, increasing video content from 20% to 40% of your content mix could boost overall engagement by 28%.",
      impact: "high",
      effort: "medium",
      platforms: ["instagram", "twitter", "facebook"],
      category: "content"
    },
    {
      id: "rec-2",
      title: "Optimal posting schedule adjustment",
      description: "Shifting LinkedIn posts to Tuesdays 10AM-12PM could reach 34% more of your professional audience based on activity patterns.",
      impact: "medium",
      effort: "low",
      platforms: ["linkedin"],
      category: "timing"
    },
    {
      id: "rec-3",
      title: "Targeted content for tech audience",
      description: "Your tech audience segment has grown 8.4% this month. Creating more technical deep-dives could capitalize on this trend.",
      impact: "medium",
      effort: "high",
      platforms: ["linkedin", "twitter"],
      category: "audience"
    }
  ];
  
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <TrendingUp className="h-5 w-5 text-green-500" />;
      case 'risk': return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'trend': return <BarChart2 className="h-5 w-5 text-blue-500" />;
      default: return <Lightbulb className="h-5 w-5 text-purple-500" />;
    }
  };
  
  const getInsightBg = (type: string) => {
    switch (type) {
      case 'opportunity': return 'bg-green-50 border-green-200';
      case 'risk': return 'bg-amber-50 border-amber-200';
      case 'trend': return 'bg-blue-50 border-blue-200';
      default: return 'bg-purple-50 border-purple-200';
    }
  };
  
  const getImpactBadgeColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'medium': return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'low': return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };
  
  const getEffortBadgeColor = (effort: string) => {
    switch (effort) {
      case 'high': return 'bg-red-100 text-red-800 hover:bg-red-100';
      case 'medium': return 'bg-amber-100 text-amber-800 hover:bg-amber-100';
      case 'low': return 'bg-green-100 text-green-800 hover:bg-green-100';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };
  
  const handleRefreshInsights = () => {
    setIsRefreshing(true);
    // Simulate API call delay
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Brain className="mr-2 h-5 w-5 text-primary" />
              AI-Powered Analytics Insights
            </CardTitle>
            <CardDescription>
              Advanced analytics and intelligent recommendations to optimize your social media strategy
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {timeframe === "30d" ? "Last 30 Days" : timeframe === "90d" ? "Last 90 Days" : "This Month"}
              <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
            <Button 
              onClick={handleRefreshInsights}
              disabled={isRefreshing}
              className="flex items-center"
            >
              <RefreshCcw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? "Refreshing..." : "Refresh Insights"}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Key Insights</TabsTrigger>
            <TabsTrigger value="audience">Audience Analysis</TabsTrigger>
            <TabsTrigger value="content">Content Performance</TabsTrigger>
            <TabsTrigger value="competitors">Competitor Analysis</TabsTrigger>
            <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-3 mb-2">
                <h3 className="text-lg font-semibold flex items-center">
                  <Sparkles className="mr-2 h-5 w-5 text-primary" />
                  AI-Generated Performance Insights
                </h3>
                <p className="text-sm text-muted-foreground">
                  Automatically detected patterns and opportunities from your social media data
                </p>
              </div>
              
              {insights.map((insight) => (
                <Card 
                  key={insight.id} 
                  className={`border ${getInsightBg(insight.type)}`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        {getInsightIcon(insight.type)}
                        <span className="ml-2 font-medium capitalize">{insight.type}</span>
                      </div>
                      <div className="flex">
                        {insight.platforms.map(platform => (
                          <SocialBadge key={platform} platform={platform} className="h-4 w-4 ml-1" />
                        ))}
                      </div>
                    </div>
                    <h3 className="text-md font-semibold mt-1">{insight.title}</h3>
                  </CardHeader>
                  
                  <CardContent className="pb-2">
                    <p className="text-sm">{insight.description}</p>
                    
                    {insight.change && (
                      <div className="flex items-center mt-2">
                        <span className="text-sm text-muted-foreground mr-2">
                          {insight.metric ? insight.metric : "Potential impact"}:
                        </span>
                        <div className={`flex items-center ${getGrowthClassName(insight.change)}`}>
                          {insight.change > 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                          <span className="font-medium">{Math.abs(insight.change)}%</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-3 text-xs">
                      <span className="text-muted-foreground">{insight.timeframe}</span>
                      <Badge variant="outline" className="bg-white/50">
                        {insight.confidenceScore}% Confidence
                      </Badge>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="pt-0">
                    {insight.actionable && (
                      <Button variant="outline" size="sm" className="w-full">
                        <Zap className="h-3 w-3 mr-1" />
                        Take Action
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Cross-Platform Engagement Trends</h3>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Export Data
                </Button>
              </div>
              
              <div className="bg-muted/30 p-4 rounded-lg">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={engagementData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      {Object.entries(CHART_COLORS).map(([platform, color]) => (
                        <linearGradient key={platform} id={`color-${platform}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                          <stop offset="95%" stopColor={color} stopOpacity={0.1}/>
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    {Object.keys(CHART_COLORS).map(platform => (
                      platform !== 'total' && (
                        <Area 
                          key={platform}
                          type="monotone" 
                          dataKey={platform} 
                          stackId="1"
                          stroke={CHART_COLORS[platform]} 
                          fillOpacity={1} 
                          fill={`url(#color-${platform})`} 
                        />
                      )
                    ))}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="audience">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-2">
                <Card>
                  <CardHeader className="pb-2">
                    <h3 className="text-lg font-semibold">Audience Segmentation</h3>
                    <p className="text-sm text-muted-foreground">
                      Breakdown of your audience demographics and interests
                    </p>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex flex-col md:flex-row md:items-center">
                      <div className="md:w-1/2">
                        <ResponsiveContainer width="100%" height={250}>
                          <PieChart>
                            <Pie
                              data={audienceSegments}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                              labelLine={false}
                            >
                              {audienceSegments.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip 
                              formatter={(value: number) => [`${value} followers`, 'Count']} 
                              labelFormatter={(name) => name}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      
                      <div className="md:w-1/2">
                        <div className="space-y-4">
                          {audienceSegments.map((segment) => (
                            <div key={segment.name} className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div 
                                  className="w-3 h-3 rounded-full mr-2" 
                                  style={{ backgroundColor: segment.color }}
                                />
                                <span className="font-medium">{segment.name}</span>
                              </div>
                              
                              <div className="flex items-center">
                                <span className="text-sm mr-3">{formatNumber(segment.value)}</span>
                                <div className={`flex items-center text-sm ${getGrowthClassName(segment.growth)}`}>
                                  {getGrowthIndicator(segment.growth)}
                                  {Math.abs(segment.growth)}%
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="mt-6">
                  <CardHeader className="pb-2">
                    <h3 className="text-lg font-semibold">Audience Interests</h3>
                    <p className="text-sm text-muted-foreground">
                      Top topics and interests resonating with your audience
                    </p>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart
                          data={[
                            { name: 'Technology', value: 68 },
                            { name: 'Marketing', value: 52 },
                            { name: 'Business', value: 47 },
                            { name: 'Leadership', value: 44 },
                            { name: 'Innovation', value: 39 },
                            { name: 'Design', value: 31 },
                            { name: 'Finance', value: 26 }
                          ]}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`${value}%`, 'Interest Level']} />
                          <Bar dataKey="value" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Badge variant="outline">Artificial Intelligence</Badge>
                      <Badge variant="outline">Digital Marketing</Badge>
                      <Badge variant="outline">Product Development</Badge>
                      <Badge variant="outline">Remote Work</Badge>
                      <Badge variant="outline">Sustainability</Badge>
                      <Badge variant="outline">E-commerce</Badge>
                      <Badge variant="outline">Entrepreneurship</Badge>
                      <Badge variant="outline">Creative Design</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="col-span-1">
                <Card>
                  <CardHeader className="pb-2">
                    <h3 className="text-lg font-semibold">Geographic Distribution</h3>
                  </CardHeader>
                  
                  <CardContent className="pb-2">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">United States</span>
                          <span className="text-sm">42%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-primary rounded-full h-2" style={{ width: '42%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">United Kingdom</span>
                          <span className="text-sm">18%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-primary rounded-full h-2" style={{ width: '18%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Canada</span>
                          <span className="text-sm">12%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-primary rounded-full h-2" style={{ width: '12%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Australia</span>
                          <span className="text-sm">8%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-primary rounded-full h-2" style={{ width: '8%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Germany</span>
                          <span className="text-sm">6%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-primary rounded-full h-2" style={{ width: '6%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Other Countries</span>
                          <span className="text-sm">14%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-primary rounded-full h-2" style={{ width: '14%' }}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="mt-6">
                  <CardHeader className="pb-2">
                    <h3 className="text-lg font-semibold">Peak Engagement Times</h3>
                    <p className="text-sm text-muted-foreground">
                      Best times to post for maximum engagement
                    </p>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="max-h-[400px] overflow-y-auto pr-2">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="py-2 text-left font-medium">Day</th>
                            <th className="py-2 text-center font-medium">Best Time</th>
                            <th className="py-2 text-center font-medium">Platform</th>
                          </tr>
                        </thead>
                        <tbody>
                          {peakEngagementTimes.flatMap(dayData => {
                            const platforms = [
                              { name: 'twitter', time: dayData.twitter },
                              { name: 'linkedin', time: dayData.linkedin },
                              { name: 'facebook', time: dayData.facebook },
                              { name: 'instagram', time: dayData.instagram }
                            ];
                            
                            return platforms.map((platform, index) => (
                              <tr key={`${dayData.day}-${platform.name}`} className="border-b last:border-0">
                                {index === 0 && (
                                  <td className="py-2 font-medium" rowSpan={4}>{dayData.day}</td>
                                )}
                                <td className="py-2 text-center">{platform.time}</td>
                                <td className="py-2 text-center">
                                  <SocialBadge platform={platform.name} className="h-4 w-4 inline-block" />
                                </td>
                              </tr>
                            ));
                          })}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="content">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Content Performance by Type</h3>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-1" />
                        Filter
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                          data={[
                            { 
                              type: 'Video', 
                              engagement: 4.8, 
                              reach: 1840, 
                              clickRate: 3.7,
                              growth: 32 
                            },
                            { 
                              type: 'Images', 
                              engagement: 3.2, 
                              reach: 1450, 
                              clickRate: 2.8,
                              growth: 18 
                            },
                            { 
                              type: 'Carousels', 
                              engagement: 3.5, 
                              reach: 1380, 
                              clickRate: 3.2,
                              growth: 25 
                            },
                            { 
                              type: 'Text', 
                              engagement: 2.4, 
                              reach: 890, 
                              clickRate: 1.9,
                              growth: -5 
                            },
                            { 
                              type: 'Links', 
                              engagement: 1.8, 
                              reach: 780, 
                              clickRate: 3.4,
                              growth: 8 
                            },
                            { 
                              type: 'Polls', 
                              engagement: 4.2, 
                              reach: 1120, 
                              clickRate: 1.5,
                              growth: 15 
                            }
                          ]}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="type" />
                          <YAxis yAxisId="left" orientation="left" label={{ value: 'Engagement Rate (%)', angle: -90, position: 'insideLeft' }} />
                          <YAxis yAxisId="right" orientation="right" label={{ value: 'Reach', angle: 90, position: 'insideRight' }} />
                          <Tooltip />
                          <Bar yAxisId="left" dataKey="engagement" name="Engagement Rate (%)" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} />
                          <Bar yAxisId="right" dataKey="reach" name="Average Reach" fill={CHART_COLORS.secondary} radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="text-md font-medium mb-3">Key Content Insights</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <Zap className="h-4 w-4 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-sm">
                            Video content delivers 2.7x higher engagement than text-only posts
                          </span>
                        </li>
                        <li className="flex items-start">
                          <Zap className="h-4 w-4 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-sm">
                            Interactive content (polls, quizzes) has seen a 15% growth in engagement this month
                          </span>
                        </li>
                        <li className="flex items-start">
                          <Zap className="h-4 w-4 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-sm">
                            Carousel posts have 22% higher retention rates compared to single image posts
                          </span>
                        </li>
                        <li className="flex items-start">
                          <Zap className="h-4 w-4 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-sm">
                            Text-only content performance has declined 5% over the past 30 days
                          </span>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card>
                  <CardHeader className="pb-2">
                    <h3 className="text-lg font-semibold">Top Performing Content</h3>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      {topPerformers.map((post) => (
                        <div key={post.id} className="border rounded-lg p-3">
                          <div className="flex items-center mb-2">
                            <SocialBadge platform={post.platform} className="h-5 w-5 mr-2" />
                            <span className="text-xs text-muted-foreground">
                              Posted {format(post.publishedAt, 'MMM d, yyyy')}
                            </span>
                          </div>
                          
                          <p className="text-sm font-medium mb-2">{post.content}</p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <span className="text-sm text-muted-foreground mr-1">
                                {post.metric === 'engagement' ? 'Engagements:' : 
                                 post.metric === 'shares' ? 'Shares:' : 'Impressions:'}
                              </span>
                              <span className="font-medium">{formatNumber(post.value)}</span>
                            </div>
                            
                            <div className={`flex items-center text-sm ${getGrowthClassName(post.growth)}`}>
                              {getGrowthIndicator(post.growth)}
                              {post.growth.toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <Button variant="outline" size="sm" className="w-full mt-4">
                      <ScanSearch className="h-4 w-4 mr-1" />
                      View All Top Content
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="mt-6">
                  <CardHeader className="pb-2">
                    <h3 className="text-lg font-semibold">Hashtag Performance</h3>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">#innovation</span>
                          <div className="flex items-center text-sm text-green-600">
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                            18.4%
                          </div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-green-500 rounded-full h-2" style={{ width: '87%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">#leadership</span>
                          <div className="flex items-center text-sm text-green-600">
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                            12.2%
                          </div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-green-500 rounded-full h-2" style={{ width: '82%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">#tech2023</span>
                          <div className="flex items-center text-sm text-green-600">
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                            9.5%
                          </div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-green-500 rounded-full h-2" style={{ width: '75%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">#remotework</span>
                          <div className="flex items-center text-sm text-green-600">
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                            7.8%
                          </div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-green-500 rounded-full h-2" style={{ width: '68%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">#marketingtips</span>
                          <div className="flex items-center text-sm text-red-600">
                            <ArrowDownRight className="h-3 w-3 mr-1" />
                            3.2%
                          </div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-amber-500 rounded-full h-2" style={{ width: '62%' }}></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-3 border-t text-sm">
                      <h4 className="font-medium mb-2">Recommended Hashtags</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">#ai</Badge>
                        <Badge variant="outline">#sustainability</Badge>
                        <Badge variant="outline">#futureofwork</Badge>
                        <Badge variant="outline">#digitaltransformation</Badge>
                        <Badge variant="outline">#productivityhacks</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="competitors">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-3">
                <Card>
                  <CardHeader className="pb-2">
                    <h3 className="text-lg font-semibold">Competitive Landscape Overview</h3>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[600px]">
                        <thead>
                          <tr className="border-b">
                            <th className="py-3 text-left font-medium"></th>
                            <th className="py-3 text-center font-medium">Followers</th>
                            <th className="py-3 text-center font-medium">Engagement Rate</th>
                            <th className="py-3 text-center font-medium">Post Frequency</th>
                            <th className="py-3 text-center font-medium">Relative Position</th>
                          </tr>
                        </thead>
                        <tbody>
                          {competitorMetrics.map((competitor, index) => (
                            <tr key={competitor.name} className={`border-b ${competitor.name === 'Your Brand' ? 'bg-primary/5' : ''}`}>
                              <td className="py-3 font-medium">
                                {competitor.name}
                                {competitor.name === 'Your Brand' && (
                                  <Badge variant="outline" className="ml-2">You</Badge>
                                )}
                              </td>
                              
                              <td className="py-3 text-center">
                                <div className="flex flex-col items-center">
                                  <span>{formatNumber(competitor.followers)}</span>
                                  <div className={`flex items-center text-xs mt-1 ${getGrowthClassName(competitor.followersGrowth)}`}>
                                    {getGrowthIndicator(competitor.followersGrowth)}
                                    {competitor.followersGrowth.toFixed(1)}%
                                  </div>
                                </div>
                              </td>
                              
                              <td className="py-3 text-center">
                                <div className="flex flex-col items-center">
                                  <span>{competitor.engagement.toFixed(1)}%</span>
                                  <div className={`flex items-center text-xs mt-1 ${getGrowthClassName(competitor.engagementGrowth)}`}>
                                    {getGrowthIndicator(competitor.engagementGrowth)}
                                    {Math.abs(competitor.engagementGrowth).toFixed(1)}%
                                  </div>
                                </div>
                              </td>
                              
                              <td className="py-3 text-center">
                                <div className="flex flex-col items-center">
                                  <span>{competitor.postFrequency.toFixed(1)}/week</span>
                                  <div className={`flex items-center text-xs mt-1 ${getGrowthClassName(competitor.postFrequencyGrowth)}`}>
                                    {getGrowthIndicator(competitor.postFrequencyGrowth)}
                                    {Math.abs(competitor.postFrequencyGrowth).toFixed(1)}
                                  </div>
                                </div>
                              </td>
                              
                              <td className="py-3 text-center">
                                {competitor.name === 'Your Brand' ? (
                                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                                    Current
                                  </Badge>
                                ) : competitor.name === 'Industry Average' ? (
                                  <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                                    Benchmark
                                  </Badge>
                                ) : (
                                  <Badge className={
                                    competitor.engagement > competitorMetrics[0].engagement 
                                      ? "bg-red-100 text-red-800 hover:bg-red-100"
                                      : "bg-green-100 text-green-800 hover:bg-green-100"
                                  }>
                                    {competitor.engagement > competitorMetrics[0].engagement 
                                      ? "Outperforming" 
                                      : "Underperforming"}
                                  </Badge>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="md:col-span-2">
                <Card>
                  <CardHeader className="pb-2">
                    <h3 className="text-lg font-semibold">Competitive Performance Analysis</h3>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <ResponsiveContainer width="100%" height={350}>
                        <LineChart
                          data={[
                            { month: 'Jan', your: 2.4, competitorA: 1.8, competitorB: 3.2, average: 2.2 },
                            { month: 'Feb', your: 2.5, competitorA: 1.9, competitorB: 3.6, average: 2.4 },
                            { month: 'Mar', your: 2.7, competitorA: 2.0, competitorB: 3.8, average: 2.5 },
                            { month: 'Apr', your: 2.8, competitorA: 2.0, competitorB: 4.1, average: 2.6 },
                            { month: 'May', your: 2.9, competitorA: 1.9, competitorB: 4.3, average: 2.7 },
                            { month: 'Jun', your: 3.2, competitorA: 2.1, competitorB: 4.5, average: 2.8 }
                          ]}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis label={{ value: 'Engagement Rate (%)', angle: -90, position: 'insideLeft' }} />
                          <Tooltip />
                          <Line 
                            type="monotone" 
                            dataKey="your" 
                            name="Your Brand" 
                            stroke={CHART_COLORS.primary}
                            strokeWidth={3} 
                            dot={{ r: 4 }} 
                            activeDot={{ r: 6 }} 
                          />
                          <Line 
                            type="monotone" 
                            dataKey="competitorA" 
                            name="Competitor A" 
                            stroke={CHART_COLORS.secondary} 
                            dot={{ r: 3 }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="competitorB" 
                            name="Competitor B" 
                            stroke={CHART_COLORS.twitter} 
                            dot={{ r: 3 }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="average" 
                            name="Industry Average" 
                            stroke="#888" 
                            strokeDasharray="4 4"
                            dot={{ r: 2 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="text-md font-medium mb-3">Competitive Insights</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <TrendingUp className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-sm">
                            Your engagement rate has improved 33% over 6 months, outpacing the industry average growth of 27%.
                          </span>
                        </li>
                        <li className="flex items-start">
                          <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-sm">
                            Competitor B maintains higher engagement but your growth rate is 2.1x faster.
                          </span>
                        </li>
                        <li className="flex items-start">
                          <Lightbulb className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-sm">
                            You're publishing 34% more frequently than Competitor A, correlating with higher engagement.
                          </span>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card>
                  <CardHeader className="pb-2">
                    <h3 className="text-lg font-semibold">Content Gap Analysis</h3>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border rounded-lg p-3">
                        <h4 className="font-medium mb-1">Opportunity: Video Tutorials</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Competitor B is gaining significant traction with product tutorial videos. This content type is missing from your strategy.
                        </p>
                        <div className="flex justify-between items-center">
                          <Badge variant="outline" className="bg-green-50">High Impact</Badge>
                          <Button variant="outline" size="sm">Explore</Button>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-3">
                        <h4 className="font-medium mb-1">Opportunity: Industry AMAs</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Competitor A's "Ask Me Anything" sessions with industry experts generate 3x average engagement.
                        </p>
                        <div className="flex justify-between items-center">
                          <Badge variant="outline" className="bg-green-50">Medium Impact</Badge>
                          <Button variant="outline" size="sm">Explore</Button>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-3">
                        <h4 className="font-medium mb-1">Unique Advantage: Case Studies</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Your case study content receives 48% more engagement than competitors. Continue to leverage this strength.
                        </p>
                        <div className="flex justify-between items-center">
                          <Badge variant="outline" className="bg-blue-50">Strength</Badge>
                          <Button variant="outline" size="sm">Expand</Button>
                        </div>
                      </div>
                    </div>
                    
                    <Button variant="outline" size="sm" className="w-full mt-4">
                      <ScanSearch className="h-4 w-4 mr-1" />
                      View Full Gap Analysis
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="recommendations">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-3 mb-0">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold flex items-center">
                          <Sparkles className="mr-2 h-5 w-5 text-primary" />
                          AI-Generated Strategy Recommendations
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Personalized recommendations based on your data patterns and industry best practices
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-1" />
                        Filter Recommendations
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              </div>
              
              {aiRecommendations.map((recommendation) => (
                <Card key={recommendation.id} className="border">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <h3 className="text-md font-semibold">{recommendation.title}</h3>
                      <div className="flex gap-1">
                        {recommendation.platforms.map(platform => (
                          <SocialBadge key={platform} platform={platform} className="h-4 w-4" />
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pb-2">
                    <p className="text-sm">{recommendation.description}</p>
                    
                    <div className="flex mt-3 gap-2">
                      <Badge className={getImpactBadgeColor(recommendation.impact)}>
                        {recommendation.impact.charAt(0).toUpperCase() + recommendation.impact.slice(1)} Impact
                      </Badge>
                      <Badge className={getEffortBadgeColor(recommendation.effort)}>
                        {recommendation.effort.charAt(0).toUpperCase() + recommendation.effort.slice(1)} Effort
                      </Badge>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="pt-0 pb-4">
                    <Button className="w-full">
                      <Lightbulb className="h-4 w-4 mr-1" />
                      Implement Recommendation
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              
              <div className="md:col-span-3 mt-2">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Brain className="h-5 w-5 text-primary mr-2" />
                        <span className="text-sm font-medium">AI Model: SocialInsight Pro</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Last updated: {format(new Date(), 'MMMM d, yyyy h:mm a')}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="border-t px-6 py-4">
        <div className="flex justify-between items-center w-full">
          <p className="text-sm text-muted-foreground">
            Pro Tip: Export reports regularly to track your progress over time.
          </p>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Export Analytics Report
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}