import React, { useState } from 'react';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, Brain, Zap, ArrowRightLeft, Users, Check, 
  ExternalLink, ChevronRight, Star, Award, Info, Lock 
} from 'lucide-react';
import { ContentRecommendationEngine } from '@/components/content/recommendation-engine';
import { ABTesting } from '@/components/testing/ab-testing';
import { TeamCollaboration } from '@/components/team/collaboration';
import { AIInsights } from '@/components/analytics/ai-insights';

export default function PremiumFeatures() {
  const [activeTab, setActiveTab] = useState<string>("overview");
  
  const plans = [
    {
      name: "Basic",
      price: "$0",
      billing: "Free",
      description: "For individuals just getting started",
      features: [
        "Social media content scheduling",
        "Basic analytics",
        "Connect up to 3 social accounts",
        "Single user"
      ]
    },
    {
      name: "Professional",
      price: "$29",
      billing: "per month",
      description: "For creators and small businesses",
      popular: true,
      features: [
        "All Basic features",
        "Advanced analytics",
        "Content recommendation engine",
        "Connect up to 10 social accounts",
        "3 team members"
      ]
    },
    {
      name: "Business",
      price: "$99",
      billing: "per month",
      description: "For growing businesses and agencies",
      features: [
        "All Professional features",
        "AI-powered performance insights",
        "A/B testing capabilities",
        "Team collaboration tools",
        "Unlimited social accounts",
        "10 team members"
      ]
    },
    {
      name: "Enterprise",
      price: "Custom",
      billing: "contact sales",
      description: "For large teams and organizations",
      features: [
        "All Business features",
        "Custom API integrations",
        "Dedicated account manager",
        "Priority support",
        "Custom reporting",
        "Unlimited team members"
      ]
    }
  ];
  
  const features = [
    {
      id: "content-recommendation",
      name: "Content Recommendation Engine",
      description: "AI-powered content suggestions based on audience insights and trending topics",
      icon: Sparkles,
      component: ContentRecommendationEngine,
      planLevel: "Professional"
    },
    {
      id: "ab-testing",
      name: "A/B Testing for Posts",
      description: "Compare different versions of your content to maximize engagement",
      icon: ArrowRightLeft,
      component: ABTesting,
      planLevel: "Business"
    },
    {
      id: "team-collaboration",
      name: "Team Collaboration Features",
      description: "Coordinate with your team and manage workflows efficiently",
      icon: Users,
      component: TeamCollaboration,
      planLevel: "Business"
    },
    {
      id: "ai-insights",
      name: "Advanced Analytics with AI-Powered Insights",
      description: "Deep performance analysis and intelligent recommendations to optimize your strategy",
      icon: Brain,
      component: AIInsights,
      planLevel: "Business"
    }
  ];
  
  const testimonials = [
    {
      quote: "The content recommendation engine has completely transformed our social media strategy. We're seeing 43% higher engagement since we started using it.",
      author: "Sarah Johnson",
      title: "Marketing Director, TechInnovate",
      avatar: ""
    },
    {
      quote: "A/B testing our posts has been a game-changer. We now know exactly what resonates with our audience and have doubled our conversion rate.",
      author: "Michael Chen",
      title: "Social Media Manager, GrowthBrands",
      avatar: ""
    },
    {
      quote: "The collaboration features have made our team so much more efficient. We can now manage campaigns across all platforms seamlessly.",
      author: "Jessica Williams",
      title: "Content Lead, CreativeAgency",
      avatar: ""
    }
  ];
  
  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6">
      <header className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-1 bg-primary/10 rounded-full mb-4">
          <Badge variant="secondary" className="px-3 py-1">
            <Sparkles className="h-3.5 w-3.5 mr-1 text-primary" />
            Premium Features
          </Badge>
        </div>
        
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Elevate Your Social Media Strategy
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Unlock powerful AI-driven tools and advanced features to maximize your social media performance
        </p>
      </header>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-12">
        <TabsList className="w-full max-w-2xl mx-auto grid grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="content">Content AI</TabsTrigger>
          <TabsTrigger value="testing">A/B Testing</TabsTrigger>
          <TabsTrigger value="collaboration">Team Tools</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {features.map((feature) => (
              <Card key={feature.id} className="relative overflow-hidden group">
                {feature.planLevel !== "Professional" && (
                  <div className="absolute top-4 right-4 flex items-center">
                    <Badge variant="secondary">
                      <Lock className="h-3 w-3 mr-1" />
                      {feature.planLevel}+
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="pb-2">
                  <div className="flex items-start">
                    <div className="rounded-full p-2 bg-primary/10 mr-3">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle>{feature.name}</CardTitle>
                      <CardDescription className="mt-1">{feature.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-2">
                  <div className="h-48 rounded-lg bg-muted/50 flex items-center justify-center overflow-hidden">
                    <div className="opacity-25 group-hover:opacity-40 transition-opacity">
                      <img 
                        src={`/assets/premium-${feature.id}.png`} 
                        alt={feature.name}
                        className="w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = ""; 
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                    <div className="absolute flex flex-col items-center text-center">
                      <Zap className="h-8 w-8 mb-2 text-primary" />
                      <span className="font-medium">Unlock {feature.name}</span>
                      <span className="text-sm text-muted-foreground mt-1">Available in {feature.planLevel} plan</span>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={() => setActiveTab(feature.id === "ai-insights" ? "collaboration" : "content")}
                  >
                    Learn More
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="bg-primary/5 rounded-xl p-8 mb-16">
            <div className="text-center mb-8">
              <Badge variant="secondary" className="mb-2">
                <Star className="h-3.5 w-3.5 mr-1 text-primary" />
                Customer Success Stories
              </Badge>
              <h2 className="text-3xl font-bold">What Our Customers Say</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="border-0 bg-card shadow-lg">
                  <CardContent className="pt-6">
                    <div className="mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="inline-block h-4 w-4 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    
                    <blockquote className="text-lg mb-6">
                      "{testimonial.quote}"
                    </blockquote>
                    
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                        {testimonial.avatar ? (
                          <img 
                            src={testimonial.avatar} 
                            alt={testimonial.author} 
                            className="w-full h-full rounded-full"
                          />
                        ) : (
                          <span className="text-lg font-semibold text-primary">
                            {testimonial.author.charAt(0)}
                          </span>
                        )}
                      </div>
                      
                      <div>
                        <div className="font-medium">{testimonial.author}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.title}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Upgrade Your Social Media Strategy?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Choose the plan that's right for you and start unlocking the full potential of your social presence.
            </p>
            
            <div className="flex justify-center gap-4">
              <Button size="lg" onClick={() => setActiveTab("pricing")}>
                View Pricing Plans
              </Button>
              <Button size="lg" variant="outline">
                Schedule a Demo
                <ExternalLink className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="pricing" className="mt-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Flexible Plans for Every Need</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From solo creators to enterprise teams, we have the right solution to elevate your social media presence
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <Card 
                key={plan.name} 
                className={`relative ${plan.popular ? 'border-primary shadow-md' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-0 right-0 flex justify-center">
                    <Badge className="px-3 py-1 bg-primary text-white hover:bg-primary">
                      <Award className="h-3.5 w-3.5 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className={`pb-2 ${plan.popular ? 'pt-8' : ''}`}>
                  <CardTitle>{plan.name}</CardTitle>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    {plan.price !== "Custom" && (
                      <span className="text-muted-foreground ml-1">{plan.billing}</span>
                    )}
                  </div>
                  <CardDescription className="mt-1">{plan.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="pt-2">
                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    className="w-full" 
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.price === "Custom" ? "Contact Sales" : "Upgrade Now"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="bg-muted/30 rounded-lg p-6 mt-12">
            <div className="flex items-start">
              <Info className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5 text-primary" />
              <div>
                <h3 className="font-medium mb-1">Need a custom solution?</h3>
                <p className="text-muted-foreground mb-3">
                  We offer tailored plans for agencies and large organizations with specific requirements.
                </p>
                <Button variant="outline" size="sm">Contact Our Sales Team</Button>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="content" className="mt-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">AI-Powered Content Recommendation</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Get data-driven content ideas and optimize your posting strategy with intelligent insights
            </p>
          </div>
          
          <ContentRecommendationEngine />
        </TabsContent>
        
        <TabsContent value="testing" className="mt-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">A/B Testing for Maximum Impact</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Test different versions of your content to identify what resonates best with your audience
            </p>
          </div>
          
          <ABTesting />
        </TabsContent>
        
        <TabsContent value="collaboration" className="mt-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Team Collaboration Tools</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Streamline your workflow and collaborate seamlessly with your team
            </p>
          </div>
          
          <TeamCollaboration />
          
          <div className="mt-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Advanced Analytics & AI Insights</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Gain deeper understanding of your performance with AI-powered analytics
              </p>
            </div>
            
            <AIInsights />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}