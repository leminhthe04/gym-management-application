import { AlertCircle, Camera } from "lucide-react";
import Back2HomeButton from "../components/Back2HomeButton";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useCallback, useEffect, useRef, useState } from "react";
import { kioskActions, registerMember } from "@/redux/slices/kioskSlice";

import KioskCamera, { type KioskCameraHandle } from "../components/KioskCamera";

const RegisterMember2Screen = () => {
  const dispatch = useAppDispatch();

  const formData = useAppSelector((state) => state.kiosk.memberFormData);
  const registerStatus = useAppSelector((state) => state.kiosk.registerStatus);
  const registerError = useAppSelector((state) => state.kiosk.registerError);
  
  const [localError, setLocalError] = useState<string | null>(null);

  const cameraRef = useRef<KioskCameraHandle>(null);


  // Reset state khi vào màn hình
  useEffect(() => {
    dispatch(kioskActions.resetRegisterState());
  }, []);

  useEffect(() => {
    if (registerStatus === "SUCCEEDED") {
      const timer = setTimeout(() => {
        dispatch(kioskActions.navigateKiosk("REGISTER_SUCCESS"));
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [registerStatus]);

  const updateImageSrc = (imgsrc: string | null) => {
    dispatch(kioskActions.updateFormData({ faceImg: imgsrc }))
  }

  const handleCapture = useCallback((imageSrc: string) => {
    updateImageSrc(imageSrc);
    setLocalError(null); // Xóa lỗi local
  
    dispatch(registerMember());
  }, [dispatch]);

  const handleRetake = () => {
    updateImageSrc(null);
    setLocalError(null);
    dispatch(kioskActions.resetRegisterState());
  };

  const handleCameraError = useCallback((msg: string | null) => {
     if (registerStatus !== 'FAILED') {
         setLocalError(prev => (prev !== msg ? msg : prev));
     }
  }, [registerStatus]);
  
  // Hàm xử lý khi bấm nút "Chụp thủ công"
  const onManualCaptureClick = useCallback(() => {
    // Gọi hàm triggerCapture bên trong component con
    cameraRef.current?.triggerCapture();
  }, []);


  // UI RENDER
  const isLoading = registerStatus === "LOADING";
  const isSuccess = registerStatus === "SUCCEEDED";
  const isApiError = registerStatus === "FAILED";

  return (
    <div className="relative h-full w-full bg-zinc-50 p-6 flex flex-col">
      {/* Header */}
      <div className="absolute top-6 left-6 z-10">
        <Back2HomeButton />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center space-y-10 mt-20">
        <div className="text-center space-y-2 max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-black text-zinc-900 uppercase tracking-tight">
            Xác thực <span className="text-orange-600">khuôn mặt</span>
          </h2>
          <p className="text-zinc-500">Vui lòng nhìn thẳng vào camera.</p>
        </div>

        {/* CAMERA AREA */}

        {/* --- CAMERA COMPONENT --- */}
        <KioskCamera 
            ref={cameraRef}
            imgSrc={formData.faceImg}
            onCapture={handleCapture}
            onError={handleCameraError}
            isProcessing={isLoading}
            isSuccess={isSuccess}
            isError={isApiError}
        />

        {/* ERROR MESSAGE AREA */}
        <div className="h-10 px-4 w-full flex justify-center">
           {/* Ưu tiên hiện lỗi API, nếu không thì hiện lỗi Local (nhiều mặt) */}
           {(registerError || localError) && (
               <div className="flex items-center gap-2 text-red-600 bg-red-100 px-4 py-2 rounded-full animate-bounce">
                   <AlertCircle className="w-5 h-5" />
                   <span className="font-bold">{registerError || localError}</span>
               </div>
           )}
        </div>

        {/* BUTTONS AREA */}
        <div className="w-full max-w-sm space-y-4">
            
            {/* THÊM NÚT CHỤP THỦ CÔNG */}
            {/* Chỉ hiện khi chưa có ảnh và chưa thành công */}
            {!formData.faceImg && !isSuccess && (
                <button
                    onClick={onManualCaptureClick}
                    disabled={isLoading}
                    className="
                        w-full h-16 rounded-2xl 
                        bg-zinc-900 text-white font-bold text-xl 
                        hover:bg-zinc-800 transition-all active:scale-95 
                        disabled:opacity-50 flex items-center justify-center gap-3
                    "
                >
                    <Camera className="w-6 h-6" />
                    Chụp
                </button>
            )}

            {/* NÚT THỬ LẠI / CHỤP LẠI */}
            {formData.faceImg && !isSuccess && (
                <button
                    onClick={handleRetake}
                    disabled={isLoading}
                    className="w-full h-16 rounded-2xl bg-zinc-200 text-zinc-900 font-bold text-xl hover:bg-zinc-300 transition-all disabled:opacity-50"
                >
                    {isApiError ? "Thử lại" : "Chụp lại"}
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default RegisterMember2Screen;
