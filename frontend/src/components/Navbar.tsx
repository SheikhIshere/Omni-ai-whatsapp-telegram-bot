import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full bg-slate-50/80 backdrop-blur-sm shadow-sm">
      <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        <Link href="/" className="text-xl font-extrabold tracking-tighter text-sky-700 font-headline">
          OmniAgent AI
        </Link>
        <div className="hidden md:flex items-center space-x-8">
          <Link 
            href="/" 
            className={`${isActive("/") ? "text-sky-700 border-b-2 border-sky-600 pb-1" : "text-slate-600 hover:text-sky-600"} transition-colors font-headline font-bold tracking-tight`}
          >
            Features
          </Link>
          <Link 
            href="/dashboard" 
            className={`${isActive("/dashboard") ? "text-sky-700 border-b-2 border-sky-600 pb-1" : "text-slate-600 hover:text-sky-600"} transition-colors font-headline font-bold tracking-tight`}
          >
            Live Demo
          </Link>
          <Link 
            href="/about" 
            className={`${isActive("/about") ? "text-sky-700 border-b-2 border-sky-600 pb-1" : "text-slate-600 hover:text-sky-600"} transition-colors font-headline font-bold tracking-tight`}
          >
            About Developer
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <button className="hidden lg:block px-5 py-2 text-sm font-bold text-white bg-gradient-signature rounded-full shadow-md active:scale-95 duration-200 ease-in-out">
            Hire on Upwork
          </button>
          <div className="flex items-center space-x-2 text-slate-600">
            <span className="material-symbols-outlined text-3xl cursor-pointer">account_circle</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
