import { ReactNode } from "react";
import { Sidebar } from "@/components/ui/sidebar";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none md:pt-0 pt-16">
          {children}
        </main>
      </div>
    </div>
  );
}
