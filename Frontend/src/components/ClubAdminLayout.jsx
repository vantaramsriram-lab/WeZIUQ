import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

import api from "../../services/api";
import { useAuth } from "../context/authContext";
import { VscThreeBars } from "react-icons/vsc";
const ClubAdminLayout = () => {
  const [sideBarOpen, setSideBarOpen] = useState(false)
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState(null)
  const [showQuizModal, setShowQuizModal] = useState(false);

  const navigate = useNavigate();

  const [quizData, setQuizData] = useState({
    title: "",
    description: "",
    duration: ""
  });

  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState("");

  const { user } = useAuth();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await api.get("/admin");
        setQuizzes(res.data);
      } catch (error) {
        setError(
          error.response?.data?.message || "Failed to load quizzes"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const handleAddQuiz = async () => {
    setAddError("");
    setAddSuccess("");

    try {
      const res = await api.post("/admin/quiz/create", {
        ...quizData,
        duration: Number(quizData.duration)
      });

      setAddSuccess("Quiz Added Successfully");

      setQuizzes((prev) => [...prev, res.data]);

      setTimeout(() => {
        setShowQuizModal(false);

        setQuizData({
          title: "",
          description: "",
          duration: ""
        });

        setAddSuccess("");
      }, 1500);

    } catch (error) {
      setAddError(
        error.response?.data?.message || "Failed to add quiz"
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f9fc]">

      {/* Add Quiz Modal */}
      {showQuizModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

            {/* Header */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">
                Add Quiz
              </h2>

              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Enter the details of the quiz.
              </p>
            </div>

            {/* Title */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                Quiz Title
              </label>

              <input
                type="text"
                value={quizData.title}
                onChange={(e) =>
                  setQuizData((prev) => ({
                    ...prev,
                    title: e.target.value
                  }))
                }
                placeholder="Enter quiz title"
                className="
                  w-full
                  rounded-xl
                  border
                  border-[var(--border)]
                  px-4
                  py-3
                  text-sm
                  text-[var(--text-primary)]
                  outline-none
                  transition
                  focus:border-[var(--primary)]
                  focus:ring-2
                  focus:ring-[var(--primary)]/10
                "
              />
            </div>

            {/* Description */}
            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                Description
              </label>

              <textarea
                value={quizData.description}
                onChange={(e) =>
                  setQuizData((prev) => ({
                    ...prev,
                    description: e.target.value
                  }))
                }
                placeholder="Enter quiz description"
                rows={3}
                className="
                  w-full
                  resize-none
                  rounded-xl
                  border
                  border-[var(--border)]
                  px-4
                  py-3
                  text-sm
                  text-[var(--text-primary)]
                  outline-none
                  transition
                  focus:border-[var(--primary)]
                  focus:ring-2
                  focus:ring-[var(--primary)]/10
                "
              />
            </div>

            {/* Duration */}
            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                Duration (minutes)
              </label>

              <input
                type="number"
                min="1"
                value={quizData.duration}
                onChange={(e) =>
                  setQuizData((prev) => ({
                    ...prev,
                    duration: e.target.value
                  }))
                }
                placeholder="Enter duration"
                className="
                  w-full
                  rounded-xl
                  border
                  border-[var(--border)]
                  px-4
                  py-3
                  text-sm
                  text-[var(--text-primary)]
                  outline-none
                  transition
                  focus:border-[var(--primary)]
                  focus:ring-2
                  focus:ring-[var(--primary)]/10
                "
              />
            </div>

            {/* Error */}
            {addError !== "" && (
              <p className="mt-3 text-sm text-red-600">
                {addError}
              </p>
            )}

            {/* Success */}
            {addSuccess !== "" && (
              <p className="mt-3 text-sm text-green-600">
                {addSuccess}
              </p>
            )}

            {/* Buttons */}
            <div className="mt-6 flex justify-end gap-3">

              <button
                onClick={() => {
                  setShowQuizModal(false);

                  setQuizData({
                    title: "",
                    description: "",
                    duration: ""
                  });

                  setAddError("");
                  setAddSuccess("");
                }}
                className="
                  rounded-xl
                  border
                  border-[var(--border)]
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  text-[var(--text-secondary)]
                  transition
                  hover:bg-gray-50
                "
              >
                Cancel
              </button>

              <button
                onClick={handleAddQuiz}
                className="
                  rounded-xl
                  bg-[var(--primary)]
                  px-5
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-[var(--primary-dark)]
                "
              >
                Add Quiz
              </button>

            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <header className="fixed left-0 right-0 top-0 z-40 h-[76px] border-t-2 border-black border-b border-[var(--border)] bg-white">
        <div className="flex h-full items-center justify-between px-7">

          {/* Logo */}
          <h1 className="sm:text-[38px] text-[32px] font-bold tracking-wider">
            <button className="sm:hidden" onClick={() => { setSideBarOpen(!sideBarOpen) }}><VscThreeBars className="size-7" /></button>
            <span style={{ color: "var(--text-primary)" }}>
              We
            </span>

            <span style={{ color: "var(--primary)" }}>
              ZIUQ
            </span>
          </h1>

          {/* Right side */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-10">

              <h2 className="hidden text-xl font-medium tracking-wide text-black sm:block">
                Hello! {user?.name || "Admin"}
              </h2>

              <button
                className="
                  flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-[var(--border)]
                  px-4
                  py-2
                  text-base
                  font-medium
                  transition
                  hover:bg-gray-50
                "
                onClick={() => {
                  navigate("/auth");
                }}
              >
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
          </div>

        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`
           bg-white border-r border-[var(--border)] px-6 py-7 
           /* Mobile */
    fixed top-18 left-0 z-40 h-[calc(100vh-64px)] w-64
    transition-transform duration-300
    ${sideBarOpen ? "translate-x-0" : "-translate-x-full"}

    /* sm and above */
    sm:static sm:translate-x-0 sm:h-auto sm:w-auto sm:z-auto
          `}
      >

        {/* Sidebar heading */}
        <p className="mb-7 text-[12px] font-semibold tracking-wide text-[#64748b]">
          QUIZZES
        </p>

        {/* Loading */}
        {loading && (
          <p className="text-sm text-[var(--text-secondary)]">
            Loading quizzes...
          </p>
        )}

        {/* Error */}
        {!loading && error && (
          <p className="text-sm text-red-500">
            {error}
          </p>
        )}

        {/* No quizzes */}
        {!loading && !error && quizzes.length === 0 && (
          <p className="text-sm text-[var(--text-secondary)]">
            No quizzes available.
          </p>
        )}

        {/* Add Quiz */}
        <button
          onClick={() => {
            setShowQuizModal(true);
          }}
          className="
            mt-2
            flex
            w-full
            items-center
            gap-3
            rounded-xl
            px-3
            py-3
            text-base
            font-medium
            text-[var(--text-secondary)]
            transition
            hover:bg-[var(--primary-soft)]
            hover:text-[var(--primary)]
          "
        >
          <div
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              border
              border-[var(--border)]
              text-[var(--primary)]
            "
          >
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

        {/* Quiz list */}
        {!loading &&
          !error &&
          quizzes.map((quiz) => (
            <NavLink
              key={quiz._id}
              to={`quiz/${quiz._id}`}
              className={({ isActive }) =>
                `
                  group
                  mb-2
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  px-2
                  py-2.5
                  transition
                  ${isActive
                  ? "bg-[var(--primary)]"
                  : "hover:bg-[#f5f3ff]"
                }
                `
              }
            >
              {({ isActive }) => (
                <>
                  {/* Quiz icon */}
                  <div
                    className={`
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      text-sm
                      font-semibold
                      transition
                      ${isActive
                        ? "bg-white text-[var(--primary)]"
                        : "bg-[#f1edff] text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-white"
                      }
                    `}
                  >
                    {quiz.title?.charAt(0).toUpperCase()}
                  </div>

                  {/* Quiz name */}
                  <div className="min-w-0">

                    <p
                      className={`
                        truncate
                        text-[14px]
                        font-medium
                        ${isActive
                          ? "text-white"
                          : "text-[#334155]"
                        }
                      `}
                    >
                      {quiz.title}
                    </p>

                    <p
                      className={`
                        mt-0.5
                        text-[11px]
                        ${isActive
                          ? "text-white/70"
                          : "text-[#94a3b8]"
                        }
                      `}
                    >
                      {quiz.duration} min
                    </p>

                  </div>
                </>
              )}
            </NavLink>
          ))}

      </aside>

      {/* Main content */}
      <main className="ml-[240px] min-h-screen pt-[76px]">
        <div className="p-9">
          <Outlet />
        </div>
      </main>

    </div>
  );
};

export default ClubAdminLayout;