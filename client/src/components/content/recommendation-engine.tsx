import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp, BarChart2, Target, Feather, Calendar, Clock } from 'lucide-react';
import { SocialBadge } from "@/components/ui/social-icon";
import { format } from 'date-fns';

// Types for recommended content
interface RecommendedTopic {
  id: number;
  topic: string;
  relevanceScore: number;
  trendingScore: number;
  targetAudience: string[];
  bestPlatforms: string[];
}

interface ContentIdea {
  id: number;
  title: string;
  content: string;
  platforms: string[];
  estimatedEngagement: number;
  relevanceScore: number;
}

interface OptimalTime {
  platform: string;
  dayOfWeek: string;
  timeOfDay: string;
  engagementScore: number;
}

export function ContentRecommendationEngine() {
  const [recommendedTopics, setRecommendedTopics] = useState<RecommendedTopic[]>([]);
  const [contentIdeas, setContentIdeas] = useState<ContentIdea[]>([]);
  const [optimalTimes, setOptimalTimes] = useState<OptimalTime[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('topics');

  // Mock data generation (in a real app, this would call an API)
  useEffect(() => {
    // Simulated recommended topics
    setRecommendedTopics([
      {
        id: 1,
        topic: "Sustainable Business Practices",
        relevanceScore: 87,
        trendingScore: 92,
        targetAudience: ["professionals", "decision-makers", "eco-conscious"],
        bestPlatforms: ["linkedin", "twitter"]
      },
      {
        id: 2,
        topic: "Remote Work Innovations",
        relevanceScore: 91,
        trendingScore: 85,
        targetAudience: ["tech professionals", "managers", "HR practitioners"],
        bestPlatforms: ["linkedin", "twitter", "facebook"]
      },
      {
        id: 3,
        topic: "Digital Marketing Trends 2023",
        relevanceScore: 83,
        trendingScore: 89,
        targetAudience: ["marketers", "business owners", "content creators"],
        bestPlatforms: ["instagram", "linkedin", "twitter"]
      }
    ]);

    // Simulated content ideas
    setContentIdeas([
      {
        id: 1,
        title: "10 Sustainable Practices That Boost Your Bottom Line",
        content: "Explore how implementing eco-friendly business practices can lead to cost savings and improved brand reputation...",
        platforms: ["linkedin", "twitter"],
        estimatedEngagement: 78,
        relevanceScore: 85
      },
      {
        id: 2,
        title: "The Future of Remote Work: Trends to Watch in 2023",
        content: "Discover the emerging technologies and management practices shaping the remote work landscape...",
        platforms: ["linkedin", "facebook"],
        estimatedEngagement: 82,
        relevanceScore: 88
      },
      {
        id: 3,
        title: "How AI is Transforming Content Creation",
        content: "Learn how artificial intelligence tools are revolutionizing the way marketers create and distribute content...",
        platforms: ["twitter", "instagram"],
        estimatedEngagement: 75,
        relevanceScore: 81
      }
    ]);

    // Simulated optimal posting times
    setOptimalTimes([
      { 
        platform: "linkedin", 
        dayOfWeek: "Tuesday", 
        timeOfDay: "9:00 AM - 11:00 AM", 
        engagementScore: 92 
      },
      { 
        platform: "twitter", 
        dayOfWeek: "Wednesday", 
        timeOfDay: "12:00 PM - 1:00 PM", 
        engagementScore: 88 
      },
      { 
        platform: "instagram", 
        dayOfWeek: "Thursday", 
        timeOfDay: "7:00 PM - 9:00 PM", 
        engagementScore: 85 
      },
      { 
        platform: "facebook", 
        dayOfWeek: "Friday", 
        timeOfDay: "1:00 PM - 3:00 PM", 
        engagementScore: 79 
      }
    ]);
  }, []);

  const handleGenerateRecommendations = () => {
    setIsGenerating(true);
    // Simulate API call delay
    setTimeout(() => {
      setIsGenerating(false);
      // In a real app, this would update with fresh recommendations from an API
    }, 2000);
  };

  const handleUseIdea = (idea: ContentIdea) => {
    // In a real app, this would pre-populate the create post form
    console.log("Using idea:", idea);
  };

  const renderScoreBadge = (score: number) => {
    const color = score >= 90 ? "bg-green-500" : score >= 80 ? "bg-emerald-500" : score >= 70 ? "bg-yellow-500" : "bg-orange-500";
    return (
      <div className="flex items-center">
        <div className={`${color} text-white text-xs font-medium rounded-full w-8 h-8 flex items-center justify-center`}>
          {score}
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Sparkles className="mr-2 h-5 w-5 text-primary" />
              Content Recommendation Engine
            </CardTitle>
            <CardDescription>
              AI-powered content suggestions based on audience insights and trending topics
            </CardDescription>
          </div>
          <Button 
            onClick={handleGenerateRecommendations}
            disabled={isGenerating}
            className="flex items-center"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            {isGenerating ? "Generating..." : "Refresh Recommendations"}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="topics" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="topics">Trending Topics</TabsTrigger>
            <TabsTrigger value="ideas">Content Ideas</TabsTrigger>
            <TabsTrigger value="timing">Optimal Timing</TabsTrigger>
          </TabsList>

          <TabsContent value="topics">
            <div className="space-y-4">
              {recommendedTopics.map(topic => (
                <Card key={topic.id} className="bg-muted/40">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h3 className="text-lg font-semibold">{topic.topic}</h3>
                          <Badge variant="secondary" className="ml-2">Trending</Badge>
                        </div>
                        
                        <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2">
                          <div className="flex items-center text-sm">
                            <Target className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="text-muted-foreground">Relevance:</span>
                            <span className="ml-1 font-medium">{topic.relevanceScore}%</span>
                          </div>
                          
                          <div className="flex items-center text-sm">
                            <TrendingUp className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="text-muted-foreground">Trending:</span>
                            <span className="ml-1 font-medium">{topic.trendingScore}%</span>
                          </div>
                          
                          <div className="col-span-2 flex flex-wrap gap-1 mt-1">
                            <span className="text-xs text-muted-foreground mr-1">Best for:</span>
                            {topic.bestPlatforms.map(platform => (
                              <SocialBadge key={platform} platform={platform} className="h-4 w-4" />
                            ))}
                          </div>
                          
                          <div className="col-span-2 flex flex-wrap gap-1 mt-1">
                            <span className="text-xs text-muted-foreground mr-1">Audience:</span>
                            {topic.targetAudience.map(audience => (
                              <Badge key={audience} variant="outline" className="text-xs">
                                {audience}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <Button variant="outline" size="sm" onClick={() => setActiveTab('ideas')}>
                        Get Content Ideas
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="ideas">
            <div className="space-y-4">
              {contentIdeas.map(idea => (
                <Card key={idea.id} className="bg-muted/40">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h3 className="text-lg font-semibold">{idea.title}</h3>
                        </div>
                        
                        <p className="text-sm mt-2 text-muted-foreground">{idea.content}</p>
                        
                        <div className="mt-4 flex flex-wrap gap-2">
                          <div className="flex items-center text-sm">
                            <BarChart2 className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="text-muted-foreground">Est. Engagement:</span>
                            <span className="ml-1 font-medium">{idea.estimatedEngagement}%</span>
                          </div>
                          
                          <div className="flex items-center text-sm ml-4">
                            <Target className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="text-muted-foreground">Relevance:</span>
                            <span className="ml-1 font-medium">{idea.relevanceScore}%</span>
                          </div>
                        </div>
                        
                        <div className="mt-2 flex flex-wrap gap-1">
                          <span className="text-xs text-muted-foreground mr-1">Recommended platforms:</span>
                          {idea.platforms.map(platform => (
                            <SocialBadge key={platform} platform={platform} className="h-4 w-4" />
                          ))}
                        </div>
                      </div>
                      
                      <Button 
                        className="ml-4" 
                        size="sm"
                        onClick={() => handleUseIdea(idea)}
                      >
                        <Feather className="h-4 w-4 mr-1" />
                        Use This Idea
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="timing">
            <div className="space-y-4">
              <div className="bg-muted/40 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Best Times to Post by Platform</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {optimalTimes.map((time, index) => (
                    <Card key={index} className="border bg-card">
                      <CardContent className="pt-6">
                        <div className="flex items-center mb-2">
                          <SocialBadge platform={time.platform} className="h-5 w-5 mr-2" />
                          <h4 className="font-medium">{time.platform.charAt(0).toUpperCase() + time.platform.slice(1)}</h4>
                          <div className="ml-auto">{renderScoreBadge(time.engagementScore)}</div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 mt-3">
                          <div className="flex items-center text-sm">
                            <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span>{time.dayOfWeek}</span>
                          </div>
                          
                          <div className="flex items-center text-sm">
                            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span>{time.timeOfDay}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="flex justify-between border-t px-6 py-4">
        <div className="text-sm text-muted-foreground">
          Recommendations updated: {format(new Date(), 'MMMM d, yyyy h:mm a')}
        </div>
        <Button variant="outline" size="sm" onClick={() => setActiveTab('topics')}>
          <TrendingUp className="h-4 w-4 mr-1" />
          View All Trends
        </Button>
      </CardFooter>
    </Card>
  );
}