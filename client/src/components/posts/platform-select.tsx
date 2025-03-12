import { Button } from "@/components/ui/button";
import { SocialIcon } from "@/components/ui/social-icon";
import { X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { SocialAccount } from "@shared/schema";

interface PlatformSelectProps {
  accounts: SocialAccount[];
  value: number[];
  onChange: (value: number[]) => void;
  className?: string;
}

export function PlatformSelect({ accounts, value, onChange, className }: PlatformSelectProps) {
  const handleAddPlatform = (accountId: number) => {
    if (!value.includes(accountId)) {
      onChange([...value, accountId]);
    }
  };

  const handleRemovePlatform = (accountId: number) => {
    onChange(value.filter(id => id !== accountId));
  };

  const getSelectedAccounts = () => {
    return accounts.filter(account => value.includes(account.id));
  };

  const getUnselectedAccounts = () => {
    return accounts.filter(account => !value.includes(account.id));
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'twitter': return 'bg-blue-100 text-blue-700';
      case 'instagram': return 'bg-pink-100 text-pink-700';
      case 'facebook': return 'bg-blue-600 bg-opacity-10 text-blue-600';
      case 'linkedin': return 'bg-blue-500 bg-opacity-10 text-blue-500';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {getSelectedAccounts().map(account => (
        <div 
          key={account.id}
          className={cn(
            "flex items-center px-3 py-1 rounded-full",
            getPlatformColor(account.platform)
          )}
        >
          <SocialIcon platform={account.platform} className="mr-1 h-4 w-4" />
          <span className="text-sm">{account.accountName}</span>
          <button 
            type="button"
            onClick={() => handleRemovePlatform(account.id)}
            className="ml-1 cursor-pointer focus:outline-none"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
      
      {getUnselectedAccounts().length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              type="button"
              variant="outline" 
              size="sm" 
              className="flex items-center px-3 py-1 rounded-full border border-gray-300 text-gray-500 hover:bg-gray-50"
            >
              <Plus className="h-3 w-3 mr-1" />
              <span className="text-sm">Add Platform</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {getUnselectedAccounts().map(account => (
              <DropdownMenuItem
                key={account.id}
                onClick={() => handleAddPlatform(account.id)}
                className="cursor-pointer"
              >
                <SocialIcon platform={account.platform} className="mr-2 h-4 w-4" />
                {account.accountName}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {accounts.length === 0 && (
        <div className="text-sm text-gray-500">
          No social accounts connected. Add accounts in the Connections page.
        </div>
      )}
    </div>
  );
}
