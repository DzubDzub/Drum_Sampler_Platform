import React, { useEffect, useState } from "react";
import useAuthStore from "stores/AuthStore";

interface Lesson {
  ID?: number;
  Date: string;
  Notes: string;
  teacherId: string;
  studentId: string;
}

interface Homework {
  ID?: number;
  Description: string;
  isSubmittable: boolean;
  lessonId: number;
}

function LessonDialog({
  selectedLesson,
  isNew,
  onLessonCreated,
}: {
  selectedLesson: Lesson;
  isNew: Boolean;
  onLessonCreated?: () => void;
}) {
  const token = useAuthStore((state) => state.token);
  const [lesson, setLesson] = useState<Lesson>(selectedLesson);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [homeworkForLesson, setHomeworkForLesson] = useState<Homework[]>();
  const [newHomework, setNewHomework] = useState<Homework[]>([]);

  useEffect(() => {
    setLesson(selectedLesson);
  }, [selectedLesson]);

  async function submitHomeworkChanges(homeworkList: Homework[]) {
    for (const homework of homeworkList) {
      if (!homework.ID) {
        //create new homework
        await fetch("http://localhost:3001/homework", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Description: homework.Description,
            isSubmittable: homework.isSubmittable,
            lessonId: homework.lessonId,
          }),
        });
      } else {
        //update existing homework
        await fetch(`http://localhost:3001/homework/${homework.ID}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Description: homework.Description,
            isSubmittable: homework.isSubmittable,
            lessonId: homework.lessonId,
          }),
        });
      }
    }
  }

  async function submitLesson() {
    setIsSubmitting(true);
    setSuccessMessage("");
    try {
      const method = isNew ? "POST" : "PATCH";
      const url = isNew
        ? "http://localhost:3001/lessons"
        : `http://localhost:3001/lessons/${lesson.ID}`;

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(lesson),
      });

      if (!response.ok) throw new Error("Failed to submit lesson");

      const isJson = response.headers
        .get("content-type")
        ?.includes("application/json");
      const data = isJson ? await response.json() : null;
      if (data) {
        console.log("Lesson submitted:", data);
      }

      const returnedLessonId = isNew && data?.ID ? data.ID : lesson.ID;
      if (isNew && data?.ID) {
        setLesson((prev) => ({ ...prev, ID: data.ID }));
      }

      if (returnedLessonId) {
        console.log("Submitting homework with lessonId:", returnedLessonId);
        const homeworkToSubmit = newHomework.map((hw) => ({
          ...hw,
          lessonId: returnedLessonId,
        }));
        await submitHomeworkChanges(homeworkToSubmit);
      }

      setSuccessMessage(
        isNew ? "Lesson successfully added." : "Lesson successfully updated."
      );

      if (onLessonCreated) {
        onLessonCreated();
      }
    } catch (err: any) {
      console.error(err.message);
      setSuccessMessage(
        isNew ? "Failed to add lesson." : "Failed to update lesson."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    async function fetchHomework(lessonId?: number) {
      if (!lessonId) {
        setHomeworkForLesson([]);
        return;
      }

      try {
        setHomeworkForLesson(undefined);
        const response = await fetch(
          `http://localhost:3001/lessons/${lessonId}/homework`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch lessons");
        const data: Homework[] = await response.json();
        setHomeworkForLesson(data);
      } catch (err: any) {
        console.log(err);
      }
    }
    fetchHomework(selectedLesson.ID);
  }, [selectedLesson.ID, token]);

  function handleInputChange(field: keyof Lesson, value: string) {
    setLesson((prev) => ({ ...prev, [field]: value }));
  }

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  function isLessonChanged(original: Lesson, current: Lesson) {
    return (
      original.Date !== current.Date ||
      original.Notes !== current.Notes ||
      original.teacherId !== current.teacherId ||
      original.studentId !== current.studentId
    );
  }

  const hasChanges = isLessonChanged(selectedLesson, lesson);

  const handleHomeworkDescriptionChange = (event: any, index: number) => {
    const updatedHomeworkList = newHomework.map((item, i) => {
      if (i === index) {
        return { ...item, Description: event.target.value };
      }
      return item;
    });

    setNewHomework(updatedHomeworkList);
  };

  const handleHomeworkCheckboxChange = (event: any, index: number) => {
    const updatedHomeworkList = newHomework.map((item, i) => {
      if (i === index) {
        return { ...item, isSubmittable: event.target.checked };
      }
      return item;
    });

    setNewHomework(updatedHomeworkList);
  };

  const handleRemoveHomework = (indexToRemove: number) => {
    const updatedHomeworkList = newHomework.filter((item, i) => {
      return i !== indexToRemove;
    });
    setNewHomework(updatedHomeworkList);
  };

  return (
    <>
      <div className="flex flex-col w-full gap-4 p-4">
        {/* Date Field */}
        <div className="flex flex-col">
          <label
            htmlFor="lesson-date"
            className="mb-1 text-sm font-medium text-gray-700"
          >
            Date
          </label>
          <input
            id="lesson-date"
            type="date"
            className="p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={lesson.Date}
            onChange={(e) => handleInputChange("Date", e.target.value)}
          />
        </div>

        {/* Teacher Field */}
        <div className="flex flex-col">
          <label
            htmlFor="lesson-teacher"
            className="mb-1 text-sm font-medium text-gray-700"
          >
            Teacher
          </label>
          <input
            id="lesson-teacher"
            type="text"
            readOnly
            className="p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={lesson.teacherId}
          />
        </div>

        {/* Notes Field */}
        <div className="flex flex-col">
          <label
            htmlFor="lesson-notes"
            className="mb-1 text-sm font-medium text-gray-700"
          >
            Notes
          </label>
          <textarea
            id="lesson-notes"
            rows={4}
            className="p-1 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={lesson.Notes}
            onChange={(e) => handleInputChange("Notes", e.target.value)}
          />
        </div>

        {/* Homework Field */}
        <div className="flex flex-col">
          <label
            htmlFor="lesson-homework"
            className="mb-1 text-sm font-medium text-gray-700"
          >
            Homework
          </label>

          {/* add homework ui when isNew */}
          {isNew && (
            <div className="flex flex-col gap-2 mb-2">
              {newHomework.map((homeworkItem, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Description"
                    className="flex-1 p-1 border border-gray-300 rounded-lg"
                    value={homeworkItem.Description}
                    onChange={(e) => handleHomeworkDescriptionChange(e, index)}
                  />
                  <label className="flex items-center gap-1 text-sm">
                    <input
                      type="checkbox"
                      checked={homeworkItem.isSubmittable}
                      onChange={(e) => handleHomeworkCheckboxChange(e, index)}
                    />
                    Submittable
                  </label>
                  <button
                    type="button"
                    className="px-2 py-1 text-sm text-white bg-red-500 rounded"
                    onClick={() => handleRemoveHomework(index)}
                  >
                    X
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setNewHomework((prev) => [
                    ...prev,
                    { Description: "", isSubmittable: false, lessonId: 0 },
                  ])
                }
                className="self-start px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
              >
                + Add Homework
              </button>
            </div>
          )}

          {homeworkForLesson === undefined ? (
            <div className="text-sm text-gray-500">Loading homework...</div>
          ) : homeworkForLesson.length === 0 && !isNew ? (
            <div className="text-sm text-gray-500">No homework assigned.</div>
          ) : !isNew ? (
            <ul className="p-2 space-y-1 overflow-y-auto text-sm text-gray-800 list-disc list-inside bg-gray-100 rounded-lg max-h-40">
              {homeworkForLesson.map((homework) => (
                <li key={homework.ID} className="flex gap-3">
                  <div>
                    <span className="font-light">Submittable:</span>{" "}
                    {homework.isSubmittable ? "Yes" : "No"}
                  </div>
                  <div>
                    <span className="font-light">Description:</span>{" "}
                    {homework.Description}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div />
          )}
        </div>

        <button
          onClick={submitLesson}
          disabled={isSubmitting || !hasChanges}
          className={`px-4 py-2 mt-4 font-semibold text-white rounded-lg ${
            isSubmitting || !hasChanges
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isSubmitting
            ? "Submitting..."
            : isNew
              ? "Add New Lesson"
              : "Save Changes"}
        </button>

        {successMessage && (
          <div className="mt-2 text-sm font-semibold text-green-600">
            {successMessage}
          </div>
        )}
      </div>
    </>
  );
}

export default LessonDialog;
