import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from "recharts";
import { cn } from "@/lib/utils";

interface PlatformChartProps {
  title: string;
  data: any[];
  className?: string;
}

const platformColors = {
  twitter: "#1DA1F2",
  instagram: "#E4405F",
  facebook: "#1877F2",
  linkedin: "#0A66C2"
};

const metricLabels = {
  views: "Views",
  engagements: "Engagements",
  followers: "Followers",
  shares: "Shares"
};

export function PlatformChart({ title, data, className }: PlatformChartProps) {
  const [metric, setMetric] = useState("views");

  const formatData = (data: any[]) => {
    return data.map(platformData => ({
      name: platformData.platform.charAt(0).toUpperCase() + platformData.platform.slice(1),
      [metricLabels[metric as keyof typeof metricLabels]]: 
        platformData.analytics[0]?.metrics[metric] || 0,
      fill: platformColors[platformData.platform as keyof typeof platformColors]
    }));
  };

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <div>
            <Select
              value={metric}
              onValueChange={setMetric}
            >
              <SelectTrigger className="w-[180px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg">
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="views">Views</SelectItem>
                <SelectItem value="engagements">Engagements</SelectItem>
                <SelectItem value="shares">Shares</SelectItem>
                <SelectItem value="followers">Followers</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={formatData(data)}
              layout="vertical"
              margin={{
                top: 5,
                right: 30,
                left: 60,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" axisLine={false} tickLine={false} />
              <YAxis 
                dataKey="name" 
                type="category" 
                axisLine={false} 
                tickLine={false} 
              />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.375rem',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                }}
              />
              <Bar 
                dataKey={metricLabels[metric as keyof typeof metricLabels]} 
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
