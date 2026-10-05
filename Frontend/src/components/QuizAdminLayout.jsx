import { NavLink, Outlet, useParams } from "react-router-dom";
import { useAuth } from "../context/authContext";

const QuizAdminLayout = () => {
  const { user } = useAuth();
  const { quizId } = useParams();

  const navLinks = [
    {
      name: "Dashboard",
      path: `/admin/quiz/${quizId}`,
    },
    {
      name: "Users",
      path: `/admin/quiz/${quizId}/users`,
    },
    {
      name: "Questions",
      path: `/admin/quiz/${quizId}/questions`,
    },
    {
      name: "Results",
      path: `/admin/quiz/${quizId}/results`,
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)]">

      <main className="mx-auto px-6 py-8 md:px-30">

        {/* Navigation Links */}
        <div className="flex w-full gap-5 overflow-x-auto sm:gap-10 mb-10">

          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.name === "Dashboard"}
              className={({ isActive }) =>
                `
                w-fit
                rounded-lg
                px-5
                py-2.5
                font-medium
                transition
                ${
                  isActive
                    ? "bg-[var(--primary)] text-white"
                    : "border border-[var(--border)] bg-white text-gray-600 hover:text-[var(--primary)]"
                }
                `
              }
            >
              {link.name}
            </NavLink>
          ))}

        </div>

        {/* Pages */}
        <Outlet context={quizId} />

      </main>

    </div>
  );
};

export default QuizAdminLayout;