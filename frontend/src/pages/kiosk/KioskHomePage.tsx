import SharedKioskUI from "@/components/kiosk/SharedKioskUI";
import { useEffect } from "react";

const KioskHomePage = () => {

  
  useEffect(() => {
    // Kết nối vào kênh (cùng tên với kênh trong middleware)
    const channel = new BroadcastChannel("kiosk_channel");

    // Hàm gửi lời "trăng trối"
    const handleUnload = () => {
      channel.postMessage({ type: "SYSTEM/KIOSK_CLOSED" });
    };

    // Lắng nghe khi người dùng tắt tab/cửa sổ
    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      channel.close();
    };
  }, []);

  return (
    <div className="h-screen w-screen">
      {/* Chỉ hiển thị UI Kiosk, không có Admin Control */}
      <SharedKioskUI />
    </div>
  );
};

export default KioskHomePage;
