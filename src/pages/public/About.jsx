import { Outlet, Link } from "react-router-dom";

export default function About() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-900">
        About Us
      </h2>
      <p className="mt-3 text-zinc-700 max-w-3xl">
        Azael Printing delivers premium printing solutions for businesses and
        individuals with modern machines and strict quality control.
      </p>

      <div className="mt-6 flex gap-2 flex-wrap">
        <Link
          to="/about/vision"
          className="px-4 py-2 rounded-xl bg-bgLight text-primary font-bold hover:opacity-90"
        >
          Vision
        </Link>
        <Link
          to="/about/mission"
          className="px-4 py-2 rounded-xl bg-bgLight text-primary font-bold hover:opacity-90"
        >
          Mission
        </Link>
        <Link
          to="/about/values"
          className="px-4 py-2 rounded-xl bg-bgLight text-primary font-bold hover:opacity-90"
        >
          Value
        </Link>
      </div>

      <div className="mt-8">
        <Outlet />
      </div>
    </div>
  );
}
