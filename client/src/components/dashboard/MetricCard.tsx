import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  timeframe?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  change, 
  timeframe = "This Week" 
}) => {
  const isPositive = change >= 0;
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
          <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
            {timeframe}
          </span>
        </div>
        <div className="mt-2 flex items-baseline">
          <p className="text-3xl font-semibold text-gray-900">{value}</p>
          <p className={cn(
            "ml-2 text-sm flex items-center",
            isPositive ? "text-emerald-500" : "text-red-500"
          )}>
            {isPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
            <span>{Math.abs(change)}%</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
