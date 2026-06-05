"use client"

import * as React from "react"
import {
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  Megaphone,
  Users,
} from "lucide-react"
import { NavMain } from "@/components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button";
import { userLogout } from "@/actions/auth";
import { useNavigate } from "react-router"


// This is sample data.
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
    },
    {
      title: "Students",
      url: "/students",
      icon: Users,
    },
    {
      title: "Teachers",
      url: "/teachers",
      icon: GraduationCap,
    },
    {
      title: "Academics",
      url: "/academics",
      icon: BookOpen,
      isActive: true,
      items: [
        {
          title: "Curriculum",
          url: "/curriculum"
        },
        {
          title: "Subjects",
          url: "/subjects",
        },
        {
          title: "Schedules",
          url: "/schedules",
        },
        {
          title: "Sections",
          url: "/sections",
        }
      ]
    },
    {
      title: "Announcements",
      url: "/announcements",
      icon: Megaphone,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate();
  const handleLogout = async () => {
    await userLogout();
    navigate("/login");
  }


  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>

      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <Button
              variant="ghost"
                  className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-200 cursor-pointer"
                  onClick={handleLogout}
            >
            Logout
        </Button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
