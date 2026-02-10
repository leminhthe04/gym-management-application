interface KioskButtonProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const ActionButton = ({ title, subtitle, icon, onClick }: KioskButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`
            group relative flex flex-col items-center justify-center 
            /* Kích thước thẻ: Chiều cao cố định hoặc padding vừa phải */
            h-48 w-full rounded-2xl
            bg-white border border-zinc-200 shadow-sm
            
            /* Hiệu ứng chuyển động mượt mà */
            transition-all duration-200 ease-out
            
            /* HOVER: Viền cam, Nổi lên, Bóng đổ */
            hover:border-orange-500 hover:shadow-lg hover:-translate-y-1 hover:z-10
            
            /* ACTIVE: Nhấn xuống */
            active:scale-[0.98] active:bg-zinc-50 outline-none
        `}
    >
      {/* Icon Circle */}
      <div
        className="mb-4 p-4 rounded-full bg-zinc-100 text-zinc-600 
                        group-hover:bg-orange-600 group-hover:text-white 
                        transition-colors duration-300"
      >
        {icon}
      </div>

      {/* Text Content */}
      <div className="text-center space-y-1 px-2">
        <h3 className="text-lg font-bold text-zinc-900 group-hover:text-orange-700 transition-colors">
          {title}
        </h3>
        <p className="text-xs text-zinc-400 font-medium group-hover:text-zinc-500">
          {subtitle}
        </p>
      </div>
    </button>
  );
};

export default ActionButton;
