import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number | string): string {
  const n = typeof num === 'string' ? parseFloat(num) : num;
  
  if (n >= 1000000) {
    return (n / 1000000).toFixed(1) + 'M';
  }
  
  if (n >= 1000) {
    return (n / 1000).toFixed(1) + 'k';
  }
  
  return n.toString();
}

export function getGrowthClassName(value: number): string {
  if (value > 0) {
    return "text-green-600";
  } else if (value < 0) {
    return "text-red-600";
  }
  return "text-gray-500";
}

export function getGrowthIndicator(value: number): string {
  if (value > 0) {
    return "+";
  } else if (value < 0) {
    return "";
  }
  return "";
}

export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

export function getPlatformColor(platform: string): string {
  switch (platform) {
    case 'twitter': return 'bg-blue-100 text-blue-700';
    case 'instagram': return 'bg-pink-100 text-pink-700';
    case 'facebook': return 'bg-blue-600 bg-opacity-10 text-blue-600';
    case 'linkedin': return 'bg-blue-500 bg-opacity-10 text-blue-500';
    default: return 'bg-gray-100 text-gray-700';
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'draft': return 'bg-yellow-100 text-yellow-800';
    case 'scheduled': return 'bg-green-100 text-green-800';
    case 'published': return 'bg-blue-100 text-blue-800';
    case 'failed': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}
