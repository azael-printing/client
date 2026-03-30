// PublicLayout.jsx
import { Outlet, useLocation } from "react-router-dom";
import TopNav from "../../components/nav/TopNav";
import MainNavbar from "../../components/nav/MainNavbar";

export default function PublicLayout() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="min-h-screen bg-white">
      {isHome ? <MainNavbar /> : <TopNav />}
      <main>
        <Outlet />
      </main>
      {!isHome && (
        <footer className="border-t border-zinc-200 mt-16">
          <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-zinc-600">
            © {new Date().getFullYear()} Azael Printing. All rights reserved.|
            Powered by MuluTilaCodeCamp. | Developed by{" Pro.STD"}
            <a
              href="https://mulutilacodecomp.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              MuluTilaCodeCamp . ChatGPT.
            </a>
          </div>
        </footer>
      )}
    </div>
  );
}
