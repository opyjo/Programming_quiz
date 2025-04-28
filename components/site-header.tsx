"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Frame, User, LogOut, Menu, ChevronDown, X, Mail } from "lucide-react";
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
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type SubNavItem = {
  name: string;
  href: string;
};

type NavItem = {
  name: string;
  href: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  hoverColor: string;
  active?: boolean;
  dropdown?: boolean;
  items?: SubNavItem[];
};

export function SiteHeader() {
  const pathname = usePathname();
  const { user, isAuthenticated, signOut } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

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

  // Check if a nav item is active
  const isNavItemActive = (href: string) => {
    if (href === "/" && pathname !== "/") return false;
    return pathname.startsWith(href);
  };

  // Navigation items
  const navItems: NavItem[] = [
    {
      name: "Home",
      href: "/",
      icon: <Frame className="h-4 w-4" />,
      color: "text-blue-500 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
      hoverColor: "hover:text-blue-600 dark:hover:text-blue-300",
      active: pathname === "/",
    },
    {
      name: "Quiz",
      href: "/quiz",
      icon: <Menu className="h-4 w-4" />,
      color: "text-green-500 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/20",
      hoverColor: "hover:text-green-600 dark:hover:text-green-300",
      active: pathname.startsWith("/quiz"),
    },
    {
      name: "Contact",
      href: "/contact",
      icon: <Mail className="h-4 w-4" />,
      color: "text-emerald-500 dark:text-emerald-400",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/20",
      hoverColor: "hover:text-emerald-600 dark:hover:text-emerald-300",
      active: pathname === "/contact",
    },
  ];

  const logoAnimation = {
    hover: { rotate: 360, transition: { duration: 0.6, ease: "easeInOut" } },
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -5, height: 0 },
    visible: {
      opacity: 1,
      y: 0,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -5,
      height: 0,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2 group">
            <motion.div whileHover="hover" animate={{ rotate: 0 }}>
              <motion.div variants={logoAnimation}>
                <Frame className="h-6 w-6 text-blue-500" />
              </motion.div>
            </motion.div>
            <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-violet-500">
              Programming Quiz
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-1 items-center justify-between space-x-4">
          <nav className="flex items-center space-x-1">
            {navItems.map((item) =>
              item.dropdown ? (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(item.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Button
                    variant="ghost"
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-300",
                      item.active ? item.color : "text-foreground/70",
                      item.hoverColor,
                      "hover:bg-accent"
                    )}
                  >
                    <span
                      className={cn(
                        "p-1.5 rounded-md mr-2",
                        item.active ? item.bgColor : "bg-transparent"
                      )}
                    >
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                    <ChevronDown
                      className={cn(
                        "ml-1 h-4 w-4 transition-transform duration-300",
                        activeDropdown === item.name ? "rotate-180" : "rotate-0"
                      )}
                    />
                  </Button>

                  <AnimatePresence>
                    {activeDropdown === item.name && (
                      <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={dropdownVariants}
                        className="absolute left-0 mt-1 w-48 origin-top-left rounded-md bg-popover shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden"
                      >
                        <div className="py-1">
                          {item.items?.map((subItem) => {
                            const isActive = pathname === subItem.href;
                            return (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                className={cn(
                                  "block px-4 py-2 text-sm transition-colors duration-200",
                                  isActive
                                    ? "bg-accent text-accent-foreground font-medium"
                                    : "text-foreground/70 hover:bg-accent hover:text-accent-foreground"
                                )}
                              >
                                {subItem.name}
                              </Link>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.div
                  key={item.name}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
                      item.active
                        ? `${item.color} ${item.bgColor} bg-opacity-20`
                        : "text-foreground/70 hover:bg-accent",
                      item.hoverColor
                    )}
                  >
                    <span
                      className={cn(
                        "p-1.5 rounded-md mr-2",
                        item.active ? item.bgColor : "bg-transparent"
                      )}
                    >
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                  </Link>
                </motion.div>
              )
            )}
          </nav>

          <div className="flex items-center space-x-4">
            <ModeToggle />

            {mounted && (
              <>
                {isAuthenticated ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <motion.div whileHover={{ scale: 1.05 }}>
                        <Button
                          variant="ghost"
                          className="relative h-9 w-9 rounded-full border border-primary/10 bg-gradient-to-br from-background to-background/80"
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-violet-500 text-white">
                              {getUserInitials()}
                            </AvatarFallback>
                          </Avatar>
                        </Button>
                      </motion.div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-56 animate-in slide-in-from-top-2"
                    >
                      <DropdownMenuLabel className="flex items-center gap-2 font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {user?.name || "User"}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user?.email || ""}
                          </p>
                        </div>
                        {getProviderIcon()}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link
                          href="/profile"
                          className="flex items-center transition-colors duration-200 hover:text-blue-500"
                        >
                          <User className="mr-2 h-4 w-4" />
                          <span>Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="cursor-pointer transition-colors duration-200 hover:text-red-500"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="flex items-center space-x-2">
                    <motion.div whileHover={{ scale: 1.05 }}>
                      <Link href="/auth/sign-in">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="transition-colors duration-200 hover:text-blue-500"
                        >
                          Sign In
                        </Button>
                      </Link>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }}>
                      <Link href="/auth/sign-up">
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 transition-colors duration-200"
                        >
                          Sign Up
                        </Button>
                      </Link>
                    </motion.div>
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
                className="ml-2 p-1.5 relative transition-transform duration-200 hover:scale-110"
              >
                <span className="sr-only">Toggle menu</span>
                <Menu className="h-5 w-5" />
                {isAuthenticated && (
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-gradient-to-r from-blue-500 to-violet-500" />
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
              <div className="flex flex-col h-full">
                <div className="border-b p-4 flex items-center justify-between">
                  <Link
                    href="/"
                    className="flex items-center space-x-2 group"
                    onClick={() => setIsOpen(false)}
                  >
                    <Frame className="h-6 w-6 transition-transform duration-300 group-hover:rotate-180 text-blue-500" />
                    <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-violet-500">
                      Programming Quiz
                    </span>
                  </Link>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 transition-transform duration-200 hover:scale-110"
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Close</span>
                    </Button>
                  </SheetTrigger>
                </div>

                <div className="flex-1 overflow-auto py-4">
                  <nav className="flex flex-col space-y-3">
                    {navItems.map((item) =>
                      item.dropdown ? (
                        <div key={item.name} className="px-4">
                          <div
                            className={cn(
                              "flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md",
                              item.active
                                ? `${item.color} ${item.bgColor}`
                                : "bg-accent/50",
                              "mb-2"
                            )}
                          >
                            <div className="flex items-center">
                              <span className="p-1 rounded-md mr-2">
                                {item.icon}
                              </span>
                              <span>{item.name}</span>
                            </div>
                          </div>
                          <div className="ml-4 border-l-2 border-muted pl-4 space-y-1">
                            {item.items?.map((subItem) => {
                              const isActive = pathname === subItem.href;
                              return (
                                <Link
                                  key={subItem.name}
                                  href={subItem.href}
                                  className={cn(
                                    "flex px-3 py-2 text-sm rounded-md transition-colors duration-200",
                                    isActive
                                      ? "font-medium text-primary bg-primary/10"
                                      : "text-muted-foreground hover:text-primary hover:bg-accent"
                                  )}
                                  onClick={() => setIsOpen(false)}
                                >
                                  {subItem.name}
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={cn(
                            "flex items-center px-3 py-2 mx-4 text-sm font-medium rounded-md transition-all duration-200",
                            item.active
                              ? `${item.color} ${item.bgColor}`
                              : "text-foreground/70 hover:bg-accent",
                            "hover:translate-x-1"
                          )}
                          onClick={() => setIsOpen(false)}
                        >
                          <span className="p-1 rounded-md mr-2">
                            {item.icon}
                          </span>
                          <span>{item.name}</span>
                        </Link>
                      )
                    )}
                  </nav>
                </div>

                <div className="border-t p-4">
                  {mounted && (
                    <>
                      {isAuthenticated ? (
                        <div className="flex flex-col space-y-4">
                          <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                            <Avatar className="h-10 w-10 border-2 border-background">
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-violet-500 text-white">
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
                              <Button
                                variant="outline"
                                className="w-full transition-all duration-200 hover:text-blue-500"
                              >
                                <User className="mr-2 h-4 w-4" />
                                Profile
                              </Button>
                            </Link>
                            <Button
                              variant="default"
                              className="flex-1 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600"
                              onClick={handleLogout}
                            >
                              <LogOut className="mr-2 h-4 w-4" />
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
                            <Button
                              variant="outline"
                              className="w-full transition-all duration-200 hover:text-blue-500"
                            >
                              Sign In
                            </Button>
                          </Link>
                          <Link
                            href="/auth/sign-up"
                            className="flex-1"
                            onClick={() => setIsOpen(false)}
                          >
                            <Button
                              variant="default"
                              className="w-full bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600"
                            >
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
