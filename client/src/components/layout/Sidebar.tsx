import React from "react";
import { Link, useLocation } from "wouter";
import { 
  HomeIcon, 
  CalendarIcon, 
  PencilIcon, 
  LineChartIcon, 
  SettingsIcon, 
  X, 
  CircleUserRound 
} from "lucide-react";
import { SiTwitter, SiInstagram, SiLinkedin, SiFacebook } from "react-icons/si";
import { cn } from "@/lib/utils";

interface SidebarProps {
  open: boolean;
}

type NavItem = {
  name: string;
  href: string;
  icon: React.ElementType;
};

type Platform = {
  name: string;
  icon: React.ElementType;
  connected: boolean;
};

const Sidebar: React.FC<SidebarProps> = ({ open }) => {
  const [location] = useLocation();

  const navigation: NavItem[] = [
    { name: "Dashboard", href: "/", icon: HomeIcon },
    { name: "Calendar", href: "/calendar", icon: CalendarIcon },
    { name: "Compose", href: "/compose", icon: PencilIcon },
    { name: "Analytics", href: "/analytics", icon: LineChartIcon },
    { name: "Settings", href: "/settings", icon: SettingsIcon },
  ];

  const platforms: Platform[] = [
    { name: "Twitter", icon: SiTwitter, connected: true },
    { name: "Instagram", icon: SiInstagram, connected: true },
    { name: "LinkedIn", icon: SiLinkedin, connected: true },
    { name: "Facebook", icon: SiFacebook, connected: false },
  ];

  return (
    <div className={cn(
      "md:flex md:flex-shrink-0 transition-all duration-300 ease-in-out",
      open ? "block fixed inset-0 z-40 md:relative md:inset-auto" : "hidden"
    )}>
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 bg-gray-800">
          <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-900">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
                <MessageSquare className="text-white text-xl" />
              </div>
              <h1 className="text-white font-semibold text-lg">SocialSynch</h1>
            </div>
          </div>

          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = location === item.href;
                return (
                  <Link 
                    key={item.name} 
                    href={item.href}
                    className={cn(
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                      isActive 
                        ? "bg-gray-900 text-white" 
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    )}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Connected Platforms */}
            <div className="px-4 mt-6">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Connected Platforms
              </h2>
              <div className="mt-3 space-y-2">
                {platforms.map((platform) => (
                  <div key={platform.name} className="flex items-center text-gray-300">
                    <platform.icon className="mr-2 h-5 w-5" />
                    <span className="text-sm">{platform.name}</span>
                    <span className={cn(
                      "ml-auto h-2 w-2 rounded-full",
                      platform.connected ? "bg-emerald-500" : "bg-red-500"
                    )}></span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* User Profile */}
          <div className="flex-shrink-0 flex border-t border-gray-700 p-4">
            <div className="flex items-center">
              <div>
                <CircleUserRound className="h-9 w-9 rounded-full text-gray-300" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">Alex Johnson</p>
                <p className="text-xs font-medium text-gray-400">Pro Plan</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MessageSquare = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

export default Sidebar;
