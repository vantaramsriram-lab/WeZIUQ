import { useState } from "react";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom"

const Auth = () => {
  const { register, login } = useAuth()
  const [activeTab, setActiveTab] = useState("login");
  const [success, setSuccess] = useState("");
  const [loginError, setLoginError] = useState("")
  const [registerError, setRegisterError] = useState("")
  const [loginLoading, setLoginLoading] = useState(false)
  const [registerLoading, setRegisterLoading] = useState(false)
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate()
  const handleLogin = async (e) => {
    e.preventDefault();
    setRegisterError("")
    setLoginError("")
    try {
      setLoginLoading(true)
      const res = await login(
        loginData.email,
        loginData.password
      )
      navigate(res.data.user.role == 'admin' ? '/admin' : '/user')
    } catch (error) {
      setLoginError(error.response.data.message)
    } finally {
      setLoginLoading(false)
    }
  };
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoginError("")
    setRegisterError("");
    try {
      setRegisterLoading(true)
      const res = await register(
        registerData.name,
        registerData.email,
        registerData.password
      )
      setSuccess("Registered successfully!");
      setRegisterData({
        ...registerData,
        name: "",
        email: "",
        password: "",
      })
      setTimeout(() => {
        setActiveTab("login");
        setSuccess("");
        setLoginData({
          email: registerData.email,
          password: "",
        });
      }, 1500);
    } catch (error) {
      setRegisterError(error.response.data.message)
      
    } finally {
      setRegisterLoading(false)
    }
  };


  const switchTab = (tab) => {
    setActiveTab(tab);
    setSuccess("");
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden flex items-center justify-center px-5"
      style={{ backgroundColor: "var(--background)" }}
    >

      {/* =====================================
          BACKGROUND SPRINKLES
      ===================================== */}

      <div
        className="absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--primary) 15%, transparent)",
        }}
      />

      <div
        className="absolute top-[15%] -right-20 h-64 w-64 rounded-full blur-3xl"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--primary) 12%, transparent)",
        }}
      />

      <div
        className="absolute top-[45%] left-[5%] h-40 w-40 rounded-full blur-3xl"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--primary) 10%, transparent)",
        }}
      />

      <div
        className="absolute bottom-[-100px] left-[20%] h-80 w-80 rounded-full blur-3xl"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--primary) 10%, transparent)",
        }}
      />

      <div
        className="absolute bottom-[15%] right-[10%] h-48 w-48 rounded-full blur-3xl"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--primary) 12%, transparent)",
        }}
      />

      <div
        className="absolute top-[30%] right-[25%] h-24 w-24 rounded-full blur-2xl"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--primary) 10%, transparent)",
        }}
      />

      <div
        className="absolute bottom-[30%] left-[30%] h-28 w-28 rounded-full blur-3xl"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--primary) 8%, transparent)",
        }}
      />

      {/* =====================================
          MAIN AUTH CONTENT
      ===================================== */}

      <div className="relative z-10 w-full max-w-[420px]">

        {/* Logo */}

        <h1 className="mb-9 text-center text-[38px] font-bold tracking-[0.08em]">
          <span style={{ color: "var(--text-primary)" }}>
            We
          </span>

          <span style={{ color: "var(--primary)" }}>
            ZIUQ
          </span>
        </h1>

        {/* =====================================
            AUTH CARD
        ===================================== */}

        <div className="rounded-[26px] border border-blue-100 bg-white/85 p-8 shadow-[0_20px_60px_rgba(59,130,246,0.10)] backdrop-blur-xl">

          {/* =====================================
              LOGIN / REGISTER TABS
          ===================================== */}


          <div className="mb-8 grid grid-cols-2 rounded-xl bg-gray-100 p-1.5">

            <button
              type="button"
              onClick={() => switchTab("login")}
              className={`
                  rounded-lg
                  py-2.5
                  text-[15px]
                  font-semibold
                  transition-all
                  duration-200

                  ${activeTab === "login"
                  ? "bg-white text-[var(--primary)] shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
                }
                `}
            >
              Login
            </button>

            <button
              type="button"
              onClick={() => switchTab("register")}
              className={`
                  rounded-lg
                  py-2.5
                  text-[15px]
                  font-semibold
                  transition-all
                  duration-200

                  ${activeTab === "register"
                  ? "bg-white text-[var(--primary)] shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
                }
                `}
            >
              Register
            </button>

          </div>


          {/* =====================================
              SUCCESS MESSAGE
          ===================================== */}

          {success && (
            <div className="mb-5 rounded-xl bg-[var(--primary-soft)] px-4 py-3 text-center text-[14px] font-medium text-[var(--primary)]">
              {success}
            </div>
          )}

          {/* =====================================
              LOGIN
          ===================================== */}

          {activeTab === "login" && (
            <>
              <div className="mb-7">
                <h2 className="text-[22px] font-semibold text-[var(--text-primary)]">
                  Welcome back
                </h2>

                <p className="mt-1 text-[14px] text-[var(--text-secondary)]">
                  Login to continue to WeZIUQ
                </p>
              </div>

              <form
                onSubmit={handleLogin}
                className="space-y-5"
              >

                {/* Email */}

                <div>
                  <label className="mb-2 block text-[14px] font-medium text-gray-700">
                    Email
                  </label>

                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={loginData.email}
                    onChange={(e) =>
                      setLoginData({
                        ...loginData,
                        email: e.target.value,
                      })
                    }
                    className="
                      w-full
                      rounded-xl
                      border
                      border-[var(--border)]
                      bg-white
                      px-4
                      py-3
                      text-[15px]
                      text-[var(--text-primary)]
                      outline-none
                      transition

                      placeholder:text-gray-400

                      focus:border-[var(--primary)]
                      focus:ring-4
                      focus:ring-blue-100
                    "
                    required
                  />
                </div>

                {/* Password */}

                <div>
                  <label className="mb-2 block text-[14px] font-medium text-gray-700">
                    Password
                  </label>

                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({
                        ...loginData,
                        password: e.target.value,
                      })
                    }
                    className="
                      w-full
                      rounded-xl
                      border
                      border-[var(--border)]
                      bg-white
                      px-4
                      py-3
                      text-[15px]
                      text-[var(--text-primary)]
                      outline-none
                      transition

                      placeholder:text-gray-400

                      focus:border-[var(--primary)]
                      focus:ring-4
                      focus:ring-blue-100
                    "
                    required
                  />
                </div>
                {loginError !== "" && loginError !== "Server Error" && <p className="text-red-700">{loginError}</p>}
                {/* Login button */}

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="
                    mt-2
                    w-full
                    rounded-xl
                    bg-[var(--primary)]
                    py-3
                    text-[15px]
                    font-semibold
                    text-white
                    transition
                    hover:bg-[var(--primary-dark)]
                    active:scale-[0.99]
                  "
                >
                  {loginLoading ? "Logging in...": "Login"}
                </button>

              </form>
            </>
          )}

          {/* =====================================
              USER REGISTER
          ===================================== */}

          {activeTab === "register" && (
            <>
              <div className="mb-7">
                <h2 className="text-[22px] font-semibold text-[var(--text-primary)]">
                  Create account
                </h2>

                <p className="mt-1 text-[14px] text-[var(--text-secondary)]">
                  Register to participate in quizzes
                </p>
              </div>

              <form
                onSubmit={handleRegister}
                className="space-y-4"
              >

                {/* Name */}

                <input
                  type="text"
                  placeholder="Your name"
                  value={registerData.name}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      name: e.target.value,
                    })
                  }
                  className="
                    w-full
                    rounded-xl
                    border
                    border-[var(--border)]
                    bg-white
                    px-4
                    py-3
                    text-[15px]
                    outline-none
                    transition

                    placeholder:text-gray-400

                    focus:border-[var(--primary)]
                    focus:ring-4
                    focus:ring-blue-100
                  "
                  required
                />

                {/* Email */}

                <input
                  type="email"
                  placeholder="Email address"
                  value={registerData.email}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      email: e.target.value,
                    })
                  }
                  className="
                    w-full
                    rounded-xl
                    border
                    border-[var(--border)]
                    bg-white
                    px-4
                    py-3
                    text-[15px]
                    outline-none
                    transition

                    placeholder:text-gray-400

                    focus:border-[var(--primary)]
                    focus:ring-4
                    focus:ring-blue-100
                  "
                  required
                />

                {/* Password */}

                <input
                  type="password"
                  placeholder="Create password"
                  value={registerData.password}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      password: e.target.value,
                    })
                  }
                  className="
                    w-full
                    rounded-xl
                    border
                    border-[var(--border)]
                    bg-white
                    px-4
                    py-3
                    text-[15px]
                    outline-none
                    transition

                    placeholder:text-gray-400

                    focus:border-[var(--primary)]
                    focus:ring-4
                    focus:ring-blue-100
                  "
                  required
                />
                {registerError !== "" && registerError !== "Server Error" && <p className="text-red-700">{registerError}</p>}
                {/* Register */}
                <button
                  type="submit"
                  disabled={registerLoading}
                  className="
                    w-full
                    rounded-xl
                    bg-[var(--primary)]
                    py-3
                    text-[15px]
                    font-semibold
                    text-white
                    transition
                    hover:bg-[var(--primary-dark)]
                  "
                >
                  {registerLoading ? "Registering" : "Register"}
                </button>
              </form>

            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;