import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/teacher/AddCourse.css";

const AddCourse = () => {
  const token = localStorage.getItem("token");

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

    setFormData(() => {
      return {
        ...formData,
        [name]: files ? files[0] : value,
      };
    });
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

  const handleQuizCorrectOption = (
    chapterIdx,
    topicIdx,
    quizIdx,
    quizOptionIdx
  ) => {
    const newChapters = [...formData.chapters];
    newChapters[chapterIdx].topics[topicIdx].quiz[quizIdx].correctOption =
      quizOptionIdx;

    setFormData({
      ...formData,
      chapters: newChapters,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-heading">Add New Course</h2>
      <form className="course-form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label>Title</label>
          <input
            type="text"
            name="title"
            placeholder="Course Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field">
          <label>Description</label>
          <textarea
            name="description"
            placeholder="Course Description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field">
          <label>Category</label>
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>

        <div className="fields-grid">
          <div className="form-field">
            <label>Level</label>
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advance">Advance</option>
            </select>
          </div>
          <div className="form-field">
            <label>Duration (hours)</label>
            <input
              type="number"
              name="duration"
              placeholder="Duration"
              value={formData.duration}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-field">
          <label>Price (₹)</label>
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field">
          <label>Notes (PDF)</label>
          <input
            type="file"
            name="notes"
            accept="application/pdf"
            onChange={handleChange}
          />
        </div>

        <div className="fields-grid">
          <div className="form-field">
            <label>Preview Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <label>Preview Video</label>
            <input
              type="file"
              name="video"
              accept="video/*"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="ghost-btn" onClick={handleAddChapter}>
            + Add Chapter
          </button>
        </div>

        {formData.chapters.map((chapter, chapterIdx) => (
          <section className="chapter-card" key={chapterIdx}>
            <div className="chapter-card-header">
              <div>
                <h3>Chapter {chapterIdx + 1}</h3>
                <p className="form-note">Give this chapter a clear, short title.</p>
              </div>
              <button
                type="button"
                className="ghost-btn ghost-btn--small"
                onClick={() => handleAddTopic(chapterIdx)}
              >
                + Add Topic
              </button>
            </div>

            <div className="form-field">
              <label>Chapter Title</label>
              <input
                type="text"
                placeholder="Chapter title"
                value={chapter.title}
                onChange={(e) => handleChapterChange(chapterIdx, e.target.value)}
              />
            </div>

            {chapter.topics.map((topic, topicIdx) => (
              <div className="topic-card" key={topicIdx}>
                <div className="chapter-card-header">
                  <div>
                    <h4>Topic {topicIdx + 1}</h4>
                    <p className="form-note">Explain what to cover & link resources.</p>
                  </div>
                  <button
                    type="button"
                    className="ghost-btn ghost-btn--small"
                    onClick={() => handleAddQuestion(chapterIdx, topicIdx)}
                  >
                    + Add Question
                  </button>
                </div>

                <div className="form-field">
                  <label>Topic Title</label>
                  <input
                    type="text"
                    placeholder="Enter topic title"
                    value={topic.title}
                    onChange={(e) =>
                      handleTopicChange(chapterIdx, topicIdx, "title", e)
                    }
                  />
                </div>

                <div className="form-field">
                  <label>Topic Video</label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) =>
                      handleTopicChange(chapterIdx, topicIdx, "video", e)
                    }
                  />
                </div>

                <div className="topic-quiz">
                  <p className="form-note">Add quiz questions for this topic.</p>
                  {topic.quiz.map((q, quizIdx) => (
                    <div className="quiz-card" key={quizIdx}>
                      <div className="form-field">
                        <label>Question Text</label>
                        <input
                          type="text"
                          placeholder="Enter question"
                          value={q.question}
                          onChange={(e) => {
                            const newChapters = [...formData.chapters];
                            newChapters[chapterIdx].topics[topicIdx].quiz[
                              quizIdx
                            ].question = e.target.value;

                            setFormData({
                              ...formData,
                              chapters: newChapters,
                            });
                          }}
                        />
                      </div>

                      <div className="quiz-options">
                        {q.options.map((option, quizOptionIdx) => (
                          <div className="quiz-option" key={quizOptionIdx}>
                            <label className="radio-label">
                              <input
                                type="radio"
                                name={`correct-${chapterIdx}-${topicIdx}-${quizIdx}`}
                                checked={
                                  q.correctOption === quizOptionIdx
                                }
                                onChange={() =>
                                  handleQuizCorrectOption(
                                    chapterIdx,
                                    topicIdx,
                                    quizIdx,
                                    quizOptionIdx
                                  )
                                }
                              />
                              Correct
                            </label>
                            <input
                              type="text"
                              placeholder={`Enter option ${quizOptionIdx + 1}`}
                              value={option}
                              onChange={(e) =>
                                handleQuizOptionChange(
                                  e,
                                  chapterIdx,
                                  topicIdx,
                                  quizIdx,
                                  quizOptionIdx
                                )
                              }
                            />
                          </div>
                        ))}
                      </div>

                      <div className="form-field">
                        <label>Explanation</label>
                        <input
                          type="text"
                          placeholder="Enter explanation"
                          value={q.explaination}
                          onChange={(e) => {
                            const newChapters = [...formData.chapters];
                            newChapters[chapterIdx].topics[topicIdx].quiz[
                              quizIdx
                            ].explaination = e.target.value;

                            setFormData({
                              ...formData,
                              chapters: newChapters,
                            });
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>
        ))}

        <label className="form-checkbox">
          <input
            type="checkbox"
            id="createFlashcards"
            checked={createFlashcards}
            onChange={(e) => setCreateFlashcards(e.target.checked)}
          />
          After creating the course, go to Flashcards to create a deck
        </label>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Add Course
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCourse;
