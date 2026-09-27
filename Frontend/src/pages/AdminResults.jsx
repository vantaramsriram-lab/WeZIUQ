import React, { useEffect, useMemo, useState } from "react";
import api from "../../services/api.js";

const AdminResults = () => {
  const [results, setResults] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("");
  const [error, setError] = useState("");

  // Fetch results
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchResults();
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/admin/results", {
        params: { search },
      });

      setResults(res.data);
    } catch (error) {
      console.error("Failed to fetch results:", error);

      setError(
        error.response?.data?.message || "Failed to fetch results"
      );
    } finally {
      setLoading(false);
    }
  };

  // Convert seconds to minutes and seconds
  const formatTime = (seconds) => {
    if (!seconds || seconds < 0) {
      return "0m:0s";
    }

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${mins}m:${secs}s`;
  };

  // Percentage for displaying
  const getPercentage = (score, total) => {
    if (!total) return 0;

    return Math.round((score / total) * 100);
  };

  // Raw percentage for sorting
  const getRawPercentage = (score, total) => {
    if (!total) return 0;

    return (score / total) * 100;
  };

  // Sort results
  const sortedResults = useMemo(() => {
    return [...results].sort((a, b) => {
      if (sortBy === "percentage-high") {
        return (
          getRawPercentage(b.score, b.totalQuestions) -
          getRawPercentage(a.score, a.totalQuestions)
        );
      }

      if (sortBy === "percentage-low") {
        return (
          getRawPercentage(a.score, a.totalQuestions) -
          getRawPercentage(b.score, b.totalQuestions)
        );
      }

      return 0;
    });
  }, [results, sortBy]);

  // Percentage badge
  const getPercentageStyle = (percentage) => {
    if (percentage >= 70) {
      return "bg-green-50 text-green-700 border border-green-200";
    }

    if (percentage >= 40) {
      return "bg-yellow-50 text-yellow-700 border border-yellow-200";
    }

    return "bg-red-50 text-red-700 border border-red-200";
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-4xl font-bold text-[var(--text-primary)] mb-1">
            Results
          </h2>

          <p className="text-[var(--text-secondary)] text-base">
            {results.length} submissions
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="
              w-full sm:w-56
              px-4 py-2.5
              bg-white
              border border-[var(--border)]
              rounded-lg
              text-[var(--text-primary)]
              focus:outline-none
              focus:ring-2
              focus:ring-[var(--primary)]/20
              focus:border-[var(--primary)]
              text-sm
            "
          >
            <option value="">Sort By</option>

            <option value="percentage-high">
              Percentage: High-Low
            </option>

            <option value="percentage-low">
              Percentage: Low-High
            </option>
          </select>

          {/* Search */}
          <div className="w-full sm:w-72">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full
                px-4 py-2.5
                bg-white
                border border-[var(--border)]
                rounded-lg
                text-[var(--text-primary)]
                placeholder:text-[var(--text-secondary)]
                focus:outline-none
                focus:ring-2
                focus:ring-[var(--primary)]/20
                focus:border-[var(--primary)]
                transition-all
                text-sm
              "
            />
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
        </div>
      ) : sortedResults.length === 0 ? (
        /* Empty State */
        <div className="bg-white border border-[var(--border)] rounded-2xl p-12 text-center">
          <span className="text-4xl mb-4 block">📋</span>

          <p className="text-[var(--text-secondary)]">
            {search
              ? "No results found for your search"
              : "No quiz submissions yet"}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-[var(--border)] rounded-2xl overflow-hidden">
          {/* ================= DESKTOP TABLE ================= */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)] bg-gray-50">
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">
                    User
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">
                    Score
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">
                    Percentage
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">
                    Time Taken
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">
                    Started
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">
                    Submitted
                  </th>
                </tr>
              </thead>

              <tbody>
                {sortedResults.map((result) => {
                  const percentage = getPercentage(
                    result.score,
                    result.totalQuestions
                  );

                  return (
                    <tr
                      key={result._id}
                      className="
                        border-b border-[var(--border)]
                        hover:bg-[var(--primary-soft)]
                        transition-colors
                      "
                    >
                      {/* User */}
                      <td className="px-6 py-4">
                        <div className="text-[var(--text-primary)] font-medium">
                          {result.userName}
                        </div>

                        <div className="text-[var(--text-secondary)] text-xs mt-1">
                          {result.userEmail}
                        </div>
                      </td>

                      {/* Score */}
                      <td className="px-6 py-4">
                        <span className="text-[var(--text-primary)] font-semibold">
                          {result.score}/{result.totalQuestions}
                        </span>
                      </td>

                      {/* Percentage */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getPercentageStyle(
                            percentage
                          )}`}
                        >
                          {percentage}%
                        </span>
                      </td>

                      {/* Time */}
                      <td className="px-6 py-4 text-[var(--text-secondary)] text-sm">
                        {formatTime(result.timeTaken)}
                      </td>

                      {/* Started */}
                      <td className="px-6 py-4 text-[var(--text-secondary)] text-sm">
                        {new Date(result.startedAt).toLocaleString()}
                      </td>

                      {/* Submitted */}
                      <td className="px-6 py-4 text-[var(--text-secondary)] text-sm">
                        {new Date(result.submittedAt).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ================= MOBILE CARDS ================= */}
          <div className="lg:hidden divide-y divide-[var(--border)]">
            {sortedResults.map((result) => {
              const percentage = getPercentage(
                result.score,
                result.totalQuestions
              );

              return (
                <div
                  key={result._id}
                  className="p-4 hover:bg-[var(--primary-soft)] transition-colors"
                >
                  {/* User + Percentage */}
                  <div className="flex justify-between items-start mb-4 gap-3">
                    <div className="min-w-0">
                      <div className="text-[var(--text-primary)] font-medium truncate">
                        {result.userName}
                      </div>

                      <div className="text-[var(--text-secondary)] text-sm truncate">
                        {result.userEmail}
                      </div>
                    </div>

                    <span
                      className={`shrink-0 inline-flex px-3 py-1 rounded-full text-xs font-medium ${getPercentageStyle(
                        percentage
                      )}`}
                    >
                      {percentage}%
                    </span>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-[var(--text-secondary)] text-xs mb-1">
                        Score
                      </div>

                      <div className="text-[var(--text-primary)] font-semibold">
                        {result.score}/{result.totalQuestions}
                      </div>
                    </div>

                    <div>
                      <div className="text-[var(--text-secondary)] text-xs mb-1">
                        Time
                      </div>

                      <div className="text-[var(--text-primary)]">
                        {formatTime(result.timeTaken)}
                      </div>
                    </div>

                    <div>
                      <div className="text-[var(--text-secondary)] text-xs mb-1">
                        Started
                      </div>

                      <div className="text-[var(--text-primary)] text-xs">
                        {new Date(result.startedAt).toLocaleString()}
                      </div>
                    </div>

                    <div>
                      <div className="text-[var(--text-secondary)] text-xs mb-1">
                        Submitted
                      </div>

                      <div className="text-[var(--text-primary)] text-xs">
                        {new Date(result.submittedAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminResults;