import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ChartBar, BarChart2, Award, Zap, Edit, PlusCircle, Clock, ArrowRightLeft, Check } from 'lucide-react';
import { SocialBadge } from "@/components/ui/social-icon";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { format } from 'date-fns';

interface ABTestVariant {
  id: string;
  content: string;
  image?: string | null;
  impressions: number;
  engagement: number;
  clicks: number;
  shares: number;
  platforms: string[];
}

interface ABTest {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'draft';
  variants: ABTestVariant[];
  startDate: Date;
  endDate: Date | null;
  targetAudience: string[];
  conversionMetric: string;
  totalSampleSize: number;
  createdAt: Date;
}

export function ABTesting() {
  const [activeTab, setActiveTab] = useState("active");
  const [tests, setTests] = useState<ABTest[]>([
    {
      id: "test-1",
      name: "Headline Comparison for Product Launch",
      status: "active",
      variants: [
        {
          id: "variant-a",
          content: "Introducing Our Revolutionary New Product",
          image: null,
          impressions: 2450,
          engagement: 412,
          clicks: 186,
          shares: 78,
          platforms: ["twitter", "linkedin", "facebook"]
        },
        {
          id: "variant-b",
          content: "See How Our New Product Is Changing The Game",
          image: null,
          impressions: 2320,
          engagement: 387,
          clicks: 215,
          shares: 92,
          platforms: ["twitter", "linkedin", "facebook"]
        }
      ],
      startDate: new Date(2023, 2, 15),
      endDate: null,
      targetAudience: ["professionals", "early adopters"],
      conversionMetric: "clicks",
      totalSampleSize: 5000,
      createdAt: new Date(2023, 2, 10)
    },
    {
      id: "test-2",
      name: "Image Test for Engagement",
      status: "completed",
      variants: [
        {
          id: "variant-a",
          content: "Our team is expanding! Join us in our journey.",
          image: "image-a.jpg",
          impressions: 3245,
          engagement: 618,
          clicks: 342,
          shares: 129,
          platforms: ["instagram", "facebook"]
        },
        {
          id: "variant-b",
          content: "Our team is expanding! Join us in our journey.",
          image: "image-b.jpg",
          impressions: 3310,
          engagement: 712,
          clicks: 380,
          shares: 152,
          platforms: ["instagram", "facebook"]
        }
      ],
      startDate: new Date(2023, 1, 25),
      endDate: new Date(2023, 2, 10),
      targetAudience: ["job seekers", "industry professionals"],
      conversionMetric: "engagement",
      totalSampleSize: 7000,
      createdAt: new Date(2023, 1, 20)
    },
    {
      id: "test-3",
      name: "CTA Button Test",
      status: "draft",
      variants: [
        {
          id: "variant-a",
          content: "Learn More",
          image: null,
          impressions: 0,
          engagement: 0,
          clicks: 0,
          shares: 0,
          platforms: ["twitter", "linkedin"]
        },
        {
          id: "variant-b",
          content: "Get Started Now",
          image: null,
          impressions: 0,
          engagement: 0,
          clicks: 0,
          shares: 0,
          platforms: ["twitter", "linkedin"]
        }
      ],
      startDate: new Date(),
      endDate: null,
      targetAudience: ["potential customers"],
      conversionMetric: "clicks",
      totalSampleSize: 3000,
      createdAt: new Date(2023, 2, 20)
    }
  ]);

  const calculateWinner = (test: ABTest) => {
    if (test.status !== 'completed') return null;
    
    const conversionMetric = test.conversionMetric as keyof ABTestVariant;
    let winner = test.variants[0];
    
    for (let i = 1; i < test.variants.length; i++) {
      if (test.variants[i][conversionMetric] > winner[conversionMetric]) {
        winner = test.variants[i];
      }
    }
    
    return winner;
  };

  const calculateConversionRate = (variant: ABTestVariant, metric: keyof ABTestVariant) => {
    if (variant.impressions === 0) return 0;
    return ((variant[metric] as number) / variant.impressions) * 100;
  };

  const calculateProgress = (test: ABTest) => {
    if (test.status === 'draft') return 0;
    if (test.status === 'completed') return 100;
    
    const totalImpressions = test.variants.reduce((sum, variant) => sum + variant.impressions, 0);
    return (totalImpressions / test.totalSampleSize) * 100;
  };

  const getStatLabel = (key: string): string => {
    switch (key) {
      case 'impressions': return 'Impressions';
      case 'engagement': return 'Engagements';
      case 'clicks': return 'Clicks';
      case 'shares': return 'Shares';
      default: return key;
    }
  };

  const getStatColor = (metric: string): string => {
    switch (metric) {
      case 'impressions': return 'text-blue-500';
      case 'engagement': return 'text-green-500';
      case 'clicks': return 'text-purple-500';
      case 'shares': return 'text-orange-500';
      default: return 'text-gray-500';
    }
  };

  const filteredTests = tests.filter(test => {
    if (activeTab === 'active') return test.status === 'active';
    if (activeTab === 'completed') return test.status === 'completed';
    if (activeTab === 'draft') return test.status === 'draft';
    return true;
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center">
              <ArrowRightLeft className="mr-2 h-5 w-5 text-primary" />
              A/B Testing for Posts
            </CardTitle>
            <CardDescription>
              Compare different versions of your content to maximize engagement
            </CardDescription>
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Test
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="active">Active Tests</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="draft">Drafts</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab}>
            {filteredTests.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <BarChart2 className="h-6 w-6" />
                </div>
                <h3 className="font-medium text-lg mb-1">No {activeTab} tests found</h3>
                <p className="text-muted-foreground text-sm max-w-md">
                  {activeTab === 'active' 
                    ? "Start an A/B test to optimize your content performance" 
                    : activeTab === 'completed' 
                      ? "Completed tests will appear here" 
                      : "Create a draft test to prepare for future campaigns"}
                </p>
                <Button className="mt-4">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create New Test
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredTests.map(test => (
                  <Card key={test.id} className="border bg-card">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <h3 className="text-lg font-semibold">{test.name}</h3>
                            {test.status === 'active' && (
                              <Badge variant="secondary" className="ml-2">Active</Badge>
                            )}
                            {test.status === 'completed' && (
                              <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>
                            )}
                            {test.status === 'draft' && (
                              <Badge variant="outline" className="ml-2">Draft</Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            <span>Created {format(test.createdAt, 'MMMM d, yyyy')}</span>
                            <span className="mx-2">•</span>
                            {test.status === 'completed' ? (
                              <span>Ran for {Math.round((test.endDate!.getTime() - test.startDate.getTime()) / (1000 * 60 * 60 * 24))} days</span>
                            ) : (
                              <span>Running since {format(test.startDate, 'MMMM d, yyyy')}</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          {test.status === 'draft' && (
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          )}
                          {test.status === 'active' && (
                            <Button size="sm" variant="outline">
                              <Check className="h-4 w-4 mr-1" />
                              End Test
                            </Button>
                          )}
                          {test.status === 'completed' && calculateWinner(test) && (
                            <Button size="sm" variant="outline">
                              <Zap className="h-4 w-4 mr-1" />
                              Apply Winner
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      {test.status !== 'draft' && (
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Test progress</span>
                            <span>{Math.min(100, Math.floor(calculateProgress(test)))}%</span>
                          </div>
                          <Progress value={calculateProgress(test)} className="h-2" />
                        </div>
                      )}
                      
                      <div className="grid md:grid-cols-2 gap-4 mt-4">
                        {test.variants.map((variant, index) => (
                          <div key={variant.id} className="border rounded-lg p-4 relative">
                            {test.status === 'completed' && calculateWinner(test)?.id === variant.id && (
                              <div className="absolute -top-3 -right-3 bg-green-500 text-white rounded-full p-1">
                                <Award className="h-5 w-5" />
                              </div>
                            )}
                            
                            <div className="flex items-center mb-3">
                              <h4 className="font-medium">Variant {String.fromCharCode(65 + index)}</h4>
                              <div className="flex ml-auto">
                                {variant.platforms.map(platform => (
                                  <SocialBadge key={platform} platform={platform} className="h-4 w-4 ml-1" />
                                ))}
                              </div>
                            </div>
                            
                            <div className="bg-muted/50 p-3 rounded mb-4 text-sm">
                              {variant.content}
                            </div>
                            
                            {test.status !== 'draft' && (
                              <div className="grid grid-cols-2 gap-3">
                                {['impressions', 'engagement', 'clicks', 'shares'].map(key => (
                                  <div key={key} className="text-sm">
                                    <span className="text-muted-foreground">{getStatLabel(key)}:</span>
                                    <div className="flex items-center">
                                      <span className={`font-medium text-base ${getStatColor(key)}`}>
                                        {variant[key as keyof ABTestVariant] as number}
                                      </span>
                                      {key !== 'impressions' && (
                                        <span className="text-xs text-muted-foreground ml-1">
                                          ({calculateConversionRate(variant, key as keyof ABTestVariant).toFixed(1)}%)
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {test.status === 'completed' && (
                        <div className="mt-4 bg-muted/30 rounded-lg p-4">
                          <h4 className="font-medium flex items-center mb-3">
                            <Award className="h-5 w-5 mr-2 text-green-500" />
                            Results Summary
                          </h4>
                          
                          <div className="text-sm">
                            <p>
                              Variant {test.variants.indexOf(calculateWinner(test)!) === 0 ? 'A' : 'B'} performed better with a 
                              {' ' + (calculateConversionRate(calculateWinner(test)!, test.conversionMetric as keyof ABTestVariant) - 
                                calculateConversionRate(
                                  test.variants.find(v => v.id !== calculateWinner(test)!.id)!, 
                                  test.conversionMetric as keyof ABTestVariant
                                )).toFixed(1)}% increase in {test.conversionMetric}.
                            </p>
                            <p className="mt-2">
                              Statistical significance: <span className="font-medium">95% confidence</span>
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="border-t px-6 py-4">
        <div className="flex items-center justify-between w-full">
          <p className="text-sm text-muted-foreground">
            Pro Tip: A/B tests are most effective when testing one variable at a time.
          </p>
          <Button variant="outline" size="sm">
            <ChartBar className="h-4 w-4 mr-1" />
            View Performance History
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}