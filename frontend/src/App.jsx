import { BrowserRouter, Routes, Route } from "react-router-dom";
import { socket } from "./socket";
import { useEffect } from "react";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import TenantPage from "./pages/TenantPage";

import ProtectedRoute from "./components/ProtectedRoute";
import WorkspaceLayout from "./pages/WorkspaceLayout";
import WorkspaceHome from "./pages/WorkspaceHome";
import WorkspaceSettings from "./pages/owner/WorkspaceSettings";
import MemberManagement from "./pages/owner/MemberManagement";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import MemberProjects from "./pages/MemberProjects";
import MemberProjectDetails from "./pages/MemberProjectDetails";
import ProjectChat from "./pages/ProjectChat";

function App() {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("React socket connected:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.log("Socket connection error:", err.message);
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
    };
  }, []);
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        {/* PROTECTED ROUTES */}
        <Route
          path="/tenants"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Workspace routes */}
        <Route
          path="/tenant/:tenantId/*"
          element={
            <ProtectedRoute>
              <WorkspaceLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<WorkspaceHome />} />
          <Route path="settings" element={<WorkspaceSettings />} />
          <Route path="members" element={<MemberManagement />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:projectId" element={<ProjectDetails />} />
          <Route path="my-projects" element={<MemberProjects />} />
          <Route path="my-projects/:projectId" element={<MemberProjectDetails />} />
          <Route path="projects/:projectId/chat" element={<ProjectChat />} />
        </Route>
  </Routes>
    </BrowserRouter>
  );
}

export default App;