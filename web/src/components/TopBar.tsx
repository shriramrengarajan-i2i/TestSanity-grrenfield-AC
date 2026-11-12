import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const TABS = [
  { to: '/', label: 'Home' },
  { to: '/varieties', label: 'Varieties' },
  { to: '/growing', label: 'Growing' },
  { to: '/nutrition', label: 'Nutrition' },
  { to: '/recipes', label: 'Recipes' },
  { to: '/safety', label: 'Safety' },
];

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 text-sm font-medium rounded-[var(--radius-control)] ${
    isActive ? 'text-[var(--color-text)] bg-[var(--color-bg)]' : 'text-[var(--color-text-muted)]'
  }`;

// No sign-in/account control anywhere in this shell: every tab is directly
// reachable without identifying the visitor (REQ-120, REQ-123).
export function TopBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="h-14 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="max-w-[var(--page-max-width)] mx-auto h-full flex items-center justify-between px-6">
        <span className="font-semibold text-[var(--color-text)]">MicroGreens</span>
        <nav className="hidden md:flex gap-1">
          {TABS.map((tab) => (
            <NavLink key={tab.to} to={tab.to} end={tab.to === '/'} className={linkClass}>
              {tab.label}
            </NavLink>
          ))}
        </nav>
        <button
          type="button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          className="md:hidden text-[var(--color-text)]"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={20} strokeWidth={2.5} /> : <Menu size={20} strokeWidth={2.5} />}
        </button>
      </div>
      {menuOpen && (
        <nav className="md:hidden flex flex-col px-6 pb-3">
          {TABS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.to === '/'}
              className={linkClass}
              onClick={() => setMenuOpen(false)}
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
