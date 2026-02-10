import { useAppDispatch } from "@/redux/hooks";
import Back2HomeButton from "../components/Back2HomeButton";

const CheckInScreen = () => {
  const dispatch = useAppDispatch();

  return (
    <div className="p-6 h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-4">Quẹt thẻ hoặc Nhập mã</h2>
      
      {/* Nội dung Check-in (Input, Camera...) */}
      <div className="flex-1 bg-gray-100 rounded mb-4">
          {/* ... */}
      </div>

      <Back2HomeButton />
    </div>
  );
};

export default CheckInScreen;