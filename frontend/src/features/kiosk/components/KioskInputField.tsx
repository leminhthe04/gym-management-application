import React from "react";

interface KioskInputFieldProps {
  label: string;
  icon: React.ReactNode;
  placeholder?: string;
  required?: boolean;
  error?: string;
  registration?: any;
  onFocus?: () => void; // Thêm prop này
}

const KioskInputField = ({
  label,
  icon,
  placeholder,
  required,
  error,
  registration,
  onFocus,
}: KioskInputFieldProps) => {
  return (
    <div className="space-y-1">
      <label className="flex items-center text-sm font-bold text-zinc-500 uppercase tracking-wider ml-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative group">
        <div
          className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors 
                                ${error ? "text-red-400" : "text-zinc-400 group-focus-within:text-orange-600"}`}
        >
          {/* @ts-ignore */}
          {React.cloneElement(icon, { className: "w-5 h-5" })}
        </div>

        <input
          type="text" // Luôn để text để tránh lỗi bàn phím ảo với input type number
          placeholder={placeholder}
          {...registration}
          onFocus={onFocus} // Bắn sự kiện focus ra ngoài để bật bàn phím
          // Tắt autocomplete của trình duyệt để không che bàn phím ảo
          autoComplete="off"
           // Mẹo: Để readOnly để không hiện bàn phím ảo native của điện thoại/tablet (nếu có)
          // Nhưng vẫn cho phép script (keyboard ảo) ghi vào.
          // Nếu test trên PC thấy không gõ được phím cứng thì bỏ readOnly đi.
          className={`
                        w-full h-14 pl-12 pr-4 rounded-xl border-2 
                        text-xl font-semibold text-zinc-900 placeholder:text-zinc-300
                        outline-none transition-all duration-200 cursor-pointer
                        ${
                          error
                            ? "bg-red-50 border-red-500 focus:ring-2 focus:ring-red-100"
                            : "bg-white border-zinc-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                        }
                    `}
        />
      </div>
      {error && <p className="text-red-500 text-xs font-bold ml-1">{error}</p>}
    </div>
  );
};

export default KioskInputField;
