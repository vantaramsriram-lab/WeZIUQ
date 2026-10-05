import { useEffect, useState } from "react";
import api from "../../services/api.js";
import { useOutletContext } from "react-router-dom";
const emptyForm = {
  question: "",
  options: ["", "", "", ""],
  correctAnswer: "",
};

const AdminQuestions = () => {
  const quizId = useOutletContext()

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Fetch all questions
  const fetchQuestions = async () => {
    try {
      const res = await api.get(`/admin/${quizId}/questions`);
      console.log(res.data)
      setQuestions(res.data);
    } catch (error) {
      console.error("Failed to fetch questions:", error);
      setError(
        error.response?.data?.message || "Failed to fetch questions"
      );
    } finally {
      setLoading(false);
    }
  };

  // Delete question
  const handleDelete = async (questionId) => {
    try {
      await api.delete(`/questions/${quizId}/${questionId}`);

      setQuestions((prev) =>
        prev.filter((question) => question._id !== questionId)
      );

      setDeleteConfirm(null);
      showSuccess("Question deleted successfully");
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to delete question"
      );
    }
  };

  // Show success message
  const showSuccess = (message) => {
    setSuccess(message);

    setTimeout(() => {
      setSuccess("");
    }, 3000);
  };

  // Handle normal inputs
  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setError("");
  };

  // Handle option inputs
  const handleOptionChange = (index, value) => {
    setForm((prev) => {
      const options = [...prev.options];

      options[index] = value;

      return {
        ...prev,
        options,
      };
    });

    setError("");
  };

  // Open add form
  const openAddForm = () => {
    setForm({ ...emptyForm });
    setEditingId(null);
    setError("");
    setShowForm(true);
  };

  // Open edit form
  const handleEdit = (question) => {
    setForm({
      question: question.question,
      options: [...question.options],
      correctAnswer: question.correctAnswer,
    });
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    setEditingId(question._id);
    setError("");
    setShowForm(true);
  };

  // Cancel form
  const cancelForm = () => {
    setForm({ ...emptyForm });
    setEditingId(null);
    setShowForm(false);
    setError("");
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Validation
    if (!form.question.trim()) {
      setError("Question text is required");
      return;
    }

    if (form.options.some((option) => !option.trim())) {
      setError("All options are required");
      return;
    }

    if (!form.correctAnswer) {
      setError("Please select the correct answer");
      return;
    }

    try {
      setSaving(true);

      if (editingId) {
        await api.put(`/questions/${quizId}/${editingId}`, form);
        showSuccess("Question updated successfully");
      } else {
        await api.post(`/questions/${quizId}`, form);
        showSuccess("Question added successfully");
      }

      setForm({ ...emptyForm });
      setEditingId(null);
      setShowForm(false);

      await fetchQuestions();
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to save question"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-4xl font-bold text-[var(--text-primary)] mb-1">
            Questions
          </h2>

          <p className="text-[var(--text-secondary)]">
            {questions.length} questions total
          </p>
        </div>

        <button
          onClick={openAddForm}
          className="px-4 py-2.5 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white rounded-lg font-semibold transition"
        >
          + Add Question
        </button>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          {success}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white border border-[var(--border)] rounded-xl p-6 mb-6 shadow-sm">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
            {editingId ? "Edit Question" : "Add New Question"}
          </h3>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" id="form">
            {/* Question */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Question
              </label>

              <textarea
                value={form.question}
                onChange={(e) =>
                  handleChange("question", e.target.value)
                }
                rows={3}
                placeholder="Enter your question..."
                className="w-full px-4 py-3 bg-white border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder-gray-400 focus:outline-none focus:border-[var(--primary)] transition resize-none"
              />
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {form.options.map((option, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Option {String.fromCharCode(65 + index)}
                  </label>

                  <input
                    type="text"
                    value={option}
                    onChange={(e) =>
                      handleOptionChange(index, e.target.value)
                    }
                    placeholder={`Option ${String.fromCharCode(
                      65 + index
                    )}`}
                    className="w-full px-4 py-3 bg-white border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder-gray-400 focus:outline-none focus:border-[var(--primary)] transition"
                  />
                </div>
              ))}
            </div>

            {/* Correct Answer */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Correct Answer
              </label>

              <select
                value={form.correctAnswer}
                onChange={(e) =>
                  handleChange("correctAnswer", e.target.value)
                }
                className="w-full px-4 py-3 bg-white border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition"
              >
                <option value="">Select correct answer</option>

                {form.options.map((option, index) => {
                  if (!option.trim()) return null;

                  return (
                    <option key={index} value={option}>
                      Option {String.fromCharCode(65 + index)}: {option}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white rounded-lg font-semibold text-sm transition disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Question"
                    : "Add Question"}
              </button>

              <button
                type="button"
                onClick={cancelForm}
                className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium text-sm transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Questions */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]" />
        </div>
      ) : questions.length === 0 ? (
        <div className="bg-white border border-[var(--border)] rounded-xl p-12 text-center">
          <div className="text-4xl mb-4">❓</div>

          <p className="text-[var(--text-primary)] mb-2">
            No questions yet
          </p>

          <p className="text-[var(--text-secondary)] text-sm">
            Add your first question to get started
          </p>
        </div>
      ) : (
        <div className="space-y-4 sm:3/4">
          {questions.map((question, index) => (
            <div
              key={question._id}
              className="bg-white border border-[var(--border)] rounded-xl p-6 hover:shadow-sm transition"
            >
              {/* Question Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                <div className="flex items-start gap-3">
                  <span className="shrink-0 size-8 sm:w-10 sm:h-10 bg-[var(--primary-soft)] border border-purple-200 rounded-lg flex items-center justify-center text-[var(--primary)] text-sm font-bold">
                    {index + 1}
                  </span>

                  <p className="text-[var(--text-primary)] sm:text-lg font-medium pt-1">
                    {question.question}
                  </p>
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleEdit(question)}

                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-base transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      setDeleteConfirm(question._id)
                    }
                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg text-base transition"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ml-11">
                {question.options.map((option, optionIndex) => {
                  const isCorrect =
                    option === question.correctAnswer;

                  return (
                    <div
                      key={optionIndex}
                      className={`px-3 py-2 rounded-lg text-base flex items-center gap-2 ${isCorrect
                        ? "bg-green-50 border border-green-200 text-green-700"
                        : "bg-gray-50 border border-gray-200 text-gray-600"
                        }`}
                    >
                      <span className="font-medium">
                        {String.fromCharCode(65 + optionIndex)}.
                      </span>

                      <span>{option}</span>

                      {isCorrect && (
                        <span className="ml-auto text-xs">
                          ✓
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Delete Confirmation */}
              {deleteConfirm === question._id && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-700 mb-3">
                    Are you sure you want to delete this question?
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        handleDelete(question._id)
                      }
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition"
                    >
                      Delete
                    </button>

                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminQuestions;