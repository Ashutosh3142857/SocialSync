import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface ThemeResetProps {
  onReset: () => void;
}

export function ThemeReset({ onReset }: ThemeResetProps) {
  const { toast } = useToast();

  const handleReset = () => {
    onReset();
    toast({
      title: "Theme Reset",
      description: "Your theme has been reset to default settings.",
    });
  };

  return (
    <Card className="border-amber-200 bg-amber-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-amber-800 flex items-center text-lg">
          <AlertTriangle className="h-5 w-5 mr-2" />
          Reset Theme to Default
        </CardTitle>
        <CardDescription className="text-amber-700">
          This will revert all theme customizations to the original default settings
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-amber-700 pb-2">
        <p>Any custom colors, animations, and contrast settings will be lost. This action cannot be undone.</p>
      </CardContent>
      <CardFooter>
        <Button 
          variant="destructive" 
          className="bg-amber-600 hover:bg-amber-700"
          onClick={handleReset}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset Theme
        </Button>
      </CardFooter>
    </Card>
  );
}