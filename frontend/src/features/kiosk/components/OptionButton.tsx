import { ArrowRight } from "lucide-react";

interface OptionButtonProps {
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: "outline" | "primary";
}

const OptionButton = ({
  title,
  subtitle,
  description,
  icon,
  onClick,
  variant = "outline",
}: OptionButtonProps) => {
  const isPrimary = variant === "primary";

  return (
    <button
      onClick={onClick}
      className={`
        group relative flex flex-col items-start text-left p-8 rounded-3xl h-full min-h-80
        border-2 transition-all duration-300 ease-out
        hover:-translate-y-2 hover:shadow-xl
        outline-none
        
        ${
          isPrimary
            ? "bg-white border-orange-100 hover:border-orange-500 shadow-orange-100/50" // Style cho thẻ Hội viên
            : "bg-white border-zinc-100 hover:border-zinc-400 shadow-sm" // Style cho thẻ Vé ngày
        }
      `}
    >
      {/* Icon Header */}
      <div className="w-full flex justify-between items-start mb-6">
        <div
          className={`p-4 rounded-2xl transition-colors duration-300 ${
            isPrimary
              ? "bg-orange-100 text-orange-600 group-hover:bg-orange-600 group-hover:text-white"
              : "bg-zinc-100 text-zinc-600 group-hover:bg-zinc-800 group-hover:text-white"
          }`}
        >
          {icon}
        </div>
        
        {/* Mũi tên chỉ dẫn (Ẩn hiện khi hover) */}
        <div className={`
            p-2 rounded-full opacity-0 -translate-x-4 transition-all duration-300
            group-hover:opacity-100 group-hover:translate-x-0
            ${isPrimary ? 'text-orange-600 bg-orange-50' : 'text-zinc-400 bg-zinc-50'}
        `}>
            <ArrowRight className="w-6 h-6" />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3 mt-auto w-full">
        <div>
          <h3 className="text-2xl font-black text-zinc-900 group-hover:text-orange-600 transition-colors">
            {title}
          </h3>
          <p className="text-sm font-bold uppercase tracking-wide text-zinc-400 mt-1">
            {subtitle}
          </p>
        </div>
        
        {/* Đường kẻ phân cách */}
        <div className={`w-12 h-1 rounded-full ${isPrimary ? 'bg-orange-200' : 'bg-zinc-200'}`} />

        <p className="text-zinc-500 text-base leading-relaxed font-medium whitespace-pre-line">
          {description}
        </p>
      </div>
    </button>
  );
};

export default OptionButton;