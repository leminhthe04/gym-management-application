import * as tf from "@tensorflow/tfjs";
import * as blazeface from "@tensorflow-models/blazeface";

let modelInstance: blazeface.BlazeFaceModel | null = null;
let isLoading = false;

// Hàm helper để nhường luồng cho UI cập nhật
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const FaceModelService = {
  load: async () => {
    if (modelInstance) return modelInstance;

    // Nếu đang load dở thì chờ
    if (isLoading) {
      while (isLoading) {
        await sleep(100);
      }
      return modelInstance;
    }

    try {
      isLoading = true;
      console.log("Loading AI model...");

      // --- BƯỚC 1: Nhường luồng 100ms ---
      // Mục đích: Để React kịp render UI "Đang tải..." hoặc Animation quay vòng
      // Nếu không có dòng này, UI sẽ bị đơ ngay lập tức khi chưa kịp hiện Spinner
      await sleep(100);

      await tf.ready();
      modelInstance = await blazeface.load(
        { modelUrl: "/models/blazeface/model.json" }
      );

      console.log("Loading AI model 2...");

      // --- BƯỚC 2: WARM-UP (Tác vụ gây lag nhất) ---
      // Ta bọc trong try-catch riêng để không làm chết app nếu warm-up lỗi
      try {
        // Tạo tensor giả
        const dummyInput = tf.zeros([32, 32, 3]);

        // Nhường luồng thêm 1 chút trước cú huých mạnh nhất
        await sleep(50);
        await tf.nextFrame(); // Yêu cầu TensorFlow đợi khung hình tiếp theo

        // Đây là dòng gây đứng UI:
        await modelInstance.estimateFaces(dummyInput as any, false);

        dummyInput.dispose(); // Dọn rác
        console.log("AI model loaded");
      } catch (warmUpError) {
        console.warn("Loading AI error:", warmUpError);
      }

      return modelInstance;
    } catch (error) {
      console.error("Loading AI error:", error);
      return null;
    } finally {
      isLoading = false;
    }
  },

  get: () => modelInstance,
};
