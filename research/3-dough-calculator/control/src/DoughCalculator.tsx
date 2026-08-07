import React, { useEffect, useMemo, useRef, useState } from "react";
import "./styles.css";

type Theme = "light" | "dark";

interface RecipeState {
  loaves: number;
  loafWeight: number;
  hydration: number;
  starter: number;
  salt: number;
}

const DEFAULTS: RecipeState = {
  loaves: 2,
  loafWeight: 900,
  hydration: 75,
  starter: 20,
  salt: 2,
};

const RANGES = {
  loaves: { min: 1, max: 12 },
  loafWeight: { min: 400, max: 1200 },
  hydration: { min: 50, max: 100 },
  starter: { min: 5, max: 40 },
  salt: { min: 1, max: 3 },
};

const LOAF_PRESETS = [400, 900, 1200];
const HIGH_HYDRATION_THRESHOLD = 85;
const THEME_STORAGE_KEY = "danas-dough-theme";
const RECIPE_STORAGE_KEY = "danas-dough-recipe";

function inRange(value: number, key: keyof typeof RANGES): boolean {
  if (Number.isNaN(value)) return false;
  const { min, max } = RANGES[key];
  return value >= min && value <= max;
}

function computeWeights(recipe: RecipeState) {
  const totalDoughWeight = recipe.loaves * recipe.loafWeight;
  const sumOfPercentages = 100 + recipe.hydration + recipe.starter + recipe.salt;
  const flour = totalDoughWeight / (sumOfPercentages / 100);
  const water = flour * (recipe.hydration / 100);
  const starter = flour * (recipe.starter / 100);
  const salt = flour * (recipe.salt / 100);
  return { totalDoughWeight, flour, water, starter, salt };
}

/** Hook that animates a number smoothly toward a target value. */
function useAnimatedNumber(target: number, duration = 420): number {
  const [display, setDisplay] = useState(target);
  const frameRef = useRef<number | null>(null);
  const fromRef = useRef(target);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    fromRef.current = display;
    startRef.current = null;

    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
    }

    const from = fromRef.current;
    const delta = target - from;

    if (Math.abs(delta) < 0.001) {
      setDisplay(target);
      return;
    }

    const step = (timestamp: number) => {
      if (startRef.current === null) {
        startRef.current = timestamp;
      }
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(from + delta * eased);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(step);
      } else {
        setDisplay(target);
        frameRef.current = null;
      }
    };

    frameRef.current = requestAnimationFrame(step);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration]);

  return display;
}

function AnimatedGrams({ value }: { value: number }) {
  const animated = useAnimatedNumber(value);
  return <>{animated.toFixed(1)} g</>;
}

function MinusIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <path d="M3 8h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
      <circle cx="10" cy="10" r="3.6" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <path d="M10 1.6v2.2M10 16.2v2.2M18.4 10h-2.2M3.8 10H1.6M15.6 4.4l-1.6 1.6M6 14l-1.6 1.6M15.6 15.6L14 14M6 6 4.4 4.4" />
      </g>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
      <path
        d="M16.5 12.9A7.2 7.2 0 0 1 7.1 3.5a7.2 7.2 0 1 0 9.4 9.4Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
      <path
        d="M15.5 6.5A6.5 6.5 0 1 0 17 10.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path d="M15.7 3v4h-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PrintIcon() {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
      <rect x="5" y="2.5" width="10" height="5" rx="0.6" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <rect x="3" y="7.2" width="14" height="7" rx="1.2" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <rect x="5.5" y="12" width="9" height="5.5" rx="0.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true">
      <path
        d="M10 2.6 18.2 16.6H1.8Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M10 8.2v3.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="10" cy="14" r="0.9" fill="currentColor" />
    </svg>
  );
}

export default function DoughCalculator() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    return saved === "dark" || saved === "light" ? (saved as Theme) : "light";
  });

  const [recipe, setRecipe] = useState<RecipeState>(() => {
    if (typeof window === "undefined") return DEFAULTS;
    try {
      const saved = window.localStorage.getItem(RECIPE_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULTS, ...parsed };
      }
    } catch {
      // ignore malformed storage
    }
    return DEFAULTS;
  });

  // Raw text values for fields that accept free typing, so a baker can
  // temporarily see an out-of-range value (shown in red) before correcting it.
  const [loafWeightText, setLoafWeightText] = useState<string>(String(DEFAULTS.loafWeight));
  const [loavesText, setLoavesText] = useState<string>(String(DEFAULTS.loaves));
  const [starterText, setStarterText] = useState<string>(String(DEFAULTS.starter));
  const [saltText, setSaltText] = useState<string>(String(DEFAULTS.salt));

  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimerRef = useRef<number | null>(null);

  useEffect(() => {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    setLoafWeightText(String(recipe.loafWeight));
    setLoavesText(String(recipe.loaves));
    setStarterText(String(recipe.starter));
    setSaltText(String(recipe.salt));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const loavesValid = inRange(recipe.loaves, "loaves");
  const loafWeightValid = inRange(recipe.loafWeight, "loafWeight");
  const starterValid = inRange(recipe.starter, "starter");
  const saltValid = inRange(recipe.salt, "salt");

  const weights = useMemo(() => computeWeights(recipe), [recipe]);
  const isHighHydration = recipe.hydration > HIGH_HYDRATION_THRESHOLD;

  function updateRecipe(patch: Partial<RecipeState>) {
    setRecipe((prev) => ({ ...prev, ...patch }));
  }

  function stepLoaves(delta: number) {
    const next = Math.min(RANGES.loaves.max, Math.max(RANGES.loaves.min, recipe.loaves + delta));
    updateRecipe({ loaves: next });
    setLoavesText(String(next));
  }

  function handleLoavesTextChange(text: string) {
    setLoavesText(text);
    const parsed = Number(text);
    if (text.trim() !== "" && !Number.isNaN(parsed)) {
      updateRecipe({ loaves: parsed });
    }
  }

  function handleLoafWeightTextChange(text: string) {
    setLoafWeightText(text);
    const parsed = Number(text);
    if (text.trim() !== "" && !Number.isNaN(parsed)) {
      updateRecipe({ loafWeight: parsed });
    }
  }

  function handleStarterTextChange(text: string) {
    setStarterText(text);
    const parsed = Number(text);
    if (text.trim() !== "" && !Number.isNaN(parsed)) {
      updateRecipe({ starter: parsed });
    }
  }

  function handleSaltTextChange(text: string) {
    setSaltText(text);
    const parsed = Number(text);
    if (text.trim() !== "" && !Number.isNaN(parsed)) {
      updateRecipe({ salt: parsed });
    }
  }

  function selectLoafPreset(value: number) {
    updateRecipe({ loafWeight: value });
    setLoafWeightText(String(value));
  }

  function handleReset() {
    setRecipe(DEFAULTS);
    setLoavesText(String(DEFAULTS.loaves));
    setLoafWeightText(String(DEFAULTS.loafWeight));
    setStarterText(String(DEFAULTS.starter));
    setSaltText(String(DEFAULTS.salt));
    setAdvancedOpen(false);
  }

  function handleSave() {
    try {
      window.localStorage.setItem(RECIPE_STORAGE_KEY, JSON.stringify(recipe));
    } catch {
      // ignore storage failures
    }
    setToastVisible(true);
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastVisible(false);
    }, 2600);
  }

  function handlePrint() {
    window.print();
  }

  const rows: Array<{ key: string; label: string; percent: number; grams: number }> = [
    { key: "flour", label: "Flour", percent: 100, grams: weights.flour },
    { key: "water", label: "Water", percent: recipe.hydration, grams: weights.water },
    { key: "starter", label: "Starter", percent: recipe.starter, grams: weights.starter },
    { key: "salt", label: "Salt", percent: recipe.salt, grams: weights.salt },
  ];

  return (
    <div className={`dd-app dd-theme-${theme}`}>
      <div className="dd-card">
        <header className="dd-header">
          <div className="dd-brand">
            <p className="dd-brand-name">Dana&rsquo;s Dough</p>
            <h1 className="dd-tool-name">Baker&rsquo;s Calculator</h1>
            <p className="dd-tagline">
              Tell it how many loaves and how wet you like your dough, and it weighs out the rest.
            </p>
          </div>
          <div className="dd-header-actions">
            <button
              type="button"
              className="dd-icon-btn"
              onClick={handleReset}
              aria-label="Reset to defaults"
              title="Reset to defaults"
            >
              <ResetIcon />
            </button>
            <button
              type="button"
              className="dd-icon-btn"
              onClick={handlePrint}
              aria-label="Print recipe card"
              title="Print recipe card"
            >
              <PrintIcon />
            </button>
            <button
              type="button"
              className="dd-theme-toggle"
              onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
              aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
              title={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
            >
              {theme === "light" ? <MoonIcon /> : <SunIcon />}
            </button>
          </div>
        </header>

        <div className="dd-body">
          <section className="dd-panel dd-inputs" aria-label="Recipe inputs">
            <div className="dd-field dd-field-loaves">
              <label className="dd-field-label" htmlFor="dd-loaves">
                Loaves
              </label>
              <div className="dd-stepper">
                <button
                  type="button"
                  className="dd-stepper-btn"
                  onClick={() => stepLoaves(-1)}
                  aria-label="Decrease number of loaves"
                >
                  <MinusIcon />
                </button>
                <input
                  id="dd-loaves"
                  className={`dd-stepper-input ${!loavesValid ? "dd-invalid" : ""}`}
                  type="number"
                  inputMode="numeric"
                  placeholder="Loaves"
                  value={loavesText}
                  onChange={(e) => handleLoavesTextChange(e.target.value)}
                  min={RANGES.loaves.min}
                  max={RANGES.loaves.max}
                  aria-invalid={!loavesValid}
                />
                <button
                  type="button"
                  className="dd-stepper-btn"
                  onClick={() => stepLoaves(1)}
                  aria-label="Increase number of loaves"
                >
                  <PlusIcon />
                </button>
              </div>
            </div>

            <div className="dd-field dd-field-loafweight">
              <span className="dd-field-label">Loaf weight</span>
              <div className="dd-segmented" role="group" aria-label="Loaf weight presets">
                {LOAF_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    className={`dd-segment ${recipe.loafWeight === preset ? "dd-segment-active" : ""}`}
                    onClick={() => selectLoafPreset(preset)}
                  >
                    {preset} g
                  </button>
                ))}
                <input
                  className={`dd-segment-custom ${!loafWeightValid ? "dd-invalid" : ""}`}
                  type="number"
                  inputMode="numeric"
                  placeholder="Exact g"
                  value={loafWeightText}
                  onChange={(e) => handleLoafWeightTextChange(e.target.value)}
                  min={RANGES.loafWeight.min}
                  max={RANGES.loafWeight.max}
                  aria-label="Exact loaf weight in grams"
                  aria-invalid={!loafWeightValid}
                />
              </div>
            </div>

            <div className="dd-field dd-field-hydration">
              <div className="dd-hydration-label-row">
                <label className="dd-field-label" htmlFor="dd-hydration">
                  Hydration
                </label>
                <span className={`dd-hydration-value ${isHighHydration ? "dd-value-warning" : ""}`}>
                  {isHighHydration && <WarningIcon />}
                  {recipe.hydration}%
                </span>
              </div>
              <input
                id="dd-hydration"
                className="dd-slider"
                type="range"
                min={RANGES.hydration.min}
                max={RANGES.hydration.max}
                value={recipe.hydration}
                onChange={(e) => updateRecipe({ hydration: Number(e.target.value) })}
              />
              <div className="dd-slider-scale">
                <span>{RANGES.hydration.min}%</span>
                <span>{RANGES.hydration.max}%</span>
              </div>
            </div>

            <div className="dd-advanced">
              <button
                type="button"
                className="dd-advanced-toggle"
                onClick={() => setAdvancedOpen((v) => !v)}
                aria-expanded={advancedOpen}
              >
                <span className={`dd-chevron ${advancedOpen ? "dd-chevron-open" : ""}`} aria-hidden="true" />
                Advanced
              </button>
              <div className={`dd-advanced-panel ${advancedOpen ? "dd-advanced-open" : ""}`}>
                <div className="dd-advanced-inner">
                  <div className="dd-field">
                    <label className="dd-field-label" htmlFor="dd-starter">
                      Starter percent
                    </label>
                    <input
                      id="dd-starter"
                      className={`dd-text-input ${!starterValid ? "dd-invalid" : ""}`}
                      type="number"
                      inputMode="numeric"
                      placeholder="Starter %"
                      value={starterText}
                      onChange={(e) => handleStarterTextChange(e.target.value)}
                      min={RANGES.starter.min}
                      max={RANGES.starter.max}
                      aria-invalid={!starterValid}
                    />
                  </div>
                  <div className="dd-field">
                    <label className="dd-field-label" htmlFor="dd-salt">
                      Salt percent
                    </label>
                    <input
                      id="dd-salt"
                      className={`dd-text-input ${!saltValid ? "dd-invalid" : ""}`}
                      type="number"
                      inputMode="numeric"
                      placeholder="Salt %"
                      value={saltText}
                      onChange={(e) => handleSaltTextChange(e.target.value)}
                      min={RANGES.salt.min}
                      max={RANGES.salt.max}
                      aria-invalid={!saltValid}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="dd-panel dd-results" aria-label="Recipe breakdown">
            <table className="dd-table">
              <thead>
                <tr>
                  <th scope="col">Ingredient</th>
                  <th scope="col">Baker&rsquo;s %</th>
                  <th scope="col">Weight</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.key}>
                    <td className="dd-ingredient-name">{row.label}</td>
                    <td className="dd-ingredient-percent">{row.percent}%</td>
                    <td className="dd-ingredient-grams">
                      <AnimatedGrams value={row.grams} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="dd-total">
              <span className="dd-total-label">Total dough weight</span>
              <span className="dd-total-value">
                <AnimatedGrams value={weights.totalDoughWeight} />
              </span>
            </div>

            <button type="button" className="dd-save-btn" onClick={handleSave}>
              Save this recipe
            </button>
          </section>
        </div>
      </div>

      <div className={`dd-toast ${toastVisible ? "dd-toast-visible" : ""}`} role="status" aria-live="polite">
        Recipe saved
      </div>
    </div>
  );
}
