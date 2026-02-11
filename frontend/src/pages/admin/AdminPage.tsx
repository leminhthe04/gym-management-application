import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import KioskPage from "../kiosk/KioskPage";
import { store } from "@/redux/store";

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
      "width=900,height=1000,left=0,top=0",
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

      // nhận được tín hiệu kiosk mở
      if (event.data.type === "SYSTEM/KIOSK_STARTED") {
        setIsKioskOpen(true);

        // Phát tín hiệu và dữ liệu để kiosk lấy dữ đồng bộ
        const currentKioskState = store.getState().kiosk;
        channel.postMessage({
          type: "SYSTEM/SYNC_STATE",
          payload: currentKioskState,
        });
      }

      // Nếu nhận được tín hiệu đóng cửa sổ từ kiosk
      if (event.data.type === "SYSTEM/KIOSK_CLOSED") {
        setIsKioskOpen(false);
        // kioskWindowRef.current = null;
      }
    };

    const handleUnload = () => {
      if (kioskWindowRef.current && !kioskWindowRef.current.closed) {
        kioskWindowRef.current.close();
      }
    };

    window.addEventListener("beforeunload", handleUnload);

    // Cleanup khi Admin thoát: đóng luôn cửa sổ Kiosk
    return () => {
      if (kioskWindowRef.current) {
        kioskWindowRef.current.close();
      }

      window.removeEventListener("beforeunload", handleUnload);
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
              Mở màn hình Kiosk
            </Button>
          </div>
        </div>
      </div>

      {/* --- RIGHT PANEL: KIOSK MIRROR --- */}
      <div className="w-1/2 h-full bg-slate-200 flex flex-col">
        <div className="flex overflow-hidden border-l-4 border-black-500">
          {/* Render giao diện Kiosk ngay tại đây để điều khiển */}
          {isKioskOpen ? (
            <KioskPage />
          ) : (
            <div className="text-center text-gray-500 flex">
              <h2 className="text-2xl font-semibold opacity-50">
                Màn hình kiosk đang tắt
              </h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;
