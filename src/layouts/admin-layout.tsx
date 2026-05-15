import { Outlet } from "react-router"
import { AppSidebar } from "@/components/admin/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar" 


export function AdminLayout({ children } : { children?: React.ReactNode }) {
  return (
    <SidebarProvider>
       <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-10 flex h-14 items-center border-b border-border bg-background/80 px-4 py-9 backdrop-blur gap-4">
            <SidebarTrigger />
            <h1 className="text-sm font-medium text-foreground">Admin</h1>
          </header>  
          <main className="flex-1 p-6">{children ?? <Outlet />}</main>
        </div>
       </div> 
    </SidebarProvider>
  )
}
