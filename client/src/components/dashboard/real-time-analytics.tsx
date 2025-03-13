import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Bell, Activity } from "lucide-react";
import { getPlatformColor } from "@/lib/utils";

interface RealTimeMetric {
  timestamp: number;
  platform: string;
  views: number;
  engagements: number;
  shares: number;
  likes: number;
}

export function RealTimeAnalytics() {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<RealTimeMetric[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);

  // Set up WebSocket connection
  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    const socket = new WebSocket(wsUrl);
    
    socket.onopen = () => {
      console.log("WebSocket connection established");
      setConnected(true);
      
      // Subscribe to analytics updates
      socket.send(JSON.stringify({
        type: "subscribe",
        channel: "analytics"
      }));
    };
    
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("WebSocket message received:", data);
        
        // Add message to list
        setMessages(prev => [data, ...prev].slice(0, 5));
        
        // If it's an analytics update, add to metrics
        if (data.type === "analytics_update") {
          const newMetric: RealTimeMetric = {
            timestamp: data.timestamp,
            platform: data.data.platform,
            views: data.data.metrics.views,
            engagements: data.data.metrics.engagements,
            shares: data.data.metrics.shares,
            likes: data.data.metrics.likes
          };
          
          setMetrics(prev => [...prev, newMetric].slice(-20)); // Keep last 20 data points
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };
    
    socket.onclose = () => {
      console.log("WebSocket connection closed");
      setConnected(false);
    };
    
    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
    
    setWs(socket);
    
    // Clean up on component unmount
    return () => {
      socket.close();
    };
  }, []);
  
  // Send ping every 30 seconds to keep connection alive
  useEffect(() => {
    if (!ws) return;
    
    const interval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "ping" }));
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [ws]);

  // Format data for the chart
  const chartData = metrics.map(metric => ({
    name: new Date(metric.timestamp).toLocaleTimeString(),
    platform: metric.platform,
    views: metric.views,
    engagements: metric.engagements,
    shares: metric.shares,
    likes: metric.likes
  }));

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-2xl font-bold">Real-time Analytics</CardTitle>
          <CardDescription>
            Live data streaming from connected social media platforms
          </CardDescription>
        </div>
        <Badge variant={connected ? "default" : "destructive"} className="h-6">
          {connected ? "Live" : "Disconnected"}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Real-time chart */}
          {metrics.length > 0 && (
            <div className="h-72 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    height={40} 
                    fontSize={12}
                    tickFormatter={(value) => value.split(":").slice(0, 2).join(":")}
                  />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="views" 
                    name="Views" 
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="engagements" 
                    name="Engagements" 
                    stroke="#82ca9d" 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="shares" 
                    name="Shares" 
                    stroke="#ffc658" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Activity Feed */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center">
              <Activity className="mr-2 h-5 w-5" />
              Recent Activity
            </h3>
            
            <div className="space-y-3">
              {messages.length > 0 ? (
                messages.map((message, index) => {
                  // For analytics updates, show a more detailed message
                  if (message.type === "analytics_update") {
                    const platform = message.data.platform;
                    const metrics = message.data.metrics;
                    const time = new Date(message.timestamp).toLocaleTimeString();
                    
                    return (
                      <div key={index} className="flex items-start space-x-2 text-sm">
                        <Bell className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <div>
                          <p>
                            <span 
                              className="font-medium" 
                              style={{ color: getPlatformColor(platform) }}
                            >
                              {platform.charAt(0).toUpperCase() + platform.slice(1)}
                            </span>{" "}
                            metrics update: {metrics.views} views, {metrics.engagements} engagements
                          </p>
                          <p className="text-xs text-muted-foreground">{time}</p>
                        </div>
                      </div>
                    );
                  }
                  
                  // For other message types
                  return (
                    <div key={index} className="flex items-start space-x-2 text-sm">
                      <Bell className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <p>{message.message || JSON.stringify(message)}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(message.timestamp || Date.now()).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-sm text-muted-foreground">
                  {connected ? "Waiting for real-time updates..." : "Connect to see real-time updates"}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}