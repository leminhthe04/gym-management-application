import {
  useRef,
  useState,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import Webcam from "react-webcam";
import * as blazeface from "@tensorflow-models/blazeface";
import { cn } from "@/lib/utils";
import { RefreshCw, CheckCircle, XCircle } from "lucide-react";
import { FaceModelService } from "@/lib/faceModel";

export interface KioskCameraHandle {
  triggerCapture: () => void;
}

interface KioskCameraProps {
  imgSrc: string | null; // Ảnh đã chụp (nếu có)
  onCapture: (src: string) => void; // Callback khi chụp xong
  onError?: (msg: string | null) => void; // Callback báo lỗi (nếu có nhiều mặt)
  isProcessing?: boolean; // Trạng thái đang gọi API
  isSuccess?: boolean; // Trạng thái thành công
  isError?: boolean; // Trạng thái lỗi API
}

const KioskCamera = forwardRef<KioskCameraHandle, KioskCameraProps>(
  (
    {
      imgSrc,
      onCapture,
      onError,
      isProcessing = false,
      isSuccess = false,
      isError = false,
    },
    ref,
  ) => {
    const webcamRef = useRef<Webcam>(null);
    const [model, setModel] = useState<blazeface.BlazeFaceModel | null>(null);
    const [progress, setProgress] = useState(0);
    const detectionInterval = useRef<ReturnType<typeof setInterval> | null>(
      null,
    );

    const isCapturingRef = useRef<boolean>(false);



    // Cấu hình lỏng lẻo để tránh bị crop lệch trên laptop
    const videoConstraints = {
      facingMode: "user",
      // width/height để auto cho browser tự chọn native resolution
    };

    // Expose hàm triggerCapture ra bên ngoài thông qua ref
    useImperativeHandle(ref, () => ({
      triggerCapture: () => {

        if (isCapturingRef.current) return;

        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) {
          isCapturingRef.current = true;
          onCapture(imageSrc);
        }
      },
    }));

    // 1. Load Model
    useEffect(() => {
      const initModel = async () => {
        const loadedModel = await FaceModelService.load();
        setModel(loadedModel);
      };

      // Chỉ load nếu chưa có ảnh (đang ở chế độ camera)
      if (!imgSrc) {
        initModel();
        isCapturingRef.current = false;
      }

      return () => {
        if (detectionInterval.current) clearInterval(detectionInterval.current);
      };
    }, [imgSrc]);

    // 2. Hàm Detect Face
    const detectFace = useCallback(async () => {
      if (
        !model ||
        !webcamRef.current?.video ||
        imgSrc ||
        isProcessing ||
        isSuccess ||
        isError ||
        isCapturingRef.current
      ) {
        return;
      }

      if (webcamRef.current.video.readyState === 4) {
        const video = webcamRef.current.video;
        const predictions = await model.estimateFaces(video, false);

        if (predictions.length === 1) {
          // Có 1 khuôn mặt -> Tăng progress
          if (onError) onError(null); // Xóa lỗi cũ nếu có

          setProgress((prev) => {
            if (prev >= 100) {
              if (isCapturingRef.current) return 100;

              if (detectionInterval.current)
                clearInterval(detectionInterval.current);


              isCapturingRef.current = true;
              // CHỤP ẢNH
              const imageSrc = webcamRef.current?.getScreenshot();
              if (imageSrc) {
                onCapture(imageSrc);
              }
              return 100;
            }
            return prev + 5; // Tốc độ tăng (5% mỗi 100ms ~ 2 giây)
          });
        } else {
          // Không có mặt hoặc nhiều mặt -> Reset
          setProgress(0);
          if (predictions.length > 1 && onError) {
            onError("Chỉ được phép 1 người trong khung hình");
          }
        }
      }
    }, [model, imgSrc, isProcessing, isSuccess, isError, onCapture, onError]);

    // 3. Chạy Interval Detect
    useEffect(() => {
      if (!imgSrc && model && !isProcessing && !isSuccess && !isError && !isCapturingRef.current) {
        detectionInterval.current = setInterval(detectFace, 100);
      }
      return () => {
        if (detectionInterval.current) clearInterval(detectionInterval.current);
      };
    }, [model, imgSrc, isProcessing, isSuccess, isError, detectFace]);

    // Reset progress khi bị reset ảnh
    useEffect(() => {
      if (!imgSrc) setProgress(0);
      isCapturingRef.current = false;
    }, [imgSrc]);

    return (
      <div className="relative">
        {/* Vòng tròn Progress (SVG) */}
        {!imgSrc && progress > 0 && !isError && (
          <svg className="absolute -inset-4 w-[calc(100%+32px)] h-[calc(100%+32px)] z-20 pointer-events-none">
            <ellipse
              cx="50%"
              cy="50%"
              rx="175"
              ry="240"
              fill="none"
              stroke="#ea580c"
              strokeWidth="8"
              strokeDasharray="1300"
              strokeDashoffset={1300 - (1300 * progress) / 100}
              strokeLinecap="round"
              className="transition-all duration-100 ease-linear"
            />
          </svg>
        )}

        {/* Container Oval */}
        <div
          className={cn(
            "w-87.5 h-120 rounded-[50%] overflow-hidden border-4 shadow-2xl relative bg-black z-10 transition-colors duration-300",
            "flex items-center justify-center", // Căn giữa nội dung Flexbox
            isError
              ? "border-red-500"
              : isSuccess
                ? "border-green-500"
                : progress > 0
                  ? "border-orange-500"
                  : "border-white",
          )}
        >
          {!imgSrc ? (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              className={cn(
                "h-full w-auto min-w-full max-w-none", // Full chiều cao, rộng tự do
                "object-cover",
                "transform scale-x-[-1]", // Lật gương
              )}
            />
          ) : (
            <img
              src={imgSrc}
              alt="Captured"
              className={cn(
                "h-full w-auto min-w-full max-w-none",
                "object-cover",
                "transform scale-x-[-1]",
              )}
            />
          )}

          {/* LOADING OVERLAY */}
          {isProcessing && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-30">
              <RefreshCw className="w-16 h-16 text-white animate-spin mb-4" />
              <p className="text-white font-bold text-lg">Đang xác thực...</p>
            </div>
          )}
          {isSuccess && (
            <div className="absolute inset-0 bg-green-500/80 flex flex-col items-center justify-center z-30">
              <CheckCircle className="w-20 h-20 text-white mb-4" />
              <p className="text-white font-bold text-2xl">Thành công!</p>
            </div>
          )}
          {isError && (
            <div className="absolute inset-0 bg-red-500/20 flex flex-col items-center justify-center z-30 animate-pulse">
              <XCircle className="w-16 h-16 text-red-600 mb-2" />
            </div>
          )}
        </div>
      </div>
    );
  },
);

KioskCamera.displayName = "KioskCamera";

export default KioskCamera;
