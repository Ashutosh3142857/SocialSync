// Platform types and colors
export const PLATFORMS = {
  twitter: {
    name: "Twitter",
    color: "text-blue-400",
    bgColor: "bg-blue-100",
    iconClassName: "text-blue-400",
  },
  instagram: {
    name: "Instagram",
    color: "text-pink-500",
    bgColor: "bg-pink-100",
    iconClassName: "text-pink-500",
  },
  facebook: {
    name: "Facebook",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    iconClassName: "text-blue-600",
  },
  linkedin: {
    name: "LinkedIn",
    color: "text-blue-500",
    bgColor: "bg-blue-100",
    iconClassName: "text-blue-500",
  },
};

// Post statuses
export const POST_STATUS = {
  draft: {
    label: "Draft",
    className: "bg-yellow-100 text-yellow-800",
  },
  scheduled: {
    label: "Scheduled",
    className: "bg-green-100 text-green-800",
  },
  published: {
    label: "Published",
    className: "bg-blue-100 text-blue-800",
  },
  failed: {
    label: "Failed",
    className: "bg-red-100 text-red-800",
  },
};

// Chart color schemes
export const CHART_COLORS = {
  primary: "hsl(var(--primary))",
  secondary: "hsl(var(--secondary))",
  accent: "hsl(var(--accent))",
  success: "hsl(var(--chart-1))",
  warning: "hsl(var(--chart-2))",
  error: "hsl(var(--chart-3))",
  info: "hsl(var(--chart-4))",
  muted: "hsl(var(--chart-5))",
};

// Time ranges for analytics
export const TIME_RANGES = [
  { label: "Last 7 days", value: "7" },
  { label: "Last 30 days", value: "30" },
  { label: "Last 90 days", value: "90" },
];

// Content character limits by platform
export const CHARACTER_LIMITS = {
  twitter: 280,
  instagram: 2200,
  facebook: 63206,
  linkedin: 3000,
};

// Max limit (we'll use 2200 as a general limit for all platforms)
export const MAX_CONTENT_LENGTH = 2200;
