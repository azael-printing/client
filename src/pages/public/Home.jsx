import { Link } from "react-router-dom";
import bgvideo from "../public/printing-advert.mp4";
export default function Home() {
  return (
    <section className="relative min-h-[calc(100vh-72px)] flex items-center justify-center overflow-hidden">
      {/* Replace src with your real video path in /public */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src={bgvideo} type="video/mp4" sound="mute" />
      </video>

      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 text-center px-4">
        <h1 className="text-white text-3xl md:text-5xl font-extrabold tracking-tight">
          High Quality Printing. Fast Delivery.
        </h1>
        <p className="mt-4 text-white/90 max-w-2xl mx-auto">
          UV Printing • Large Format • DTF • Branding • Corporate Materials
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            to="/management"
            className="px-6 py-3 rounded-2xl bg-primary text-white font-bold shadow-lg hover:opacity-90 transition"
          >
            GET STARTED
          </Link>
          <Link
            to="/contact"
            className="px-6 py-3 rounded-2xl bg-white text-primary font-bold shadow-lg hover:bg-bgLight transition"
          >
            CONTACT US
          </Link>
        </div>
      </div>
    </section>
  );
}
