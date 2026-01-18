import { useState } from "react";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";
import { message, Spin } from "antd";
import { AddLogin, GetUserDataByUserID } from "../../../service/index";
import type { LoginInterface } from "../../../interface/ILogin";
import LogoLogin from "../../../assets/SUTH Logo.png";

const Login = ({ handleSignIn }: any) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // เพิ่ม state loading
  const [messageApi, contextHolder] = message.useMessage();

  const clickLoginbt = async (datalogin: LoginInterface) => {
    setLoading(true); // เริ่มโหลด
    let res = await AddLogin(datalogin);

    if (res.status === 200) {
      const data = res.data;
      localStorage.setItem("token", data.token);
      localStorage.setItem("token_type", data.token_type);
      localStorage.setItem("isLogin", "true");
      localStorage.setItem("roleName", data.Role?.RoleName || "");
      localStorage.setItem("email", data.Email || "");
      localStorage.setItem("position", data.Position?.Position || ""); 
      localStorage.setItem("userid", data.UserID?.toString() || "");
      localStorage.setItem("firstname", data.FirstName || "");
      localStorage.setItem("lastname", data.LastName || "");

      const RoleName = res.data.Role.RoleName;
      const userID = res.data.UserID;

      if (userID) {
        try {
          await GetUserDataByUserID(Number(userID));
        } catch (error) {
          console.error("Failed to fetch UsersID:", error);
        }
      }
      messageApi.success(`เข้าสู่ระบบในฐานะ ${RoleName} สำเร็จ`);
      setTimeout(() => {
        setLoading(false); // หยุดโหลดก่อนเปลี่ยนหน้า
        if (RoleName === "Admin") {
          window.location.href = "/";
        } else if (RoleName === "User") {
          window.location.href = "/";
        }
      }, 500);
    } else {
      setLoading(false); // หยุดโหลด
      messageApi.error("อีเมลหรือรหัสผ่านไม่ถูกต้อง!");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      messageApi.warning("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน");
      return;
    }
    const datalogin: LoginInterface = { email: email.trim(), password: password };
    await clickLoginbt(datalogin);
  };

  return (
    <>
      {contextHolder}
      <div className="w-full max-w-lg mx-auto px-2 sm:px-4 md:px-6">
        <div className="flex flex-col items-center mb-8">
          <div className="mb-8">
            <img
              src={LogoLogin}
              alt="icon"
              className="w-56 h-56 md:w-64 md:h-20"
              style={{ objectFit: 'contain' }}
            />
          </div>
          <h2 className="text-3xl font-semibold text-yellow-500 mb-1">Login</h2>
          <p className="text-yellow-400 text-base">Log in to your account.</p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit} autoComplete="off">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-xs text-yellow-700 font-medium mb-1">
              Email
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-300 text-lg">
                <FaEnvelope />
              </span>
              <input
                id="email"
                type="email"
                className="w-full rounded-lg border border-yellow-200 pl-10 pr-3 py-2 text-sm bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                disabled={loading}
              />
            </div>
          </div>
          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-xs text-yellow-700 font-medium mb-1">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-300 text-lg">
                <FaLock />
              </span>
              <input
                className="w-full rounded-lg border border-yellow-200 pl-10 pr-10 py-2 text-sm bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition"
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                disabled={loading}
              />
              <span
                className="absolute top-2 right-3 text-lg text-yellow-400 cursor-pointer"
                onClick={() => setShowPassword((s) => !s)}
                tabIndex={-1}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
          </div>

          <div className="flex justify-end text-xs mt-1">
            <a href="#" className="text-yellow-500 hover:underline">Forgot Password?</a>
          </div>

          <button
            type="submit"
            className={`
              mt-4 w-full flex items-center justify-center
              bg-gradient-to-r from-yellow-400 to-yellow-600
              text-white py-2 rounded-full text-base font-semibold
              shadow-md hover:from-yellow-500 hover:to-yellow-700 transition
              ${loading ? 'opacity-70 cursor-not-allowed' : ''}
            `}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Spin size="small" className="!text-white" />
                Logging in...
              </span>
            ) : (
              "Log In"
            )}
          </button>
        </form>

        <div className="text-center mt-6 text-base text-yellow-400">
          Don't have an account?{" "}
          <span
            className="text-yellow-600 hover:underline cursor-pointer font-bold"
            onClick={handleSignIn}
          >
            Sign Up
          </span>
        </div>
      </div>
    </>
  );
};

export default Login;
