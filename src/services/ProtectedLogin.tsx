import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface ProtectedLoginRouteProps {
  children: React.ReactNode;
}

export default function ProtectedLoginRoute({ children }: ProtectedLoginRouteProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      alert("Anda sudah login. Silakan logout terlebih dahulu untuk mengakses halaman ini.");
      navigate("/"); // arahkan ke home/dashboard sesuai peran
    }
  }, []);

  return <>{children}</>;
}
