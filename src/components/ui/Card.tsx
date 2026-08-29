import { cn } from '../../utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card = ({ className, children, ...props }: CardProps) => {
  return (
    <div className={cn("bg-soft-ivory/80 backdrop-blur-sm rounded-xl shadow-lg border border-caramel/30 p-6", className)} {...props}>
      {children}
    </div>
  );
};

export default Card;
