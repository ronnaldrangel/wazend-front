import * as React from "react"
import {
  ArrowUpCircleIcon,
  BarChartIcon,
  CameraIcon,
  ClipboardListIcon,
  DatabaseIcon,
  FileCodeIcon,
  FileIcon,
  FileTextIcon,
  FolderIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  ListIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react"

import { NavSecondary } from "@/components/admin/nav-secondary"
import { NavDocuments } from "@/components/admin/nav-documents"
import { NavMain } from "@/components/admin/nav-main"
import { NavUser } from "@/components/admin/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import Link from 'next/link'
import Image from 'next/image'
import { useSession } from "next-auth/react" // Importamos useSession de NextAuth

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Extraemos los datos de sesión usando el hook useSession
  const { data: session, status } = useSession()

  // Datos de navegación principal
  const navMainItems = [
    {
      title: "Dashboard",
      url: "/admin/",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Reports",
      url: "/admin/reports",
      icon: ListIcon,
    },
    {
      title: "Analytics",
      url: "/admin/analytics",
      icon: BarChartIcon,
    },
    {
      title: "Instances",
      url: "/admin/instances",
      icon: FolderIcon,
    },
  ]

  const data = {
    documents: [
      {
        name: "Data Library",
        url: "#",
        icon: DatabaseIcon,
      },
      {
        name: "Reports",
        url: "#",
        icon: ClipboardListIcon,
      },
      {
        name: "Word Assistant",
        url: "#",
        icon: FileIcon,
      },
    ],
    navSecondary: [
      {
        title: "Settings",
        url: "#",
        icon: SettingsIcon,
      },
      {
        title: "Get Help",
        url: "#",
        icon: HelpCircleIcon,
      },
      {
        title: "Search",
        url: "#",
        icon: SearchIcon,
      },
    ],
  }


  // Datos de usuario extraídos de la sesión de NextAuth
  const userData = session?.user ? {
    name: session.user.name || "Usuario",
    email: session.user.email || "",
    avatar: session.user.image || "/avatars/default.jpg",
  } : null

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="p-1.5">
            <Link href="/">
              <Image
                className="h-6 w-auto"
                src={process.env.NEXT_PUBLIC_LOGO || '/images/logo.svg'}
                alt="Logo"
                width={236}
                height={60}
              />
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainItems} />
        {/* <NavDocuments items={data.documents} /> */}
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        {userData && <NavUser user={userData} />}
      </SidebarFooter>
    </Sidebar>
  )
}