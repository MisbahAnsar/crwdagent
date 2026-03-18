"use client";

import * as React from "react";
import { ChevronUp, Compass, Menu, Settings, User, User2 } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/blocks/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type NavKey = "my" | "explore";

export function AppSidebar({
  active,
  onActiveChange,
}: {
  active: NavKey;
  onActiveChange: (next: NavKey) => void;
}) {
  const [open, setOpen] = React.useState(true);
  const { toggleSidebar } = useSidebar();

  const items: Array<{
    key: NavKey;
    title: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  }> =
    [
      { key: "my", title: "My Agents", icon: User },
      { key: "explore", title: "Explore Agents", icon: Compass },
    ];

  return (
    <Sidebar open={open} onOpenChange={setOpen} variant="float" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigate</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={toggleSidebar}>
                  <Menu className="h-4 w-4" />
                  <span>Menu</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>

            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    onClick={() => onActiveChange(item.key)}
                    className={
                      active === item.key
                        ? "bg-white/10 text-zinc-50 hover:bg-white/10"
                        : undefined
                    }
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Settings className="h-4 w-4" /> <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <SidebarMenuButton>
                  <User2 className="h-4 w-4" />
                  <span className="truncate">CRWDAGENT</span>
                  <ChevronUp className="ml-auto h-4 w-4 opacity-80" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-56">
                <DropdownMenuItem onSelect={() => {}}>
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => {}}>
                  <span>Back Up</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => {}}>
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

