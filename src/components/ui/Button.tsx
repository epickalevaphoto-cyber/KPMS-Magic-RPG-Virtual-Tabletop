import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  className, 
  children, 
  ...props 
}: ButtonProps) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-caramel focus:ring-offset-2 disabled:opacity-50";
  
  const variants = {
    primary: "bg-caramel text-soft-ivory hover:bg-walnut shadow-lg hover:shadow-xl",
    secondary: "bg-soft-ivory text-dark-chocolate border border-caramel hover:bg-vanilla-cream",
    ghost: "bg-transparent text-dark-chocolate hover:bg-vanilla-cream/50",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-6 py-2.5 text-base",
    lg: "px-8 py-3 text-lg",
  };

  return (
    <button className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
};

export default Button;
