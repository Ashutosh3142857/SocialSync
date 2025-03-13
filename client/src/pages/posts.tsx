import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SocialBadge, SocialIcon } from "@/components/ui/social-icon";
import { CreatePostDialog } from "@/components/posts/create-post-dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Clock, Edit, Trash2 } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { Post, PlatformPost } from "@shared/schema";

interface PostWithPlatforms extends Post {
  platforms: PlatformPost[];
}

export default function Posts() {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const { toast } = useToast();
  
  const { data: posts = [], isLoading } = useQuery<PostWithPlatforms[]>({
    queryKey: ['/api/posts'],
  });
  
  const deletePostMutation = useMutation({
    mutationFn: async (postId: number) => {
      await apiRequest('DELETE', `/api/posts/${postId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      toast({
        title: "Post deleted",
        description: "The post has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      });
    },
  });

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
  
  const formatTime = (date: Date | null) => {
    if (!date) return "";
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };
  
  const draftPosts = posts.filter(post => post.status === "draft");
  const scheduledPosts = posts.filter(post => post.status === "scheduled");
  const publishedPosts = posts.filter(post => post.status === "published");
  
  const handleDeletePost = (postId: number) => {
    if (confirm("Are you sure you want to delete this post?")) {
      deletePostMutation.mutate(postId);
    }
  };

  const PostList = ({ posts }: { posts: PostWithPlatforms[] }) => (
    <div className="space-y-4">
      {posts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No posts to display.
        </div>
      ) : (
        posts.map(post => (
          <Card key={post.id} className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-start">
                <SocialBadge platform={getFirstPlatform(post)} />
                <div className="ml-4 flex-1">
                  <div className="flex justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <Badge 
                          variant={
                            post.status === "draft" ? "outline" : 
                            post.status === "scheduled" ? "secondary" : 
                            "default"
                          }
                          className="mr-2"
                        >
                          {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                        </Badge>
                        {post.scheduledFor && (
                          <div className="text-xs text-gray-500 flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(post.scheduledFor).toLocaleDateString()}
                            <Clock className="h-3 w-3 mx-1" />
                            {new Date(post.scheduledFor).toLocaleTimeString([], {
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true
                            })}
                          </div>
                        )}
                        {!post.scheduledFor && post.createdAt && (
                          <div className="text-xs text-gray-500 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            Created {formatTime(post.createdAt)}
                          </div>
                        )}
                      </div>
                      <p className="mt-2">{post.content}</p>
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
                    <div className="flex ml-4">
                      <Button variant="ghost" size="sm" className="mr-1">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeletePost(post.id)}
                        disabled={deletePostMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Posts</h1>
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
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Posts</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              <TabsTrigger value="published">Published</TabsTrigger>
              <TabsTrigger value="draft">Drafts</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              {isLoading ? (
                <div className="text-center py-8 text-gray-500">
                  Loading posts...
                </div>
              ) : (
                <PostList posts={posts} />
              )}
            </TabsContent>
            
            <TabsContent value="scheduled">
              <PostList posts={scheduledPosts} />
            </TabsContent>
            
            <TabsContent value="published">
              <PostList posts={publishedPosts} />
            </TabsContent>
            
            <TabsContent value="draft">
              <PostList posts={draftPosts} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <CreatePostDialog open={showCreatePost} onOpenChange={setShowCreatePost} />
    </div>
  );
}
