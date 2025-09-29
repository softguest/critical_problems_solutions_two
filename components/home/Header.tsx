"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Search, Menu, X } from "lucide-react";

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const searchDrawerRef = useRef<HTMLDivElement>(null);

  // Close drawers on ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Trap focus inside the drawer when open
  useEffect(() => {
    const trapFocus = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const drawer = mobileMenuOpen
        ? mobileMenuRef.current
        : searchOpen
        ? searchDrawerRef.current
        : null;

      if (!drawer) return;

      const focusableElements = drawer.querySelectorAll<HTMLElement>(
        'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );

      const firstEl = focusableElements[0];
      const lastEl = focusableElements[focusableElements.length - 1];

      if (!firstEl || !lastEl) return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };

    if (mobileMenuOpen || searchOpen) {
      window.addEventListener("keydown", trapFocus);
    } else {
      window.removeEventListener("keydown", trapFocus);
    }

    return () => window.removeEventListener("keydown", trapFocus);
  }, [mobileMenuOpen, searchOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-sky-500 text-white">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-white"></div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium hover:underline underline-offset-4">
              Home
            </Link>
            <Link href="/categories" className="text-sm font-medium hover:underline underline-offset-4">
              Categories
            </Link>
            <Link href="/problems" className="text-sm font-medium hover:underline underline-offset-4">
              Problems
            </Link>
            {/* <Link href="/about" className="text-sm font-medium hover:underline underline-offset-4">
              About
            </Link> */}
          </nav>
        </div>

        {/* Right side (desktop) */}
        <div className="hidden md:flex items-center space-x-4">
          <button
            className="p-2 hover:opacity-80"
            onClick={() => setSearchOpen(true)}
            aria-label="Open search"
          >
            <Search className="h-5 w-5" />
          </button>

          <Link href="/auth/login" className="text-sm font-medium hover:underline">
            Sign in
          </Link>

          <Button asChild className="rounded-full bg-white text-sky-500 hover:bg-gray-100">
            <Link href="/auth/register">Dashboard</Link>
          </Button>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 hover:opacity-80"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Overlay (shared for both drawers) */}
      {(mobileMenuOpen || searchOpen) && (
        <div
          className="fixed inset-0 z-40 bg-black/40"
          onClick={() => {
            setMobileMenuOpen(false);
            setSearchOpen(false);
          }}
          aria-hidden="true"
        ></div>
      )}

      {/* Mobile Drawer (left) */}
      <div
        ref={mobileMenuRef}
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-sky-500 text-white transform transition-transform duration-300 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/20">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-white"></div>
          </Link>
          <button onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Drawer Nav */}
        <nav className="flex flex-col space-y-4 p-4">
          <Link href="/" className="text-sm font-medium hover:underline">
            Home
          </Link>
          <Link href="/categories" className="text-sm font-medium hover:underline">
            Categories
          </Link>
          <Link href="/problems" className="text-sm font-medium hover:underline">
            Problems
          </Link>
          <hr className="border-white/40" />

          <Link href="/auth/login" className="text-sm font-medium hover:underline">
            Sign in
          </Link>

          <Button asChild className="rounded-full bg-white text-sky-500 hover:bg-gray-100 w-fit">
            <Link href="/auth/register">Dashboard</Link>
          </Button>
        </nav>
      </div>

      {/* Search Drawer (right) */}
      <div
        ref={searchDrawerRef}
        className={`fixed top-0 right-0 z-50 h-full w-80 bg-white text-gray-900 shadow-lg transform transition-transform duration-300 ${
          searchOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Search</h2>
          <button onClick={() => setSearchOpen(false)} aria-label="Close search">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4">
          <input
            type="text"
            placeholder="Search blog articles..."
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <Button className="mt-3 w-full bg-sky-500 text-white hover:bg-sky-600">
            Search
          </Button>
        </div>
      </div>
    </header>
  );
};
