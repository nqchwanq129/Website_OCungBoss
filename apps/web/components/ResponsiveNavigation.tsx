'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { Button } from './Button';

export function ResponsiveNavigation({
  id,
  className,
  label = 'Menu',
  children,
}: {
  id: string;
  className: string;
  label?: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [previousPath, setPreviousPath] = useState(pathname);
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  if (previousPath !== pathname) {
    setPreviousPath(pathname);
    setOpen(false);
  }
  useEffect(() => {
    const desktop = matchMedia('(min-width: 1024px)');
    const trigger = menu.current;
    const content = panel.current;
    function resize(hidden?: HTMLElement) {
      const active = hidden ?? document.activeElement;
      setOpen(false);
      if (!desktop.matches && content?.contains(active)) trigger?.focus();
      if (desktop.matches && active === trigger) {
        const target =
          content?.querySelector<HTMLElement>('a, button, input') ?? document.getElementById('main-content');
        target?.focus();
      }
    }
    const change = () => resize();
    function hiddenBlur(event: FocusEvent) {
      // CSS can move focus to body before the media-query change callback runs.
      if (!event.relatedTarget && event.target instanceof HTMLElement && !event.target.getClientRects().length) {
        resize(event.target);
      }
    }
    desktop.addEventListener('change', change);
    trigger?.addEventListener('blur', hiddenBlur);
    content?.addEventListener('blur', hiddenBlur, true);
    return () => {
      desktop.removeEventListener('change', change);
      trigger?.removeEventListener('blur', hiddenBlur);
      content?.removeEventListener('blur', hiddenBlur, true);
    };
  }, []);
  function escape(event: KeyboardEvent<HTMLElement>) {
    if (event.key === 'Escape' && open) {
      event.preventDefault();
      setOpen(false);
      menu.current?.focus();
    }
  }
  return (
    <>
      <Button
        ref={menu}
        variant="secondary"
        className="responsive-menu"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen(!open)}
        onKeyDown={escape}
      >
        {label}
      </Button>
      <div
        ref={panel}
        id={id}
        className={`${className}${open ? ' is-open' : ''}`}
        onKeyDown={escape}
        onClick={(event) => {
          if (event.target instanceof Element && event.target.closest('a')) setOpen(false);
        }}
      >
        {children}
      </div>
    </>
  );
}
