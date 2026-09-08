"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Gamepad2, User, LogOut, Trophy } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup,
  SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton,
  SidebarMenuItem, SidebarSeparator, useSidebar,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

const navItems = [
  { label: "Play",    href: "/dashboard",    icon: Gamepad2 },
  { label: "Profile", href: "/account-setup", icon: User },
]

export function AppSidebar() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const { state } = useSidebar()
  const collapsed = state === "collapsed"

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  const initials = user?.username?.slice(0, 2).toUpperCase() ?? "??"

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-1 py-1">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/20 border border-violet-500/30">
            <Trophy className="h-4 w-4 text-violet-400" />
          </div>
          {!collapsed && (
            <span className="text-sm font-extrabold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent font-main">
              Metsie
            </span>
          )}
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel className="font-small">Menu</SidebarGroupLabel>}
          <SidebarMenu>
            {navItems.map(({ label, href, icon: Icon }) => (
              <SidebarMenuItem key={href}>
                <SidebarMenuButton asChild isActive={pathname === href} tooltip={label}>
                  <Link href={href}>
                    <Icon />
                    <span className="font-sub">{label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter>
        {user && (
          <div className={`flex items-center gap-2 rounded-lg p-2 ${collapsed ? "justify-center" : ""}`}>
            <Avatar className="h-7 w-7 shrink-0">
              <AvatarFallback className="bg-violet-500/20 text-violet-300 border-violet-500/30">{initials}</AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex flex-1 flex-col truncate leading-tight">
                <span className="truncate text-xs font-semibold text-zinc-200 font-sub">{user.username}</span>
                <span className="truncate text-[10px] text-zinc-500 font-small">{user.email}</span>
              </div>
            )}
            {!collapsed && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0 text-zinc-400 hover:text-red-400"
                onClick={handleLogout}
                title="Log out"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
        {collapsed && user && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-zinc-400 hover:text-red-400 mx-auto"
            onClick={handleLogout}
            title="Log out"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
