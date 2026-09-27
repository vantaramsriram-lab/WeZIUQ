import { useAuth } from '../context/authContext';

const QuizCompleted = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fbff] p-4">

      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-[#7C3AED] opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-[#5B21B6] opacity-5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 text-center max-w-md w-full">

        {/* Success Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[#7C3AED]/10 to-[#5B21B6]/10 border-2 border-[#7C3AED]/20 rounded-full mb-4">

            <svg
              className="w-12 h-12 text-[#7C3AED]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>

          </div>
        </div>

        {/* Card */}
        <div className="bg-white border border-[#e5e7eb] rounded-2xl p-8 sm:p-10 shadow-lg">

          <h1 className="text-3xl sm:text-4xl font-bold text-[#111827] mb-4">
            Quiz Completed
          </h1>

          <div className="w-16 h-1 bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] rounded-full mx-auto mb-6"></div>

          <p className="text-[#6b7280] text-lg mb-2">
            Thank you,{" "}
            <span className="text-[#111827] font-medium">
              {user?.name}
            </span>
            !
          </p>

          <p className="text-[#6b7280] mb-8">
            Your quiz has been successfully submitted.
          </p>

          <div className="bg-[#eff6ff] border border-[#e5e7eb] rounded-xl p-4">
            <p className="text-sm text-[#6b7280]">
              You may now close this page.
            </p>
          </div>

        </div>

        {/* Decorative dots */}
        <div className="mt-8 flex justify-center gap-2">
          <div className="w-2 h-2 bg-[#7C3AED] rounded-full opacity-60"></div>
          <div className="w-2 h-2 bg-[#7C3AED] rounded-full opacity-40"></div>
          <div className="w-2 h-2 bg-[#7C3AED] rounded-full opacity-20"></div>
        </div>

      </div>
    </div>
  );
};

export default QuizCompleted;