import {
  BellIcon,
  CreditCardIcon,
  LogOutIcon,
  MoreVerticalIcon,
  UserCircleIcon,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

import LogoGravatar from '@/components/layout/logo'
import Link from 'next/link'
import { useState } from 'react'

// Tipo para los elementos del menú
type MenuItem = {
  id: string
  icon: React.ElementType
  label: string
  url: string
  group?: string
}

export function NavUser({
  user,
  menuItems: initialMenuItems,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
  menuItems?: MenuItem[]
}) {
  const { isMobile } = useSidebar()
  
  // Lista de menú predeterminada si no se proporciona
  const defaultMenuItems: MenuItem[] = [
    {
      id: "account",
      icon: UserCircleIcon,
      label: "Profile",
      url: "/profile",
      group: "main"
    },
    {
      id: "billing",
      icon: CreditCardIcon,
      label: "Billing",
      url: "/billing",
      group: "main"
    },
    {
      id: "affiliates",
      icon: BellIcon,
      label: "Affiliates",
      url: "/affiliates",
      group: "main"
    },
    {
      id: "logout",
      icon: LogOutIcon,
      label: "Log out",
      url: "/api/auth/signout",
      group: "footer"
    }
  ]
  
  // Usar los elementos de menú proporcionados o los predeterminados
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems || defaultMenuItems)
  
  // Función para actualizar un elemento del menú
  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    setMenuItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    )
  }
  
  // Función para añadir un nuevo elemento al menú
  const addMenuItem = (newItem: MenuItem) => {
    setMenuItems(prevItems => [...prevItems, newItem])
  }
  
  // Función para eliminar un elemento del menú
  const removeMenuItem = (id: string) => {
    setMenuItems(prevItems => prevItems.filter(item => item.id !== id))
  }
  
  // Agrupar elementos por su propiedad "group"
  const mainGroupItems = menuItems.filter(item => item.group === "main")
  const footerItems = menuItems.filter(item => item.group === "footer")
  const otherItems = menuItems.filter(item => !item.group || (item.group !== "main" && item.group !== "footer"))

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="dropdown-menu-open"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <LogoGravatar email={user.email} size={40} />
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>
              <MoreVerticalIcon className="ml-auto h-4 w-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="dropdown-menu-width min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <LogoGravatar email={user.email} size={40} />
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {/* Grupo principal de elementos */}
            {mainGroupItems.length > 0 && (
              <DropdownMenuGroup>
                {mainGroupItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <DropdownMenuItem key={item.id} asChild>
                      <Link href={item.url} className="flex w-full cursor-pointer items-center">
                        <Icon className="h-4 w-4 mr-2" />
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuGroup>
            )}
            
            {/* Otros elementos (si existen) */}
            {otherItems.length > 0 && (
              <>
                {mainGroupItems.length > 0 && <DropdownMenuSeparator />}
                <DropdownMenuGroup>
                  {otherItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <DropdownMenuItem key={item.id} asChild>
                        <Link href={item.url} className="flex w-full cursor-pointer items-center">
                          <Icon className="h-4 w-4 mr-2" />
                          {item.label}
                        </Link>
                      </DropdownMenuItem>
                    )
                  })}
                </DropdownMenuGroup>
              </>
            )}
            
            {/* Elementos de pie (generalmente logout) */}
            {footerItems.length > 0 && (
              <>
                <DropdownMenuSeparator />
                {footerItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <DropdownMenuItem key={item.id} asChild>
                      <Link href={item.url} className="flex w-full cursor-pointer items-center">
                        <Icon className="h-4 w-4 mr-2" />
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  )
                })}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

// Exportamos también las funciones de ayuda para la edición de elementos desde el componente padre
export type { MenuItem };