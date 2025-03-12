import React from "react";
import { useLocation } from "wouter";
import { Bell, Search, HelpCircle, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TopBarProps {
  toggleSidebar: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ toggleSidebar }) => {
  const [location] = useLocation();
  
  // Get the page title based on the current location
  const getPageTitle = () => {
    switch (location) {
      case "/":
        return "Dashboard";
      case "/calendar":
        return "Calendar";
      case "/compose":
        return "Compose";
      case "/analytics":
        return "Analytics";
      case "/settings":
        return "Settings";
      default:
        return "SocialSynch";
    }
  };

  return (
    <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
      <button 
        type="button" 
        className="px-4 md:hidden text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
        onClick={toggleSidebar}
      >
        <Menu className="h-6 w-6" />
      </button>
      
      <div className="flex-1 px-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800 hidden md:block">
          {getPageTitle()}
        </h1>
        
        <div className="ml-4 flex items-center md:ml-6 space-x-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              className="bg-gray-100 h-10 pl-10 pr-3 w-64"
              type="text"
              placeholder="Search..."
            />
          </div>
          
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative text-gray-500 rounded-full hover:bg-gray-100">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
          </Button>
          
          {/* Help */}
          <Button variant="ghost" size="icon" className="text-gray-500 rounded-full hover:bg-gray-100">
            <HelpCircle className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
