import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function SiteHeader( {title} ) {
  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b transition-all ease-linear sidebar-header">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 separator-vertical"
        />
        <h1 className="text-base font-medium">{title}</h1>
      </div>
    </header>
  )
}