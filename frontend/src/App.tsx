import { BrowserRouter, Route, Routes } from "react-router";
import { Toaster } from "sonner";
import SignInPage from "@/pages/admin/SignInPage";
import SignUpPage from "@/pages/admin/SignUpPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminHomePage from "./pages/admin/AdminHomePage";
import KioskHomePage from "./pages/kiosk/KioskHomePage";

function App() {

  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>      {/* Wrap protected routes */}
            <Route path="/admin" element={<AdminHomePage />} />
            <Route path="/kiosk" element={<KioskHomePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
