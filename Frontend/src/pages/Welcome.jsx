import { useOutletContext } from "react-router-dom";
import { useAuth } from "../context/authContext";
const Welcome = () => {
  const setShowJoinModal = useOutletContext()
  const { user } = useAuth()
  return (
    <div className="min-h-full">

      {/* Welcome Section */}
      <section
        className="
    relative
    flex
    min-h-[calc(100vh-120px)]
    items-center
    justify-center
    overflow-hidden
    rounded-3xl
    border
    border-[var(--border)]
    bg-white
    px-6
    py-16
  "
      >
        {/* Background Decoration */}
        <div
          className="
      absolute
      -right-32
      -top-32
      h-80
      w-80
      rounded-full
      bg-[var(--primary)]
      opacity-10
      blur-3xl
    "
        />

        <div
          className="
      absolute
      -bottom-32
      -left-32
      h-80
      w-80
      rounded-full
      bg-[var(--primary)]
      opacity-5
      blur-3xl
    "
        />

        <div className="relative flex max-w-2xl flex-col items-center text-center">

          {/* Logo */}
          <div
            className="
        flex
        h-28
        w-28
        items-center
        justify-center
        rounded-3xl
        bg-[var(--primary)]
        shadow-lg
      "
          >
            <span className="text-5xl font-extrabold tracking-tight text-white">
              WZ
            </span>
          </div>

          {/* Welcome */}
          <h1
            className="
        mt-8
        sm:text-8xl
        font-semibold
        text-[var(--text-primary)]
        text-6xl
      "
          >
            Welcome to We
            <span className="text-[var(--primary)] font-extrabold">ZUIQ</span>
          </h1>

          {/* Tagline */}
          {user.role === "user" && (<p
            className="
        mt-4
        max-w-lg
        text-base
        leading-7
        text-[var(--text-secondary)]
        sm:text-lg
      "
          >
            Enhance your knowledge. Challenge yourself. Start your journey.
          </p>)}

          {/* CTA */}
          {user.role === "user" && <button
            className="
        mt-8
        inline-flex
        items-center
        gap-2
        rounded-xl
        bg-[var(--primary)]
        px-6
        py-3.5
        text-sm
        font-semibold
        text-white
        shadow-sm
        transition
        hover:bg-[var(--primary-dark)]
        hover:shadow-md
      " onClick={() => {
              setShowJoinModal(true);
            }}
          >
            Join Clubs

            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>}

        </div>
      </section>

    </div>
  );
};

export default Welcome;