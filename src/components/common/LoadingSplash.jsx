import titleLogo from "../../assets/title-logo.png";

export default function LoadingSplash() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-primary text-white">
      <div className="text-center">
        <img
          src={titleLogo}
          alt="Azael Printing"
          className="h-14 mx-auto drop-shadow"
        />
        <div className="mt-3 text-lg opacity-90 animate-pulse">Loading…</div>
      </div>
    </div>
  );
}
