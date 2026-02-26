import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Management() {
  const nav = useNavigate();
  useEffect(() => {
    nav("/login", { replace: true });
  }, [nav]);

  return null;
}
