import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Home, Stethoscope, PawPrint, NotebookPen, BookOpen } from "lucide-react";

const nav = [
  { to: "/", label: "Home", icon: Home },
  { to: "/check", label: "Check", icon: Stethoscope },
  { to: "/pets", label: "Pets", icon: PawPrint },
  { to: "/journal", label: "Journal", icon: NotebookPen },
  { to: "/guide", label: "Guide", icon: BookOpen },
] as const;

export function AppShell({
  children,
  title,
  subtitle,
  action,
  hideNav,
}: {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  hideNav?: boolean;
}) {
  return (
    <div className="app-shell-bg min-h-screen">
      <div className="mx-auto w-full max-w-lg px-4 pt-safe pb-28">
        {(title || action) && (
          <header className="mb-5 flex items-start justify-between gap-3">
            <div>
              {title && (
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
              )}
              {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
            </div>
            {action}
          </header>
        )}
        {children}
      </div>
      {!hideNav && (
        <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border glass-card">
          <ul className="mx-auto flex max-w-lg items-stretch justify-between px-2 pb-safe pt-2">
            {nav.map(({ to, label, icon: Icon }) => (
              <li key={to} className="flex-1">
                <Link
                  to={to}
                  activeOptions={{ exact: to === "/" }}
                  className="flex flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-[11px] font-medium text-muted-foreground transition-colors data-[status=active]:bg-secondary data-[status=active]:text-foreground"
                >
                  <Icon className="size-5" strokeWidth={1.75} />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`glass-card rounded-2xl p-4 ${className}`}>{children}</section>;
}

export function Disclaimer() {
  return (
    <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
      Healthy Pet Checker is an educational tool. It does not diagnose, and it never replaces advice
      from a qualified veterinarian.
    </p>
  );
}
