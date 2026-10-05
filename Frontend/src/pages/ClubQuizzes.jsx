import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api.js";

const ClubQuizzes = () => {
  const { clubId } = useParams();
  const [startError, setStartError] = useState("")
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate()
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setError("");
        const res = await api.get(`/user/clubs/${clubId}/quizzes`);
        setQuizzes(res.data);
      } catch (error) {
        setError(
          error.response?.data?.message || "Failed to load quizzes"
        );
      }
    };
    fetchQuizzes();
  }, [clubId]);
  const handleStartQuiz = async (quizId) => {
    setStartError("")
    try {
      const res = await api.post(`/attempt/start/${quizId}`)
      navigate(`/quiz/${quizId}/start`)
    } catch (error) {
      setStartError(error.response?.data?.message || "Failed to start quizzes")
    }
  }
  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div>
      {startError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">

            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
                ✕
              </div>

              <h2 className="mt-4 text-lg font-semibold text-[var(--text-primary)]">
                Something went wrong
              </h2>

              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                {startError}
              </p>
            </div>

            <button
              onClick={() => setStartError("")}
              className="mt-6 w-full rounded-xl bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-white hover:bg-[var(--primary-dark)]"
            >
              Okay
            </button>

          </div>
        </div>
      )}
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          Club Quizzes
        </h1>

        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Explore quizzes and test your knowledge.
        </p>
      </div>

      {/* No quizzes */}
      {quizzes.length === 0 ? (
        <div
          className="
            flex
            min-h-[300px]
            items-center
            justify-center
            rounded-2xl
            border
            border-[var(--border)]
            bg-white
          "
        >
          <div className="text-center">
            <div
              className="
                mx-auto
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-xl
                bg-blue-50
                text-[var(--primary)]
              "
            >
              ?
            </div>

            <h2 className="mt-4 font-semibold text-[var(--text-primary)]">
              No quizzes present
            </h2>

            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              There are currently no quizzes available in this club.
            </p>
          </div>
        </div>
      ) : (
        /* Quiz Cards */
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz) => (
            <div
              key={quiz._id}
              className="
                rounded-2xl
                border
                border-[var(--border)]
                bg-white
                p-5
                transition
                hover:-translate-y-1
                hover:shadow-md
              "
            >
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                {quiz.title}
              </h2>

              <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--text-secondary)]">
                {quiz.description || "Test your knowledge with this quiz."}
              </p>

              <div className="mt-5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Duration
                  </p>

                  <p className="mt-1 text-sm font-medium text-[var(--text-primary)]">
                    {quiz.duration} minutes
                  </p>
                </div>

                <button
                  className="
                    rounded-xl
                    bg-[var(--primary)]
                    px-4
                    py-2.5
                    text-sm
                    font-semibold
                    text-white
                    transition
                    hover:bg-[var(--primary-dark)]
                  "
                  onClick={() => {
                    handleStartQuiz(quiz._id)
                  }}
                >
                  Start Quiz
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClubQuizzes;