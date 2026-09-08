import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-12 shrink-0 items-center gap-2 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur px-4">
          <SidebarTrigger className="text-zinc-400 hover:text-white" />
          <div className="h-4 w-px bg-zinc-800" />
          <span className="text-sm text-zinc-400 font-small">Play</span>
        </header>
        <div className="flex-1 p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
