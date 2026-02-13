import SharedKioskUI from "@/features/kiosk/components/SharedKioskUI";
import { useAppDispatch } from "@/redux/hooks";
import { kioskActions } from "@/redux/slices/kioskSlice";
import { useEffect, useState } from "react";

const KioskPage = () => {

  const dispatch = useAppDispatch();
  const [isSynced, setIsSynced] = useState<boolean>(false);

  useEffect(() => {
    // Kết nối vào kênh (cùng tên với kênh trong middleware)
    const channel = new BroadcastChannel("kiosk_channel");

    channel.postMessage({ type: "SYSTEM/KIOSK_STARTED" });



    // Đăng ký lắng nghe sự kiện đồng bộ dữ liệu
    channel.onmessage = (event) => {
      if (!event.data) return;

      if (event.data.type == "SYSTEM/SYNC_STATE") {
        // console.log("Kiosk Sync State From Admin:", event.data.payload);
        dispatch(kioskActions.setAllState(event.data.payload));
        setIsSynced(true);
      }
    }


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




  return ( isSynced ? 
    <div className="h-screen w-screen">
      {/* Chỉ hiển thị UI Kiosk, không có Admin Control */}
      <SharedKioskUI />
    </div> : <div className="h-screen w-screen bg-white" />
  );
};

export default KioskPage;
