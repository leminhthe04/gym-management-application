import { useAppDispatch } from "@/redux/hooks";
import { kioskActions } from "@/redux/slices/kioskSlice";
import { MenuSquare, ShoppingBag, UserCheck, UserPlus } from "lucide-react"; // Import icon
import ActionButton from "../components/ActionButton";

const KioskHomeScreen = () => {
  const dispatch = useAppDispatch();

  return (
    // Container chính: Nền trắng xám nhẹ (Zinc-50)
    <div className="flex flex-col items-center justify-center h-full p-6 bg-zinc-50 select-none">
      
      {/* --- HEADER --- */}
      <div className="text-center mb-10 space-y-2">
        <h1 className="text-4xl md:text-4xl font-black tracking-tight text-zinc-900 uppercase">
          Gym <span className="text-orange-600">Kiosk</span>
        </h1>
        <p className="text-base text-zinc-500 font-medium">
          Chạm vào tùy chọn bên dưới để bắt đầu
        </p>
      </div>

      {/* --- GRID 2x2: Chứa 4 nút chức năng --- */}
      {/* max-w-4xl giúp grid rộng hơn một chút để chứa 4 nút thoải mái */}
      <div className="grid grid-cols-2 gap-8 w-full max-w-xl px-2 mt-16">
        
        {/* 1. CHECK-IN */}
        <ActionButton
          title="Check-in"
          subtitle="Dành cho hội viên đã đăng ký"
          icon={<UserCheck className="w-8 h-8" />}
          onClick={() => dispatch(kioskActions.navigateKiosk("CHECK_IN"))}
        />

        {/* 2. ĐĂNG KÝ MỚI */}
        <ActionButton
          title="Đăng ký"
          subtitle="Người mới, Khách vãng lai"
          icon={<UserPlus className="w-8 h-8" />}
          onClick={() => dispatch(kioskActions.navigateKiosk("REGISTER"))}
        />

        {/* 3. THAM KHẢO DỊCH VỤ (Nút mới) */}
        <ActionButton
          title="Tham khảo"
          subtitle="Các dịch vụ hiện có tại phòng"
          icon={<MenuSquare className="w-8 h-8" />}
          onClick={() => console.log("Nav to Services")} // Thay bằng action navigate của bạn
        />

        {/* 4. MUA / THUÊ ĐỒ (Nút mới) */}
        <ActionButton
          title="Canteen"
          subtitle="Mua/Thuê nước, khăn, dụng cụ"
          icon={<ShoppingBag className="w-8 h-8" />}
          onClick={() => console.log("Nav to Shop")} // Thay bằng action navigate của bạn
        />

      </div>
    </div>
  );
};

export default KioskHomeScreen;