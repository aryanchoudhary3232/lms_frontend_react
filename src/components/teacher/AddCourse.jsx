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
    <div
      className="form-container"
      style={{
        width: "50vw",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: "2px",
        boxShadow: "0 0 12px rgba(0,0,0,0.2)",
        borderRadius: "12px",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          color: "white",
          background: "#2337ad",
          height: "3rem",
          paddingTop: "16px",
          marginTop: "0",
          borderRadius: "12px",
          marginLeft: "47px",
          marginRight: "50px",
        }}
      >
        {" "}
        Add New Course
      </h2>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          paddingLeft: "12px",
          paddingRight: "12px",
        }}
      >
        <label
          style={{
            marginLeft: "42px",
            marginBottom: "9px",
          }}
        >
          Title
        </label>
        <input
          type="text"
          name="title"
          placeholder="Course Title"
          value={formData.title}
          onChange={handleChange}
          required
          style={{
            height: "26px",
            margin: "0 42px 12px 42px",
            padding: "5px",
            borderRadius: "5px",
          }}
        />
        <label
          style={{
            marginLeft: "42px",
            marginBottom: "9px",
          }}
          htmlFor=""
        >
          Description
        </label>
        <textarea
          name="description"
          placeholder="Course Description"
          value={formData.description}
          onChange={handleChange}
          required
          style={{
            height: "26px",
            margin: "0 42px 12px 42px",
            padding: "5px",
            borderRadius: "5px",
          }}
        />
        <label
          style={{
            marginLeft: "42px",
            marginBottom: "9px",
          }}
          htmlFor=""
        >
          Category
        </label>
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          required
          style={{
            height: "26px",
            margin: "0 42px 12px 42px",
            padding: "5px",
            borderRadius: "5px",
          }}
        />
        <label
          style={{
            marginLeft: "42px",
            marginBottom: "9px",
          }}
          htmlFor=""
        >
          Level
        </label>
        <select
          name="level"
          value={formData.level}
          onChange={handleChange}
          style={{
            height: "41px",
            margin: "0 42px 12px 42px",
            padding: "5px",
            borderRadius: "5px",
          }}
        >
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advance">Advance</option>
        </select>
        <label
          style={{
            marginLeft: "42px",
            marginBottom: "9px",
          }}
          htmlFor=""
        >
          Duration
        </label>
        <input
          type="number"
          name="duration"
          placeholder="Duration (in hours)"
          value={formData.duration}
          onChange={handleChange}
          required
          style={{
            height: "26px",
            margin: "0 42px 12px 42px",
            padding: "5px",
            borderRadius: "5px",
          }}
        />
        <label
          style={{
            marginLeft: "42px",
            marginBottom: "9px",
          }}
          htmlFor=""
        >
          Price
        </label>
        <input
          type="number"
          name="price"
          placeholder="Price (₹)"
          value={formData.price}
          onChange={handleChange}
          required
          style={{
            height: "26px",
            margin: "0 42px 12px 42px",
            padding: "5px",
            borderRadius: "5px",
          }}
        />
        <label
          style={{
            marginLeft: "42px",
            marginBottom: "9px",
          }}
          htmlFor=""
        >
          Notes (PDF)
        </label>
        <input
          type="file"
          name="notes"
          accept="application/pdf"
          onChange={handleChange}
          style={{
            margin: "0 42px 12px 42px",
          }}
        />
        <label
          style={{
            marginLeft: "42px",
            marginBottom: "9px",
          }}
        >
          Preview Image
        </label>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          style={{
            height: "26px",
            margin: "0 42px 12px 42px",
            padding: "5px",
            borderRadius: "5px",
          }}
        />
        <label
          style={{
            marginLeft: "42px",
            marginBottom: "9px",
          }}
        >
          Preview Video
        </label>
        <input
          type="file"
          name="video"
          accept="video/*"
          onChange={handleChange}
          style={{
            height: "26px",
            margin: "0 42px 12px 42px",
            padding: "5px",
            borderRadius: "5px",
          }}
        />

        <button
          type="button"
          onClick={handleAddChapter}
          style={{
            height: "41px",
            margin: "0 42px 12px 42px",
            padding: "5px",
            borderRadius: "5px",
          }}
        >
          Add Chapter
        </button>
        {formData.chapters.map((chapter, chapterIdx) => (
          <div
            key={chapterIdx}
            style={{
              margin: "0 42px 0px 42px",
              padding: "5px",
              borderRadius: "5px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <label
              htmlFor=""
              style={{
                marginBottom: "10px",
              }}
            >
              Chapter Title
            </label>
            <input
              onChange={(e) => handleChapterChange(chapterIdx, e.target.value)}
              value={chapter.title}
              style={{
                height: "26px",
                margin: "0 0 12px 0",
                padding: "11px 3px",
                borderRadius: "5px"
              }}
              type="text"
              placeholder="Chapter title"
            />
            {chapter.topics.map((topic, topicIdx) => (
              <div
                key={topicIdx}
                style={{
                  marginBottom: "10px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <label
                  htmlFor=""
                  style={{
                    marginBottom: "10px",
                  }}
                >
                  Topic Title
                </label>
                <input
                  onChange={(e) =>
                    handleTopicChange(chapterIdx, topicIdx, "title", e)
                  }
                  value={topic.title}
                  style={{
                    height: "26px",
                    margin: "0 0 12px 0",
                    padding: "9px 3px",
                    borderRadius: "5px"
                  }}
                  type="text"
                  placeholder="Enter title"
                />
                <label
                  htmlFor=""
                  style={{
                    marginBottom: "3px",
                  }}
                >
                  Topic Video
                </label>
                <input
                  onChange={(e) =>
                    handleTopicChange(chapterIdx, topicIdx, "video", e)
                  }
                  accept="video/*"
                  style={{
                    height: "26px",
                    margin: "0 0 -4px 0",
                    padding: "11px 3px",
                    borderRadius: "5px"
                  }}
                  type="file"
                />
                <label
                  htmlFor=""
                  style={{
                    marginBottom: "12px",
                  }}
                >
                  Quiz
                </label>
                {topic.quiz.map((q, quizIdx) => (
                  <div
                    key={quizIdx}
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <label
                      style={{
                        marginBottom: "11px",
                      }}
                      htmlFor=""
                    >
                      Question Text
                    </label>
                    <input
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
                      value={q.question}
                      style={{
                        height: "26px",
                        margin: "0 0 14px 0",
                        padding: "9px 3px",
                        borderRadius: "5px"
                      }}
                      type="text"
                      name=""
                      id=""
                      placeholder="Enter question"
                    />
                    {q.options.map((option, quizOptionIdx) => (
                      <label
                        key={quizOptionIdx}
                        htmlFor=""
                        style={{ marginBottom: "5px" }}
                      >
                        <input
                          onChange={(e) =>
                            handleQuizCorrectOption(
                              e,
                              chapterIdx,
                              topicIdx,
                              quizIdx,
                              option
                            )
                          }
                          type="radio"
                          name=""
                          id=""
                        />
                        <input
                          onChange={(e) =>
                            handleQuizOptionChange(
                              e,
                              chapterIdx,
                              topicIdx,
                              quizIdx,
                              quizOptionIdx
                            )
                          }
                          value={option}
                          style={{
                            height: "26px",
                            margin: "0 0 14px 5px",
                            padding: "6px 3px",
                            borderRadius: "5px"
                          }}
                          type="text"
                          placeholder={`Enter option ${quizOptionIdx + 1}`}
                        />
                      </label>
                    ))}

                    <label
                      style={{
                        marginBottom: "11px",
                      }}
                      htmlFor=""
                    >
                      Explaination
                    </label>
                    <input
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
                      style={{
                        height: "26px",
                        margin: "0 0 9px 0",
                        padding: "9px 3px",
                        borderRadius: "5px"
                      }}
                      type="text"
                      name=""
                      id=""
                      placeholder="Enter Explaination"
                    />
                  </div>
                ))}
                <button
                  onClick={() => handleAddQuestion(chapterIdx, topicIdx)}
                  type="button"
                  style={{
                    padding: "12px 5px",
                    borderRadius: "5px",
                    marginBottom: "12px",
                    width: "122px",
                  }}
                >
                  Add Question
                </button>
              </div>
            ))}
            <button
              onClick={() => handleAddTopic(chapterIdx)}
              type="button"
              style={{
                padding: "12px 5px",
                borderRadius: "5px",
                marginBottom: "12px",
              }}
            >
              Add Topic
            </button>
          </div>
        ))}
        <div style={{
            display: "flex",
            alignItems: "center",
            margin: "0 42px 12px 42px",
            gap: "8px"
        }}>
          <input
            type="checkbox"
            id="createFlashcards"
            checked={createFlashcards}
            onChange={(e) => setCreateFlashcards(e.target.checked)}
          />
          <label htmlFor="createFlashcards" style={{ fontSize: "0.9rem" }}>
            After creating the course, go to Flashcards to create a deck
          </label>
        </div>
        <button
          type="submit"
          style={{
            height: "41px",

            padding: "5px 6px",
            background: "#2337ad",
            color: "white",
            borderRadius: "5px",
            margin: "10px 43px",
          }}
        >
          Add Course
        </button>
      </form>
    </div>
  );
};

export default AddCourse;
