import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddCourse = () => {
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [activeStep, setActiveStep] = useState(1);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    level: "Beginner",
    duration: "",
    price: "",
    image: null,
    video: null,
    notes: null,
    teacher: "",
    chapters: [],
  });
  // Removed unused teacher/student search & lists to satisfy lint
  const [createFlashcards, setCreateFlashcards] = useState(false); // optional flashcard creation toggle
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && name === "image") {
      setImagePreview(URL.createObjectURL(files[0]));
    }
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleDeleteChapter = (chapterIdx) => {
    const newChapters = formData.chapters.filter((_, idx) => idx !== chapterIdx);
    setFormData({ ...formData, chapters: newChapters });
  };

  const handleDeleteTopic = (chapterIdx, topicIdx) => {
    const newChapters = [...formData.chapters];
    newChapters[chapterIdx].topics = newChapters[chapterIdx].topics.filter((_, idx) => idx !== topicIdx);
    setFormData({ ...formData, chapters: newChapters });
  };

  const handleDeleteQuestion = (chapterIdx, topicIdx, quizIdx) => {
    const newChapters = [...formData.chapters];
    newChapters[chapterIdx].topics[topicIdx].quiz = newChapters[chapterIdx].topics[topicIdx].quiz.filter((_, idx) => idx !== quizIdx);
    setFormData({ ...formData, chapters: newChapters });
  };

  // (Potential future enhancement: allow selecting teacher/students here)

  const handleAddChapter = () => {
    setFormData({
      ...formData,
      chapters: [...formData.chapters, { title: "", topics: [] }],
    });
  };

  const handleAddTopic = (chapterIdx) => {
    const newChapters = [...formData.chapters];
    newChapters[chapterIdx] = {
      ...newChapters[chapterIdx],
      topics: [
        ...newChapters[chapterIdx].topics,
        { title: "", video: "", quiz: [] },
      ],
    };

    setFormData({
      ...formData,
      chapters: newChapters,
    });
  };

  const handleAddQuestion = (chapterIdx, topicIdx) => {
    const newChapters = [...formData.chapters];
    newChapters[chapterIdx].topics[topicIdx] = {
      ...newChapters[chapterIdx].topics[topicIdx],
      quiz: [
        ...newChapters[chapterIdx].topics[topicIdx].quiz,
        {
          question: "",
          options: ["", "", "", ""],
          correctOption: "",
          explaination: "",
        },
      ],
    };

    setFormData({
      ...formData,
      chapters: newChapters,
    });
  };

  const handleChapterChange = (chapterIdx, value) => {
    const newChapters = [...formData.chapters];
    newChapters[chapterIdx].title = value;
    setFormData({
      ...formData,
      chapters: newChapters,
    });
  };

  const handleTopicChange = (chapterIdx, topicIdx, field, e) => {
    const newChapters = [...formData.chapters];

    if (field === "title") {
      newChapters[chapterIdx].topics[topicIdx][field] = e.target.value;
    } else if (field === "video") {
      newChapters[chapterIdx].topics[topicIdx][field] = e.target.files[0];
    }

    setFormData({
      ...formData,
      chapters: newChapters,
    });
  };
  console.log(".....", formData);

  const handleQuizOptionChange = (
    e,
    chapterIdx,
    topicIdx,
    quizIdx,
    quizOptionIdx
  ) => {
    const newChapters = [...formData.chapters];
    newChapters[chapterIdx].topics[topicIdx].quiz[quizIdx].options[
      quizOptionIdx
    ] = e.target.value;

    setFormData({
      ...formData,
      chapters: newChapters,
    });
  };

  const handleQuizCorrectOption = (e, chapterIdx, topicIdx, quizIdx, val) => {
    const newChapters = [...formData.chapters];
    newChapters[chapterIdx].topics[topicIdx].quiz[quizIdx].correctOption = val;

    setFormData({
      ...formData,
      chapters: newChapters,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("level", formData.level);
    data.append("duration", formData.duration);
    data.append("price", formData.price);
    data.append("image", formData.image);
    data.append("video", formData.video);
    if (formData.notes) data.append("notes", formData.notes);
    data.append("teacher", formData.teacher);

    const chaptersCopy = formData.chapters.map((chapter, chapterIdx) => {
      return {
        title: chapter.title,
        topics: chapter.topics.map((topic, topicIdx) => {
          if (topic.video) {
            data.append(
              `chapters[${chapterIdx}][topics][${topicIdx}][video]`,
              topic.video
            );
          }

          return {
            title: topic.title,
            quiz: topic.quiz,
          };
        }),
      };
    });

    data.append("chapters", JSON.stringify(chaptersCopy));

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/teacher/courses/create_course`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: data,
        }
      );
      const coursesResponse = await response.json();

      if (response.ok) {
        // Assume API returns created course object under data
        const newCourseId = coursesResponse?.data?._id;
        if (createFlashcards && newCourseId) {
          // Redirect directly to flashcards management with preselected course
            navigate(`/teacher/flashcards?courseId=${newCourseId}`);
        } else {
            navigate("/teacher/courses");
        }
      }
    } catch (err) {
      console.log("error occured", err);
    } finally {
      setLoading(false);
    }
  };

  // Modern styles
  const styles = {
    container: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "40px 20px",
    },
    card: {
      maxWidth: "900px",
      margin: "0 auto",
      background: "white",
      borderRadius: "20px",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      overflow: "hidden",
    },
    header: {
      background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
      padding: "30px 40px",
      color: "white",
    },
    stepper: {
      display: "flex",
      justifyContent: "center",
      gap: "15px",
      padding: "20px",
      background: "#f8fafc",
      borderBottom: "1px solid #e2e8f0",
    },
    step: {
      padding: "10px 20px",
      borderRadius: "25px",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "14px",
      transition: "all 0.3s ease",
    },
    formContent: {
      padding: "40px",
    },
    formGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "20px",
    },
    inputGroup: {
      marginBottom: "20px",
    },
    label: {
      display: "block",
      fontSize: "14px",
      fontWeight: "600",
      color: "#374151",
      marginBottom: "8px",
    },
    input: {
      width: "100%",
      padding: "12px 16px",
      borderRadius: "10px",
      border: "2px solid #e5e7eb",
      fontSize: "15px",
      transition: "border-color 0.3s",
      outline: "none",
      boxSizing: "border-box",
    },
    textarea: {
      width: "100%",
      padding: "12px 16px",
      borderRadius: "10px",
      border: "2px solid #e5e7eb",
      fontSize: "15px",
      minHeight: "100px",
      resize: "vertical",
      outline: "none",
      boxSizing: "border-box",
    },
    select: {
      width: "100%",
      padding: "12px 16px",
      borderRadius: "10px",
      border: "2px solid #e5e7eb",
      fontSize: "15px",
      background: "white",
      cursor: "pointer",
      outline: "none",
      boxSizing: "border-box",
    },
    fileInput: {
      width: "100%",
      padding: "12px",
      borderRadius: "10px",
      border: "2px dashed #e5e7eb",
      background: "#f9fafb",
      cursor: "pointer",
      boxSizing: "border-box",
    },
    chapterCard: {
      background: "#f8fafc",
      borderRadius: "12px",
      padding: "20px",
      marginBottom: "20px",
      border: "2px solid #e2e8f0",
    },
    topicCard: {
      background: "white",
      borderRadius: "10px",
      padding: "15px",
      marginBottom: "15px",
      marginLeft: "15px",
      border: "1px solid #e5e7eb",
    },
    quizCard: {
      background: "#fffbeb",
      borderRadius: "8px",
      padding: "15px",
      marginTop: "10px",
      border: "1px solid #fcd34d",
    },
    addBtn: {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      padding: "12px 24px",
      background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
      color: "white",
      border: "none",
      borderRadius: "10px",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
    },
    deleteBtn: {
      padding: "6px 12px",
      background: "#FEE2E2",
      color: "#DC2626",
      border: "none",
      borderRadius: "6px",
      fontSize: "12px",
      fontWeight: "600",
      cursor: "pointer",
    },
    submitBtn: {
      width: "100%",
      padding: "16px",
      background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
      color: "white",
      border: "none",
      borderRadius: "12px",
      fontSize: "16px",
      fontWeight: "700",
      cursor: "pointer",
      marginTop: "20px",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={{ fontSize: "28px", fontWeight: "700", margin: "0 0 8px 0" }}>
            🎓 Create New Course
          </h1>
          <p style={{ fontSize: "14px", opacity: "0.9", margin: 0 }}>
            Fill in the details below to create an amazing learning experience
          </p>
        </div>

        {/* Stepper */}
        <div style={styles.stepper}>
          {[
            { num: 1, label: "Basic Info" },
            { num: 2, label: "Media Files" },
            { num: 3, label: "Chapters & Quizzes" },
          ].map((s) => (
            <div
              key={s.num}
              onClick={() => setActiveStep(s.num)}
              style={{
                ...styles.step,
                background: activeStep === s.num ? "#4F46E5" : "#e5e7eb",
                color: activeStep === s.num ? "white" : "#6b7280",
              }}
            >
              {s.num}. {s.label}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div style={styles.formContent}>
            {/* Step 1: Basic Info */}
            {activeStep === 1 && (
              <>
                <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#1f2937", marginBottom: "25px" }}>
                  📝 Course Information
                </h3>
                <div style={styles.formGrid}>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={styles.label}>Course Title *</label>
                    <input
                      type="text"
                      name="title"
                      placeholder="Enter an engaging course title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      style={styles.input}
                    />
                  </div>

                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={styles.label}>Description *</label>
                    <textarea
                      name="description"
                      placeholder="Describe what students will learn..."
                      value={formData.description}
                      onChange={handleChange}
                      required
                      style={styles.textarea}
                    />
                  </div>

                  <div>
                    <label style={styles.label}>Category *</label>
                    <input
                      type="text"
                      name="category"
                      placeholder="e.g., Web Development"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      style={styles.input}
                    />
                  </div>

                  <div>
                    <label style={styles.label}>Level *</label>
                    <select name="level" value={formData.level} onChange={handleChange} style={styles.select}>
                      <option value="Beginner">🌱 Beginner</option>
                      <option value="Intermediate">📈 Intermediate</option>
                      <option value="Advance">🚀 Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label style={styles.label}>Duration (hours) *</label>
                    <input
                      type="number"
                      name="duration"
                      placeholder="e.g., 10"
                      value={formData.duration}
                      onChange={handleChange}
                      required
                      style={styles.input}
                    />
                  </div>

                  <div>
                    <label style={styles.label}>Price (₹) *</label>
                    <input
                      type="number"
                      name="price"
                      placeholder="e.g., 999"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      style={styles.input}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "30px" }}>
                  <button
                    type="button"
                    onClick={() => setActiveStep(2)}
                    style={{
                      padding: "12px 30px",
                      background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
                      color: "white",
                      border: "none",
                      borderRadius: "10px",
                      fontSize: "15px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    Next: Media Files →
                  </button>
                </div>
              </>
            )}

            {/* Step 2: Media Files */}
            {activeStep === 2 && (
              <>
                <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#1f2937", marginBottom: "25px" }}>
                  🎬 Media & Resources
                </h3>
                <div style={styles.formGrid}>
                  <div>
                    <label style={styles.label}>📸 Course Thumbnail *</label>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleChange}
                      style={styles.fileInput}
                    />
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{ width: "100%", maxHeight: "150px", objectFit: "cover", borderRadius: "10px", marginTop: "10px" }}
                      />
                    )}
                  </div>

                  <div>
                    <label style={styles.label}>🎥 Preview Video *</label>
                    <input
                      type="file"
                      name="video"
                      accept="video/*"
                      onChange={handleChange}
                      style={styles.fileInput}
                    />
                    <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "8px" }}>
                      This video will be shown as a course preview
                    </p>
                  </div>

                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={styles.label}>📄 Course Notes (PDF) - Optional</label>
                    <input
                      type="file"
                      name="notes"
                      accept="application/pdf"
                      onChange={handleChange}
                      style={styles.fileInput}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "30px" }}>
                  <button
                    type="button"
                    onClick={() => setActiveStep(1)}
                    style={{
                      padding: "12px 30px",
                      background: "#f3f4f6",
                      color: "#374151",
                      border: "1px solid #d1d5db",
                      borderRadius: "10px",
                      fontSize: "15px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveStep(3)}
                    style={{
                      padding: "12px 30px",
                      background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
                      color: "white",
                      border: "none",
                      borderRadius: "10px",
                      fontSize: "15px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    Next: Chapters →
                  </button>
                </div>
              </>
            )}

            {/* Step 3: Chapters & Quizzes */}
            {activeStep === 3 && (
              <>
                <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#1f2937", marginBottom: "25px" }}>
                  📚 Course Content
                </h3>

                <button type="button" onClick={handleAddChapter} style={styles.addBtn}>
                  ➕ Add Chapter
                </button>

                <div style={{ marginTop: "20px" }}>
                  {formData.chapters.map((chapter, chapterIdx) => (
                    <div key={chapterIdx} style={styles.chapterCard}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                        <span style={{ fontSize: "16px", fontWeight: "600", color: "#4F46E5" }}>
                          📖 Chapter {chapterIdx + 1}
                        </span>
                        <button type="button" onClick={() => handleDeleteChapter(chapterIdx)} style={styles.deleteBtn}>
                          🗑️ Delete
                        </button>
                      </div>

                      <input
                        type="text"
                        placeholder="Enter chapter title"
                        value={chapter.title}
                        onChange={(e) => handleChapterChange(chapterIdx, e.target.value)}
                        style={{ ...styles.input, marginBottom: "15px" }}
                      />

                      {chapter.topics.map((topic, topicIdx) => (
                        <div key={topicIdx} style={styles.topicCard}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                            <span style={{ fontWeight: "600", color: "#059669" }}>🎯 Topic {topicIdx + 1}</span>
                            <button
                              type="button"
                              onClick={() => handleDeleteTopic(chapterIdx, topicIdx)}
                              style={{ ...styles.deleteBtn, fontSize: "11px", padding: "4px 8px" }}
                            >
                              Delete
                            </button>
                          </div>

                          <input
                            type="text"
                            placeholder="Topic title"
                            value={topic.title}
                            onChange={(e) => handleTopicChange(chapterIdx, topicIdx, "title", e)}
                            style={{ ...styles.input, marginBottom: "10px" }}
                          />

                          <label style={{ ...styles.label, fontSize: "13px" }}>Topic Video</label>
                          <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => handleTopicChange(chapterIdx, topicIdx, "video", e)}
                            style={{ ...styles.fileInput, marginBottom: "10px" }}
                          />

                          {/* Quiz Section */}
                          <div style={{ marginTop: "15px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                              <span style={{ fontWeight: "600", color: "#D97706", fontSize: "14px" }}>📝 Quiz Questions</span>
                              <button
                                type="button"
                                onClick={() => handleAddQuestion(chapterIdx, topicIdx)}
                                style={{
                                  padding: "6px 12px",
                                  background: "#E0E7FF",
                                  color: "#4F46E5",
                                  border: "none",
                                  borderRadius: "6px",
                                  fontSize: "12px",
                                  fontWeight: "600",
                                  cursor: "pointer",
                                }}
                              >
                                ➕ Add Question
                              </button>
                            </div>

                            {topic.quiz.map((q, quizIdx) => (
                              <div key={quizIdx} style={styles.quizCard}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                                  <span style={{ fontWeight: "600", fontSize: "13px" }}>Question {quizIdx + 1}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteQuestion(chapterIdx, topicIdx, quizIdx)}
                                    style={{ ...styles.deleteBtn, fontSize: "10px", padding: "3px 6px" }}
                                  >
                                    Delete
                                  </button>
                                </div>

                                <input
                                  type="text"
                                  placeholder="Enter your question"
                                  value={q.question}
                                  onChange={(e) => {
                                    const newChapters = [...formData.chapters];
                                    newChapters[chapterIdx].topics[topicIdx].quiz[quizIdx].question = e.target.value;
                                    setFormData({ ...formData, chapters: newChapters });
                                  }}
                                  style={{ ...styles.input, marginBottom: "10px" }}
                                />

                                <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "8px" }}>Select the correct answer:</p>

                                {q.options.map((option, optIdx) => (
                                  <div key={optIdx} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                                    <input
                                      type="radio"
                                      name={`correct-${chapterIdx}-${topicIdx}-${quizIdx}`}
                                      checked={q.correctOption === option && option !== ""}
                                      onChange={() => handleQuizCorrectOption(null, chapterIdx, topicIdx, quizIdx, option)}
                                      style={{ width: "18px", height: "18px", cursor: "pointer" }}
                                    />
                                    <input
                                      type="text"
                                      placeholder={`Option ${optIdx + 1}`}
                                      value={option}
                                      onChange={(e) => handleQuizOptionChange(e, chapterIdx, topicIdx, quizIdx, optIdx)}
                                      style={{ flex: 1, padding: "8px 12px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "14px" }}
                                    />
                                  </div>
                                ))}

                                <input
                                  type="text"
                                  placeholder="Explanation (shown after answering)"
                                  value={q.explaination}
                                  onChange={(e) => {
                                    const newChapters = [...formData.chapters];
                                    newChapters[chapterIdx].topics[topicIdx].quiz[quizIdx].explaination = e.target.value;
                                    setFormData({ ...formData, chapters: newChapters });
                                  }}
                                  style={{ ...styles.input, marginTop: "10px" }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => handleAddTopic(chapterIdx)}
                        style={{
                          marginTop: "10px",
                          padding: "8px 16px",
                          background: "#E0E7FF",
                          color: "#4F46E5",
                          border: "none",
                          borderRadius: "8px",
                          fontSize: "13px",
                          fontWeight: "600",
                          cursor: "pointer",
                        }}
                      >
                        ➕ Add Topic
                      </button>
                    </div>
                  ))}
                </div>

                {/* Flashcard Option */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "15px",
                    background: "#F0FDF4",
                    borderRadius: "10px",
                    marginTop: "20px",
                  }}
                >
                  <input
                    type="checkbox"
                    id="createFlashcards"
                    checked={createFlashcards}
                    onChange={(e) => setCreateFlashcards(e.target.checked)}
                    style={{ width: "20px", height: "20px", cursor: "pointer" }}
                  />
                  <label htmlFor="createFlashcards" style={{ fontSize: "14px", color: "#166534" }}>
                    🃏 After creating, redirect to Flashcards to create a study deck
                  </label>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "30px" }}>
                  <button
                    type="button"
                    onClick={() => setActiveStep(2)}
                    style={{
                      padding: "12px 30px",
                      background: "#f3f4f6",
                      color: "#374151",
                      border: "1px solid #d1d5db",
                      borderRadius: "10px",
                      fontSize: "15px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    ← Back
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    ...styles.submitBtn,
                    opacity: loading ? 0.7 : 1,
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                >
                  {loading ? "⏳ Creating Course..." : "🚀 Create Course"}
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCourse;
