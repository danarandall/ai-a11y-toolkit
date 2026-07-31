import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

/**
 * Dana's Dough — Baker's Calculator
 *
 * Standalone baker's-percentage calculator. Flour is always 100%; every
 * other ingredient is a percentage of the flour weight.
 *
 *   totalDoughWeight = loaves * loafWeight
 *   sumOfPercentages = 100 + hydration + starter + salt
 *   flour            = totalDoughWeight / (sumOfPercentages / 100)
 *   water            = flour * (hydration / 100)
 *   starterWeight    = flour * (starter / 100)
 *   saltWeight       = flour * (salt / 100)
 */

type ThemeName = "light" | "dark";

interface Ranges {
  loaves: { min: number; max: number; default: number };
  loafWeight: { min: number; max: number; default: number };
  hydration: { min: number; max: number; default: number };
  starter: { min: number; max: number; default: number };
  salt: { min: number; max: number; default: number };
}

const RANGES: Ranges = {
  loaves: { min: 1, max: 12, default: 2 },
  loafWeight: { min: 400, max: 1200, default: 900 },
  hydration: { min: 50, max: 100, default: 75 },
  starter: { min: 5, max: 40, default: 20 },
  salt: { min: 1, max: 3, default: 2 },
};

const HYDRATION_WARNING_THRESHOLD = 85;
const LOAF_WEIGHT_PRESETS = [400, 900, 1200] as const;

const THEME_STORAGE_KEY = "danas-dough-theme";

interface Recipe {
  loaves: number;
  loafWeight: number;
  hydration: number;
  starter: number;
  salt: number;
}

const DEFAULT_RECIPE: Recipe = {
  loaves: RANGES.loaves.default,
  loafWeight: RANGES.loafWeight.default,
  hydration: RANGES.hydration.default,
  starter: RANGES.starter.default,
  salt: RANGES.salt.default,
};

interface Weights {
  flour: number;
  water: number;
  starter: number;
  salt: number;
  total: number;
}

function computeWeights(recipe: Recipe): Weights {
  const totalDoughWeight = recipe.loaves * recipe.loafWeight;
  const sumOfPercentages = 100 + recipe.hydration + recipe.starter + recipe.salt;
  const flour = totalDoughWeight / (sumOfPercentages / 100);
  const water = flour * (recipe.hydration / 100);
  const starter = flour * (recipe.starter / 100);
  const salt = flour * (recipe.salt / 100);
  return { flour, water, starter, salt, total: totalDoughWeight };
}

function formatGrams(value: number): string {
  return `${value.toFixed(1)} g`;
}

function inRange(value: number, min: number, max: number): boolean {
  return Number.isFinite(value) && value >= min && value <= max;
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (event: MediaQueryListEvent) => setReduced(event.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return reduced;
}

/**
 * Animates a displayed number counting up (or down) smoothly toward a
 * target value. Falls back to an instant snap when the user has asked
 * for reduced motion.
 */
function useAnimatedNumber(target: number, durationMs = 400): number {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [display, setDisplay] = useState(target);
  const frameRef = useRef<number | null>(null);
  const fromRef = useRef(target);

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplay(target);
      return;
    }

    const from = fromRef.current;
    const to = target;
    if (from === to) return;

    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / durationMs);
      // Ease-out: quick start, gentle settle. No overshoot or bounce.
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = from + (to - from) * eased;
      setDisplay(current);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = to;
      }
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, durationMs, prefersReducedMotion]);

  return display;
}

interface FieldErrors {
  loaves?: string;
  loafWeight?: string;
  hydration?: string;
  starter?: string;
  salt?: string;
}

function validate(recipe: Recipe): FieldErrors {
  const errors: FieldErrors = {};
  if (!inRange(recipe.loaves, RANGES.loaves.min, RANGES.loaves.max)) {
    errors.loaves = `Enter a whole number of loaves between ${RANGES.loaves.min} and ${RANGES.loaves.max}.`;
  }
  if (!inRange(recipe.loafWeight, RANGES.loafWeight.min, RANGES.loafWeight.max)) {
    errors.loafWeight = `Enter a loaf weight between ${RANGES.loafWeight.min} and ${RANGES.loafWeight.max} g.`;
  }
  if (!inRange(recipe.hydration, RANGES.hydration.min, RANGES.hydration.max)) {
    errors.hydration = `Enter a hydration between ${RANGES.hydration.min} and ${RANGES.hydration.max} percent.`;
  }
  if (!inRange(recipe.starter, RANGES.starter.min, RANGES.starter.max)) {
    errors.starter = `Enter a starter amount between ${RANGES.starter.min} and ${RANGES.starter.max} percent.`;
  }
  if (!inRange(recipe.salt, RANGES.salt.min, RANGES.salt.max)) {
    errors.salt = `Enter a salt amount between ${RANGES.salt.min} and ${RANGES.salt.max} percent.`;
  }
  return errors;
}

/** Small inline warning triangle. Decorative; the adjacent text carries the meaning. */
function WarningIcon() {
  return (
    <svg
      className="warning-icon"
      viewBox="0 0 20 20"
      width="16"
      height="16"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M10 2.5 18.5 17H1.5L10 2.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <line x1="10" y1="8" x2="10" y2="11.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="10" cy="14" r="0.9" fill="currentColor" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">
      <line x1="3" y1="8" x2="13" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">
      <line x1="8" y1="3" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="3" y1="8" x2="13" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true" focusable="false">
      <circle cx="10" cy="10" r="3.6" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <line x1="10" y1="1.6" x2="10" y2="3.4" />
        <line x1="10" y1="16.6" x2="10" y2="18.4" />
        <line x1="1.6" y1="10" x2="3.4" y2="10" />
        <line x1="16.6" y1="10" x2="18.4" y2="10" />
        <line x1="4.2" y1="4.2" x2="5.4" y2="5.4" />
        <line x1="14.6" y1="14.6" x2="15.8" y2="15.8" />
        <line x1="14.6" y1="5.4" x2="15.8" y2="4.2" />
        <line x1="4.2" y1="15.8" x2="5.4" y2="14.6" />
      </g>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true" focusable="false">
      <path
        d="M17 12.5A7 7 0 0 1 7.5 3 7.5 7.5 0 1 0 17 12.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true" focusable="false">
      <path
        d="M16 10a6 6 0 1 1-1.8-4.3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M16 3.5v4.2h-4.2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PrintIcon() {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true" focusable="false">
      <path
        d="M5.5 7.5V3h9v4.5M5.5 15h9v-3.2h-9V15Zm-2.3-7.5h13.6a1.2 1.2 0 0 1 1.2 1.2v4.1a1.2 1.2 0 0 1-1.2 1.2H15v-3.4H5v3.4H3.2A1.2 1.2 0 0 1 2 9.3V5.2A1.2 1.2 0 0 1 3.2 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function DoughCalculator() {
  const idPrefix = useId();
  const prefersReducedMotion = usePrefersReducedMotion();

  const [theme, setTheme] = useState<ThemeName>(() => {
    if (typeof window === "undefined") return "light";
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Storage may be unavailable (private browsing, etc). Theme still
      // applies for this session.
    }
  }, [theme]);

  // Raw text state per field so a baker can type freely (including
  // temporarily invalid values) before we validate.
  const [loavesText, setLoavesText] = useState(String(DEFAULT_RECIPE.loaves));
  const [loafWeightText, setLoafWeightText] = useState(String(DEFAULT_RECIPE.loafWeight));
  const [hydrationText, setHydrationText] = useState(String(DEFAULT_RECIPE.hydration));
  const [starterText, setStarterText] = useState(String(DEFAULT_RECIPE.starter));
  const [saltText, setSaltText] = useState(String(DEFAULT_RECIPE.salt));

  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimeoutRef = useRef<number | null>(null);

  const recipe: Recipe = useMemo(
    () => ({
      loaves: parseFloat(loavesText),
      loafWeight: parseFloat(loafWeightText),
      hydration: parseFloat(hydrationText),
      starter: parseFloat(starterText),
      salt: parseFloat(saltText),
    }),
    [loavesText, loafWeightText, hydrationText, starterText, saltText],
  );

  const errors = useMemo(() => validate(recipe), [recipe]);

  // For the live math, fall back to the last valid values so results never
  // show NaN while a baker is mid-edit; the field itself still shows red.
  const safeRecipe: Recipe = useMemo(
    () => ({
      loaves: inRange(recipe.loaves, RANGES.loaves.min, RANGES.loaves.max) ? recipe.loaves : DEFAULT_RECIPE.loaves,
      loafWeight: inRange(recipe.loafWeight, RANGES.loafWeight.min, RANGES.loafWeight.max)
        ? recipe.loafWeight
        : DEFAULT_RECIPE.loafWeight,
      hydration: inRange(recipe.hydration, RANGES.hydration.min, RANGES.hydration.max)
        ? recipe.hydration
        : DEFAULT_RECIPE.hydration,
      starter: inRange(recipe.starter, RANGES.starter.min, RANGES.starter.max)
        ? recipe.starter
        : DEFAULT_RECIPE.starter,
      salt: inRange(recipe.salt, RANGES.salt.min, RANGES.salt.max) ? recipe.salt : DEFAULT_RECIPE.salt,
    }),
    [recipe],
  );

  const weights = useMemo(() => computeWeights(safeRecipe), [safeRecipe]);

  const animatedFlour = useAnimatedNumber(weights.flour);
  const animatedWater = useAnimatedNumber(weights.water);
  const animatedStarter = useAnimatedNumber(weights.starter);
  const animatedSalt = useAnimatedNumber(weights.salt);
  const animatedTotal = useAnimatedNumber(weights.total);

  const hydrationHigh = safeRecipe.hydration > HYDRATION_WARNING_THRESHOLD;

  const resultsSummary = `${formatGrams(weights.flour)} flour, ${formatGrams(weights.water)} water, ${formatGrams(
    weights.starter,
  )} starter, ${formatGrams(weights.salt)} salt. Total dough weight ${formatGrams(weights.total)}.`;

  const handleThemeToggle = useCallback(() => {
    setTheme((current) => (current === "light" ? "dark" : "light"));
  }, []);

  const nudgeLoaves = useCallback(
    (delta: number) => {
      const current = inRange(recipe.loaves, RANGES.loaves.min, RANGES.loaves.max)
        ? recipe.loaves
        : DEFAULT_RECIPE.loaves;
      const next = Math.min(RANGES.loaves.max, Math.max(RANGES.loaves.min, current + delta));
      setLoavesText(String(next));
    },
    [recipe.loaves],
  );

  const handleReset = useCallback(() => {
    setLoavesText(String(DEFAULT_RECIPE.loaves));
    setLoafWeightText(String(DEFAULT_RECIPE.loafWeight));
    setHydrationText(String(DEFAULT_RECIPE.hydration));
    setStarterText(String(DEFAULT_RECIPE.starter));
    setSaltText(String(DEFAULT_RECIPE.salt));
    setAdvancedOpen(false);
  }, []);

  const handlePrint = useCallback(() => {
    if (typeof window !== "undefined") {
      window.print();
    }
  }, []);

  const handleSave = useCallback(() => {
    try {
      window.localStorage.setItem("danas-dough-saved-recipe", JSON.stringify(safeRecipe));
    } catch {
      // Ignore storage failures; the toast still confirms the in-session save.
    }
    setToastVisible(true);
    if (toastTimeoutRef.current !== null) {
      window.clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = window.setTimeout(() => {
      setToastVisible(false);
    }, 3200);
  }, [safeRecipe]);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current !== null) {
        window.clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const loavesId = `${idPrefix}-loaves`;
  const loafWeightId = `${idPrefix}-loaf-weight`;
  const hydrationId = `${idPrefix}-hydration`;
  const starterId = `${idPrefix}-starter`;
  const saltId = `${idPrefix}-salt`;

  return (
    <div className={`dough-app theme-${theme}`} data-theme={theme}>
      <header className="dough-header">
        <div className="dough-header-text">
          <p className="dough-brand">Dana&rsquo;s Dough</p>
          <h1 className="dough-title">Baker&rsquo;s Calculator</h1>
          <p className="dough-intro">
            Tell it how many loaves and how wet you like your dough, and it weighs out the rest.
          </p>
        </div>
        <div className="dough-header-actions">
          <button
            type="button"
            className="icon-button"
            onClick={handleReset}
            aria-label="Reset to default recipe"
            title="Reset to defaults"
          >
            <ResetIcon />
          </button>
          <button
            type="button"
            className="icon-button"
            onClick={handlePrint}
            aria-label="Print recipe card"
            title="Print recipe"
          >
            <PrintIcon />
          </button>
          <button
            type="button"
            className="icon-button theme-toggle"
            onClick={handleThemeToggle}
            aria-pressed={theme === "dark"}
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          >
            {theme === "dark" ? <MoonIcon /> : <SunIcon />}
          </button>
        </div>
      </header>

      <main className="dough-main">
        <section className="panel inputs-panel" aria-labelledby={`${idPrefix}-inputs-heading`}>
          <h2 id={`${idPrefix}-inputs-heading`} className="visually-hidden">
            Recipe inputs
          </h2>

          <div className="field-group">
            <label htmlFor={loavesId}>Number of loaves</label>
            <div className="stepper">
              <button
                type="button"
                className="stepper-button"
                onClick={() => nudgeLoaves(-1)}
                aria-label="Decrease number of loaves"
                disabled={safeRecipe.loaves <= RANGES.loaves.min && loavesText === String(safeRecipe.loaves)}
              >
                <MinusIcon />
              </button>
              <input
                id={loavesId}
                className={`stepper-input${errors.loaves ? " field-invalid" : ""}`}
                type="number"
                inputMode="numeric"
                placeholder="Loaves"
                min={RANGES.loaves.min}
                max={RANGES.loaves.max}
                step={1}
                value={loavesText}
                onChange={(event) => setLoavesText(event.target.value)}
                aria-invalid={Boolean(errors.loaves)}
                aria-describedby={errors.loaves ? `${loavesId}-error` : undefined}
              />
              <button
                type="button"
                className="stepper-button"
                onClick={() => nudgeLoaves(1)}
                aria-label="Increase number of loaves"
                disabled={safeRecipe.loaves >= RANGES.loaves.max && loavesText === String(safeRecipe.loaves)}
              >
                <PlusIcon />
              </button>
            </div>
            {errors.loaves && (
              <p className="field-error" id={`${loavesId}-error`} role="alert">
                {errors.loaves}
              </p>
            )}
          </div>

          <div className="field-group">
            <label htmlFor={loafWeightId}>Loaf weight</label>
            <div className="segmented" role="group" aria-label="Loaf weight presets">
              {LOAF_WEIGHT_PRESETS.map((preset) => {
                const selected = Number(loafWeightText) === preset;
                return (
                  <button
                    key={preset}
                    type="button"
                    className={`segment${selected ? " segment-selected" : ""}`}
                    aria-pressed={selected}
                    onClick={() => setLoafWeightText(String(preset))}
                  >
                    {preset} g
                  </button>
                );
              })}
              <input
                id={loafWeightId}
                className={`segment-input${errors.loafWeight ? " field-invalid" : ""}`}
                type="number"
                inputMode="numeric"
                placeholder="Custom g"
                min={RANGES.loafWeight.min}
                max={RANGES.loafWeight.max}
                step={1}
                value={loafWeightText}
                onChange={(event) => setLoafWeightText(event.target.value)}
                aria-invalid={Boolean(errors.loafWeight)}
                aria-describedby={errors.loafWeight ? `${loafWeightId}-error` : undefined}
              />
            </div>
            {errors.loafWeight && (
              <p className="field-error" id={`${loafWeightId}-error`} role="alert">
                {errors.loafWeight}
              </p>
            )}
          </div>

          <div className="field-group">
            <div className="slider-label-row">
              <label htmlFor={hydrationId}>Hydration</label>
              <span className={`slider-value${hydrationHigh ? " value-warning" : ""}`}>
                {hydrationHigh && <WarningIcon />}
                {Number.isFinite(recipe.hydration) ? recipe.hydration : ""}%
              </span>
            </div>
            <input
              id={hydrationId}
              className={`slider${errors.hydration ? " field-invalid" : ""}`}
              type="range"
              min={RANGES.hydration.min}
              max={RANGES.hydration.max}
              step={1}
              value={inRange(recipe.hydration, RANGES.hydration.min, RANGES.hydration.max) ? recipe.hydration : safeRecipe.hydration}
              onChange={(event) => setHydrationText(event.target.value)}
              aria-invalid={Boolean(errors.hydration)}
              aria-describedby={
                [hydrationHigh ? `${hydrationId}-warning` : null, errors.hydration ? `${hydrationId}-error` : null]
                  .filter(Boolean)
                  .join(" ") || undefined
              }
            />
            {hydrationHigh && (
              <p className="field-warning" id={`${hydrationId}-warning`}>
                <WarningIcon /> Above {HYDRATION_WARNING_THRESHOLD}% is a wet, sticky dough that most home bakers find hard to handle.
              </p>
            )}
            {errors.hydration && (
              <p className="field-error" id={`${hydrationId}-error`} role="alert">
                {errors.hydration}
              </p>
            )}
          </div>

          <div className="advanced-section">
            <button
              type="button"
              className="advanced-toggle"
              aria-expanded={advancedOpen}
              aria-controls={`${idPrefix}-advanced-panel`}
              onClick={() => setAdvancedOpen((open) => !open)}
            >
              <span className={`disclosure-caret${advancedOpen ? " disclosure-caret-open" : ""}`} aria-hidden="true" />
              Advanced: starter &amp; salt
            </button>
            <div
              id={`${idPrefix}-advanced-panel`}
              className={`advanced-panel${advancedOpen ? " advanced-panel-open" : ""}`}
              hidden={!advancedOpen}
            >
              <div className="field-group">
                <label htmlFor={starterId}>Starter percent</label>
                <input
                  id={starterId}
                  className={`text-input${errors.starter ? " field-invalid" : ""}`}
                  type="number"
                  inputMode="decimal"
                  placeholder={`Starter % (${RANGES.starter.min}-${RANGES.starter.max})`}
                  min={RANGES.starter.min}
                  max={RANGES.starter.max}
                  step={1}
                  value={starterText}
                  onChange={(event) => setStarterText(event.target.value)}
                  aria-invalid={Boolean(errors.starter)}
                  aria-describedby={errors.starter ? `${starterId}-error` : undefined}
                />
                {errors.starter && (
                  <p className="field-error" id={`${starterId}-error`} role="alert">
                    {errors.starter}
                  </p>
                )}
              </div>
              <div className="field-group">
                <label htmlFor={saltId}>Salt percent</label>
                <input
                  id={saltId}
                  className={`text-input${errors.salt ? " field-invalid" : ""}`}
                  type="number"
                  inputMode="decimal"
                  placeholder={`Salt % (${RANGES.salt.min}-${RANGES.salt.max})`}
                  min={RANGES.salt.min}
                  max={RANGES.salt.max}
                  step={0.1}
                  value={saltText}
                  onChange={(event) => setSaltText(event.target.value)}
                  aria-invalid={Boolean(errors.salt)}
                  aria-describedby={errors.salt ? `${saltId}-error` : undefined}
                />
                {errors.salt && (
                  <p className="field-error" id={`${saltId}-error`} role="alert">
                    {errors.salt}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="panel results-panel" aria-labelledby={`${idPrefix}-results-heading`}>
          <h2 id={`${idPrefix}-results-heading`}>Your recipe</h2>
          <div className="visually-hidden" role="status" aria-live="polite">
            {resultsSummary}
          </div>
          <table className="breakdown-table">
            <caption className="visually-hidden">Ingredient weights as baker&rsquo;s percentages of flour</caption>
            <thead>
              <tr>
                <th scope="col">Ingredient</th>
                <th scope="col">Baker&rsquo;s %</th>
                <th scope="col">Weight</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Flour</th>
                <td>100%</td>
                <td>
                  <span className="gram-value">{formatGrams(animatedFlour)}</span>
                </td>
              </tr>
              <tr>
                <th scope="row">Water</th>
                <td>{safeRecipe.hydration}%</td>
                <td>
                  <span className="gram-value">{formatGrams(animatedWater)}</span>
                </td>
              </tr>
              <tr>
                <th scope="row">Starter</th>
                <td>{safeRecipe.starter}%</td>
                <td>
                  <span className="gram-value">{formatGrams(animatedStarter)}</span>
                </td>
              </tr>
              <tr>
                <th scope="row">Salt</th>
                <td>{safeRecipe.salt}%</td>
                <td>
                  <span className="gram-value">{formatGrams(animatedSalt)}</span>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="total-row">
            <span className="total-label">Total dough weight</span>
            <span className="total-value">{formatGrams(animatedTotal)}</span>
          </div>

          <button type="button" className="save-button" onClick={handleSave}>
            Save this recipe
          </button>
        </section>
      </main>

      <div
        className={`toast${toastVisible ? " toast-visible" : ""}`}
        role="status"
        aria-live="polite"
      >
        Recipe saved.
      </div>
    </div>
  );
}
