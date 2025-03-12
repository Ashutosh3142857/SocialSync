import { SocialBadge } from "@/components/ui/social-icon";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { CalendarIcon, Edit, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Post, PlatformPost } from "@shared/schema";

interface PostWithPlatforms extends Post {
  platforms: PlatformPost[];
}

export function UpcomingPosts() {
  const { toast } = useToast();

  const { data: upcomingPosts = [], isLoading } = useQuery<PostWithPlatforms[]>({
    queryKey: ['/api/upcoming'],
  });

  const deletePostMutation = useMutation({
    mutationFn: async (postId: number) => {
      await apiRequest('DELETE', `/api/posts/${postId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/upcoming'] });
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

  const handleDeletePost = (postId: number) => {
    if (confirm("Are you sure you want to delete this post?")) {
      deletePostMutation.mutate(postId);
    }
  };

  const formatScheduleTime = (date: Date | null) => {
    if (!date) return "";
    
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getFirstPlatform = (post: PostWithPlatforms) => {
    if (post.platforms && post.platforms.length > 0) {
      const platformPost = post.platforms[0];
      const account = platformPost.socialAccountId;
      // This is a simplification - in a real app you'd need to get platform info
      return account === 1 ? "twitter" : 
             account === 2 ? "instagram" : 
             account === 3 ? "facebook" : "linkedin";
    }
    return "twitter";
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg leading-6 font-medium text-gray-900">Upcoming Posts</h2>
        <Link href="/schedule" className="text-sm font-medium text-primary hover:text-blue-600">
          View all
        </Link>
      </div>
      
      <div className="mt-2 bg-white shadow overflow-hidden sm:rounded-md">
        {isLoading ? (
          <div className="px-4 py-8 text-center text-gray-500">
            Loading upcoming posts...
          </div>
        ) : upcomingPosts.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-500">
            No upcoming posts scheduled.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {upcomingPosts.map((post) => (
              <li key={post.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <SocialBadge platform={getFirstPlatform(post)} />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {post.content}
                        </p>
                        <div className="flex mt-1">
                          <p className="text-xs text-gray-500">
                            <CalendarIcon className="inline-block h-3 w-3 mr-1" />
                            {post.scheduledFor ? formatScheduleTime(post.scheduledFor) : "Draft"}
                          </p>
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ml-2 ${
                            post.status === 'scheduled' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/posts/edit/${post.id}`}>
                          <Edit className="h-4 w-4 text-gray-500" />
                        </Link>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeletePost(post.id)}
                        disabled={deletePostMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4 text-gray-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
