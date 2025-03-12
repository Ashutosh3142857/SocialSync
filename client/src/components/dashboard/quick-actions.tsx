import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  CalendarClock, 
  BarChart2, 
  Copy, 
  PlusCircle 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { CreatePostDialog } from "@/components/posts/create-post-dialog";

export function QuickActions() {
  const [showCreatePost, setShowCreatePost] = useState(false);
  
  return (
    <div className="mt-8 mb-8">
      <h2 className="text-lg leading-6 font-medium text-gray-900">Quick Actions</h2>
      <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white overflow-hidden shadow">
          <CardContent className="px-4 py-5 sm:p-6 text-center">
            <div className="rounded-full mx-auto flex items-center justify-center w-12 h-12 bg-primary/10 text-primary">
              <CalendarClock className="h-6 w-6" />
            </div>
            <h3 className="mt-3 text-lg font-medium text-gray-900">Schedule Posts</h3>
            <p className="mt-1 text-sm text-gray-500">Plan and schedule your content across platforms</p>
            <Button className="mt-4" asChild>
              <Link href="/schedule">Schedule Now</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white overflow-hidden shadow">
          <CardContent className="px-4 py-5 sm:p-6 text-center">
            <div className="rounded-full mx-auto flex items-center justify-center w-12 h-12 bg-indigo-500/10 text-indigo-500">
              <BarChart2 className="h-6 w-6" />
            </div>
            <h3 className="mt-3 text-lg font-medium text-gray-900">Analytics Report</h3>
            <p className="mt-1 text-sm text-gray-500">Get detailed insights across all platforms</p>
            <Button className="mt-4" variant="secondary" asChild>
              <Link href="/analytics">Generate Report</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white overflow-hidden shadow">
          <CardContent className="px-4 py-5 sm:p-6 text-center">
            <div className="rounded-full mx-auto flex items-center justify-center w-12 h-12 bg-purple-500/10 text-purple-500">
              <Copy className="h-6 w-6" />
            </div>
            <h3 className="mt-3 text-lg font-medium text-gray-900">Content Library</h3>
            <p className="mt-1 text-sm text-gray-500">Access your content and media files</p>
            <Button className="mt-4" variant="outline" asChild>
              <Link href="/posts">Browse Library</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white overflow-hidden shadow">
          <CardContent className="px-4 py-5 sm:p-6 text-center">
            <div className="rounded-full mx-auto flex items-center justify-center w-12 h-12 bg-green-500/10 text-green-500">
              <PlusCircle className="h-6 w-6" />
            </div>
            <h3 className="mt-3 text-lg font-medium text-gray-900">Connect Account</h3>
            <p className="mt-1 text-sm text-gray-500">Add a new social media account</p>
            <Button className="mt-4" variant="outline" className="bg-green-500 hover:bg-green-600 text-white" asChild>
              <Link href="/connections">Connect Now</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <CreatePostDialog open={showCreatePost} onOpenChange={setShowCreatePost} />
    </div>
  );
}
