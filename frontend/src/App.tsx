import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { Toaster } from "sonner";
import SignInPage from "@/pages/admin/SignInPage";
import SignUpPage from "@/pages/admin/SignUpPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminHomePage from "./pages/admin/AdminPage";
import KioskHomePage from "./pages/kiosk/KioskPage";
// import { VNKeys } from "./lib/VNKeys";
// import { useEffect } from "react";

function App() {

  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Navigate to="/signin" replace />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            {" "}
            {/* Wrap protected routes */}
            <Route path="/admin" element={<AdminHomePage />} />
            <Route path="/kiosk" element={<KioskHomePage />} />
          </Route>

          <Route
            path="*"
            element={<div className="p-10">404 - Không tìm thấy trang</div>}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
