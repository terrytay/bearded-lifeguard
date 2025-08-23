import Link from "next/link";

type BookNowButtonProps = {
  variant?: "primary" | "secondary" | "hero";
  size?: "sm" | "md" | "lg";
  className?: string;
  children?: React.ReactNode;
};

export function BookNowButton({ 
  variant = "primary", 
  size = "md", 
  className = "",
  children = "Book Now" 
}: BookNowButtonProps) {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#FF6633]/20 focus:ring-offset-2";
  
  const variantStyles = {
    primary: "bg-[#FF6633] text-white hover:bg-[#e55a2b] shadow-lg hover:shadow-xl",
    secondary: "border-2 border-[#FF6633] text-[#FF6633] hover:bg-[#FF6633] hover:text-white",
    hero: "bg-[#FF6633] text-white hover:bg-[#20334F] shadow-2xl hover:shadow-[#FF6633]/25 transform hover:scale-105"
  };
  
  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <Link
      href="/booking"
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </Link>
  );
}
