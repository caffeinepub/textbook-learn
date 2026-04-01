import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, BookOpen, Moon, Search, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";

export function Header() {
  const { theme, setTheme } = useTheme();
  const router = useRouterState();
  const isStudyPage = router.location.pathname.startsWith("/study");
  const [searchOpen, setSearchOpen] = useState(false);

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "My Library", to: "/#library" },
    { label: "How It Works", to: "/#how" },
  ];

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-border/50 backdrop-blur-md"
      style={{ background: "oklch(0.175 0.043 240 / 0.92)" }}
      data-ocid="header.panel"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 shrink-0"
          data-ocid="header.link"
        >
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold gold-glow shrink-0"
            style={{
              background: "oklch(0.82 0.14 75)",
              color: "oklch(0.12 0.04 240)",
            }}
          >
            TB
          </div>
          <div className="hidden sm:block">
            <div
              className="text-sm font-bold leading-tight"
              style={{ color: "oklch(0.965 0.01 240)" }}
            >
              TextBook
            </div>
            <div
              className="text-xs leading-tight"
              style={{ color: "oklch(0.77 0.12 200)" }}
            >
              Learn
            </div>
          </div>
        </Link>

        {/* Center Nav */}
        {!isStudyPage && (
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-sm font-medium transition-colors hover:text-cyan"
                style={{ color: "oklch(0.68 0.035 240)" }}
                data-ocid="header.link"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        {isStudyPage && (
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: "oklch(0.68 0.035 240)" }}
              />
              <Input
                placeholder="Search study materials…"
                className="pl-10 bg-card/50 border-border/60 text-sm"
                data-ocid="header.search_input"
              />
            </div>
          </div>
        )}

        {/* Right utilities */}
        <div className="flex items-center gap-2">
          {/* Search icon for mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setSearchOpen(!searchOpen)}
            data-ocid="header.search_input"
          >
            <Search className="w-4 h-4" />
          </Button>

          {/* Notification bell */}
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            data-ocid="header.button"
          >
            <Bell className="w-4 h-4" />
            <span
              className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full"
              style={{ background: "oklch(0.82 0.14 75)" }}
            />
          </Button>

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            data-ocid="header.toggle"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>

          {/* Avatar */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer"
            style={{
              background: "oklch(0.77 0.12 200)",
              color: "oklch(0.12 0.04 240)",
            }}
            data-ocid="header.button"
          >
            <BookOpen className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Mobile search */}
      {searchOpen && (
        <div className="md:hidden px-4 pb-3">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: "oklch(0.68 0.035 240)" }}
            />
            <Input
              placeholder="Search study materials…"
              className="pl-10 bg-card/50 border-border/60 text-sm"
              autoFocus
              data-ocid="header.search_input"
            />
          </div>
        </div>
      )}
    </header>
  );
}
