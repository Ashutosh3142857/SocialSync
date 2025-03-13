import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ThemePreviewProps {
  theme: 'light' | 'dark' | 'system';
  onApply: () => void;
  onCancel: () => void;
}

export function ThemePreview({ theme, onApply, onCancel }: ThemePreviewProps) {
  // Create a preview of the app with the selected theme
  const backgroundColor = theme === 'dark' ? 'bg-gray-900' : 'bg-white';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  
  return (
    <div className="relative">
      <div className={`${backgroundColor} border ${borderColor} rounded-lg shadow-lg p-4 h-[360px] overflow-hidden`}>
        {/* Mock header */}
        <div className={`flex items-center justify-between ${textColor} mb-4`}>
          <div className="text-lg font-bold">SocialSync Preview</div>
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
        </div>
        
        {/* Mock content */}
        <div className="flex">
          {/* Mock sidebar */}
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} w-1/4 rounded p-2 mr-2`}>
            <div className={`${textColor} opacity-70 py-1 px-2 rounded ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} cursor-pointer mb-1`}>Dashboard</div>
            <div className={`${textColor} opacity-70 py-1 px-2 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} cursor-pointer mb-1`}>Posts</div>
            <div className={`${textColor} opacity-70 py-1 px-2 rounded ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} cursor-pointer mb-1`}>Analytics</div>
            <div className={`${textColor} opacity-70 py-1 px-2 rounded ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} cursor-pointer`}>Settings</div>
          </div>
          
          {/* Mock main content */}
          <div className="w-3/4">
            <div className={`${textColor} font-semibold mb-2`}>Recent Posts</div>
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} rounded p-2 mb-2 ${borderColor} border`}>
              <div className={`${textColor} text-sm`}>Welcome to SocialSync!</div>
              <div className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-xs mt-1`}>Posted 2 days ago</div>
            </div>
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} rounded p-2 ${borderColor} border`}>
              <div className={`${textColor} text-sm`}>Check out our latest update</div>
              <div className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-xs mt-1`}>Posted 5 days ago</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 mt-3">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={onApply}>Apply Theme</Button>
      </div>
    </div>
  );
}