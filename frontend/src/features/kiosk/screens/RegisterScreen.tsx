import Back2HomeButton from "../components/Back2HomeButton"; // Giả sử component này đã có sẵn
import { useAppDispatch } from "@/redux/hooks";
import { kioskActions } from "@/redux/slices/kioskSlice";
import { Ticket, Crown } from "lucide-react";
import OptionButton from "../components/OptionButton";

const RegisterScreen = () => {
  const dispatch = useAppDispatch();

  // Hàm xử lý chọn Khách vãng lai
  const handleWalkIn = () => {
    // Dispatch đến màn hình thanh toán vé ngày (ví dụ: ONE_DAY_PASS)
    dispatch(kioskActions.navigateKiosk("REGISTER_WALK_IN")); 
  };

  // Hàm xử lý chọn Đăng ký hội viên
  const handleMemberRegister = () => {
    // Dispatch đến màn hình điền form thông tin (ví dụ: REGISTER_STEP_1)
    dispatch(kioskActions.navigateKiosk("REGISTER_MEMBER"));
  };

  return (
    <div className="relative h-full w-full bg-zinc-50 p-6 flex flex-col">
      
      {/* 1. Nút Back (Đặt góc trên trái) */}
      <div className="absolute top-6 left-6 z-10">
        <Back2HomeButton />
      </div>

      {/* 2. Nội dung chính: Căn giữa màn hình */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-10">
        
        {/* Header Text */}
        <div className="text-center space-y-2 max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-black text-zinc-900 uppercase tracking-tight">
            Chọn <span className="text-orange-600">hình thức</span>
          </h2>
          <p className="text-zinc-500 font-medium text-lg">
            Trải nghiệm 1 ngày hay đăng ký thành viên dài hạn?
          </p>
        </div>

        {/* Grid Lựa chọn (2 Cột lớn) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl px-4">
          
          {/* OPTION 1: KHÁCH VÃNG LAI (Vé ngày) */}
          <OptionButton
            title="Khách vãng lai"
            subtitle="Tập 1 buổi - Thanh toán ngay"
            description={"Không lưu hồ sơ.\nThanh toán và vào tập ngay."}
            icon={<Ticket className="w-10 h-10" />}
            onClick={handleWalkIn}
            variant="outline"
          />

          {/* OPTION 2: HỘI VIÊN (Đăng ký gói) */}
          <OptionButton
            title="Đăng ký Thành viên"
            subtitle="Gói Tháng/Năm"
            description={"Lưu hồ sơ, nhận diện khuôn mặt.\nGói càng dài, tiết kiệm càng nhiều."}
            icon={<Crown className="w-10 h-10" />}
            onClick={handleMemberRegister}
            variant="primary" // Nổi bật hơn
          />

        </div>
      </div>
      
      {/* Decorative Background Element (Optional - làm đẹp nền) */}
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-orange-100 rounded-tl-full opacity-20 pointer-events-none" />
    </div>
  );
};

export default RegisterScreen;