import React, { useEffect, useMemo, useRef, useState } from 'react';
import './styles.css';

type Icon = {
  id: string;
  name: string;
  category: 'Navigation' | 'Media' | 'Status';
  status: 'stable' | 'beta' | 'deprecated';
  svg: string;
};

const ICONS: Icon[] = [
  { id: 'i1', name: 'Arrow right', category: 'Navigation', status: 'stable',
    svg: '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" fill="none"/></svg>' },
  { id: 'i2', name: 'Chevron down', category: 'Navigation', status: 'stable',
    svg: '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" fill="none"/></svg>' },
  { id: 'i3', name: 'Play', category: 'Media', status: 'stable',
    svg: '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>' },
  { id: 'i4', name: 'Pause', category: 'Media', status: 'beta',
    svg: '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M7 4h4v16H7zM13 4h4v16h-4z" fill="currentColor"/></svg>' },
  { id: 'i5', name: 'Volume', category: 'Media', status: 'deprecated',
    svg: '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor"/></svg>' },
  { id: 'i6', name: 'Check circle', category: 'Status', status: 'stable',
    svg: '<svg viewBox="0 0 24 24" width="24" height="24"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" fill="none"/><path d="M8 12l3 3 5-6" stroke="currentColor" stroke-width="2" fill="none"/></svg>' },
  { id: 'i7', name: 'Warning', category: 'Status', status: 'stable',
    svg: '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M12 3l9 17H3z" stroke="currentColor" stroke-width="2" fill="none"/><path d="M12 9v5M12 17h.01" stroke="currentColor" stroke-width="2"/></svg>' },
  { id: 'i8', name: 'Info', category: 'Status', status: 'beta',
    svg: '<svg viewBox="0 0 24 24" width="24" height="24"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" fill="none"/><path d="M12 11v5M12 8h.01" stroke="currentColor" stroke-width="2"/></svg>' },
  { id: 'i9', name: 'Home', category: 'Navigation', status: 'stable',
    svg: '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M4 11l8-7 8 7v9H4z" stroke="currentColor" stroke-width="2" fill="none"/></svg>' },
  { id: 'i10', name: 'Search', category: 'Navigation', status: 'stable',
    svg: '<svg viewBox="0 0 24 24" width="24" height="24"><circle cx="11" cy="11" r="6" stroke="currentColor" stroke-width="2" fill="none"/><path d="M16 16l4 4" stroke="currentColor" stroke-width="2"/></svg>' },
  { id: 'i11', name: 'Record', category: 'Media', status: 'stable',
    svg: '<svg viewBox="0 0 24 24" width="24" height="24"><circle cx="12" cy="12" r="7" fill="currentColor"/></svg>' },
  { id: 'i12', name: 'Error', category: 'Status', status: 'deprecated',
    svg: '<svg viewBox="0 0 24 24" width="24" height="24"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" fill="none"/><path d="M9 9l6 6M15 9l-6 6" stroke="currentColor" stroke-width="2"/></svg>' },
];

const CATEGORIES: Icon['category'][] = ['Navigation', 'Media', 'Status'];

type Theme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'icon-browser-theme';

function getInitialTheme(): Theme {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
  } catch {
    // localStorage may be unavailable; fall back to default.
  }
  return 'light';
}

function IconGlyph({ svg }: { svg: string }) {
  return <span className="icon-glyph" dangerouslySetInnerHTML={{ __html: svg }} />;
}

function StatusDot({ status }: { status: Icon['status'] }) {
  return (
    <span className={`status-dot status-dot--${status}`} title={status}>
      <span className="status-dot__label">{status}</span>
    </span>
  );
}

function CopyButton({
  getText,
  className,
  label,
}: {
  getText: () => string;
  className?: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = getText();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard access can fail silently; no confirmation shown in that case.
    }
  };

  return (
    <button
      type="button"
      className={`copy-button ${className ?? ''}`.trim()}
      onClick={handleClick}
      aria-label={label ?? 'Copy SVG'}
    >
      {copied ? 'Copied!' : label ?? 'Copy SVG'}
    </button>
  );
}

function IconDetail({ icon, onClose }: { icon: Icon; onClose: () => void }) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="overlay-backdrop" onClick={onClose}>
      <div
        className="overlay-panel"
        role="dialog"
        aria-modal="true"
        aria-label={`${icon.name} details`}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="overlay-close" onClick={onClose} aria-label="Close">
          &times;
        </button>
        <div className="overlay-preview">
          <IconGlyph svg={icon.svg} />
        </div>
        <h2 className="overlay-title">{icon.name}</h2>
        <dl className="overlay-meta">
          <div className="overlay-meta__row">
            <dt>Category</dt>
            <dd>{icon.category}</dd>
          </div>
          <div className="overlay-meta__row">
            <dt>Status</dt>
            <dd>
              <StatusDot status={icon.status} />
            </dd>
          </div>
        </dl>
        <div className="overlay-code-wrap">
          <pre className="overlay-code">
            <code>{icon.svg}</code>
          </pre>
          <CopyButton
            getText={() => icon.svg}
            className="copy-button--overlay"
            label="Copy SVG"
          />
        </div>
      </div>
    </div>
  );
}

function IconCard({ icon, onOpen }: { icon: Icon; onOpen: (icon: Icon) => void }) {
  return (
    <div
      className="icon-card"
      onClick={() => onOpen(icon)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen(icon);
        }
      }}
    >
      <CopyButton
        getText={() => icon.svg}
        className="copy-button--card"
        label="Copy"
      />
      <div className="icon-card__preview">
        <IconGlyph svg={icon.svg} />
      </div>
      <div className="icon-card__name">{icon.name}</div>
      <StatusDot status={icon.status} />
    </div>
  );
}

export default function IconBrowser() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [query, setQuery] = useState('');
  const [activeCategories, setActiveCategories] = useState<Set<Icon['category']>>(
    () => new Set(CATEGORIES)
  );
  const [selectedIcon, setSelectedIcon] = useState<Icon | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Ignore storage errors (e.g. private browsing restrictions).
    }
  }, [theme]);

  const toggleCategory = (category: Icon['category']) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const filteredIcons = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return ICONS.filter((icon) => {
      const matchesCategory = activeCategories.has(icon.category);
      const matchesQuery =
        normalizedQuery === '' || icon.name.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [query, activeCategories]);

  return (
    <div className={`icon-browser icon-browser--${theme}`}>
      <header className="icon-browser__header">
        <div className="icon-browser__heading">
          <h1 className="icon-browser__title">Icon Browser</h1>
          <p className="icon-browser__intro">
            Find a brand icon, preview it, and copy it into Figma or code.
          </p>
        </div>
        <button
          type="button"
          className="theme-toggle"
          onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
          aria-label="Toggle theme"
        >
          <span className="theme-toggle__icon" aria-hidden="true">
            {theme === 'light' ? '\u263E' : '\u2600'}
          </span>
          {theme === 'light' ? 'Dark mode' : 'Light mode'}
        </button>
      </header>

      <div className="icon-browser__controls">
        <div className="search-row">
          <input
            type="text"
            className="search-input"
            placeholder="Search icons by name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search icons"
          />
          <span className="search-count">
            {filteredIcons.length} icon{filteredIcons.length === 1 ? '' : 's'}
          </span>
        </div>

        <div className="category-row" role="group" aria-label="Filter by category">
          {CATEGORIES.map((category) => {
            const isActive = activeCategories.has(category);
            return (
              <button
                key={category}
                type="button"
                className={`category-toggle ${isActive ? 'category-toggle--active' : ''}`}
                onClick={() => toggleCategory(category)}
                aria-pressed={isActive}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {filteredIcons.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state__title">No icons found</p>
          <p className="empty-state__body">
            Try a different search term or enable more categories.
          </p>
        </div>
      ) : (
        <div className="icon-grid">
          {filteredIcons.map((icon) => (
            <IconCard key={icon.id} icon={icon} onOpen={setSelectedIcon} />
          ))}
        </div>
      )}

      {selectedIcon && (
        <IconDetail icon={selectedIcon} onClose={() => setSelectedIcon(null)} />
      )}
    </div>
  );
}
