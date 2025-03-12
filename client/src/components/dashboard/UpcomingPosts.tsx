import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { SiTwitter, SiInstagram, SiLinkedin, SiFacebook } from "react-icons/si";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Link } from "wouter";
import { Post } from "@/types";

const PostIcon: React.FC<{ platform: string }> = ({ platform }) => {
  const iconClass = "h-5 w-5";
  
  switch (platform.toLowerCase()) {
    case "twitter":
      return <SiTwitter className={iconClass + " text-blue-500"} />;
    case "instagram":
      return <SiInstagram className={iconClass + " text-pink-500"} />;
    case "linkedin":
      return <SiLinkedin className={iconClass + " text-blue-700"} />;
    case "facebook":
      return <SiFacebook className={iconClass + " text-blue-600"} />;
    default:
      return null;
  }
};

const UpcomingPosts: React.FC = () => {
  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ["/api/posts/upcoming"],
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium text-gray-900">Upcoming Posts</CardTitle>
          <Link href="/calendar">
            <Button variant="link" className="text-primary hover:text-primary/90 text-sm p-0">
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-3 animate-pulse">
                <div className="h-10 w-10 rounded-full bg-gray-200" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : posts && posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                <div className={`h-10 w-10 rounded-full ${post.platform === "Twitter" ? "bg-blue-100" : post.platform === "Instagram" ? "bg-pink-100" : post.platform === "LinkedIn" ? "bg-blue-100" : "bg-blue-100"} flex items-center justify-center`}>
                  <PostIcon platform={post.platform} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{post.content}</p>
                <p className="text-xs text-gray-500">{post.scheduledTime}</p>
              </div>
              <div className="flex-shrink-0">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-500">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Reschedule</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500">No upcoming posts scheduled</p>
          </div>
        )}
        <div className="mt-4">
          <Link href="/compose">
            <Button variant="outline" className="w-full py-2 bg-primary-50 text-primary hover:bg-primary-100 transition-colors">
              Create New Post
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingPosts;
