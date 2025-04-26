"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Frame,
  User,
  LogOut,
  Menu,
  Home,
  BookOpen,
  Award,
  BarChart2,
  HelpCircle,
  Mail,
  Info,
  Bookmark,
  History,
  ChevronDown,
  X,
} from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, signOut } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Fix hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    signOut();
    setIsOpen(false);
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.name) return "U";

    const nameParts = user.name.split(" ");
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();

    return (
      nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)
    ).toUpperCase();
  };

  // Get provider icon for social login
  const getProviderIcon = () => {
    if (!user || !user.provider) return null;

    switch (user.provider) {
      case "google":
        return (
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
        );
      case "github":
        return (
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"
              fill="currentColor"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  // Navigation items
  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: <Home className="h-4 w-4 mr-2" />,
      active: pathname === "/",
    },
    {
      name: "Quizzes",
      href: "/quiz",
      icon: <BookOpen className="h-4 w-4 mr-2" />,
      active: pathname.startsWith("/quiz"),
      dropdown: true,
      items: [
        { name: "All Categories", href: "/quiz" },
        { name: "Web Development", href: "/quiz/web-development" },
        { name: "Python", href: "/quiz/python" },
        { name: "Golang", href: "/quiz/golang" },
        { name: "Java", href: "/quiz/java" },
      ],
    },
    {
      name: "Resources",
      href: "/resources",
      icon: <BookOpen className="h-4 w-4 mr-2" />,
      active: pathname === "/resources",
    },
    {
      name: "About",
      href: "/about",
      icon: <Info className="h-4 w-4 mr-2" />,
      active: pathname === "/about",
    },
    {
      name: "FAQ",
      href: "/faq",
      icon: <HelpCircle className="h-4 w-4 mr-2" />,
      active: pathname === "/faq",
    },
    {
      name: "Contact",
      href: "/contact",
      icon: <Mail className="h-4 w-4 mr-2" />,
      active: pathname === "/contact",
    },
  ];

  // User-specific navigation items (only shown when logged in)
  const userNavItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <BarChart2 className="h-4 w-4 mr-2" />,
      active: pathname === "/dashboard",
    },
    {
      name: "Bookmarks",
      href: "/bookmarks",
      icon: <Bookmark className="h-4 w-4 mr-2" />,
      active: pathname === "/bookmarks",
    },
    {
      name: "History",
      href: "/history",
      icon: <History className="h-4 w-4 mr-2" />,
      active: pathname === "/history",
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <Frame className="h-6 w-6" />
            <span className="font-bold">Programming Quiz</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-1 items-center justify-between space-x-4">
          <nav className="flex items-center space-x-6">
            {navItems.map((item) =>
              item.dropdown ? (
                <DropdownMenu key={item.name}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        "flex items-center px-2 py-1.5 text-sm font-medium transition-colors hover:text-primary",
                        item.active ? "text-foreground" : "text-foreground/60"
                      )}
                    >
                      {item.name}
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {item.items?.map((subItem) => (
                      <DropdownMenuItem key={subItem.name} asChild>
                        <Link href={subItem.href}>{subItem.name}</Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    item.active ? "text-foreground" : "text-foreground/60"
                  )}
                >
                  {item.name}
                </Link>
              )
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {mounted && isAuthenticated && (
              <nav className="flex items-center space-x-4">
                {userNavItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary",
                      item.active ? "text-foreground" : "text-foreground/60"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            )}

            <ModeToggle />

            {mounted && (
              <>
                {isAuthenticated ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative h-8 w-8 rounded-full"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{getUserInitials()}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel className="flex items-center gap-2">
                        My Account
                        {getProviderIcon()}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/profile">
                          <User className="mr-2 h-4 w-4" />
                          <span>Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Link href="/auth/sign-in">
                      <Button variant="ghost" size="sm">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/sign-up">
                      <Button size="sm">Sign Up</Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden flex-1 justify-end items-center">
          <ModeToggle />

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="ml-2 p-1.5 relative"
              >
                <span className="sr-only">Toggle menu</span>
                <Menu className="h-5 w-5" />
                {isAuthenticated && (
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary" />
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
              <div className="flex flex-col h-full">
                <div className="border-b p-4 flex items-center justify-between">
                  <Link
                    href="/"
                    className="flex items-center space-x-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <Frame className="h-6 w-6" />
                    <span className="font-bold">Programming Quiz</span>
                  </Link>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <X className="h-4 w-4" />
                      <span className="sr-only">Close</span>
                    </Button>
                  </SheetTrigger>
                </div>

                <div className="flex-1 overflow-auto py-2">
                  <nav className="flex flex-col space-y-1">
                    {navItems.map((item) =>
                      item.dropdown ? (
                        <div key={item.name} className="px-2 py-1">
                          <div className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-muted">
                            {item.icon}
                            {item.name}
                          </div>
                          <div className="mt-1 pl-5 space-y-1">
                            {item.items?.map((subItem) => (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                className="flex px-3 py-2 text-sm rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                onClick={() => setIsOpen(false)}
                              >
                                {subItem.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={cn(
                            "flex items-center px-3 py-2 mx-2 text-sm font-medium rounded-md hover:bg-muted/50",
                            item.active
                              ? "bg-muted text-foreground"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                          onClick={() => setIsOpen(false)}
                        >
                          {item.icon}
                          {item.name}
                        </Link>
                      )
                    )}

                    {mounted && isAuthenticated && (
                      <>
                        <div className="px-2 py-2">
                          <Separator />
                        </div>
                        {userNavItems.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                              "flex items-center px-3 py-2 mx-2 text-sm font-medium rounded-md hover:bg-muted/50",
                              item.active
                                ? "bg-muted text-foreground"
                                : "text-muted-foreground hover:text-foreground"
                            )}
                            onClick={() => setIsOpen(false)}
                          >
                            {item.icon}
                            {item.name}
                          </Link>
                        ))}
                      </>
                    )}
                  </nav>
                </div>

                <div className="border-t p-4">
                  {mounted && (
                    <>
                      {isAuthenticated ? (
                        <div className="flex flex-col space-y-4">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>
                                {getUserInitials()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">
                                {user?.name || user?.email}
                              </p>
                              <p className="text-xs text-muted-foreground flex items-center">
                                {user?.provider && (
                                  <>
                                    <span className="mr-1">via</span>
                                    {getProviderIcon()}
                                  </>
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Link
                              href="/profile"
                              className="flex-1"
                              onClick={() => setIsOpen(false)}
                            >
                              <Button variant="outline" className="w-full">
                                Profile
                              </Button>
                            </Link>
                            <Button
                              variant="default"
                              className="flex-1"
                              onClick={handleLogout}
                            >
                              Log out
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <Link
                            href="/auth/sign-in"
                            className="flex-1"
                            onClick={() => setIsOpen(false)}
                          >
                            <Button variant="outline" className="w-full">
                              Sign In
                            </Button>
                          </Link>
                          <Link
                            href="/auth/sign-up"
                            className="flex-1"
                            onClick={() => setIsOpen(false)}
                          >
                            <Button variant="default" className="w-full">
                              Sign Up
                            </Button>
                          </Link>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
