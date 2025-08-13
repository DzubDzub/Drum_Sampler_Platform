import AccountDropdown from "components/AccountDropdown";
import { useEffect, useState } from "react";
import { LuUser, LuX } from "react-icons/lu";
import useAuthStore from "stores/AuthStore";

interface Student {
  username: string;
  firstName: string;
  lastName: string;
  teacherId: string;
}

interface Lesson {
  ID: number;
  Date: string;
  Notes: string;
  teacherId: string;
  studentId: string;
}

function DashboardStudentView() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // teacher username to filter studnets
  const username = useAuthStore((state) => state.username);
  const token = useAuthStore((state) => state.token);

  const closePanel = () => {
    setSelectedLesson(null);
  };

  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    async function fetchLessons() {
      try {
        const response = await fetch(
          `http://localhost:3001/students/${username}/lessons`,
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
      } finally {
        setLoading(false);
      }
    }
    fetchLessons();
  }, [username, token]);

  if (loading) {
    return <p className="mt-10 text-center">Loading lessons...</p>;
  }

  if (error) {
    return <p className="mt-10 text-center text-red-500">Error</p>;
  }

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gradient-to-b from-zinc-50 to-zinc-100">
      {/* main content wrapper */}

      <p className="flex items-center justify-center px-16 py-10 text-4xl font-extrabold w-fit">
        Student Dashboard
      </p>

      <AccountDropdown />

      <div className="flex flex-col items-center justify-center w-full gap-5">
        <div className="w-fit">
          <p className="text-lg font-medium text-gray-500">MY LESSONS:</p>
          <div className="w-[70rem] max-h-[18rem] overflow-y-auto p-2 rounded border">
            <ul className="space-y-1 border-none">
              {lessons.map((lesson) => (
                <li
                  key={lesson.ID}
                  className="flex items-center h-10 px-3 transition bg-gray-200 hover:bg-gray-300 hover:cursor-pointer"
                  onClick={() => setSelectedLesson(lesson)}
                >
                  {new Date(lesson.Date).toLocaleDateString() +
                    " - " +
                    lesson.teacherId}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Slide-in panel, only render when a student is selected */}
      {selectedLesson && (
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
                {username}
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
                    LESSONS DETAILS:
                  </p>

                  {selectedLesson ? (
                    <div className="flex flex-col gap-2">
                      <p className="p-2 bg-gray-200">ID: {selectedLesson.ID}</p>
                      <p className="p-2 bg-gray-200 ">
                        Date:{" "}
                        {new Date(selectedLesson.Date).toLocaleDateString()}
                      </p>
                      <p className="p-2 bg-gray-200">
                        Notes: {selectedLesson.Notes}
                      </p>
                      <p className="p-2 bg-gray-200">
                        Teacher: {selectedLesson.teacherId}
                      </p>
                    </div>
                  ) : (
                    <p className="italic text-gray-500">
                      Select a lesson to see details
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default DashboardStudentView;
