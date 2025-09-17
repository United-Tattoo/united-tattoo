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
    <div className="flex flex-col w-64 bg-white shadow-lg">
      {/* Logo/Brand */}
      <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-sm">U</span>
          </div>
          <span className="text-xl font-bold text-gray-900">United Admin</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {filteredNavigation.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* User info and sign out */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <span className="text-sm font-medium text-gray-600">
                {user.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user.name}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user.role.replace('_', ' ').toLowerCase()}
            </p>
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleSignOut}
          className="w-full justify-start"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
