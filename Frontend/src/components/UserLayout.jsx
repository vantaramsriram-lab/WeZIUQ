import { useState, useEffect } from "react";
import api from "../../services/api.js";
import { Outlet, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { VscThreeBars } from "react-icons/vsc";
const UserLayout = () => {
  const [sideBarOpen, setSideBarOpen] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [clubCode, setClubCode] = useState("");
  const [joinError, setJoinError] = useState("")
  const [joinSuccess, setJoinSuccess] = useState("")
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()
  useEffect(() => {
    const fetchClubs = async () => {
      setLoading(true);
      const res = await api.get("/user/myclubs");
      setMemberships(res.data);
      setLoading(false);
    }
    fetchClubs();
  }, [])
  const handleJoinClub = async () => {
    setJoinError("")
    setJoinSuccess("")
    try {
      const res = await api.post("/user/clubs/join", { clubCode });
      console.log(res.data)
      setJoinSuccess(res.data.message)
      setMemberships((prev) => [...prev, res.data.membership]);
      setTimeout(() => {
        setClubCode("")
        setJoinSuccess("")
        setShowJoinModal(false)
      }, 1500)
    } catch (error) {
      setJoinError(error.response.data?.message)
    }
  };
  if (loading) {
    return (
      <div className="flex min-h-[100vh] items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)]">
      {/* Navbar */}
      <header className="h-16 bg-white border-b border-[var(--border)] flex items-center justify-between px-6 py-9">

        {/* Logo */}
        <div className="flex gap-4">
          <button className="sm:hidden" onClick={() => { setSideBarOpen(!sideBarOpen) }}><VscThreeBars className="size-7" /></button>
          <h1 className="sm:text-[38px] text-[30px] font-bold tracking-wider">
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

      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

            {/* Header */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">
                Join a Club
              </h2>

              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Enter the club code to join the club.
              </p>
            </div>

            {/* Club Code */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                Club Code
              </label>

              <input
                type="text"
                value={clubCode}
                onChange={(e) => setClubCode(e.target.value)}
                placeholder="Enter club code"
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
            {joinError !== "" &&
              (
                <p className="text-sm text-red-600">{joinError}</p>
              )
            }
            {
              joinSuccess !== "" && (
                <p className="text-sm text-green-600">{joinSuccess}</p>
              )
            }
            {/* Buttons */}
            <div className="mt-6 flex justify-end gap-3">

              <button
                onClick={() => {
                  setShowJoinModal(false);
                  setClubCode("");
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
                onClick={handleJoinClub}
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
                Join Club
              </button>

            </div>
          </div>
        </div>
      )}
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
            CLUBS
          </p>

          {/* Join New Club */}
          <button
            onClick={() => {
              setShowJoinModal(true)
            }}
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

            <span>Join New Club</span>
          </button>

          {
            memberships.map((club) => (
              <Link
                key={club._id}
                to={`/user/club/${club.clubId?._id}`}
                className="
        group
        flex
        items-center
        gap-3
        rounded-xl
        px-3
        py-2.5
        transition
        hover:bg-blue-50
      "
              >
                {/* Club Icon */}
                <div
                  className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-lg
          bg-blue-50
          text-sm
          font-semibold
          text-[var(--primary)]
          transition
          group-hover:bg-[var(--primary)]
          group-hover:text-white
        "
                >
                  {club.clubId?.clubName?.charAt(0).toUpperCase()}
                </div>

                {/* Club Details */}
                <div className="min-w-0">
                  <p
                    className="
            truncate
            text-sm
            font-medium
            text-[var(--text-primary)]
          "
                  >
                    {club.clubId?.clubName}
                  </p>

                  <p
                    className="
            mt-0.5
            text-xs
            text-[var(--text-secondary)]
          "
                  >
                    {club.clubId?.clubCode}
                  </p>
                </div>
              </Link>
            ))
          }

        </aside>

        {/* Main Content */}
        <main className="flex-1 px-6 md:px-10 py-9 overflow-hidden">
          <Outlet context={setShowJoinModal} />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;