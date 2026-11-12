
import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const API = 'http://localhost:5000/api/courses';

const INITIAL_COURSES = [
  {
    _id: '1',
    title: 'Full Stack Web Development',
    instructor: 'Sakthi Priya',
    duration: '12 Weeks',
    price: 4999
  },
  {
    _id: '2',
    title: 'Modern React & Vite Mastery',
    instructor: 'Sanju Ponnusamy',
    duration: '8 Weeks',
    price: 3499
  },
  {
    _id: '3',
    title: 'Node.js & MongoDB Backend Architecture',
    instructor: 'Dr. Ramesh Kumar',
    duration: '10 Weeks',
    price: 3999
  }
];

function App() {
  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem('coursehub_courses');
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });
  const [form, setForm] = useState({
    title: '',
    instructor: '',
    duration: '',
    price: ''
  });
  const [editId, setEditId] = useState(null);

  const loadCourses = async () => {
    try {
      const res = await axios.get(API, { timeout: 2000 });
      if (Array.isArray(res.data) && res.data.length > 0) {
        setCourses(res.data);
        localStorage.setItem('coursehub_courses', JSON.stringify(res.data));
      }
    } catch {
      console.log('Backend not active; running in client demo mode with local storage.');
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveCourse = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await axios.put(`${API}/${editId}`, {
          ...form,
          price: Number(form.price)
        }, { timeout: 2000 });
        loadCourses();
      } else {
        await axios.post(API, {
          ...form,
          price: Number(form.price)
        }, { timeout: 2000 });
        loadCourses();
      }
    } catch {
      if (editId) {
        const updated = courses.map(c => 
          c._id === editId 
            ? { ...c, ...form, price: Number(form.price) } 
            : c
        );
        setCourses(updated);
        localStorage.setItem('coursehub_courses', JSON.stringify(updated));
      } else {
        const newCourse = {
          _id: Date.now().toString(),
          ...form,
          price: Number(form.price)
        };
        const updated = [newCourse, ...courses];
        setCourses(updated);
        localStorage.setItem('coursehub_courses', JSON.stringify(updated));
      }
    }

    setForm({ title: '', instructor: '', duration: '', price: '' });
    setEditId(null);
  };

  const editCourse = (course) => {
    setForm({
      title: course.title,
      instructor: course.instructor,
      duration: course.duration,
      price: course.price
    });
    setEditId(course._id);
  };

  const deleteCourse = async (id) => {
    try {
      await axios.delete(`${API}/${id}`, { timeout: 2000 });
      loadCourses();
    } catch {
      const updated = courses.filter(c => c._id !== id);
      setCourses(updated);
      localStorage.setItem('coursehub_courses', JSON.stringify(updated));
    }
  };

  return (
    <div className="container">
      <h1>Online Course Management</h1>
      <p>Manage your courses in one place</p>

      <form onSubmit={saveCourse}>
        <input name="title" placeholder="Course Name"
          value={form.title} onChange={handleChange} required />

        <input name="instructor" placeholder="Instructor Name"
          value={form.instructor} onChange={handleChange} required />

        <input name="duration" placeholder="Duration"
          value={form.duration} onChange={handleChange} required />

        <input name="price" type="number" min="0"
          placeholder="Price" value={form.price}
          onChange={handleChange} required />

        <button type="submit">
          {editId ? 'Update Course' : 'Add Course'}
        </button>
      </form>

      <h2>Available Courses</h2>

      {courses.length === 0 && <p>No courses available yet.</p>}

      {courses.map(course => (
        <div className="course" key={course._id}>
          <h3>{course.title}</h3>
          <p>Instructor: {course.instructor}</p>
          <p>Duration: {course.duration}</p>
          <p>Price: ₹{course.price}</p>
          <button onClick={() => editCourse(course)}>Edit</button>
          <button onClick={() => deleteCourse(course._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default App;
