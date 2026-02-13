import { useState, useRef, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { kioskActions } from "@/redux/slices/kioskSlice";
import Back2HomeButton from "../components/Back2HomeButton";
import { User, Phone, ArrowRight } from "lucide-react";

// Validation
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Keyboard Library
import KioskInputField from "../components/KioskInputField";
import VirtualKeyBoard from "../components/VirtualKeyBoard";
import { cn } from "@/lib/utils";
import { toVietnamese } from "@/lib/talex";

// --- VALIDATION SCHEMA ---
const registerSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập họ tên").min(3, "Tên quá ngắn"),

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


  const { control, handleSubmit, setValue, getValues } =
    useForm<RegisterFormData>({
      resolver: zodResolver(registerSchema),
      defaultValues: {
        name: savedData.name || "",
        phone: savedData.phone || "",
      },
    });



  const [activeFieldName, setActiveFieldName] = 
    useState<keyof RegisterFormData | null>(null);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const inputRefsMap: Record<
    keyof RegisterFormData,
    React.RefObject<HTMLInputElement | null>
  > = {
    name: nameInputRef,
    phone: phoneInputRef,
  };

  const keyboardRef = useRef<any>(null);

  const keyboardAreaRef = useRef<HTMLDivElement>(null);
  const inputAreaRef = useRef<HTMLDivElement>(null);


  const isKioskWindow = location.pathname.startsWith("/kiosk");


  const onSubmit = (data: RegisterFormData) => {
    dispatch(kioskActions.updateFormData(data));
    dispatch(kioskActions.navigateKiosk("REGISTER_MEMBER_2"));
  };




  const updateFieldValue = (
    fieldName: keyof RegisterFormData,
    value: string,
    isDeleting: boolean = false,
  ) => {
    const finalValue = isDeleting ? value : toVietnamese(value);

    dispatch(
      // update Redux store only, form and keyboardRef will auto update via useEffect below
      kioskActions.updateFormData({
        [fieldName]: finalValue,
      }),
    );
  };




  // Khi gõ phím ảo, convert nội dung thành tiếng Việt, cập nhật vào Redux store,
  // giữ focus vào input đang gõ
  const onKeyboardChange = (newValue: string) => {
    if (!activeFieldName) return;

    const currentValue = getValues(activeFieldName) || "";

    const isDeleting = newValue.length < currentValue.length;

    updateFieldValue(activeFieldName, newValue, isDeleting);

    const activeInputRef = inputRefsMap[activeFieldName] || null;
    // 4. GIỮ FOCUS
    requestAnimationFrame(() => {
      if (activeInputRef?.current) {
        const input = activeInputRef.current;
        input.focus();
      }
    });
  };



  
  // Xử lý thêm sự kiện click ngoài để ẩn keyboard
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as Node;

      const clickInsideInput = inputAreaRef.current?.contains(target);
      const clickInsideKeyboard = keyboardAreaRef.current?.contains(target);

      if (!clickInsideInput && !clickInsideKeyboard) {
        setActiveFieldName(null);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  // Tác dụng: Khi Redux thay đổi (do màn hình kia nhập), Form và keyboardRef tự cập nhật theo.
  useEffect(() => {
    const currentValues = getValues();

    // Danh sách các field cần sync
    const fieldsToSync: (keyof RegisterFormData)[] = ["name", "phone"];

    for (const field of fieldsToSync) {
      const reduxVal: string = savedData[field] || "";
      const localVal: string = currentValues[field] || "";

      // Chỉ update nếu có sự khác biệt
      if (reduxVal === localVal) continue;

      // 1. Update Form
      setValue(field, reduxVal, { shouldDirty: true, shouldValidate: true });

      // 2. Nếu field này đang Active (đang gõ), update luôn Keyboard ảo
      if (activeFieldName === field) {
        keyboardRef.current?.setInput(reduxVal, field);
        keyboardRef.current?.setCaretPosition(reduxVal.length);
      }
    }

  }, [savedData]); // Dependency là savedData: Cứ Redux đổi là chạy hàm này






  return (
    <div className="relative h-full w-full bg-zinc-50 p-6 flex flex-col">
      {/* Header */}
      <div className="absolute top-6 left-6 z-10">
        <Back2HomeButton />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center space-y-10 mt-20">
        <div className="text-center space-y-2 max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-black text-zinc-900 uppercase tracking-tight">
            Thông tin <span className="text-orange-600">cá nhân</span>
          </h2>
        </div>

        {/* Form Area */}
        {/* Thêm padding-bottom lớn (pb-80) để khi bàn phím hiện lên không che mất nội dung cuối */}
        <div className="flex-1 w-full max-w-3xl mx-auto px-6 py-4 overflow-y-auto pb-80">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <p className="text-right text-zinc-500 font-medium text-xs italic">
              Tắt bộ gõ tiếng Việt (UniKey) nếu dùng bàn phím cứng
            </p>

            <div ref={inputAreaRef}>
              <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                  <KioskInputField
                    label="Họ tên"
                    placeholder="Hoàng Phủ Ngọc Tường"
                    icon={<User />}
                    required
                    textValue={field.value}
                    error={fieldState.error?.message}
                    onFocus={() => setActiveFieldName("name")}
                    onChange={(value: string) => {
                      updateFieldValue("name", value);
                    }}
                    inputRef={nameInputRef}
                  />
                )}
              />

              <Controller
                name="phone"
                control={control}
                render={({ field, fieldState }) => (
                  <KioskInputField
                    label="Số điện thoại"
                    placeholder="0323456789"
                    icon={<Phone />}
                    textValue={field.value ?? ""}
                    error={fieldState.error?.message}
                    onFocus={() => setActiveFieldName("phone")}
                    onChange={(value: string) => {
                      updateFieldValue("phone", value);
                    }}
                    inputRef={phoneInputRef}
                  />
                )}
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
      </div>

      {// uncomment when only want to show keyboard in kiosk window, not in admin mirror
      // isKioskWindow && 
      <VirtualKeyBoard
        containerRef={keyboardAreaRef}
        parentClassName={cn(
          "keyboard-container pb-4 pt-2",
          activeFieldName ? "keyboard-visible" : "keyboard-hidden",
        )}
        keyboardRef={keyboardRef}
        layoutType={activeFieldName === "phone" ? "numbers" : "default"}
        onChange={onKeyboardChange}
        inputName={activeFieldName || "default"}
      />}


    </div>
  );
};

export default RegisterMemberScreen;
