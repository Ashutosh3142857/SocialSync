import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Users, MessageSquare, Clipboard, ClipboardCheck, AlertCircle, 
  Clock, SendHorizontal, PlusCircle, Edit, Check, XCircle,
  User, UserPlus, Lock, Settings
} from 'lucide-react';
import { format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SocialBadge } from '@/components/ui/social-icon';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'editor' | 'reviewer' | 'viewer';
  status: 'active' | 'invited' | 'offline';
  lastActive?: Date;
}

interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  assignedBy: string;
  status: 'todo' | 'in_progress' | 'in_review' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: Date;
  createdAt: Date;
  completedAt?: Date;
  platforms: string[];
}

interface Comment {
  id: string;
  userId: string;
  text: string;
  timestamp: Date;
  postId?: string;
  taskId?: string;
}

export function TeamCollaboration() {
  const [activeTab, setActiveTab] = useState<string>("team");
  const [newComment, setNewComment] = useState<string>("");
  
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: "user-1",
      name: "Alex Johnson",
      email: "alex@example.com",
      avatar: "",
      role: "admin",
      status: "active",
      lastActive: new Date()
    },
    {
      id: "user-2",
      name: "Jamie Smith",
      email: "jamie@example.com",
      avatar: "",
      role: "editor",
      status: "active",
      lastActive: new Date(Date.now() - 30 * 60 * 1000)
    },
    {
      id: "user-3",
      name: "Riley Taylor",
      email: "riley@example.com",
      avatar: "",
      role: "reviewer",
      status: "offline",
      lastActive: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      id: "user-4",
      name: "Casey Brown",
      email: "casey@example.com",
      avatar: "",
      role: "viewer",
      status: "invited"
    }
  ]);
  
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "task-1",
      title: "Create weekly newsletter content",
      description: "Draft the content for this week's newsletter focusing on industry trends",
      assignee: "user-2",
      assignedBy: "user-1",
      status: "in_progress",
      priority: "high",
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      platforms: ["twitter", "linkedin"]
    },
    {
      id: "task-2",
      title: "Review pending social media posts",
      description: "Review and approve the posts scheduled for next week",
      assignee: "user-3",
      assignedBy: "user-1",
      status: "todo",
      priority: "medium",
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      platforms: ["facebook", "instagram"]
    },
    {
      id: "task-3",
      title: "Analyze last campaign performance",
      description: "Generate a report on the last campaign's performance metrics",
      assignee: "user-1",
      assignedBy: "user-1",
      status: "completed",
      priority: "medium",
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      platforms: ["twitter", "facebook", "linkedin", "instagram"]
    }
  ]);
  
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "comment-1",
      userId: "user-1",
      text: "Let's focus on highlighting our new product features in this newsletter.",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      taskId: "task-1"
    },
    {
      id: "comment-2",
      userId: "user-2",
      text: "I've added some graphics to the draft. What do you think?",
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      taskId: "task-1"
    },
    {
      id: "comment-3",
      userId: "user-1",
      text: "Looks great! Please make sure to run it through the brand compliance check.",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      taskId: "task-1"
    }
  ]);
  
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 hover:bg-red-100';
      case 'editor': return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'reviewer': return 'bg-amber-100 text-amber-800 hover:bg-amber-100';
      case 'viewer': return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-gray-100 text-gray-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'in_review': return 'bg-amber-100 text-amber-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'todo': return 'To Do';
      case 'in_progress': return 'In Progress';
      case 'in_review': return 'In Review';
      case 'completed': return 'Completed';
      default: return status;
    }
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'text-gray-600';
      case 'medium': return 'text-amber-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  const getMemberById = (id: string) => {
    return teamMembers.find(member => member.id === id);
  };
  
  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: `comment-${comments.length + 1}`,
      userId: "user-1", // Current user
      text: newComment,
      timestamp: new Date(),
      taskId: "task-1" // Currently selected task
    };
    
    setComments([...comments, comment]);
    setNewComment("");
  };
  
  const filteredTasks = tasks.filter(task => {
    // Filter logic for tasks - can be extended based on selected filters
    return true;
  });
  
  const taskComments = comments.filter(comment => comment.taskId === "task-1");

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5 text-primary" />
              Team Collaboration
            </CardTitle>
            <CardDescription>
              Coordinate with your team and manage workflows efficiently
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-1" />
              Workspace Settings
            </Button>
            <Button size="sm">
              <UserPlus className="h-4 w-4 mr-1" />
              Invite Member
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="team" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="team">Team Members</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>
          
          <TabsContent value="team">
            <div className="rounded-md border">
              <div className="grid grid-cols-12 p-4 font-medium border-b bg-muted/50 text-sm">
                <div className="col-span-4">Team Member</div>
                <div className="col-span-3">Role</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Last Active</div>
                <div className="col-span-1 text-right">Actions</div>
              </div>
              
              {teamMembers.map(member => (
                <div key={member.id} className="grid grid-cols-12 p-4 border-b last:border-0 items-center text-sm">
                  <div className="col-span-4 flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-xs text-muted-foreground">{member.email}</div>
                    </div>
                  </div>
                  
                  <div className="col-span-3">
                    <Badge className={`${getRoleColor(member.role)} capitalize`}>
                      {member.role}
                    </Badge>
                  </div>
                  
                  <div className="col-span-2">
                    <div className="flex items-center">
                      <div className={`h-2 w-2 rounded-full mr-2 ${
                        member.status === 'active' ? 'bg-green-500' : 
                        member.status === 'invited' ? 'bg-blue-500' : 'bg-gray-400'
                      }`} />
                      <span className="capitalize">{member.status}</span>
                    </div>
                  </div>
                  
                  <div className="col-span-2 text-muted-foreground">
                    {member.lastActive 
                      ? format(member.lastActive, 'MMM d, h:mm a')
                      : member.status === 'invited' ? 'Pending invitation' : 'Never'}
                  </div>
                  
                  <div className="col-span-1 flex justify-end space-x-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 flex justify-end">
              <Button variant="outline" className="mr-2">
                <Lock className="h-4 w-4 mr-1" />
                Manage Permissions
              </Button>
              <Button>
                <UserPlus className="h-4 w-4 mr-1" />
                Add Team Member
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="tasks">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="space-x-2">
                  <Button variant="outline" size="sm">All Tasks</Button>
                  <Button variant="ghost" size="sm">My Tasks</Button>
                  <Button variant="ghost" size="sm">Assigned by Me</Button>
                </div>
                
                <Button size="sm">
                  <PlusCircle className="h-4 w-4 mr-1" />
                  New Task
                </Button>
              </div>
              
              <div className="rounded-md border">
                <div className="grid grid-cols-12 p-4 font-medium border-b bg-muted/50 text-sm">
                  <div className="col-span-5">Task</div>
                  <div className="col-span-2">Assignee</div>
                  <div className="col-span-1">Priority</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2">Due Date</div>
                </div>
                
                {filteredTasks.map(task => (
                  <div key={task.id} className="grid grid-cols-12 p-4 border-b last:border-0 items-center text-sm hover:bg-muted/30 cursor-pointer">
                    <div className="col-span-5">
                      <div className="font-medium">{task.title}</div>
                      <div className="text-xs text-muted-foreground flex items-center mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        Created {format(task.createdAt, 'MMM d')}
                        <span className="mx-1">•</span>
                        <div className="flex">
                          {task.platforms.map(platform => (
                            <SocialBadge key={platform} platform={platform} className="h-3 w-3 mr-0.5" />
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-span-2">
                      <div className="flex items-center">
                        <Avatar className="h-6 w-6 mr-1">
                          <AvatarFallback className="text-xs">
                            {getInitials(getMemberById(task.assignee)?.name || '')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs truncate max-w-[100px]">
                          {getMemberById(task.assignee)?.name.split(' ')[0]}
                        </span>
                      </div>
                    </div>
                    
                    <div className="col-span-1">
                      <span className={`capitalize ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    
                    <div className="col-span-2">
                      <Badge className={`${getStatusColor(task.status)}`}>
                        {getStatusText(task.status)}
                      </Badge>
                    </div>
                    
                    <div className="col-span-2 flex items-center">
                      <span className={`${
                        new Date() > task.dueDate && task.status !== 'completed' ? 'text-red-600' : ''
                      }`}>
                        {format(task.dueDate, 'MMM d, yyyy')}
                      </span>
                      {new Date() > task.dueDate && task.status !== 'completed' && (
                        <AlertCircle className="h-4 w-4 ml-1 text-red-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="activity">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Task Discussion</h3>
                      <Badge>
                        {getStatusText(tasks[0].status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{tasks[0].title}</p>
                  </CardHeader>
                  
                  <CardContent className="p-4">
                    <div className="bg-muted/40 rounded-lg p-3 mb-4">
                      <p className="text-sm">{tasks[0].description}</p>
                      <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                        <div>
                          Assigned to: <span className="font-medium">{getMemberById(tasks[0].assignee)?.name}</span>
                        </div>
                        <div>
                          Due: <span className="font-medium">{format(tasks[0].dueDate, 'MMM d, yyyy')}</span>
                        </div>
                      </div>
                    </div>
                    
                    <h4 className="text-sm font-medium mb-3">Comments</h4>
                    
                    <ScrollArea className="h-[300px] pr-4">
                      <div className="space-y-4">
                        {taskComments.map(comment => (
                          <div key={comment.id} className="flex">
                            <Avatar className="h-8 w-8 mr-2 mt-0.5">
                              <AvatarFallback>{getInitials(getMemberById(comment.userId)?.name || '')}</AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1">
                              <div className="flex items-center">
                                <span className="font-medium text-sm">{getMemberById(comment.userId)?.name}</span>
                                <span className="text-xs text-muted-foreground ml-2">
                                  {format(comment.timestamp, 'MMM d, h:mm a')}
                                </span>
                              </div>
                              
                              <div className="text-sm mt-1">{comment.text}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    
                    <div className="mt-3 flex">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarFallback>{getInitials(teamMembers[0].name)}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 flex items-center">
                        <Input 
                          placeholder="Add a comment..." 
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="flex-1"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddComment();
                          }}
                        />
                        <Button 
                          size="icon" 
                          className="ml-2" 
                          onClick={handleAddComment}
                          disabled={!newComment.trim()}
                        >
                          <SendHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card>
                  <CardHeader className="pb-2">
                    <h3 className="text-md font-semibold">Team Activity</h3>
                  </CardHeader>
                  
                  <CardContent className="p-4">
                    <ScrollArea className="h-[400px] pr-4">
                      <div className="space-y-4">
                        <div className="border-l-2 border-primary pl-4 relative">
                          <div className="absolute w-2 h-2 bg-primary rounded-full -left-[5px] top-1.5"></div>
                          <p className="text-sm">
                            <span className="font-medium">Alex</span> created a new task
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Today at 10:30 AM
                          </p>
                        </div>
                        
                        <div className="border-l-2 border-blue-400 pl-4 relative">
                          <div className="absolute w-2 h-2 bg-blue-400 rounded-full -left-[5px] top-1.5"></div>
                          <p className="text-sm">
                            <span className="font-medium">Jamie</span> completed the task <span className="font-medium">Update social media strategy</span>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Yesterday at 2:15 PM
                          </p>
                        </div>
                        
                        <div className="border-l-2 border-green-400 pl-4 relative">
                          <div className="absolute w-2 h-2 bg-green-400 rounded-full -left-[5px] top-1.5"></div>
                          <p className="text-sm">
                            <span className="font-medium">Riley</span> approved 5 posts for publishing
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Yesterday at 11:45 AM
                          </p>
                        </div>
                        
                        <div className="border-l-2 border-amber-400 pl-4 relative">
                          <div className="absolute w-2 h-2 bg-amber-400 rounded-full -left-[5px] top-1.5"></div>
                          <p className="text-sm">
                            <span className="font-medium">Casey</span> joined the team
                          </p>
                          <p className="text-xs text-muted-foreground">
                            2 days ago
                          </p>
                        </div>
                        
                        <div className="border-l-2 border-primary pl-4 relative">
                          <div className="absolute w-2 h-2 bg-primary rounded-full -left-[5px] top-1.5"></div>
                          <p className="text-sm">
                            <span className="font-medium">Alex</span> created a new campaign
                          </p>
                          <p className="text-xs text-muted-foreground">
                            3 days ago
                          </p>
                        </div>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="border-t px-6 py-4">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="h-4 w-4 mr-1" />
            <span>{teamMembers.filter(m => m.status === 'active').length} members online</span>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Clipboard className="h-4 w-4 mr-1" />
              View All Tasks
            </Button>
            <Button variant="outline" size="sm">
              <MessageSquare className="h-4 w-4 mr-1" />
              Team Chat
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}