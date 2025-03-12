import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { format } from "date-fns";
import { SiTwitter, SiInstagram, SiLinkedin, SiFacebook } from "react-icons/si";
import { MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Post } from "@/types";
import { cn } from "@/lib/utils";

const platformIcons: Record<string, React.ReactNode> = {
  Twitter: <SiTwitter className="text-blue-500" />,
  Instagram: <SiInstagram className="text-pink-500" />,
  LinkedIn: <SiLinkedin className="text-blue-700" />,
  Facebook: <SiFacebook className="text-blue-600" />,
};

const Calendar: React.FC = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<"calendar" | "list">("calendar");

  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ["/api/posts", { month: date.getMonth(), year: date.getFullYear() }],
  });

  // Group posts by date for the calendar view
  const groupPostsByDate = () => {
    if (!posts) return {};
    
    const grouped: Record<string, Post[]> = {};
    
    posts.forEach(post => {
      const dateStr = new Date(post.scheduledFor).toDateString();
      if (!grouped[dateStr]) {
        grouped[dateStr] = [];
      }
      grouped[dateStr].push(post);
    });
    
    return grouped;
  };
  
  const postsByDate = groupPostsByDate();

  const renderCalendarDay = (day: Date) => {
    const dateStr = day.toDateString();
    const dayPosts = postsByDate[dateStr] || [];
    
    return (
      <div>
        <div className={cn("w-full h-full min-h-[80px] p-1", dayPosts.length > 0 ? "cursor-pointer" : "")}>
          <time dateTime={format(day, 'yyyy-MM-dd')} className="font-semibold text-sm">
            {format(day, 'd')}
          </time>
          <div className="mt-1">
            {dayPosts.slice(0, 3).map((post, i) => (
              <div 
                key={i} 
                className="flex items-center mb-1 text-xs" 
                title={post.content}
              >
                <span className="mr-1">{platformIcons[post.platform]}</span>
                <span className="truncate">{format(new Date(post.scheduledFor), 'HH:mm')}</span>
              </div>
            ))}
            {dayPosts.length > 3 && (
              <div className="text-xs text-gray-500">+{dayPosts.length - 3} more</div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Content Calendar</h1>
        <Button className="bg-primary text-white">
          Schedule Post
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Schedule</CardTitle>
            <Tabs defaultValue="calendar" value={view} onValueChange={(v) => setView(v as "calendar" | "list")}>
              <TabsList>
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
                <TabsTrigger value="list">List</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={view} className="w-full">
            <TabsContent value="calendar" className="mt-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-xl font-semibold">
                    {format(date, 'MMMM yyyy')}
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => {
                        const newDate = new Date(date);
                        newDate.setMonth(newDate.getMonth() - 1);
                        setDate(newDate);
                      }}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => {
                        const newDate = new Date(date);
                        newDate.setMonth(newDate.getMonth() + 1);
                        setDate(newDate);
                      }}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="border rounded-md">
                  <CalendarComponent
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => newDate && setDate(newDate)}
                    month={date}
                    className="rounded-md"
                    components={{
                      Day: ({ day }) => renderCalendarDay(day),
                    }}
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="list" className="mt-0">
              <div className="space-y-4">
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center space-x-4 p-3 animate-pulse border-b">
                        <div className="h-10 w-10 rounded-full bg-gray-200" />
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                          <div className="h-3 bg-gray-200 rounded w-1/4" />
                        </div>
                        <div className="h-8 w-8 bg-gray-200 rounded" />
                      </div>
                    ))}
                  </div>
                ) : posts && posts.length > 0 ? (
                  posts.map((post) => (
                    <div key={post.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg border-b">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                          {platformIcons[post.platform]}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{post.content}</p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(post.scheduledFor), 'MMM d, yyyy - h:mm a')}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4 text-gray-400" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No scheduled posts for this month</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Calendar;
