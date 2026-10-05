import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext.jsx";
import { useNavigate, useParams } from "react-router-dom"
import api from "../../services/api.js"

const Quiz = () => {
  const {quizId} = useParams()
  const [loading, setLoading] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [error, setError] = useState("")
  const [startedAt, setStartedAt] = useState(null)
  const [attemptId, setAttemptId] = useState(null)
  const [answers, setAnswers] = useState({});
  const [visited, setVisited] = useState([0]);
  const [timeLeft, setTimeLeft] = useState(null);
  const { logout, user } = useAuth();
  const navigate = useNavigate()

  //fetching Questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await api.post(`/attempt/start/${quizId}`);
        const { questions: qs, attempt, duration } = res.data
        setQuestions(qs)
        console.log("Attempt: ", attempt)
        setAttemptId(attempt.id)
        setStartedAt(new Date(attempt.startedAt))
        if (attempt.answers && attempt.answers.length > 0) {
          const restore = {}
          attempt.answers.forEach(a => {
            if (a.selectedAnswer) {
              restore[a.questionId.toString()] = a.selectedAnswer;
            }
          })
          setAnswers(restore)
        }
        const elapsed = (Date.now() - new Date(attempt.startedAt).getTime()) / 1000;
        const total = duration * 60;
        const remainingTime = Math.max(0, Math.floor(total - elapsed))
        setTimeLeft(remainingTime)
      } catch (error) {
        console.log(error.response)
        setError(error.response?.data?.message || "Something went wrong")
      } finally {
        setLoading(false)
      }
    }
    fetchQuestions();
  }, [])

  // Timer
  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);
  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const handleAnswer = async (questionId, selectedAnswer) => {
    try {
      const res = await api.put(`/attempt/${attemptId}/answer`, { questionId, selectedAnswer });
      setAnswers((prev) => ({
        ...prev,
        [questionId]: selectedAnswer,
      }));
    } catch (err) {
      console.log(err.response)
    }
  };

  const goToQuestion = (index) => {
    setCurrentQuestion(index);
    setVisited((prev) => {
      if (prev.includes(index)) return prev;
      return [...prev, index];
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      goToQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      goToQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitLoading(true)
      const res = await api.post(`/attempt/${attemptId}/submit`);
      localStorage.removeItem("currentQuestion");
      navigate("/quiz/completed");
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong")
    } finally {
      setSubmitLoading(false)
    }
  };

  const answeredCount = Object.keys(answers).length;

  const progress =
    ((currentQuestion + 1) / questions.length) * 100;

  const question = questions[currentQuestion];


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-fadeIn">
          <div className="animate-spin rounded-full h-15 w-15 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div
          className="absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl pointer-events-none"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--primary) 15%, transparent)",
          }}
        />

        <div
          className="absolute top-[15%] -right-20 h-64 w-64 rounded-full blur-3x pointer-events-nonel"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--primary) 12%, transparent)",
          }}
        />

        <div
          className="absolute top-[45%] left-[5%] h-40 w-40 rounded-full blur-3xl pointer-events-none"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--primary) 10%, transparent)",
          }}
        />

        <div
          className="absolute bottom-[-100px] left-[20%] h-80 w-80 rounded-full blur-3xl pointer-events-none"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--primary) 10%, transparent)",
          }}
        />

        <div
          className="absolute bottom-[15%] right-[10%] h-48 w-48 rounded-full blur-3xl pointer-events-none"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--primary) 12%, transparent)",
          }}
        />

        <div
          className="absolute top-[30%] right-[25%] h-24 w-24 rounded-full blur-2xl pointer-events-none"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--primary) 10%, transparent)",
          }}
        />

        <div
          className="absolute bottom-[30%] left-[30%] h-28 w-28 rounded-full blur-3xl pointer-events-none"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--primary) 8%, transparent)",
          }}
        />
        <div className=" border border-gray-500 rounded-2xl p-8 max-w-md w-full text-center animate-scaleIn">
          {user.name && <p className="font-semibold text-2xl mb-6">Hey {user.name}</p>}
          {user.quizCompleted ? <p className="text-[#8295a1] mb-6 text-lg">You Already Completed the Quiz</p> : <p className="text-[#8295a1] mb-6">Error! Login again</p>}
          <button
            onClick={() => {
              logout();
              navigate('/auth');
            }}
            className="px-6 py-2 bg-[var(--primary)] hover:bg-[#6200b1] text-white rounded-lg transition-colors text-[18px] font-semibold"
          >
            Back to Login
          </button>
        </div>
      </div>
    )
  }
  if (!questions.length) {
    return (<div>
      <p>No Questions available</p>
      <p>Please Contact admin</p>
    </div>);
  }
  return (
    <div className="min-h-screen bg-[#f7f9fc] text-[#151b2d]">

      {/* Header */}
      <header className="h-16 bg-white border-b border-[#e5e7eb] flex items-center justify-between px-6 py-9">

        {/* Logo */}
        <h1 className="text-[38px] font-bold tracking-wider">
          <span style={{ color: "var(--text-primary)" }}>
            We
          </span>

          <span style={{ color: "var(--primary)" }}>
            ZIUQ
          </span>
        </h1>

        {/* Timer */}
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#e2e5eb] bg-white">

          <svg
            className="w-5 h-5 text-purple-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </svg>

          <span className="font-semibold text-[16px]">
            {formatTime()}
          </span>

        </div>
      </header>

      {/* Main */}
      <main className="max-w-[1500px] mx-auto px-5 md:px-8 py-7">

        {/* Top information */}
        <div className="mb-5">

          <div className="flex justify-between items-center mb-3">

            <p className="text-[15px] text-gray-500">
              Question{" "}
              <span className="text-purple-600 font-semibold">
                {currentQuestion + 1}
              </span>{" "}
              of {questions.length}
            </p>

            <p className="text-[15px] text-gray-500">
              <span className="font-semibold text-purple-600">
                {answeredCount}
              </span>{" "}
              answered
            </p>

          </div>

          {/* Progress */}
          <div className="h-2 bg-[#e9eaf1] rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-600 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">

          {/* Question card */}
          <section className="bg-white border border-[#e3e6ec] rounded-2xl p-6 md:p-8 shadow-sm">

            {/* Question number */}
            <div className="flex items-center gap-3 mb-8">

              <div className="w-11 h-11 rounded-xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-600 font-bold">
                {currentQuestion + 1}
              </div>

              <span className="text-gray-500 font-medium">
                Question {currentQuestion + 1}
              </span>

            </div>

            {/* Question */}
            <h1 className="text-[25px] md:text-[28px] font-bold leading-tight mb-8">
              {question.question}
            </h1>

            {/* Options */}
            <div className="space-y-3">

              {question.options.map((option, index) => {

                const selected = answers[question._id] === option;

                const letter = String.fromCharCode(65 + index);

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(question._id, option)}
                    className={`
                      w-full flex items-center gap-4
                      text-left px-4 py-4
                      rounded-xl border
                      transition-all duration-200
                      ${selected
                        ? "border-purple-500 bg-purple-50"
                        : "border-[#e2e5eb] bg-white hover:border-purple-300 hover:bg-purple-50/40"
                      }
                    `}
                  >

                    {/* Option letter */}
                    <span
                      className={`
                        w-10 h-10 rounded-lg
                        flex items-center justify-center
                        font-semibold shrink-0
                        ${selected
                          ? "bg-purple-600 text-white"
                          : "bg-[#f0f2f6] text-gray-500"
                        }
                      `}
                    >
                      {letter}
                    </span>

                    {/* Option text */}
                    <span
                      className={`
                        text-[16px]
                        ${selected
                          ? "text-purple-700 font-semibold"
                          : "text-gray-700"
                        }
                      `}
                    >
                      {option}
                    </span>

                    {/* Radio */}
                    <span className="ml-auto">

                      <span
                        className={`
                          block w-5 h-5 rounded-full border-2
                          ${selected ? "border-purple-600 bg-purple-600" : "border-gray-300"}
                        `}
                      >
                        {selected && (
                          <span className="block w-2 h-2 bg-white rounded-full mx-auto mt-[5px]" />
                        )}
                      </span>

                    </span>

                  </button>
                );
              })}

            </div>

            {/* Bottom navigation */}
            <div className="flex justify-between items-center mt-9 pt-6 border-t border-[#edf0f4]">

              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className={`
                  px-5 py-3 rounded-xl font-medium
                  border transition
                  ${currentQuestion === 0
                    ? "text-gray-300 border-gray-200 cursor-not-allowed"
                    : "text-gray-600 border-gray-200 hover:border-purple-300 hover:text-purple-600"
                  }
                `}
              >
                ← Previous
              </button>

              <button
                onClick={handleNext}
                disabled={currentQuestion === questions.length - 1}
                className={`
                  px-6 py-3 rounded-xl font-semibold
                  transition
                  ${currentQuestion === questions.length - 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-purple-600 text-white hover:bg-purple-700"
                  }
                `}
              >
                Next →
              </button>

            </div>

          </section>

          {/* Question Palette */}
          <aside className="bg-white border border-[#e3e6ec] rounded-2xl p-6 shadow-sm h-fit">

            <h2 className="text-lg font-bold mb-5">
              Question Palette
            </h2>

            {/* Numbers */}
            <div className="grid grid-cols-5 gap-2 mb-7">

              {questions.map((q, index) => {

                const isCurrent = currentQuestion === index;
                const isAnswered = answers[q._id] !== undefined;
                const isVisited = visited.includes(index);

                return (
                  <button
                    key={index}
                    onClick={() => goToQuestion(index)}
                    className={`
                      h-11 rounded-lg border
                      font-medium transition
                      ${isCurrent
                        ? "bg-purple-600 text-white border-purple-600"
                        : isAnswered
                          ? "bg-purple-100 text-purple-700 border-purple-300"
                          : isVisited
                            ? "bg-gray-100 text-gray-600 border-gray-300"
                            : "bg-white text-gray-500 border-gray-200 hover:border-purple-300"
                      }
                    `}
                  >
                    {index + 1}
                  </button>
                );
              })}

            </div>

            {/* Legend */}
            <div className="space-y-3 mb-7">

              <Legend
                color="bg-purple-600"
                text="Current"
              />

              <Legend
                color="bg-purple-100 border border-purple-400"
                text="Answered"
              />

              <Legend
                color="bg-gray-200 border border-gray-300"
                text="Visited"
              />

              <Legend
                color="bg-white border border-gray-200"
                text="Not visited"
              />

            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={submitLoading}
              className="w-full py-3.5 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
            >
              {submitLoading ? "Submitting" : "Submit Quiz"}
            </button>

          </aside>

        </div>
      </main>
    </div>
  );
}

function Legend({ color, text }) {
  return (
    <div className="flex items-center gap-3">

      <span
        className={`w-4 h-4 rounded ${color}`}
      />

      <span className="text-sm text-gray-500">
        {text}
      </span>

    </div>
  );
}
export default Quiz;