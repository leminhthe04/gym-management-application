import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks"; // Hook của chúng ta
import { fetchMe, refresh } from "@/redux/slices/authSlice";

const ProtectedRoute = () => {
  // 1. Lấy state từ Redux thay vì Zustand
  const { accessToken, admin, loading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initAuth = async () => {
      // Logic cũ: Nếu chưa có token thì thử refresh (trường hợp F5 mất state nhưng còn Cookie)
      if (!accessToken) {
        try {
          // unwrap() giúp bắt lỗi hoặc lấy kết quả ngay từ Promise của Thunk
          await dispatch(refresh()).unwrap(); 
          
          // Refresh thành công thì tiện tay lấy luôn user info nếu chưa có
          // Lưu ý: Cần kiểm tra lại state mới nhất, nhưng vì dispatch là async nên
          // tốt nhất là gọi luôn fetchMe nếu logic server cho phép
          await dispatch(fetchMe()).unwrap();
        } catch (error) {
          // Refresh lỗi -> User thực sự chưa login -> Kệ nó, xuống dưới sẽ bị redirect
          console.log("Session init failed:", error);
        }
      } 
      // Logic cũ: Có token rồi nhưng chưa có info User (trường hợp persist chỉ lưu token)
      else if (accessToken && !admin) {
        try {
          await dispatch(fetchMe()).unwrap();
        } catch (error) {
          console.log("Fetch user failed:", error);
        }
      }

    };

    initAuth();
  }, [dispatch]); // Dependency array chỉ cần dispatch (hoặc rỗng)

  // 2. Màn hình Loading
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg font-semibold">Loading system...</div>
      </div>
    );
  }

  // 3. Logic Redirect
  // Kiểm tra xong xuôi mà vẫn không có token -> Đá về login
  if (!accessToken) {
    return <Navigate to="/signin" replace />;
  }

  // 4. Render Children
  return <Outlet />;
};

export default ProtectedRoute;