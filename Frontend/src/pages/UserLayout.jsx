import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import logo from "/logo.png"
import { VscThreeBars } from "react-icons/vsc";
const UserLayout = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [sideBarOpen, setSideBarOpen] = useState(false)
  const { user } = useAuth()
  const handleAddQuiz = () => {
    setShowNotification(true);

    setTimeout(() => {
      setShowNotification(false);
    }, 3500);
  };
  const navigate = useNavigate()
  const handleStart = () => {
    navigate("/user/quiz")
  }
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)]">


      {/* Navbar */}
      <header className="h-16 bg-white border-b border-[var(--border)] flex items-center justify-between px-6 py-9">

        {/* Logo */}
        <div className="flex gap-4">
          <button className="sm:hidden" onClick={() => { setSideBarOpen(!sideBarOpen) }}><VscThreeBars className="size-7" /></button>
          <h1 className="text-[38px] font-bold tracking-wider">
            <span style={{ color: "var(--text-primary)" }}>
              We
            </span>

            <span style={{ color: "var(--primary)" }}>
              ZIUQ
            </span>
          </h1>
        </div>


        {/* Logout */}
        <div className="flex sm:gap-10 items-center">
          <h2 className="hidden sm:block text-xl font-medium text-black tracking-wide">Hello! {user.name}</h2>
          <button className="flex items-center gap-2 px-4 py-2 rounded-full text-base font-medium border border-[var(--border)] hover:bg-gray-50 transition" onClick={() => { navigate("/auth") }}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <path d="M16 17l5-5-5-5" />
              <path d="M21 12H9" />
            </svg>

            Logout
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex min-h-[calc(100vh-64px)]">

        {/* Sidebar */}
        <aside className={`
          
           bg-white border-r border-[var(--border)] px-6 py-7 
           /* Mobile */
    fixed top-16 left-0 z-40 h-[calc(100vh-64px)] w-64
    transition-transform duration-300
    ${sideBarOpen ? "translate-x-0" : "-translate-x-full"}

    /* sm and above */
    sm:static sm:translate-x-0 sm:h-auto sm:w-auto sm:z-auto
          `}>

          <p className="text-xs font-semibold tracking-wider px-3 mb-4 text-[var(--text-secondary)] w-3/4">
            QUIZZES
          </p>

          {/* Spark Quiz */}
          <button className="w-full flex items-center justify-between px-3 py-3 rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">

            <div className="flex items-center gap-3">
              <img src={logo} alt="logo" className="w-9 h-9 rounded-xl" />


              <span className="text-base font-medium">
                Spark Quiz
              </span>
            </div>

            <span className="w-2 h-2 rounded-full bg-[var(--primary)]" />
          </button>

          {/* Add New Quiz */}
          <button
            onClick={handleAddQuiz}
            className="w-full mt-2 flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium text-[var(--text-secondary)] hover:bg-[var(--primary-soft)] hover:text-[var(--primary)] transition"
          >
            <div className="w-9 h-9 rounded-lg border border-[var(--border)] flex items-center justify-center text-[var(--primary)]">

              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 5v14" />
                <path d="M5 12h14" />
              </svg>

            </div>

            <span>Add New Quiz</span>
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-6 md:px-10 py-9 overflow-hidden">

          <div className="max-w-6xl mx-auto">

            {/* Page Heading */}
            <div className="mb-7">

              <p className="text-lg font-semibold tracking-wider mb-2 text-[var(--primary)]">
                WELCOME <span className="text-black">to</span>
              </p>

              <h1 className="text-5xl font-bold tracking-tight">
                Spark Quiz
              </h1>

            </div>

            {/* Instructions Card */}
            <div className="bg-white rounded-2xl border border-[var(--border)] overflow-hidden flex flex-col lg:flex-row shadow-sm">

              {/* Left Content */}
              <div className="flex-1 p-8 md:p-10">

                {/* Card Heading */}
                <div className="flex items-start gap-4 mb-8">

                  <div className="w-10 h-10 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center shrink-0">

                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 11v5" />
                      <path d="M12 8h.01" />
                    </svg>

                  </div>

                  <div>

                    <h2 className="font-semibold text-lg">
                      Before you begin
                    </h2>

                    <p className="text-sm mt-1 text-[var(--text-secondary)]">
                      Please review these instructions carefully.
                    </p>

                  </div>

                </div>

                {/* Instructions */}
                <div className="space-y-6">

                  {[
                    "Read each question carefully.",
                    "Select the most appropriate answer.",
                    "Complete the quiz within the given time.",
                    "Make sure you submit your answers before the timer ends.",
                  ].map((instruction, index) => (

                    <div
                      key={index}
                      className="flex items-center gap-4"
                    >

                      <div className="w-7 h-7 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center text-sm font-semibold shrink-0">
                        {index + 1}
                      </div>

                      <p className="text-base text-[var(--text-secondary)]">
                        {instruction}
                      </p>

                    </div>

                  ))}

                </div>

                {/* Start Quiz */}
                <button
                  className="mt-9 px-6 py-3.5 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white text-base font-medium flex items-center gap-5 transition"
                  onClick={handleStart}>
                  Start Quiz

                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14" />
                    <path d="M13 6l6 6-6 6" />
                  </svg>

                </button>

              </div>

              {/* Illustration */}
              <div className="hidden lg:flex w-[35%] min-h-[340px] bg-[var(--primary-soft)] items-center justify-center relative overflow-hidden">

                {/* Outer Circle */}
                <div className="absolute w-44 h-44 rounded-full border border-dashed border-[var(--primary)] opacity-30" />

                {/* Main Circle */}
                <div className="absolute w-32 h-32 rounded-full bg-[var(--primary)]" />

                {/* Dot 1 */}
                <div className="absolute w-2.5 h-2.5 rounded-full bg-[var(--primary)] translate-x-[-85px] translate-y-[-40px]" />

                {/* Dot 2 */}
                <div className="absolute w-2.5 h-2.5 rounded-full bg-[var(--primary)] opacity-65 translate-x-[65px] translate-y-[50px]" />

                {/* Spark */}
                <svg
                  className="absolute text-[var(--primary)] translate-x-[80px] translate-y-[-65px]"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M12 2l1.5 6.5L20 10l-6.5 1.5L12 18l-1.5-6.5L4 10l6.5-1.5L12 2z" />
                </svg>

              </div>

            </div>
          </div>
        </main>
      </div>

      {/* Add Quiz Notification */}
      {showNotification && (
        <div className="fixed bottom-6 right-6 z-50">

          <div className="w-[360px] bg-white border border-[var(--border)] rounded-xl p-5 flex gap-4 shadow-xl">

            <div className="w-10 h-10 rounded-lg bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center shrink-0">

              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 8v4" />
                <path d="M12 16h.01" />
                <circle cx="12" cy="12" r="9" />
              </svg>

            </div>

            <div>

              <p className="font-semibold text-base">
                We're working on it!
              </p>

              <p className="text-sm mt-1 leading-5 text-[var(--text-secondary)]">
                The ability to create new quizzes will be available soon.
              </p>

            </div>

            <button
              onClick={() => setShowNotification(false)}
              className="ml-auto text-lg text-gray-400 hover:text-gray-600"
            >
              ×
            </button>

          </div>

        </div>
      )}

    </div>
  );
};

export default UserLayout;