import useAuthStore from "stores/AuthStore";
import StudentView from "./DashboardStudentView";
import TeacherView from "./DashboardTeacherView";

const Dashboard = () => {
  const role = useAuthStore((state) => state.role);

  if (role === "student") {
    return <StudentView />;
  }

  if (role === "teacher") {
    return <TeacherView />;
  }

  return <div></div>;
};

export default Dashboard;
