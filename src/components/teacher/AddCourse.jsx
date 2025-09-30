import { useEffect, useState } from "react";
import "../../css/teacher/AddCourse.css";

const AddCourse = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    level: "Beginner",
    duration: "",
    price: "",
    image: null,
    video: null,
    teacher: "",
    chapters: [],
  });
  const [searchTeacher, setSearchTeacher] = useState("");
  const [searchStudent, setSearchStudent] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData(() => {
      return {
        ...formData,
        [name]: files ? files[0] : value,
      };
    });
  };

  const handleSearchChangeTeacher = (e) => {
    setSearchTeacher(e.target.value);
  };

  const handleSearchChangeStudent = (e) => {
    setSearchStudent(e.target.value);
  };

  useEffect(() => {
    async function fetchTeachers() {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/teacher`
      );
      const data = await response.json();
      setTeachers(data.data);
    }

    fetchTeachers();
  }, []);

  useEffect(() => {
    async function fetchStudents() {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/student`
      );
      const data = await response.json();
      setStudents(data.data);
    }

    fetchStudents();
  }, []);

  const filterdTeachers = teachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(searchTeacher.toLowerCase())
  );

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchStudent.toLowerCase())
  );

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
      topics: [...newChapters[chapterIdx].topics, { title: "", video: "" }],
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
          body: data,
        }
      );
      const coursesResponse = await response.json();

      if (response.ok) {
        window.location.href = "/teacher/courses"
      }
    } catch (err) {
      console.log("error occured", err);
    }
  };

  return (
    <div className="form-overlay">
      <div className="form-container">
        <h2>Add New Course</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Course Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Course Description"
            value={formData.description}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            required
          />
          <select name="level" value={formData.level} onChange={handleChange}>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advance">Advance</option>
          </select>
          <input
            type="number"
            name="duration"
            placeholder="Duration (in hours)"
            value={formData.duration}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price (₹)"
            value={formData.price}
            onChange={handleChange}
            required
          />
          <label>Preview Image:</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
          />
          <label>Course Video:</label>
          <input
            type="file"
            name="video"
            accept="video/*"
            onChange={handleChange}
          />
          <input
            type="text"
            onChange={handleSearchChangeTeacher}
            value={searchTeacher}
            placeholder="Search teacher"
          />
          <select name="teacher" onChange={handleChange}>
            <option>Select Teacher</option>
            {filterdTeachers.map((teacher) => (
              <option value={teacher._id} key={teacher._id}>
                {teacher.name}
              </option>
            ))}
          </select>
          <div className="">
            <button type="button" onClick={handleAddChapter}>
              Add Chapter
            </button>
          </div>
          {formData.chapters.map((chapter, chapterIdx) => (
            <div
              key={chapterIdx}
              style={{
                boxShadow: "0 0 12px rgba(0, 0, 0, 0.2)",
                marginBottom: "20px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <input
                onChange={(e) =>
                  handleChapterChange(chapterIdx, e.target.value)
                }
                value={chapter.title}
                style={{
                  width: "20rem",
                }}
                type="text"
                placeholder="Enter title"
              />
              {chapter.topics.map((topic, topicIdx) => (
                <div
                  key={topicIdx}
                  style={{
                    boxShadow: "0 0 12px rgba(0, 0, 0, 0.2)",
                    marginBottom: "10px",
                  }}
                >
                  <input
                    onChange={(e) =>
                      handleTopicChange(chapterIdx, topicIdx, "title", e)
                    }
                    value={topic.title}
                    style={{
                      width: "20rem",
                    }}
                    type="text"
                    placeholder="Enter title"
                  />
                  <input
                    onChange={(e) =>
                      handleTopicChange(chapterIdx, topicIdx, "video", e)
                    }
                    accept="video/*"
                    style={{
                      width: "20rem",
                    }}
                    type="file"
                  />
                </div>
              ))}
              <button onClick={() => handleAddTopic(chapterIdx)} type="button">
                Add Topic
              </button>
            </div>
          ))}

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              
            >
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Add Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCourse;
