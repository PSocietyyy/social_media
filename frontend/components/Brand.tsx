import { HandHeart } from "lucide-react";

type BrandProps = {
  className?: string;
};

const Brand = ({ className }: BrandProps) => {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="rounded-full bg-orange-600 p-2">
        <HandHeart className="w-6 h-6 md:w-7 md:h-7 text-white" />
      </div>
      <h1 className="font-bold text-xl md:text-2xl">PSocietyyy</h1>
    </div>
  );
};

export default Brand;
