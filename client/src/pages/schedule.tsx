import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { SocialBadge, SocialIcon } from "@/components/ui/social-icon";
import { CreatePostDialog } from "@/components/posts/create-post-dialog";
import { Edit, Plus, CalendarDays, List } from "lucide-react";
import { Post, PlatformPost } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface PostWithPlatforms extends Post {
  platforms: PlatformPost[];
}

export default function Schedule() {
  const { toast } = useToast();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Force refetch on component mount to ensure we have the latest data
  const { data: posts = [], isLoading, refetch } = useQuery<PostWithPlatforms[]>({
    queryKey: ['/api/posts'],
  });
  
  // Refetch posts when component mounts or when returning to this page
  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Debug - log posts
  useEffect(() => {
    if (posts.length > 0) {
      console.log("All posts:", posts);
      console.log("Scheduled posts:", scheduledPosts);
    }
  }, [posts]);
  
  const scheduledPosts = posts.filter(post => post.status === "scheduled");
  
  const getPostsForDate = (date: Date | undefined) => {
    if (!date) return [];
    
    // Debug date value
    console.log("Checking posts for date:", date, date.toDateString());
    
    return scheduledPosts.filter(post => {
      if (!post.scheduledFor) {
        console.log("Post has no scheduled date:", post.id);
        return false;
      }
      
      try {
        // Convert the post's scheduledFor date string to a proper Date object
        const postDate = new Date(post.scheduledFor);
        
        // Debug post date
        console.log("Post ID:", post.id, "Date:", post.scheduledFor, "Parsed date:", postDate);
        
        // Format dates to local date strings for reliable comparison
        const postDateString = postDate.toDateString();
        const selectedDateString = date.toDateString();
        
        // Debug comparison
        console.log(`Comparing post ${post.id} date: ${postDateString} with ${selectedDateString}, match: ${postDateString === selectedDateString}`);
        
        // Compare just the date part
        return postDateString === selectedDateString;
      } catch (error) {
        console.error("Error comparing dates for post:", post.id, error);
        return false;
      }
    });
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
  
  const formatScheduleTime = (date: Date | null) => {
    if (!date) return "";
    
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };
  
  const postsForSelectedDate = getPostsForDate(selectedDate);

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Schedule</h1>
          <div className="mt-4 md:mt-0">
            <Button onClick={() => setShowCreatePost(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Post
            </Button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="mt-6">
          <Tabs defaultValue="calendar">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="calendar" className="flex items-center">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Calendar View
                </TabsTrigger>
                <TabsTrigger value="list" className="flex items-center">
                  <List className="mr-2 h-4 w-4" />
                  List View
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="calendar" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="col-span-1">
                  <CardContent className="p-4">
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border"
                    />
                  </CardContent>
                </Card>
                
                <Card className="col-span-1 lg:col-span-2">
                  <CardContent className="p-4">
                    <h2 className="text-lg font-medium mb-4">
                      {selectedDate?.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </h2>
                    
                    {isLoading ? (
                      <div className="text-center py-8 text-gray-500">
                        Loading scheduled posts...
                      </div>
                    ) : postsForSelectedDate.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No posts scheduled for this date.
                        <div className="mt-4">
                          <Button 
                            variant="outline" 
                            onClick={() => setShowCreatePost(true)}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Schedule Post
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {postsForSelectedDate.map(post => (
                          <div key={post.id} className="p-4 border rounded-md bg-white">
                            <div className="flex items-start">
                              <SocialBadge platform={getFirstPlatform(post)} />
                              <div className="ml-4 flex-1">
                                <div className="flex justify-between">
                                  <div>
                                    <p className="font-medium">{post.scheduledFor ? formatScheduleTime(new Date(post.scheduledFor)) : 'Not scheduled'}</p>
                                    <p className="text-sm text-gray-500 mt-1">{post.content}</p>
                                  </div>
                                  <Button variant="ghost" size="sm">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </div>
                                <div className="mt-2 flex flex-wrap gap-1">
                                  {post.platforms.map(platform => (
                                    <span
                                      key={platform.id}
                                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                                    >
                                      <SocialIcon 
                                        platform={
                                          platform.socialAccountId === 1 ? "twitter" :
                                          platform.socialAccountId === 2 ? "instagram" :
                                          platform.socialAccountId === 3 ? "facebook" : "linkedin"
                                        }
                                        className="mr-1 h-3 w-3"
                                      />
                                      {platform.socialAccountId === 1 ? "Twitter" :
                                       platform.socialAccountId === 2 ? "Instagram" :
                                       platform.socialAccountId === 3 ? "Facebook" : "LinkedIn"}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="list">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {isLoading ? (
                      <div className="text-center py-8 text-gray-500">
                        Loading scheduled posts...
                      </div>
                    ) : scheduledPosts.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No posts scheduled.
                        <div className="mt-4">
                          <Button 
                            variant="outline" 
                            onClick={() => setShowCreatePost(true)}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Schedule Post
                          </Button>
                        </div>
                      </div>
                    ) : (
                      scheduledPosts
                        .sort((a, b) => {
                          if (!a.scheduledFor || !b.scheduledFor) return 0;
                          return new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime();
                        })
                        .map(post => (
                          <div key={post.id} className="p-4 border rounded-md bg-white">
                            <div className="flex items-start">
                              <SocialBadge platform={getFirstPlatform(post)} />
                              <div className="ml-4 flex-1">
                                <div className="flex justify-between">
                                  <div>
                                    <p className="font-medium">
                                      {post.scheduledFor ? new Date(post.scheduledFor).toLocaleDateString('en-US', {
                                        weekday: 'short',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: 'numeric',
                                        minute: '2-digit',
                                        hour12: true
                                      }) : 'Not scheduled'}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">{post.content}</p>
                                  </div>
                                  <Button variant="ghost" size="sm">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </div>
                                <div className="mt-2 flex flex-wrap gap-1">
                                  {post.platforms.map(platform => (
                                    <span
                                      key={platform.id}
                                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                                    >
                                      <SocialIcon 
                                        platform={
                                          platform.socialAccountId === 1 ? "twitter" :
                                          platform.socialAccountId === 2 ? "instagram" :
                                          platform.socialAccountId === 3 ? "facebook" : "linkedin"
                                        }
                                        className="mr-1 h-3 w-3"
                                      />
                                      {platform.socialAccountId === 1 ? "Twitter" :
                                       platform.socialAccountId === 2 ? "Instagram" :
                                       platform.socialAccountId === 3 ? "Facebook" : "LinkedIn"}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <CreatePostDialog open={showCreatePost} onOpenChange={setShowCreatePost} />
    </div>
  );
}
