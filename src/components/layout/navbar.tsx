"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, Menu, X, ChevronDown, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useState } from "react"

const navigation = [
  { name: "动态", href: "/news", description: "新闻动态" },
  { name: "成员", href: "/members", description: "团队成员" },
  { name: "成果", href: "/publications", description: "学术成果" },
  { name: "资源", href: "/resources", description: "课程资源", auth: true },
  { name: "活动", href: "/events", description: "活动日历" },
  { name: "关于", href: "/about", description: "了解更多" },
]

export function Navbar() {
  const pathname = usePathname()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container-custom flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-md bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-lg">通</span>
          </div>
          <span className="text-xl font-semibold text-foreground hidden sm:inline-block">
            通班
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                pathname === item.href
                  ? "text-primary bg-primary/5"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center space-x-2">
          {/* Search */}
          <div className="hidden md:block relative">
            <Input
              type="search"
              placeholder="搜索..."
              className="w-48 lg:w-64 h-9 bg-muted/50 border-0 focus:bg-muted focus:ring-1 focus:ring-primary"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>

          {/* Mobile search button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Login */}
          <Button variant="outline" size="sm" className="hidden md:flex gap-2">
            <User className="h-4 w-4" />
            登录
          </Button>

          {/* Mobile menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <SheetHeader>
                <SheetTitle className="text-left">菜单</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-2 mt-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "px-4 py-3 text-sm font-medium rounded-md transition-colors",
                      pathname === item.href
                        ? "text-primary bg-primary/5"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
                <Button variant="outline" className="mt-4">
                  <User className="h-4 w-4 mr-2" />
                  登录
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Mobile search bar */}
      {isSearchOpen && (
        <div className="md:hidden border-t border-border p-4 bg-background">
          <div className="relative">
            <Input
              type="search"
              placeholder="搜索..."
              className="w-full h-10 pr-10"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      )}
    </header>
  )
}
