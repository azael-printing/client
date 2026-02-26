// PublicLayout.jsx
import { Outlet } from "react-router-dom";
import TopNav from "../../components/nav/TopNav";

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-white">
      <TopNav />
      <main>
        <Outlet />
      </main>
      <footer className="border-t border-zinc-200 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-zinc-600">
          © {new Date().getFullYear()} Azael Printing. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
