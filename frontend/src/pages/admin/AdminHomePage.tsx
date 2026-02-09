import { Button } from "@/components/ui/button"
import { useEffect, useRef, useState } from "react";
import KioskHomePage from "../kiosk/KioskHomePage";

const AdminHomePage = () => {
const kioskWindowRef = useRef<Window | null>(null);
const [isKioskOpen, setIsKioskOpen] = useState<boolean>(false);

  // Hàm mở cửa sổ Kiosk
  const openKioskWindow = () => {
    // If kiosk window opened, focus it
    if (kioskWindowRef.current && !kioskWindowRef.current.closed) {
      kioskWindowRef.current.focus();
      return;
    }

    // Mở cửa sổ mới tại route /kiosk
    // Kích thước 1024x768 (chuẩn iPad/Kiosk)
    const newWindow = window.open(
      "/kiosk",
      "KioskWindow",
      "width=900,height=768,left=200,top=200"
    );
    kioskWindowRef.current = newWindow;
    setIsKioskOpen(true);
  };

  useEffect(() => {
    // Tự động mở kiosk khi component mount (sau khi login xong)
    openKioskWindow(); 


    const channel = new BroadcastChannel("kiosk_channel");
    channel.onmessage = (event) => {

      if (!event.data) return;

      if (event.data.type === "SYSTEM/KIOSK_STARTED") {
        const 
      }

      // Nếu nhận được tín hiệu "trăng trối" từ Kiosk
      if (event.data.type === "SYSTEM/KIOSK_CLOSED") {
        setIsKioskOpen(false);
        kioskWindowRef.current = null;
      }
    };

    // Cleanup khi Admin thoát: đóng luôn cửa sổ Kiosk
    return () => {
      if (kioskWindowRef.current) {
        kioskWindowRef.current.close();
      }
      channel.close();
    };
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* --- LEFT PANEL: ADMIN HOMEPAGE --- */}
      <div className="w-1/2 h-full bg-white border-r border-gray-200 p-8 flex flex-col">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-500">Quản lý hệ thống Gym</p>
        </div>
        
        <div className="flex-1 bg-gray-50 rounded-lg p-6 border border-dashed border-gray-300 flex items-center justify-center">
          <div className="text-center">
            <p className="mb-4">Khu vực chức năng Admin</p>
            <Button variant="outline" onClick={openKioskWindow}>
              Mở lại cửa sổ Kiosk
            </Button>
          </div>
        </div>
      </div>

      {/* --- RIGHT PANEL: KIOSK MIRROR --- */}
      <div className="w-1/2 h-full bg-slate-200 flex flex-col">
        {/* <div className="p-4 bg-slate-800 text-white flex justify-between items-center">
          <span className="font-mono text-sm">LIVE PREVIEW & CONTROL</span>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
        </div> */}
        
        <div className="flex overflow-hidden border-l-4 border-orange-500">
          {/* Render giao diện Kiosk ngay tại đây để điều khiển */}
          {isKioskOpen ? (
            <KioskHomePage />
          ) : (
             <div className="text-center text-gray-500">
               <h2 className="text-2xl font-semibold opacity-50">Màn hình kiosk đang tắt</h2>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminHomePage