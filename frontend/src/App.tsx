import { BrowserRouter, Route, Routes } from "react-router";
import { Toaster } from "sonner";
import SignInPage from "@/pages/admin/SignInPage";
import SignUpPage from "@/pages/admin/SignUpPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import HomePage from "./pages/admin/HomePage";

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
            <Route path="/" element={<HomePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
