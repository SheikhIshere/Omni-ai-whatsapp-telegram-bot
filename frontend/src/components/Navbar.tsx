"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Helper function to detect if a link is for the current page
  const isActive = (path: string) => pathname === path;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinks = [
    { name: "Features", href: "/" },
    { name: "Live Demo", href: "/dashboard" },
    { name: "About Developer", href: "/about" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-slate-50/80 backdrop-blur-sm shadow-sm">
      <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        {/* Site Branding */}
        <Link href="/" className="flex items-center gap-3">

          <span className="text-xl font-extrabold tracking-tighter text-sky-700 font-headline">
            OmniAgent AI
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              href={link.href} 
              className={`${isActive(link.href) ? "text-sky-700 border-b-2 border-sky-600 pb-1" : "text-slate-600 hover:text-sky-600"} transition-colors font-headline font-bold tracking-tight text-sm`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Profile / Primary Action */}
        <div className="flex items-center gap-4">
          <button className="hidden lg:block px-5 py-2 text-sm font-bold text-white bg-gradient-signature rounded-full shadow-md active:scale-95 duration-200 ease-in-out">
            Hire on Upwork
          </button>
          <div className="hidden md:flex items-center space-x-2 text-slate-600">
            <span className="material-symbols-outlined text-3xl cursor-pointer">account_circle</span>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMenu}
            className="md:hidden p-2 text-slate-600 hover:text-sky-700 transition-colors"
            aria-label="Toggle Menu"
          >
            <span className="material-symbols-outlined text-2xl">
              {isMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-slate-50 border-b border-slate-200 shadow-xl p-6 transition-all animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                onClick={() => setIsMenuOpen(false)}
                className={`${isActive(link.href) ? "text-sky-700" : "text-slate-600"} text-lg font-headline font-bold`}
              >
                {link.name}
              </Link>
            ))}
            <hr className="border-slate-200" />
            <button className="w-full py-4 text-white bg-gradient-signature rounded-xl font-bold shadow-lg">
              Hire on Upwork
            </button>
            <div className="flex items-center gap-3 pt-2">
              <span className="material-symbols-outlined text-3xl text-slate-400">account_circle</span>
              <span className="font-bold text-slate-600 text-sm">User Profile</span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
