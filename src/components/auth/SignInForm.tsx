import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const response = await axios.post("http://localhost:8000/api/login", {
        email,
        password,
      });

      const { token, user } = response.data.data;

      // Simpan token dan user info ke localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", user.role);

      // Set token default ke axios
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Redirect berdasarkan role
      if (user.role === "super admin" || user.role === "admin") {
        navigate("/dashboard");
      } else if (user.role === "mentor" || user.role === "mentee") {
        navigate("/");
      } else {
        setErrorMsg("Role tidak dikenali. Hubungi administrator.");
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        setErrorMsg("Email atau password salah.");
      } else if (err.response?.status === 422) {
        setErrorMsg("Data tidak valid. Pastikan semua field diisi dengan benar.");
      } else {
        setErrorMsg("Terjadi kesalahan. Silakan coba lagi nanti.");
      }
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side (Image) */}
      <div className="w-1/2 bg-blue-400 flex flex-col items-center justify-center text-center px-6 py-10">
        <img
          src="/images/logo/bkpk-w.png"
          alt="Login Illustration"
          className="w-[80%] max-w-xl mb-6 drop-shadow-xl"
        />
        <h2 className="text-xl font-semibold text-gray-800">
          Selamat Datang di Mentoris!
        </h2>
        <p className="text-sm text-gray-700 mt-2">
          Platform pembelajaran dan mentoring terintegrasi
        </p>
      </div>

      {/* Right Side (Form) */}
      <div className="w-1/2 flex items-center justify-center p-10">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Selamat Datang!</h1>
          <p className="text-sm text-gray-500 mb-6">
            Masukkan email dan password untuk masuk ke sistem
          </p>

          {errorMsg && (
            <div className="mb-4 text-red-500 bg-red-100 px-4 py-2 rounded">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                placeholder="you@example.com"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <Label>Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  placeholder="Masukkan password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                >
                  {showPassword ? <EyeIcon /> : <EyeCloseIcon />}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox checked={isChecked} onChange={setIsChecked} />
                <span className="text-sm">Ingat saya</span>
              </div>
              <a href="/reset-password" className="text-sm text-blue-500 hover:underline">
                Lupa password?
              </a>
            </div>

            <Button type="submit" className="w-full">
              Masuk
            </Button>
          </form>

          <div className="mt-5 text-center text-sm">
            Belum punya akun?{" "}
            <a href="/signup" className="text-blue-500 hover:underline">
              Daftar
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
