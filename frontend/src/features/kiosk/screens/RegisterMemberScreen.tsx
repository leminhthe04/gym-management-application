import React, { useState, useRef, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { kioskActions } from "@/redux/slices/kioskSlice";
import Back2HomeButton from "../components/Back2HomeButton";
import {
  User,
  Phone,
  ArrowRight,
  Keyboard as KeyboardIcon,
  ChevronDown,
} from "lucide-react";

// Validation
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Keyboard Library
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import KioskInputField from "../components/KioskInputField";

const keyboardStyles = `

  .hg-button { height: 60px !important; font-size: 1.2rem !important; border-radius: 12px !important; }

  .hg-theme-default { background-color: #e4e4e7 !important; padding: 10px !important; }

  .hg-button[data-skbtn="{next}"] { background-color: #ea580c !important; color: white !important; flex-grow: 2 !important; }

  .hg-button[data-skbtn="{hide}"] { background-color: #fca5a5 !important; color: #7f1d1d !important; max-width: 80px !important; }

`;

// --- VALIDATION SCHEMA ---
const registerSchema = z.object({
  fullName: z.string().min(1, "Vui lòng nhập họ tên").min(3, "Tên quá ngắn"),
  birthYear: z
    .string()
    .regex(/^\d{4}$/, "Năm sinh phải là 4 chữ số")
    .refine((val) => {
      const year = parseInt(val);
      const currentYear = new Date().getFullYear();
      return year > 1900 && year <= currentYear;
    }, "Năm sinh không hợp lệ"),
  phone: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      return /^0\d{9}$/.test(val);
    }, "Số điện thoại phải 10 số và bắt đầu bằng số 0"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterMemberScreen = () => {
  const dispatch = useAppDispatch();
  const savedData = useAppSelector((state) => state.kiosk.memberFormData);

  // --- KEYBOARD STATE ---
  const [showKeyboard, setShowKeyboard] = useState(false); // 1. Mặc định ẩn
  const [layoutName, setLayoutName] = useState("default");
  const [inputName, setInputName] = useState<string>("fullName");
  const keyboardRef = useRef<any>(null);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    trigger,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: savedData.name || "",
      phone: savedData.phone || "",
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    dispatch(kioskActions.updateFormData(data));
    dispatch(kioskActions.navigateKiosk("REGISTER_MEMBER_2"));
  };

  // --- KEYBOARD HANDLERS ---

  const onKeyPress = (button: string) => {
    // Xử lý nút Shift
    if (button === "{shift}" || button === "{lock}") {
      setLayoutName(layoutName === "default" ? "shift" : "default");
    }

    // 2. Xử lý nút Next trên bàn phím
    if (button === "{next}") {
      // Gọi hàm submit của React Hook Form thủ công
      handleSubmit(onSubmit)();
    }

    // Xử lý nút ẩn bàn phím (nếu cần)
    if (button === "{hide}") {
      setShowKeyboard(false);
    }
  };

  const onChange = (input: string) => {
    setValue(inputName as keyof RegisterFormData, input);
    trigger(inputName as keyof RegisterFormData);
  };

  const handleFocus = (
    fieldName: string,
    layoutType: "default" | "numbers",
  ) => {
    setInputName(fieldName);
    setLayoutName(layoutType === "numbers" ? "numbers" : "default");

    const currentVal = getValues(fieldName as keyof RegisterFormData) || "";
    keyboardRef.current?.setInput(currentVal);
  };

  // Click ra ngoài input (vùng trống) để ẩn phím?
  // (Optional - Ở đây tôi làm nút ẩn chủ động trên bàn phím cho dễ thao tác)

  return (
    <div className="relative h-full w-full bg-zinc-50 flex flex-col overflow-hidden">
      <style>{keyboardStyles}</style>

      {/* --- BACKDROP (Lớp phủ mờ) --- 

          Khi bàn phím hiện -> Hiện lớp này đè lên nội dung -> Click vào lớp này thì ẩn phím 

      */}

      {showKeyboard && (
        <div
          className="absolute inset-0 bg-black/20 z-30"
          onClick={() => setShowKeyboard(false)}
        />
      )}

      {/* Header */}

      <div className="flex-none pt-6 px-6 z-10">
        <Back2HomeButton />
        <div className="text-center mt-4">
          <h2 className="text-3xl font-black text-zinc-900 uppercase tracking-tight">
            Thông tin <span className="text-orange-600">Cá nhân</span>
          </h2>
        </div>
      </div>

      {/* Form Area */}
      {/* Thêm padding-bottom lớn (pb-80) để khi bàn phím hiện lên không che mất nội dung cuối */}
      <div className="flex-1 w-full max-w-3xl mx-auto px-6 py-4 overflow-y-auto pb-80">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <KioskInputField
            label="Họ và tên"
            icon={<User />}
            placeholder="Nguyễn Văn A"
            required
            error={errors.fullName?.message}
            registration={register("fullName")}
            onFocus={() => handleFocus("fullName", "default")}
          />

          <div className="grid grid-cols-2 gap-6">
            <KioskInputField
              label="Số điện thoại"
              icon={<Phone />}
              placeholder="09xx..."
              error={errors.phone?.message}
              registration={register("phone")}
              onFocus={() => handleFocus("phone", "numbers")}
            />
          </div>

          {/* Nút Tiếp theo trên giao diện (Vẫn giữ) */}
          <div className="pt-4">
            <button
              type="submit"
              className="
                        w-full flex items-center justify-center gap-3
                        h-16 rounded-2xl
                        bg-zinc-900 text-white font-bold text-xl
                        transition-all duration-200
                        hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-200
                        active:scale-[0.98]
                    "
            >
              Tiếp theo
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </form>
      </div>

      {/* --- KEYBOARD CONTAINER (Có Animation trượt) --- */}
      <div
        className={`keyboard-container ${showKeyboard ? "keyboard-visible" : "keyboard-hidden"}`}
      >
        {/* Thanh Toolbar nhỏ trên bàn phím để tắt nếu muốn */}
        <div
          className="flex justify-center py-1 bg-zinc-300 border-b border-zinc-400"
          onClick={() => setShowKeyboard(false)}
        >
          <ChevronDown className="text-zinc-600 w-6 h-6" />
        </div>

        <div className="pb-4 pt-2">
          <Keyboard
            keyboardRef={(r) => (keyboardRef.current = r)}
            layoutName={layoutName}
            onChange={onChange}
            onKeyPress={onKeyPress}
            inputName={inputName}
            // 4. Custom Layout: Thêm nút {next} vào cuối
            layout={{
              default: [
                "1 2 3 4 5 6 7 8 9 0",
                "q w e r t y u i o p",
                "a s d f g h j k l",
                "{shift} z x c v b n m {backspace}",
                "{space} {next}", // Thêm {next} cạnh space
              ],
              shift: [
                "1 2 3 4 5 6 7 8 9 0",
                "Q W E R T Y U I O P",
                "A S D F G H J K L",
                "{shift} Z X C V B N M {backspace}",
                "{space} {next}",
              ],
              numbers: [
                "1 2 3",
                "4 5 6",
                "7 8 9",
                "{backspace} 0 {next}", // Số 0 ở giữa, Next bên phải
              ],
            }}
            // 5. Định nghĩa hiển thị nút
            display={{
              "{backspace}": "⌫",
              "{next}": "Tiếp theo ➜", // Hiển thị chữ trên phím
              "{shift}": "⇧",
              "{space}": "Cách",
              "{hide}": "▼",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default RegisterMemberScreen;
