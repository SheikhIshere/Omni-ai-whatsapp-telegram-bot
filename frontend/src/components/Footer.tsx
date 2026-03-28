import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full py-12 border-t border-slate-200 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <span className="text-lg font-bold text-slate-900 font-headline">OmniAgent AI</span>
          <p className="text-sm text-slate-500">© 2024 OmniAgent AI. Built for High-Trust Interactions.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          <Link className="text-sm text-slate-500 hover:text-sky-500 transition-colors" href="#">Privacy Policy</Link>
          <Link className="text-sm text-slate-500 hover:text-sky-500 transition-colors" href="#">Terms of Service</Link>
          <Link className="text-sm text-slate-500 hover:text-sky-500 transition-colors" href="#">Documentation</Link>
          <Link className="text-sm text-slate-500 hover:text-sky-500 transition-colors" href="#">Support</Link>
        </div>
      </div>
    </footer>
  );
}
