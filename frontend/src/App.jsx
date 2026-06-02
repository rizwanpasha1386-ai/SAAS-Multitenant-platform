import { BrowserRouter, Routes, Route } from "react-router-dom";

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

function App() {
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
<<<<<<< HEAD

        {/* SINGLE TENANT PAGE */}
        <Route
          path="/tenant/:tenantId"
          element={
            <ProtectedRoute>
              <TenantPage />
            </ProtectedRoute>
          }
        />

=======
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
        </Route>
>>>>>>> 08e81da (feat(frontend): add tenant workspace routing, member project/task portals, and project/task API integration)
      </Routes>
    </BrowserRouter>
  );
}

export default App;