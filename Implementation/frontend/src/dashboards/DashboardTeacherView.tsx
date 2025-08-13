import AccountDropdown from "components/AccountDropdown";
import { useEffect, useState } from "react";
import { LuUser, LuX } from "react-icons/lu";
import useAuthStore from "stores/AuthStore";
import LessonDialog from "./components/LessonDialog";
import { Link } from "react-router-dom";

interface Student {
  username: string;
  firstName: string;
  lastName: string;
  teacherId: string;
}

interface Lesson {
  ID?: number;
  Date: string;
  Notes: string;
  teacherId: string;
  studentId: string;
}

function DashboardTeacherView() {
  const [students, setStudents] = useState<Student[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // teacher username to filter studnets
  const username = useAuthStore((state) => state.username);
  const token = useAuthStore((state) => state.token);

  // selected student for showing his details
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const closePanel = () => {
    setSelectedStudent(null);
    setSelectedLesson(null);
    setIsCreatingLesson(false);
  };

  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isCreatingLesson, setIsCreatingLesson] = useState(false);

  useEffect(() => {
    async function fetchStudents() {
      try {
        const response = await fetch("http://localhost:3001/students", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch students");
        }
        const data: Student[] = await response.json();
        setStudents(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchStudents();
  }, [token]);

  async function fetchLessons(student: Student) {
    try {
      const response = await fetch(
        `http://localhost:3001/students/${student.username}/lessons`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch lessons");
      const data: Lesson[] = await response.json();
      setLessons(data);
    } catch (err: any) {
      setError(err.message);
    }
  }

  const myStudents = students.filter(
    (student) => student.teacherId === username
  );

  const handleLessonCreated = () => {
    if (selectedStudent) {
      fetchLessons(selectedStudent);
    }
  };

  if (loading) {
    return <p className="mt-10 text-center">Loading students...</p>;
  }

  if (error) {
    console.log(error);
    return (
      <>
        <p className="mt-10 text-center text-red-500">Error</p>
        <Link to="../" className="text-center bg-gray-300 rounded ">
          Click to go back!
        </Link>
      </>
    );
  }

  const emptyLesson: Lesson = {
    Date: new Date().toISOString(),
    Notes: "",
    teacherId: username!,
    studentId: selectedStudent ? selectedStudent.username : "",
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gradient-to-b from-zinc-50 to-zinc-100">
      {/* main content wrapper */}

      <p className="flex items-center justify-center px-16 py-10 text-4xl font-extrabold w-fit">
        Teacher Dashboard
      </p>

      <AccountDropdown />

      <div className="flex flex-col items-center justify-center w-full gap-5">
        <div className="w-fit">
          <p className="text-lg font-medium text-gray-500">MY STUDENTS:</p>
          <div className="w-[70rem] gap-5 flex-row flex">
            {myStudents.map((student) => (
              <div
                key={student.username}
                className="bg-gray-200 w-[150px] h-[150px] flex items-center justify-center rounded shadow hover:bg-gray-300  hover:cursor-pointer transition"
                onClick={() => {
                  setSelectedStudent(student);
                  fetchLessons(student);
                }}
              >
                {
                  <div className="flex flex-col items-center justify-center gap-3 text-gray-400">
                    <LuUser size={70} />
                    <p>{student.firstName}</p>
                  </div>
                }
              </div>
            ))}
          </div>
        </div>

        <div className="w-fit">
          <p className="text-lg font-medium text-gray-500">ALL STUDENTS:</p>
          <div className="w-[70rem] max-h-[18rem] overflow-y-auto p-2 rounded border">
            <ul className="space-y-1 border-none">
              {students.map((student) => (
                <li
                  key={student.username}
                  className="flex items-center h-10 px-3 transition bg-gray-200 hover:bg-gray-300 hover:cursor-pointer"
                  onClick={() => {
                    setSelectedStudent(student);
                    fetchLessons(student);
                  }}
                >
                  {student.firstName + " " + student.lastName}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Slide-in panel, only render when a student is selected */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={closePanel}
          />
          {/* Panel */}
          <div className="relative w-3/4 h-full max-w-4xl translate-x-0 bg-white">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="flex items-center gap-3 text-2xl font-semibold">
                <LuUser />
                {selectedStudent.firstName} {selectedStudent.lastName}
              </h2>
              <button
                onClick={closePanel}
                className="p-1 rounded hover:bg-gray-200"
              >
                <LuX size={24} />
              </button>
            </div>
            <div className="p-6">
              {/* Panel Content */}
              <div className="flex flex-row gap-5">
                <div className="">
                  <p className="mb-3 text-lg font-medium text-gray-500">
                    LESSONS:
                  </p>
                  <ul className="w-40 space-y-1 border-none">
                    {lessons.length > 0 ? (
                      lessons.map((lesson) => (
                        <li
                          key={lesson.ID}
                          className="flex items-center h-10 px-3 transition bg-gray-200 hover:bg-gray-300 hover:cursor-pointer"
                          onClick={() => {
                            setSelectedLesson(lesson);
                            setIsCreatingLesson(false);
                          }}
                        >
                          {new Date(lesson.Date).toLocaleDateString()}
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-400">No lessons found</li>
                    )}
                    <li
                      className="flex items-center justify-center h-10 px-3 text-2xl font-bold text-gray-400 transition border border-gray-400 border-dotted hover:bg-gray-100 hover:cursor-pointer"
                      onClick={() => {
                        setSelectedLesson(null);
                        setIsCreatingLesson(true);
                      }}
                    >
                      +
                    </li>
                  </ul>
                </div>
                {isCreatingLesson ? (
                  <div className="flex flex-col w-full ">
                    <p className="mb-3 text-lg font-medium text-gray-500">
                      ADD NEW LESSON:
                    </p>
                    <LessonDialog
                      selectedLesson={emptyLesson}
                      isNew={true}
                      onLessonCreated={handleLessonCreated}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col w-full ">
                    <p className="mb-3 text-lg font-medium text-gray-500">
                      LESSONS DETAILS:
                    </p>

                    {selectedLesson ? (
                      <LessonDialog
                        selectedLesson={selectedLesson}
                        isNew={false}
                      />
                    ) : (
                      <p className="italic text-gray-500">
                        Select a lesson to see details
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default DashboardTeacherView;
