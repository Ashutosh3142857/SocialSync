import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";

interface TimeframeButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const TimeframeButton: React.FC<TimeframeButtonProps> = ({ active, onClick, children }) => (
  <Button
    variant={active ? "default" : "outline"}
    className="px-3 py-1 h-8 text-sm"
    onClick={onClick}
  >
    {children}
  </Button>
);

const EngagementChart: React.FC = () => {
  const [timeframe, setTimeframe] = useState<"week" | "month" | "year">("week");
  
  // Mock data for different timeframes
  const weekData = [
    { name: "Mon", twitter: 120, instagram: 320, linkedin: 90 },
    { name: "Tue", twitter: 190, instagram: 290, linkedin: 120 },
    { name: "Wed", twitter: 150, instagram: 350, linkedin: 110 },
    { name: "Thu", twitter: 240, instagram: 320, linkedin: 140 },
    { name: "Fri", twitter: 180, instagram: 390, linkedin: 180 },
    { name: "Sat", twitter: 210, instagram: 410, linkedin: 160 },
    { name: "Sun", twitter: 250, instagram: 380, linkedin: 150 }
  ];
  
  const monthData = [
    { name: "Week 1", twitter: 850, instagram: 1200, linkedin: 650 },
    { name: "Week 2", twitter: 920, instagram: 1350, linkedin: 700 },
    { name: "Week 3", twitter: 1050, instagram: 1500, linkedin: 750 },
    { name: "Week 4", twitter: 1150, instagram: 1450, linkedin: 800 }
  ];
  
  const yearData = [
    { name: "Jan", twitter: 4200, instagram: 5800, linkedin: 3200 },
    { name: "Feb", twitter: 4500, instagram: 6000, linkedin: 3400 },
    { name: "Mar", twitter: 4800, instagram: 6200, linkedin: 3600 },
    { name: "Apr", twitter: 5100, instagram: 6500, linkedin: 3800 },
    { name: "May", twitter: 5400, instagram: 6800, linkedin: 4000 },
    { name: "Jun", twitter: 5700, instagram: 7100, linkedin: 4200 },
    { name: "Jul", twitter: 6000, instagram: 7400, linkedin: 4400 },
    { name: "Aug", twitter: 6300, instagram: 7700, linkedin: 4600 },
    { name: "Sep", twitter: 6600, instagram: 8000, linkedin: 4800 },
    { name: "Oct", twitter: 6900, instagram: 8300, linkedin: 5000 },
    { name: "Nov", twitter: 7200, instagram: 8600, linkedin: 5200 },
    { name: "Dec", twitter: 7500, instagram: 8900, linkedin: 5400 }
  ];
  
  const getChartData = () => {
    switch (timeframe) {
      case "week":
        return weekData;
      case "month":
        return monthData;
      case "year":
        return yearData;
      default:
        return weekData;
    }
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Engagement Analytics</h3>
          <div className="flex space-x-2">
            <TimeframeButton 
              active={timeframe === "week"} 
              onClick={() => setTimeframe("week")}
            >
              Week
            </TimeframeButton>
            <TimeframeButton 
              active={timeframe === "month"} 
              onClick={() => setTimeframe("month")}
            >
              Month
            </TimeframeButton>
            <TimeframeButton 
              active={timeframe === "year"} 
              onClick={() => setTimeframe("year")}
            >
              Year
            </TimeframeButton>
          </div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={getChartData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="twitter" 
                stroke="#1DA1F2" 
                activeDot={{ r: 8 }} 
                name="Twitter"
                strokeWidth={2}
                fill="rgba(29, 161, 242, 0.1)"
              />
              <Line 
                type="monotone" 
                dataKey="instagram" 
                stroke="#E1306C" 
                name="Instagram"
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="linkedin" 
                stroke="#0077B5" 
                name="LinkedIn"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default EngagementChart;
