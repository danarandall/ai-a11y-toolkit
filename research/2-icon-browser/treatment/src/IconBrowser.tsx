import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
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

const STATUS_LABEL: Record<Icon['status'], string> = {
  stable: 'Stable',
  beta: 'Beta',
  deprecated: 'Deprecated',
};

type Theme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'icon-browser-theme';

/**
 * Normalise an injected SVG string at the boundary rather than trusting it.
 * The icon's name is already rendered as visible text beside every use, so
 * the graphic itself is treated as decorative: it is hidden from assistive
 * tech and removed from the tab order, and any inline event handlers or
 * explicit tabindex on the source string are stripped defensively.
 */
function sanitizeDecorativeSvg(markup: string): string {
  return markup
    .replace(/<svg\b/i, '<svg aria-hidden="true" focusable="false"')
    .replace(/\s(on\w+)="[^"]*"/gi, '')
    .replace(/\s(on\w+)='[^']*'/gi, '')
    .replace(/\stabindex="[^"]*"/gi, '')
    .replace(/\stabindex='[^']*'/gi, '');
}

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to legacy path
  }
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

type IconCardProps = {
  icon: Icon;
  onOpen: (icon: Icon) => void;
  onCopy: (icon: Icon) => void;
  copied: boolean;
};

function IconCard({ icon, onOpen, onCopy, copied }: IconCardProps) {
  const titleId = useId();
  const sanitizedSvg = useMemo(() => sanitizeDecorativeSvg(icon.svg), [icon.svg]);

  return (
    <li className="icon-card-wrapper">
      <button
        type="button"
        className="icon-card"
        onClick={() => onOpen(icon)}
        aria-labelledby={titleId}
        aria-describedby={`${titleId}-status`}
      >
        <span
          className="icon-card__glyph"
          dangerouslySetInnerHTML={{ __html: sanitizedSvg }}
        />
        <span id={titleId} className="icon-card__name">
          {icon.name}
        </span>
        <span id={`${titleId}-status`} className={`status-pill status-pill--${icon.status}`}>
          <span className="status-pill__dot" aria-hidden="true" />
          {STATUS_LABEL[icon.status]}
        </span>
      </button>
      <button
        type="button"
        className="icon-card__copy"
        onClick={(e) => {
          e.stopPropagation();
          onCopy(icon);
        }}
        aria-label={copied ? `Copied SVG for ${icon.name}` : `Copy SVG for ${icon.name}`}
      >
        {copied ? (
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
            <path d="M5 12l4 4 10-10" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
            <rect x="8" y="8" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M5 16H4a1 1 0 01-1-1V4a1 1 0 011-1h11a1 1 0 011 1v1" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        )}
        <span className="visually-hidden">{copied ? 'Copied' : 'Copy'}</span>
      </button>
    </li>
  );
}

type DetailOverlayProps = {
  icon: Icon;
  onClose: () => void;
  onCopy: (icon: Icon) => void;
  copied: boolean;
};

function DetailOverlay({ icon, onClose, onCopy, copied }: DetailOverlayProps) {
  const headingId = useId();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const sanitizedSvg = useMemo(() => sanitizeDecorativeSvg(icon.svg), [icon.svg]);

  useEffect(() => {
    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();
    return () => {
      previouslyFocusedRef.current?.focus?.();
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key === 'Tab') {
        const panel = panelRef.current;
        if (!panel) return;
        const focusables = panel.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown, true);
    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, [onClose]);

  return (
    <div
      className="overlay-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="overlay-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        ref={panelRef}
      >
        <button
          type="button"
          className="overlay-panel__close"
          onClick={onClose}
          ref={closeButtonRef}
          aria-label="Close icon detail"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
          </svg>
        </button>

        <div className="overlay-panel__preview" dangerouslySetInnerHTML={{ __html: sanitizedSvg }} />

        <h2 id={headingId} className="overlay-panel__name">
          {icon.name}
        </h2>

        <dl className="overlay-panel__meta">
          <div className="overlay-panel__meta-row">
            <dt>Category</dt>
            <dd>{icon.category}</dd>
          </div>
          <div className="overlay-panel__meta-row">
            <dt>Status</dt>
            <dd>
              <span className={`status-pill status-pill--${icon.status}`}>
                <span className="status-pill__dot" aria-hidden="true" />
                {STATUS_LABEL[icon.status]}
              </span>
            </dd>
          </div>
        </dl>

        <div className="overlay-panel__code-block">
          <div className="overlay-panel__code-header">
            <span className="overlay-panel__code-label" id={`${headingId}-code-label`}>
              SVG source
            </span>
            <button
              type="button"
              className="button button--secondary"
              onClick={() => onCopy(icon)}
            >
              {copied ? 'Copied' : 'Copy SVG'}
            </button>
          </div>
          <pre className="overlay-panel__code" aria-labelledby={`${headingId}-code-label`}>
            <code>{icon.svg}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}

export default function IconBrowser() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'light';
    try {
      const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') return stored;
    } catch {
      // localStorage may be unavailable; fall back to system preference
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  const [query, setQuery] = useState('');
  const [activeCategories, setActiveCategories] = useState<Set<Icon['category']>>(
    () => new Set(CATEGORIES)
  );
  const [selectedIcon, setSelectedIcon] = useState<Icon | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const copiedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reducedMotion = useReducedMotion();
  const searchInputId = useId();
  const resultsHeadingId = useId();

  useEffect(() => {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // ignore persistence failures, theme still applies for this session
    }
  }, [theme]);

  useEffect(() => {
    return () => {
      if (copiedTimeoutRef.current) clearTimeout(copiedTimeoutRef.current);
    };
  }, []);

  const toggleCategory = useCallback((category: Icon['category']) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  }, []);

  const filteredIcons = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return ICONS.filter((icon) => {
      const matchesCategory = activeCategories.has(icon.category);
      const matchesQuery = normalizedQuery.length === 0 || icon.name.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [query, activeCategories]);

  const handleCopy = useCallback((icon: Icon) => {
    copyText(icon.svg).then((ok) => {
      if (!ok) return;
      setCopiedId(icon.id);
      if (copiedTimeoutRef.current) clearTimeout(copiedTimeoutRef.current);
      copiedTimeoutRef.current = setTimeout(() => setCopiedId(null), 2000);
    });
  }, []);

  const resultsSummary =
    filteredIcons.length === 0
      ? 'No icons found'
      : `Showing ${filteredIcons.length} of ${ICONS.length} icon${ICONS.length === 1 ? '' : 's'}`;

  return (
    <div className={`icon-browser icon-browser--${reducedMotion ? 'reduced-motion' : 'motion-ok'}`} data-theme={theme}>
      <header className="icon-browser__header">
        <div className="icon-browser__heading">
          <h1>Icon Browser</h1>
          <p className="icon-browser__intro">
            Find a brand icon, preview it, and copy it straight into Figma or code.
          </p>
        </div>
        <div className="theme-switch" role="group" aria-label="Colour theme">
          <button
            type="button"
            className={`theme-switch__option ${theme === 'light' ? 'is-active' : ''}`}
            aria-pressed={theme === 'light'}
            onClick={() => setTheme('light')}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
              <circle cx="12" cy="12" r="4" fill="currentColor" />
              <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Light
          </button>
          <button
            type="button"
            className={`theme-switch__option ${theme === 'dark' ? 'is-active' : ''}`}
            aria-pressed={theme === 'dark'}
            onClick={() => setTheme('dark')}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
              <path d="M20 14.5A8.5 8.5 0 019.5 4 8.5 8.5 0 1020 14.5z" fill="currentColor" />
            </svg>
            Dark
          </button>
        </div>
      </header>

      <div className="icon-browser__controls">
        <div className="search-field">
          <svg className="search-field__icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
            <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M16 16l4 4" stroke="currentColor" strokeWidth="2" />
          </svg>
          <label htmlFor={searchInputId} className="visually-hidden">
            Search icons by name
          </label>
          <input
            id={searchInputId}
            type="text"
            className="search-field__input"
            placeholder="Search icons by name"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-describedby={resultsHeadingId}
          />
        </div>

        <div className="category-filters" role="group" aria-label="Filter by category">
          {CATEGORIES.map((category) => {
            const active = activeCategories.has(category);
            return (
              <button
                key={category}
                type="button"
                className={`category-toggle ${active ? 'is-active' : ''}`}
                aria-pressed={active}
                onClick={() => toggleCategory(category)}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      <p id={resultsHeadingId} className="icon-browser__results-summary" role="status" aria-live="polite">
        {resultsSummary}
      </p>

      {filteredIcons.length > 0 ? (
        <ul className="icon-grid">
          {filteredIcons.map((icon) => (
            <IconCard
              key={icon.id}
              icon={icon}
              onOpen={setSelectedIcon}
              onCopy={handleCopy}
              copied={copiedId === icon.id}
            />
          ))}
        </ul>
      ) : (
        <div className="empty-state">
          <svg viewBox="0 0 24 24" width="40" height="40" aria-hidden="true" focusable="false">
            <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M16 16l4 4" stroke="currentColor" strokeWidth="2" />
          </svg>
          <p className="empty-state__title">No icons match your search</p>
          <p className="empty-state__hint">Try a different name or turn on more categories above.</p>
        </div>
      )}

      {selectedIcon && (
        <DetailOverlay
          icon={selectedIcon}
          onClose={() => setSelectedIcon(null)}
          onCopy={handleCopy}
          copied={copiedId === selectedIcon.id}
        />
      )}
    </div>
  );
}
