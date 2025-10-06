import { ReactNode } from 'react';
import { ChevronRight } from 'react-feather';
import { Link } from 'react-router-dom';

interface SidebarItemProps {
  children: ReactNode;
  to: string;
  active?: boolean;
  className?: string; // 👈 añadimos esta línea
}

export default function SidebarItem({
  children,
  to,
  active = false,
  className = '',
}: SidebarItemProps) {
  return (
    <Link
      to={to}
      className={`no-underline rounded-lg p-4 transition-colors flex gap-10 font-semibold text-white ${className}`}
    >
      <span className="flex gap-5">
        {children} {active ? <ChevronRight /> : null}
      </span>
    </Link>
  );
}
