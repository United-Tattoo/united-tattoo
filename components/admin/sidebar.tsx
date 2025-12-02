"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import {
  Users,
  Settings,
  Upload,
  BarChart3,
  Calendar,
  LogOut,
  Home,
  Palette
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { UserRole } from "@/types/database"

interface AdminSidebarProps {
  user: {
    id: string
    name: string
    email: string
    role: UserRole
    image?: string
  }
}

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: Home,
    roles: [UserRole.SHOP_ADMIN, UserRole.SUPER_ADMIN],
  },
  {
    name: "Artists",
    href: "/admin/artists",
    icon: Users,
    roles: [UserRole.SHOP_ADMIN, UserRole.SUPER_ADMIN],
  },
  {
    name: "Portfolio",
    href: "/admin/portfolio",
    icon: Palette,
    roles: [UserRole.SHOP_ADMIN, UserRole.SUPER_ADMIN],
  },
  {
    name: "Calendar",
    href: "/admin/calendar",
    icon: Calendar,
    roles: [UserRole.SHOP_ADMIN, UserRole.SUPER_ADMIN],
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
    roles: [UserRole.SHOP_ADMIN, UserRole.SUPER_ADMIN],
  },
  {
    name: "File Manager",
    href: "/admin/uploads",
    icon: Upload,
    roles: [UserRole.SHOP_ADMIN, UserRole.SUPER_ADMIN],
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
    roles: [UserRole.SHOP_ADMIN, UserRole.SUPER_ADMIN],
  },
]

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname()

  // Filter navigation items based on user role
  const filteredNavigation = navigation.filter(item =>
    item.roles.includes(user.role)
  )

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" })
  }

  return (
    <div className="flex flex-col w-64 bg-card shadow-lg">
      {/* Logo/Brand */}
      <div className="flex items-center justify-center h-16 px-4 border-b border-border">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">U</span>
          </div>
          <span className="text-xl font-bold text-foreground">United Admin</span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-6 space-y-2" role="list">
        {filteredNavigation.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              role="listitem"
              aria-current={isActive ? "page" : undefined}
              aria-label={`${item.name} page${isActive ? ' (current)' : ''}`}
              className={cn(
                "flex items-center px-3 py-2.5 text-base font-medium rounded-md transition-colors",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isActive
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              <Icon className="w-5 h-5 mr-3" aria-hidden="true" />
              {item.name}
            </Link>
          )
        })}
      </div>

      {/* User info and sign out */}
      <div className="border-t border-border p-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || "User avatar"}
                loading="lazy"
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <span className="text-sm font-medium text-muted-foreground">
                {(user.name || user.email || 'U').charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-medium text-foreground truncate">
              {user.name || user.email || 'User'}
            </p>
            <p className="text-sm text-muted-foreground truncate">
              {user.role.replace(/_/g, ' ').toLowerCase()}
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleSignOut}
          className="w-full justify-start"
          aria-label="Sign out of admin dashboard"
        >
          <LogOut className="w-5 h-5 mr-2" aria-hidden="true" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
