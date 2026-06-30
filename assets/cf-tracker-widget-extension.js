/**
 * Pitcher Filter Health Tracker — Recharge Affinity Custom Extension
 * ===================================================================
 *
 * PURPOSE:
 *   Standalone Custom Extension upload artifact for the Recharge Affinity
 *   Home Page Builder. This file is uploaded directly via the Affinity
 *   customizer (Storefront → Customer portal → Customize → Add a section →
 *   Custom extensions → Create a custom extension) and rendered inside the
 *   Affinity portal without any Shopify Liquid wrapper.
 *
 * REGISTRATION:
 *   Tag name:   cf-tracker-widget
 *   Events:     Recharge::action::orderChanged  (triggers refresh())
 *
 * BUSINESS LOGIC (see pitcher-business-logic.md):
 *   This widget is self-driving. On connect it authenticates with the Recharge
 *   customer-portal SDK (the global `recharge` object), finds the active
 *   "Pitcher Replacement Filter" subscription, and computes everything below.
 *   When the SDK is unavailable (e.g. the Affinity customizer preview) it falls
 *   back to the attribute-driven defaults so the preview still renders.
 *
 *   1. Eligibility — renders only when an active subscription's product_title
 *      contains "Pitcher Replacement Filter"; otherwise the element is hidden.
 *   2. Lifespan — start = `_last_reset_date` property || subscription created_at.
 *      daysPerFilter by `_household_size` (1:120, 2:90, 3:60, 4:60, else 90).
 *      totalFilters = packSize(variant) × quantity.
 *      replaceBy = start + (daysPerFilter × totalFilters − 1) days.
 *   3. Gauge — cycleLength = replaceBy − start (fallback 30); daysLeft =
 *      replaceBy − today clamped [0, cycleLength]; arc fill = portion used up;
 *      colors: 0 → #ED7C5C, ≤14 → #EDCC8B, else blue gradient; the big number
 *      animates 30 → real value (cubic ease-out).
 *   4. EWG — two chained GETs (zip → PWS → ContaminantList) cross-referenced
 *      against window.theme.contaminantSettings.contaminants by name (case-
 *      insensitive) with non-zero percentRemoved. Any failure → count 0.
 *   5. Caching — localStorage (delivery_zipcode / ewg_removed_count /
 *      ewg_removed_contaminants / delivery_address_hash); a changed delivery
 *      address fingerprint (zip|city|province|country) is detected as stale and
 *      re-fetches EWG data for the new location.
 *   6. Actions — Edit Household + Reset write `_household_size` /
 *      `_last_reset_date` via Recharge updateSubscription, then recompute with
 *      no page reload.
 *
 * ATTRIBUTES (fallback defaults when the Recharge SDK is unavailable):
 *   days-left, total-days, delivered-date, replace-date, household-size,
 *   zip-code, contaminant-count, gallons-filtered, days-of-protection,
 *   bottles-saved, alert-message, location-alert-message, bg-image, bg-video
 *
 * IMPORTANT:
 *   - This file uses `export default` as required by the Custom Extension API.
 *   - There is NO `customElements.define()` call — Recharge handles element
 *     registration using the tag name entered in the customizer.
 *   - Zero external imports. Zero Shopify/Liquid dependencies. Fully standalone.
 *   - All CSS, SVG, and HTML are self-contained within Shadow DOM.
 *   - Portal overlays (Reset / Household modals) append to `document.body`.
 *   - The `refresh()` method is called by Recharge on configured events.
 *
 * ⚠ SECURITY NOTE: the EWG API key is hardcoded in plaintext (see EWG_API_KEY
 *   below) and therefore exposed in the client bundle. Rotate it and/or proxy
 *   the EWG calls through a backend if the key carries rate/cost implications.
 */

const CF_STYLES = `
  :host {
    --cf-color-primary: #2C70BB;
    --cf-color-foreground-dark: #202635;
    --cf-color-background-light: #F2F7FB;
    --cf-color-alert-bg: #D9E8F4;
    --cf-color-radio-bg: #E6F0F8;
    --cf-color-radio-border: #D3D8DD;
    --cf-color-label-gray: #797D86;
    --cf-color-map-pin: #ED7C5C;
    --cf-color-white: #FFFFFF;
    --cf-color-black: #000000;

    --cf-font-body: 'FT System', system-ui, sans-serif;
    --cf-font-mono: 'FT System Mono', 'Courier New', monospace;

    display: block;
    width: 100%;
    box-sizing: border-box;
  }

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  /* ── Main Tracker ── */
  .cf-tracker {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding: 20px;
    position: relative;
    overflow: hidden;
    background-color: #1B3A5C;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 4px;
    min-height: 438px;
    width: 354px;
    max-width: 100%;
  }

  .cf-tracker__bg-video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
    pointer-events: none;
  }

  .cf-tracker > *:not(.cf-tracker__bg-video) {
    position: relative;
    z-index: 1;
  }

  .cf-tracker__title {
    font-family: var(--cf-font-body);
    font-weight: 400;
    font-size: 22px;
    line-height: 29px;
    letter-spacing: -0.22px;
    text-align: center;
    color: var(--cf-color-white);
  }

  /* ── Arc Lockup ── */
  .cf-tracker__arc-lockup {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 354px;
    max-width: 100%;
  }

  .cf-tracker__dates {
    display: flex;
    justify-content: space-between;
    width: 340px;
    max-width: 100%;
    padding: 0 7px;
  }

  .cf-tracker__date-label {
    font-family: var(--cf-font-mono);
    font-weight: 400;
    font-size: 10px;
    line-height: 14px;
    letter-spacing: 0.4px;
    text-transform: uppercase;
    color: var(--cf-color-white);
  }

  .cf-tracker__date-label--end {
    text-align: right;
  }

  .cf-tracker__counter-wrap {
    position: relative;
    width: 270px;
    height: 185px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
  }

  .cf-tracker__arc-svg {
    width: 270px;
    height: 134px;
    position: absolute;
    top: 0;
    left: 0;
  }

  .cf-tracker__arc-bg {
    fill: none;
    stroke: var(--cf-color-background-light);
    stroke-width: 8;
    opacity: 0.2;
    stroke-linecap: round;
  }

  .cf-tracker__arc-fill {
    fill: none;
    stroke: var(--cf-color-background-light);
    stroke-width: 8;
    stroke-linecap: round;
    transition: stroke-dashoffset 0.6s ease;
  }

  .cf-tracker__counter-inner {
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    width: 189px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .cf-tracker__days-number {
    font-family: var(--cf-font-body);
    font-weight: 400;
    font-size: 84px;
    line-height: 119px;
    letter-spacing: -1.68px;
    text-align: center;
    color: var(--cf-color-white);
  }

  .cf-tracker__days-label-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 4px 0;
  }

  .cf-tracker__days-label {
    font-family: var(--cf-font-mono);
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.56px;
    text-transform: uppercase;
    text-align: center;
    color: var(--cf-color-white);
  }

  .cf-tracker__stats-link-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
  }

  .cf-tracker__info-icon {
    width: 13px;
    height: 13px;
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .cf-tracker__info-icon svg {
    width: 13px;
    height: 13px;
    display: block;
  }

  .cf-tracker__stats-link {
    font-family: var(--cf-font-body);
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    text-align: center;
    text-decoration: underline;
    color: var(--cf-color-white);
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
  }

  /* ── Bottom Area ── */
  .cf-tracker__bottom {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    width: 320px;
    max-width: 100%;
    margin-top: auto;
    padding-top: 16px;
  }

  /* ── Alert Banner ── */
  .cf-tracker__alert {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 11px 12px;
    background: var(--cf-color-alert-bg);
    border-radius: 4px;
    width: 100%;
    overflow: hidden;
  }

  .cf-tracker__alert--location {
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .cf-tracker__alert--hidden {
    display: none;
  }

  .cf-tracker__alert-text {
    font-family: var(--cf-font-body);
    font-weight: 400;
    font-size: 10px;
    line-height: 15px;
    letter-spacing: 0.1px;
    color: var(--cf-color-foreground-dark);
    flex: 1;
  }

  .cf-tracker__alert-close {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .cf-tracker__alert-close svg {
    width: 10px;
    height: 10px;
  }

  .cf-tracker__map-pin {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .cf-tracker__map-pin svg {
    width: 7px;
    height: 14px;
  }

  /* ── Action Links ── */
  .cf-tracker__actions {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  .cf-tracker__action-link-wrap {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .cf-tracker__action-link {
    font-family: var(--cf-font-body);
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: -0.14px;
    text-align: center;
    text-decoration: underline;
    color: var(--cf-color-white);
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
  }

  /* ── Inline Panel (Stats) ── */
  .cf-tracker__inline-panel {
    display: none;
    flex-direction: column;
    gap: 17px;
    padding: 12px 0 36px 0;
    background: var(--cf-color-background-light);
    width: 100%;
    border-radius: 4px;
    overflow: hidden;
    flex-grow: 1;
  }

  .cf-tracker__inline-panel--visible {
    display: flex;
  }

  .cf-tracker__inline-panel .cf-tracker__modal-section {
    gap: 12px;
  }

  .cf-tracker__modal-section {
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: flex-end;
    padding: 0 18px;
  }

  .cf-tracker__close-btn {
    width: 24px;
    height: 24px;
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    align-self: flex-end;
  }

  .cf-tracker__close-btn svg {
    width: 15px;
    height: 15px;
  }

  .cf-tracker__text-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
  }

  .cf-tracker__modal-title {
    font-family: var(--cf-font-body);
    font-weight: 400;
    font-size: 22px;
    line-height: 29px;
    letter-spacing: -0.22px;
    color: var(--cf-color-foreground-dark);
  }

  /* ── Stats View ── */
  .cf-tracker__stats-section-label {
    font-family: 'Inter', var(--cf-font-body);
    font-weight: 400;
    font-size: 13px;
    line-height: 16px;
    letter-spacing: 0.52px;
    text-transform: uppercase;
    color: var(--cf-color-foreground-dark);
    width: 100%;
  }

  .cf-tracker__stats-grid {
    display: flex;
    justify-content: space-between;
    gap: 2px;
    width: 100%;
  }

  .cf-tracker__stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0;
    width: 93px;
  }

  .cf-tracker__stat-circle {
    width: 68px;
    height: 68px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }

  .cf-tracker__stat-circle svg {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .cf-tracker__stat-number {
    font-family: var(--cf-font-body);
    font-weight: 400;
    font-size: 22px;
    line-height: 29px;
    letter-spacing: -0.22px;
    text-align: center;
    color: var(--cf-color-white);
    position: relative;
    z-index: 1;
  }

  .cf-tracker__stat-number--small {
    font-size: 20px;
    line-height: 24px;
    letter-spacing: -0.2px;
  }

  .cf-tracker__stat-label {
    font-family: var(--cf-font-mono);
    font-weight: 400;
    font-size: 10px;
    line-height: 14px;
    letter-spacing: 0.4px;
    text-transform: uppercase;
    text-align: center;
    color: var(--cf-color-foreground-dark);
  }

  .cf-tracker__stats-body {
    font-family: var(--cf-font-body);
    font-weight: 400;
    font-size: 12px;
    line-height: 17px;
    letter-spacing: 0.12px;
    color: var(--cf-color-foreground-dark);
  }

  .cf-tracker__stats-disclaimer {
    font-family: var(--cf-font-body);
    font-weight: 400;
    font-size: 10px;
    line-height: 15px;
    letter-spacing: 0.1px;
    color: var(--cf-color-foreground-dark);
    width: 100%;
  }

  .cf-tracker__stats-text-container {
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 100%;
    align-items: flex-end;
  }
`;

/* ── SVG Icons ── */
const SVG_CLOSE = `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 1L1 14M1 1L14 14" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const SVG_CLOSE_SMALL = `<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 1L1 9M1 1L9 9" stroke="#000000" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const SVG_MAP_PIN = `<svg width="7" height="14" viewBox="0 0 7 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.5 0C1.567 0 0 1.567 0 3.5C0 6.125 3.5 10 3.5 10S7 6.125 7 3.5C7 1.567 5.433 0 3.5 0ZM3.5 4.75C2.81 4.75 2.25 4.19 2.25 3.5C2.25 2.81 2.81 2.25 3.5 2.25C4.19 2.25 4.75 2.81 4.75 3.5C4.75 4.19 4.19 4.75 3.5 4.75Z" fill="#ED7C5C"/></svg>`;

const SVG_INFO_CIRCLE = `<svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="6.5" cy="6.5" r="6.5" fill="#FFFFFF"/><text x="6.5" y="10" text-anchor="middle" font-size="10.4" font-weight="400" fill="#202635" style="font-family:'FT System',system-ui,sans-serif;letter-spacing:-0.1px">i</text></svg>`;

/* ──────────────────────────────────────────────────────────────────────────
   Business-logic configuration & pure helpers (see pitcher-business-logic.md)
   ────────────────────────────────────────────────────────────────────────── */

// ⚠ Hardcoded EWG API key — only a prefix is documented in the spec. Replace
// `...` with the full key from the original bundle, or expose it on
// window.theme.contaminantSettings.ewgApiKey to override at runtime. Until then
// the EWG step fails gracefully and the contaminant count falls back to 0.
const EWG_API_KEY = '5a4227b3-...';
const EWG_ZIP_SYSTEMS_URL = 'https://waterapi.ewg.org/zip_systems.php';
const EWG_SYSTEM_INFO_URL = 'https://waterapi.ewg.org/systeminformation.php';

const ELIGIBLE_PRODUCT_KEYWORD = 'Pitcher Replacement Filter';

// Default looping background video (used when no `bg-video` attribute is set,
// e.g. when uploaded as a Recharge Custom Extension with no Liquid wrapper).
const DEFAULT_BG_VIDEO = 'https://cdn.shopify.com/videos/c/o/v/6acf20f1b2664e0c86ba01e7c03cfd2d.mp4';

const DAYS_PER_FILTER_BY_HOUSEHOLD = { '1': 120, '2': 90, '3': 60, '4': 60 };
const DEFAULT_DAYS_PER_FILTER = 90;
const DEFAULT_HOUSEHOLD_SIZE = '2';

const FALLBACK_CYCLE_DAYS = 30;
const ANIMATION_START_VALUE = 30;
const ANIMATION_DURATION_MS = 1200;

const COLOR_DEPLETED = '#ED7C5C'; // 0 days
const COLOR_WARNING = '#EDCC8B';  // ≤ 14 days
const COLOR_OK = '#2C70BB';       // otherwise (blue gradient)

const LS_KEYS = {
  zip: 'delivery_zipcode',
  count: 'ewg_removed_count',
  contaminants: 'ewg_removed_contaminants',
  addrHash: 'delivery_address_hash'
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const MS_PER_DAY = 86400000;

function formatShortDate(date) {
  const d = date instanceof Date ? date : new Date(date);
  if (!d || isNaN(d.getTime())) return '---';
  return MONTHS[d.getMonth()] + ' ' + d.getDate();
}

function lc(str) {
  return String(str == null ? '' : str).toLowerCase().trim();
}

// Pack size from variant title: "3-Pack"/"6 Pack" → 3/6, "Single" → 1, else 1.
function parsePackSize(variantTitle) {
  const t = lc(variantTitle);
  if (!t) return 1;
  if (t.indexOf('single') !== -1) return 1;
  const m = t.match(/(\d+)\s*[- ]?\s*pack/);
  if (m) return parseInt(m[1], 10) || 1;
  return 1;
}

// Read a line-item property value from a Recharge subscription.
function getSubscriptionProperty(sub, name) {
  if (!sub || !Array.isArray(sub.properties)) return null;
  for (let i = 0; i < sub.properties.length; i++) {
    const p = sub.properties[i];
    if (p && p.name === name) return p.value;
  }
  return null;
}

function getDaysPerFilter(householdSize) {
  return DAYS_PER_FILTER_BY_HOUSEHOLD[String(householdSize)] || DEFAULT_DAYS_PER_FILTER;
}

// Section 2 — filter lifespan formula.
function computeLifespan(sub) {
  const resetDate = getSubscriptionProperty(sub, '_last_reset_date');
  const createdAt = sub && sub.created_at;
  const startStr = resetDate || createdAt;
  const startDate = startStr ? new Date(startStr) : null;

  const household = getSubscriptionProperty(sub, '_household_size') || DEFAULT_HOUSEHOLD_SIZE;
  const daysPerFilter = getDaysPerFilter(household);

  const variantTitle = sub && (sub.variant_title || (sub.variant && sub.variant.title));
  const packSize = parsePackSize(variantTitle);
  const quantity = parseInt(sub && sub.quantity, 10) || 1;
  const totalFilters = packSize * quantity;

  let replaceBy = null;
  if (startDate && !isNaN(startDate.getTime())) {
    replaceBy = new Date(startDate.getTime());
    replaceBy.setDate(replaceBy.getDate() + (daysPerFilter * totalFilters - 1));
  }

  return {
    startDate: startDate,
    replaceBy: replaceBy,
    householdSize: String(household),
    daysPerFilter: daysPerFilter,
    totalFilters: totalFilters
  };
}

// Section 3 — days-left gauge.
function computeGauge(startDate, replaceBy, today) {
  let cycleLengthDays = FALLBACK_CYCLE_DAYS;
  if (startDate && replaceBy && !isNaN(startDate.getTime()) && !isNaN(replaceBy.getTime())) {
    const diff = Math.round((replaceBy.getTime() - startDate.getTime()) / MS_PER_DAY);
    if (diff > 0) cycleLengthDays = diff;
  }

  let daysLeft = 0;
  if (replaceBy && !isNaN(replaceBy.getTime())) {
    daysLeft = Math.round((replaceBy.getTime() - today.getTime()) / MS_PER_DAY);
  }
  daysLeft = Math.min(Math.max(daysLeft, 0), cycleLengthDays);

  let fillFraction = (cycleLengthDays - daysLeft) / cycleLengthDays;
  fillFraction = Math.min(Math.max(fillFraction, 0), 1);

  let color;
  if (daysLeft <= 0) color = COLOR_DEPLETED;
  else if (daysLeft <= 14) color = COLOR_WARNING;
  else color = COLOR_OK;

  return { cycleLengthDays: cycleLengthDays, daysLeft: daysLeft, fillFraction: fillFraction, color: color, isOk: color === COLOR_OK };
}

// Section 4 — cross-reference EWG contaminants against the store filter config.
function crossReferenceContaminants(ewgList, storeContaminants) {
  if (!Array.isArray(ewgList) || !ewgList.length) return [];
  if (!Array.isArray(storeContaminants) || !storeContaminants.length) return [];

  const byName = {};
  storeContaminants.forEach(function (c) {
    const name = lc(c && (c.name || c.contaminant || c.title));
    if (name) byName[name] = c;
  });

  const matched = [];
  ewgList.forEach(function (item) {
    const name = lc(item && (item.Contaminant || item.contaminant || item.name));
    if (!name) return;
    const store = byName[name];
    if (!store) return;
    const raw = store.percentRemoved != null ? store.percentRemoved : store.percent_removed;
    const pct = parseFloat(raw);
    if (!isNaN(pct) && pct > 0) matched.push({ name: name, percentRemoved: pct });
  });
  return matched;
}

// Section 4 — two chained, unauthenticated GETs. Any failure → { count:0 }.
function fetchEwgContaminants(zip, apiKey, storeContaminants) {
  const empty = { count: 0, contaminants: [] };
  if (!zip || !/^\d{5}$/.test(String(zip))) return Promise.resolve(empty);
  if (!apiKey || apiKey.indexOf('...') !== -1) return Promise.resolve(empty);

  const step1 = EWG_ZIP_SYSTEMS_URL + '?zip=' + encodeURIComponent(zip) + '&key=' + encodeURIComponent(apiKey);
  return fetch(step1)
    .then(function (r) { if (!r.ok) throw new Error('zip_systems'); return r.json(); })
    .then(function (data) {
      const list = data && data.SystemList;
      const pws = list && list[0] && list[0].PWS;
      if (!pws) throw new Error('no PWS');
      const step2 = EWG_SYSTEM_INFO_URL + '?pws=' + encodeURIComponent(pws) + '&key=' + encodeURIComponent(apiKey);
      return fetch(step2);
    })
    .then(function (r) { if (!r.ok) throw new Error('systeminformation'); return r.json(); })
    .then(function (data) {
      const matched = crossReferenceContaminants((data && data.ContaminantList) || [], storeContaminants);
      return { count: matched.length, contaminants: matched };
    })
    .catch(function () { return empty; });
}

// Section 5 — address fingerprint for stale-address detection.
function buildFingerprint(addr) {
  if (!addr) return '';
  const parts = [
    addr.zip || addr.zipcode || '',
    addr.city || '',
    addr.province || addr.province_code || addr.state || '',
    addr.country || addr.country_code || ''
  ];
  return parts.join('|').toLowerCase();
}

class CfTrackerWidget extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._currentView = 'main';
    this._alertDismissed = false;
    this._locationAlertDismissed = false;
    this._selectedHousehold = null;

    // Business-logic state (populated from Recharge when available).
    this._session = null;
    this._subscription = null;
    this._eligible = null;   // null = unknown (SDK not resolved yet)
    this._computed = null;   // computed lifespan / gauge / EWG values
    this._shouldAnimate = false;
    this._lastAnimatedValue = null;
  }

  static get observedAttributes() {
    return [
      'days-left', 'total-days', 'delivered-date', 'replace-date',
      'household-size', 'zip-code', 'contaminant-count',
      'gallons-filtered', 'days-of-protection', 'bottles-saved',
      'alert-message', 'location-alert-message', 'bg-image', 'bg-video'
    ];
  }

  connectedCallback() {
    this._selectedHousehold = this.getAttribute('household-size') || DEFAULT_HOUSEHOLD_SIZE;
    this._containerWidth = this.offsetWidth || 0;
    this._shouldAnimate = true;

    this.render();
    this._initData();

    this._orderChangedHandler = () => { this._initData(); };
    document.addEventListener('Recharge::action::orderChanged', this._orderChangedHandler);

    this._resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width;
        if (this._containerWidth !== newWidth) {
          this._containerWidth = newWidth;
          this.render();
        }
      }
    });
    this._resizeObserver.observe(this);
  }

  disconnectedCallback() {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }
    if (this._orderChangedHandler) {
      document.removeEventListener('Recharge::action::orderChanged', this._orderChangedHandler);
      this._orderChangedHandler = null;
    }
    this._removePortalOverlay();
  }

  attributeChangedCallback() {
    if (this.isConnected) {
      // Recharge-computed state always wins; attributes are only preview fallbacks.
      if (!this._computed) {
        this._selectedHousehold = this.getAttribute('household-size') || this._selectedHousehold || DEFAULT_HOUSEHOLD_SIZE;
      }
      this.render();
    }
  }

  /**
   * Called by Recharge when a configured event fires (e.g., Recharge::action::orderChanged).
   * Re-fetches subscription data and re-renders the widget.
   */
  refresh() {
    this._initData();
  }

  /* ──────────────────────────────────────────────────────────────────────
     Data layer — Recharge customer-portal SDK integration
     ────────────────────────────────────────────────────────────────────── */

  _initData() {
    this._waitForRecharge().then((rc) => {
      if (!rc) return; // SDK unavailable (e.g. customizer preview) — keep attribute defaults
      return this._loadFromRecharge(rc);
    }).catch((err) => {
      // Never let a data failure break the rendered widget.
      if (typeof console !== 'undefined') console.error('[cf-tracker] data init failed:', err);
    });
  }

  // Resolve the global `recharge` SDK, polling briefly while the portal boots.
  _waitForRecharge() {
    return new Promise((resolve) => {
      let tries = 0;
      const check = () => {
        if (typeof recharge !== 'undefined' && recharge && recharge.auth) return resolve(recharge);
        if (++tries > 20) return resolve(null);
        setTimeout(check, 1000);
      };
      check();
    });
  }

  _authenticate(rc) {
    if (this._session) return Promise.resolve(this._session);
    return rc.auth.loginCustomerPortal().then((s) => { this._session = s; return s; });
  }

  _fetchSubscriptions(rc, session) {
    return rc.subscription.listSubscriptions(session, {
      limit: 25, sort_by: 'id-asc', status: 'Active'
    }).then((res) => (res && res.subscriptions) || []).catch(() => []);
  }

  // Section 1 — eligibility.
  _findEligible(subs) {
    if (!Array.isArray(subs)) return null;
    const keyword = lc(ELIGIBLE_PRODUCT_KEYWORD);
    for (let i = 0; i < subs.length; i++) {
      if (lc(subs[i] && subs[i].product_title).indexOf(keyword) !== -1) return subs[i];
    }
    return null;
  }

  _loadFromRecharge(rc) {
    return this._authenticate(rc)
      .then((session) => this._fetchSubscriptions(rc, session))
      .then((subs) => {
        const sub = this._findEligible(subs);
        if (!sub) {
          this._eligible = false;
          this._hide();
          return;
        }
        this._eligible = true;
        this._subscription = sub;
        this._show();
        this._recompute();
        return this._loadAddressAndEwg(rc, this._session, sub);
      });
  }

  // Sections 2 & 3 — recompute lifespan + gauge from the current subscription.
  _computeFromSub(sub) {
    const today = new Date();
    const life = computeLifespan(sub);
    const gauge = computeGauge(life.startDate, life.replaceBy, today);

    const prev = this._computed || {};
    return {
      daysLeft: gauge.daysLeft,
      totalDays: gauge.cycleLengthDays,
      fillFraction: gauge.fillFraction,
      color: gauge.color,
      isOk: gauge.isOk,
      deliveredDate: life.startDate ? formatShortDate(life.startDate) : null,
      replaceDate: life.replaceBy ? formatShortDate(life.replaceBy) : null,
      householdSize: life.householdSize,
      nextCharge: (sub && sub.next_charge_scheduled_at) || null,
      // EWG values are filled in asynchronously — carry them across recomputes.
      contaminantCount: prev.contaminantCount,
      zipCode: prev.zipCode
    };
  }

  _recompute() {
    if (!this._subscription) return;
    this._computed = this._computeFromSub(this._subscription);
    this._selectedHousehold = this._computed.householdSize;
    this._shouldAnimate = true;
    this.render();
  }

  // Section 6 — write a line-item property via Recharge, then recompute.
  _updateSubscriptionProperty(name, value) {
    const sub = this._subscription;
    const props = this._mergeProperties(sub && sub.properties, name, value);

    const canCallApi = typeof recharge !== 'undefined' && recharge &&
      recharge.subscription && this._session && sub && sub.id;
    const updateFn = canCallApi &&
      (recharge.subscription.updateSubscription || recharge.subscription.update);

    if (!canCallApi || !updateFn) {
      // No backend (preview) — apply locally so the UI still reflects the change.
      this._subscription = this._applyLocalProperties(sub, props);
      return Promise.resolve(this._subscription);
    }

    return updateFn.call(recharge.subscription, this._session, sub.id, { properties: props })
      .then((res) => {
        this._subscription = (res && res.subscription) || this._applyLocalProperties(sub, props);
        return this._subscription;
      })
      .catch((err) => {
        if (typeof console !== 'undefined') console.error('[cf-tracker] updateSubscription failed:', err);
        this._subscription = this._applyLocalProperties(sub, props);
        return this._subscription;
      });
  }

  _mergeProperties(existing, name, value) {
    const props = Array.isArray(existing)
      ? existing.map((p) => ({ name: p.name, value: p.value }))
      : [];
    let found = false;
    for (let i = 0; i < props.length; i++) {
      if (props[i].name === name) { props[i].value = value; found = true; break; }
    }
    if (!found) props.push({ name: name, value: value });
    return props;
  }

  _applyLocalProperties(sub, props) {
    if (!sub) return { properties: props };
    const copy = Object.assign({}, sub);
    copy.properties = props;
    return copy;
  }

  /* ── Section 4 & 5 — EWG fetch with localStorage caching ── */

  _loadAddressAndEwg(rc, session, sub) {
    return this._getDeliveryAddress(rc, session, sub).then((addr) => {
      const zip = (addr && (addr.zip || addr.zipcode)) || this.getAttribute('zip-code') || '';
      const fingerprint = buildFingerprint(addr);
      return this._resolveEwg(zip, fingerprint);
    }).catch(() => {});
  }

  _getDeliveryAddress(rc, session, sub) {
    if (sub && sub.shipping_address) return Promise.resolve(sub.shipping_address);
    if (sub && sub.address) return Promise.resolve(sub.address);
    try {
      if (rc.address && rc.address.listAddresses) {
        return rc.address.listAddresses(session, { limit: 1 })
          .then((res) => {
            const arr = (res && (res.addresses || res)) || [];
            return arr[0] || null;
          })
          .catch(() => null);
      }
    } catch (e) { /* fall through */ }
    return Promise.resolve(null);
  }

  _resolveEwg(zip, fingerprint) {
    const cfg = (typeof window !== 'undefined' && window.theme && window.theme.contaminantSettings) || {};
    const storeContaminants = cfg.contaminants || [];
    const apiKey = cfg.ewgApiKey || EWG_API_KEY;

    const cachedHash = this._lsGet(LS_KEYS.addrHash);
    const cachedZip = this._lsGet(LS_KEYS.zip);
    const cachedCount = this._lsGet(LS_KEYS.count);

    const stale =
      (fingerprint && cachedHash && cachedHash !== fingerprint) ||
      (zip && cachedZip && cachedZip !== zip);

    // Fresh cache for the same location — use it, no network call.
    if (!stale && cachedZip && cachedZip === zip && cachedCount != null) {
      this._applyEwg(parseInt(cachedCount, 10) || 0, this._lsGetJson(LS_KEYS.contaminants) || [], zip);
      return Promise.resolve();
    }

    // Missing or stale cache → (re)fetch for the current location.
    return fetchEwgContaminants(zip, apiKey, storeContaminants).then((result) => {
      this._lsSet(LS_KEYS.zip, zip);
      this._lsSet(LS_KEYS.count, String(result.count));
      this._lsSet(LS_KEYS.contaminants, JSON.stringify(result.contaminants));
      if (fingerprint) this._lsSet(LS_KEYS.addrHash, fingerprint);
      this._applyEwg(result.count, result.contaminants, zip);
    });
  }

  _applyEwg(count, contaminants, zip) {
    if (!this._computed) this._computed = {};
    this._computed.contaminantCount = String(count);
    this._computed.zipCode = zip;
    this._ewgContaminants = contaminants || [];
    this.render();
  }

  _lsGet(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }
  _lsGetJson(key) {
    try { return JSON.parse(window.localStorage.getItem(key)); } catch (e) { return null; }
  }
  _lsSet(key, value) {
    try { window.localStorage.setItem(key, value); } catch (e) { /* private mode / quota */ }
  }

  _hide() { this.style.display = 'none'; }
  _show() { this.style.display = ''; }

  /* ── Data Getters (computed Recharge state wins, attributes are fallback) ── */
  get daysLeft() {
    if (this._computed && this._computed.daysLeft != null) return this._computed.daysLeft;
    return parseInt(this.getAttribute('days-left') || '28', 10);
  }

  get totalDays() {
    if (this._computed && this._computed.totalDays != null) return this._computed.totalDays;
    return parseInt(this.getAttribute('total-days') || '60', 10);
  }

  get deliveredDate() {
    if (this._computed && this._computed.deliveredDate) return this._computed.deliveredDate;
    return this.getAttribute('delivered-date') || 'Mar 21';
  }

  get replaceDate() {
    if (this._computed && this._computed.replaceDate) return this._computed.replaceDate;
    return this.getAttribute('replace-date') || 'Apr 21';
  }

  get householdSize() {
    return this._selectedHousehold || '2';
  }

  get zipCode() {
    if (this._computed && this._computed.zipCode) return this._computed.zipCode;
    return this.getAttribute('zip-code') || '84098';
  }

  get contaminantCount() {
    if (this._computed && this._computed.contaminantCount != null) return this._computed.contaminantCount;
    return this.getAttribute('contaminant-count') || '25';
  }

  get gallonsFiltered() {
    return this.getAttribute('gallons-filtered') || '250';
  }

  get daysOfProtection() {
    return this.getAttribute('days-of-protection') || '57';
  }

  get bottlesSaved() {
    return this.getAttribute('bottles-saved') || '900';
  }

  get alertMessage() {
    return this.getAttribute('alert-message') || `According to our records, your filter was delivered on 3/21. If you did not replace on that date, you can reset your filter health below.`;
  }

  get locationAlertMessage() {
    return this.getAttribute('location-alert-message') || '';
  }

  /* ── Render ── */
  render() {
    // Arc fill = portion USED UP (section 3). Use computed gauge when available,
    // otherwise derive the used-up portion from the attribute fallbacks.
    let fillFraction;
    let fillColor;
    if (this._computed && this._computed.fillFraction != null) {
      fillFraction = this._computed.fillFraction;
      fillColor = this._computed.color || COLOR_OK;
    } else {
      const total = this.totalDays || FALLBACK_CYCLE_DAYS;
      const remaining = Math.min(Math.max(this.daysLeft / total, 0), 1);
      fillFraction = 1 - remaining;
      const dl = this.daysLeft;
      fillColor = dl <= 0 ? COLOR_DEPLETED : (dl <= 14 ? COLOR_WARNING : COLOR_OK);
    }
    const isOkColor = fillColor === COLOR_OK;
    const strokeRef = isOkColor ? 'url(#cf-arc-grad)' : fillColor;

    const arcR = 126;
    const arcCx = 135;
    const arcCy = 130;
    const arcPath = `M ${arcCx - arcR} ${arcCy} A ${arcR} ${arcR} 0 0 1 ${arcCx + arcR} ${arcCy}`;
    const arcLength = Math.PI * arcR;
    const fillLength = arcLength * fillFraction;

    const bgImage = this.getAttribute('bg-image');
    const bgVideo = this.getAttribute('bg-video') || DEFAULT_BG_VIDEO;
    const bgStyle = (!bgVideo && bgImage) ? `background-image: url('${bgImage}');` : '';

    const existingVideo = this.shadowRoot.querySelector('.cf-tracker__bg-video');

    const showMain = this._currentView !== 'stats';

    this.shadowRoot.innerHTML = `
      <style>${CF_STYLES}</style>
      <div class="cf-tracker" id="cf-root" style="${bgStyle}">
        ${showMain ? this._renderMain(arcPath, arcLength, fillLength, strokeRef) : ''}
        ${this._currentView === 'stats' ? this._renderStatsView() : ''}
      </div>
    `;

    const root = this.shadowRoot.querySelector('#cf-root');
    if (bgVideo && root) {
      if (existingVideo) {
        root.prepend(existingVideo);
      } else {
        const vid = document.createElement('video');
        vid.className = 'cf-tracker__bg-video';
        vid.autoplay = true;
        vid.loop = true;
        vid.muted = true;
        vid.playsInline = true;
        vid.setAttribute('preload', 'auto');
        vid.src = bgVideo;
        root.prepend(vid);
        vid.play().catch(function() {});
      }
    }

    this._bindEvents();

    // Section 3 — animate the big number 30 → real value (cubic ease-out),
    // but only once per data change (not on every incidental re-render).
    if (showMain && this._shouldAnimate && this.daysLeft !== this._lastAnimatedValue) {
      this._animateDaysNumber(this.daysLeft);
      this._lastAnimatedValue = this.daysLeft;
      this._shouldAnimate = false;
    }

    this._removePortalOverlay();
    if (this._currentView === 'reset') {
      this._createPortalOverlay(this._renderResetContent());
    } else if (this._currentView === 'household') {
      this._createPortalOverlay(this._renderHouseholdContent());
    }
  }

  /* ── Section 3 — count-up animation (cubic ease-out) ── */
  _animateDaysNumber(target) {
    const el = this.shadowRoot.querySelector('.cf-tracker__days-number');
    if (!el) return;
    const start = ANIMATION_START_VALUE;
    if (target === start) { el.textContent = String(target); return; }

    const duration = ANIMATION_DURATION_MS;
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
    let startTime = null;

    const frame = (ts) => {
      if (startTime === null) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      const val = Math.round(start + (target - start) * easeOutCubic(p));
      el.textContent = String(val);
      if (p < 1) {
        this._animationFrame = requestAnimationFrame(frame);
      } else {
        el.textContent = String(target);
      }
    };
    this._animationFrame = requestAnimationFrame(frame);
  }

  /* ── Main Tracker View ── */
  _renderMain(arcPath, arcLength, fillLength, strokeRef) {
    const hasLocationAlert = this.locationAlertMessage || (this.zipCode && this.contaminantCount);
    const locationText = this.locationAlertMessage || `${this.zipCode}: Actively protecting from ${this.contaminantCount} contaminants in local drinking water. See What\u2019s in Your Water \u2192`;

    return `
      <span class="cf-tracker__title">Pitcher Filter Health</span>

      <div class="cf-tracker__arc-lockup">
        <div class="cf-tracker__dates">
          <span class="cf-tracker__date-label">Delivered<br>${this.deliveredDate}</span>
          <span class="cf-tracker__date-label cf-tracker__date-label--end">Replace By<br>${this.replaceDate}</span>
        </div>
        <div class="cf-tracker__counter-wrap">
          <svg class="cf-tracker__arc-svg" viewBox="0 0 270 134" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="cf-arc-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="#5BA8E8" />
                <stop offset="100%" stop-color="#2C70BB" />
              </linearGradient>
            </defs>
            <path class="cf-tracker__arc-bg" d="${arcPath}" />
            <path class="cf-tracker__arc-fill" d="${arcPath}"
              style="stroke: ${strokeRef};"
              stroke-dasharray="${arcLength}"
              stroke-dashoffset="${arcLength - fillLength}" />
          </svg>
          <div class="cf-tracker__counter-inner">
            <span class="cf-tracker__days-number">${this.daysLeft}</span>
            <div class="cf-tracker__days-label-wrap">
              <span class="cf-tracker__days-label">DAYS LEFT of filter protection</span>
              <div class="cf-tracker__stats-link-wrap" data-action="show-stats">
                <span class="cf-tracker__info-icon">${SVG_INFO_CIRCLE}</span>
                <button class="cf-tracker__stats-link" type="button" data-action="show-stats">My Filter Stats</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="cf-tracker__bottom">
        ${this._renderAlertBanner()}
        ${hasLocationAlert ? this._renderLocationAlert(locationText) : ''}
        <div class="cf-tracker__actions">
          <div class="cf-tracker__action-link-wrap">
            <button class="cf-tracker__action-link" type="button" data-action="show-reset">Reset Filter Health</button>
          </div>
          <div class="cf-tracker__action-link-wrap">
            <button class="cf-tracker__action-link" type="button" data-action="show-household">Edit Household Size</button>
          </div>
        </div>
      </div>
    `;
  }

  _renderAlertBanner() {
    if (this._alertDismissed) return '';
    return `
      <div class="cf-tracker__alert" id="cf-alert-banner">
        <span class="cf-tracker__alert-text">${this.alertMessage}</span>
        <button class="cf-tracker__alert-close" type="button" data-action="dismiss-alert" aria-label="Dismiss alert">
          ${SVG_CLOSE_SMALL}
        </button>
      </div>
    `;
  }

  _renderLocationAlert(text) {
    if (this._locationAlertDismissed) return '';
    return `
      <div class="cf-tracker__alert cf-tracker__alert--location" id="cf-location-alert">
        <div class="cf-tracker__map-pin">${SVG_MAP_PIN}</div>
        <span class="cf-tracker__alert-text">${text}</span>
        <button class="cf-tracker__alert-close" type="button" data-action="dismiss-location-alert" aria-label="Dismiss alert">
          ${SVG_CLOSE_SMALL}
        </button>
      </div>
    `;
  }

  _renderResetContent() {
    return `
      <button class="cf-portal-modal__close" type="button" data-action="back" aria-label="Close">
        ${SVG_CLOSE}
      </button>
      <div class="cf-portal-modal__text">
        <h2 class="cf-portal-modal__title">Reset Filter Health</h2>
        <p class="cf-portal-modal__body">Please confirm that you'd like to reset your Pitcher Filter Health tracker. Once confirmed, tracker will be reset to the current date. This action cannot be undone.</p>
      </div>
      <div class="cf-portal-modal__ctas">
        <button class="cf-portal-modal__cta cf-portal-modal__cta--primary" type="button" data-action="confirm-reset">Yes, reset health status</button>
        <button class="cf-portal-modal__cta cf-portal-modal__cta--secondary" type="button" data-action="back">Cancel</button>
      </div>
    `;
  }

  _renderHouseholdContent() {
    const options = [
      { value: '1', label: '1 Person' },
      { value: '2', label: '2 People' },
      { value: '3', label: '3 People' },
      { value: '4', label: '4 Or more people' }
    ];

    const radioMarkup = options.map(opt => {
      const isSelected = this._selectedHousehold === opt.value;
      return `
        <div class="cf-portal-modal__radio-option${isSelected ? ' cf-portal-modal__radio-option--selected' : ''}" data-action="select-household" data-value="${opt.value}">
          <div class="cf-portal-modal__radio-circle">
            <div class="cf-portal-modal__radio-circle-inner"></div>
          </div>
          <span class="cf-portal-modal__radio-label">${opt.label}</span>
        </div>
      `;
    }).join('');

    return `
      <button class="cf-portal-modal__close" type="button" data-action="back" aria-label="Close">
        ${SVG_CLOSE}
      </button>
      <div class="cf-portal-modal__radio-group-header">
        <div class="cf-portal-modal__text">
          <h2 class="cf-portal-modal__title">Edit Household Size</h2>
        </div>
        <div class="cf-portal-modal__radio-group">
          ${radioMarkup}
        </div>
      </div>
      <div class="cf-portal-modal__ctas">
        <button class="cf-portal-modal__cta cf-portal-modal__cta--primary" type="button" data-action="save-household">Save Changes</button>
        <button class="cf-portal-modal__cta cf-portal-modal__cta--secondary" type="button" data-action="back">Cancel</button>
      </div>
    `;
  }

  /* ── Sub-View: Stats (always inline) ── */
  _renderStatsView() {
    return this._renderInlinePanel(this._renderStatsContent(), ' cf-tracker__inline-panel--stats');
  }

  _renderStatsContent() {
    return `
      <div class="cf-tracker__stats-text-container">
        <button class="cf-tracker__close-btn" type="button" data-action="back" aria-label="Close">
          ${SVG_CLOSE}
        </button>
        <div class="cf-tracker__text-container">
          <h2 class="cf-tracker__modal-title" style="font-size: 22px; line-height: 29px; letter-spacing: -0.22px;">Did you know?</h2>
          <p class="cf-tracker__stats-body">Clearly Filtered removes 365+ contaminants including PFAS, lead, and arsenic vs most standard filters which only target 5\u201315.</p>
        </div>
      </div>
      <span class="cf-tracker__stats-section-label">Your Filter Stats:</span>
      <div class="cf-tracker__stats-grid">
        <div class="cf-tracker__stat-item">
          <div class="cf-tracker__stat-circle">
            <svg viewBox="0 0 68 68" xmlns="http://www.w3.org/2000/svg">
              <circle cx="34" cy="34" r="34" fill="#2C70BB"/>
            </svg>
            <span class="cf-tracker__stat-number">${this.gallonsFiltered}</span>
          </div>
          <span class="cf-tracker__stat-label">gallons filtered</span>
        </div>
        <div class="cf-tracker__stat-item">
          <div class="cf-tracker__stat-circle">
            <svg viewBox="0 0 68 68" xmlns="http://www.w3.org/2000/svg">
              <circle cx="34" cy="34" r="34" fill="#2C70BB"/>
            </svg>
            <span class="cf-tracker__stat-number">${this.daysOfProtection}</span>
          </div>
          <span class="cf-tracker__stat-label">Days of protection</span>
        </div>
        <div class="cf-tracker__stat-item">
          <div class="cf-tracker__stat-circle">
            <svg viewBox="0 0 68 68" xmlns="http://www.w3.org/2000/svg">
              <circle cx="34" cy="34" r="34" fill="#2C70BB"/>
            </svg>
            <span class="cf-tracker__stat-number cf-tracker__stat-number--small">${this.bottlesSaved}</span>
          </div>
          <span class="cf-tracker__stat-label">plastic bottles saved</span>
        </div>
      </div>
      <p class="cf-tracker__stats-disclaimer">*Filter data and health is based on household size and recommended daily intake. Filters last ~60 days at 10 glasses/day. Actual lifespan may vary by local water quality and personal consumption habit</p>
    `;
  }

  /* ── Portal Overlay (renders on document.body, outside Shadow DOM) ── */
  _createPortalOverlay(content) {
    const overlay = document.createElement('div');
    overlay.id = 'cf-tracker-portal-overlay';
    overlay.innerHTML = `
      <style>
        #cf-tracker-portal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.25);
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cf-portal-modal {
          display: flex;
          flex-direction: column;
          gap: 17px;
          padding: 24px 0 36px;
          background: #F2F7FB;
          width: 512px;
          max-width: 95vw;
          max-height: 90vh;
          overflow-y: auto;
          border-radius: 8px;
        }
        .cf-portal-modal__section {
          display: flex;
          flex-direction: column;
          gap: 20px;
          align-items: flex-end;
          padding: 0 18px;
        }
        .cf-portal-modal__close {
          width: 24px;
          height: 24px;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          align-self: flex-end;
        }
        .cf-portal-modal__close svg { width: 15px; height: 15px; }
        .cf-portal-modal__text {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 100%;
        }
        .cf-portal-modal__title {
          font-family: 'FT System', system-ui, sans-serif;
          font-weight: 400;
          font-size: 36px;
          line-height: 47px;
          letter-spacing: -0.36px;
          color: #202635;
          margin: 0;
        }
        .cf-portal-modal__body {
          font-family: 'FT System', system-ui, sans-serif;
          font-weight: 400;
          font-size: 16px;
          line-height: 22px;
          color: #797D86;
          margin: 0;
        }
        .cf-portal-modal__ctas {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 100%;
        }
        .cf-portal-modal__cta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 10px 24px 12px;
          border-radius: 60px;
          font-family: 'FT System', system-ui, sans-serif;
          font-weight: 400;
          font-size: 14px;
          line-height: 20px;
          text-align: center;
          cursor: pointer;
          border: none;
          width: 100%;
        }
        .cf-portal-modal__cta--primary {
          background: #2C70BB;
          color: #FFFFFF;
        }
        .cf-portal-modal__cta--secondary {
          background: #FFFFFF;
          color: #202635;
          border: 1px solid #202635;
        }
        .cf-portal-modal__radio-group-header {
          display: flex;
          flex-direction: column;
          gap: 16px;
          width: 100%;
        }
        .cf-portal-modal__radio-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          width: 100%;
          padding-bottom: 4px;
        }
        .cf-portal-modal__radio-option {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          border-radius: 2px;
          background: #E6F0F8;
          border: 1px solid #D3D8DD;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
        }
        .cf-portal-modal__radio-option--selected {
          background: #FFFFFF;
          border-color: #202635;
        }
        .cf-portal-modal__radio-circle {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 1px solid #202635;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .cf-portal-modal__radio-circle-inner {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: transparent;
          transition: background 0.15s;
        }
        .cf-portal-modal__radio-option--selected .cf-portal-modal__radio-circle-inner {
          background: #202635;
        }
        .cf-portal-modal__radio-label {
          font-family: 'FT System', system-ui, sans-serif;
          font-weight: 400;
          font-size: 14px;
          line-height: 20px;
          letter-spacing: 0.14px;
          color: #202635;
        }
        @media (max-width: 512px) {
          .cf-portal-modal { border-radius: 8px 8px 0 0; align-self: flex-end; max-height: 85vh; }
          .cf-portal-modal__title { font-size: 22px; line-height: 29px; letter-spacing: -0.22px; }
          .cf-portal-modal__body { font-size: 14px; line-height: 20px; }
        }
      </style>
      <div class="cf-portal-modal" data-stop-propagation>
        <div class="cf-portal-modal__section">
          ${content}
        </div>
      </div>
    `;

    overlay.addEventListener('click', (e) => {
      if (e.target.closest('[data-stop-propagation]') && !e.target.closest('[data-action]')) return;

      const actionEl = e.target.closest('[data-action]');
      if (!actionEl) {
        if (this._currentView === 'household') {
          this._selectedHousehold = this._tempHousehold || this._selectedHousehold;
        }
        this._showView('main');
        return;
      }

      const action = actionEl.getAttribute('data-action');
      switch (action) {
        case 'back':
          if (this._currentView === 'household') {
            this._selectedHousehold = this._tempHousehold || this._selectedHousehold;
          }
          this._showView('main');
          break;

        case 'confirm-reset':
          this._handleReset();
          break;

        case 'save-household':
          this._handleHouseholdSave();
          break;

        case 'select-household': {
          const value = actionEl.getAttribute('data-value');
          if (value) {
            this._selectedHousehold = value;
            const options = overlay.querySelectorAll('.cf-portal-modal__radio-option');
            options.forEach(opt => {
              opt.classList.toggle('cf-portal-modal__radio-option--selected', opt.getAttribute('data-value') === value);
            });
          }
          break;
        }
      }
    });

    document.body.appendChild(overlay);
    this._portalOverlay = overlay;
  }

  _removePortalOverlay() {
    if (this._portalOverlay) {
      this._portalOverlay.remove();
      this._portalOverlay = null;
    }
  }

  /* ── Section 6 — user actions (write to Recharge, then recompute) ── */
  _handleReset() {
    const timestamp = new Date().toISOString();
    this.dispatchEvent(new CustomEvent('cf-tracker:reset', {
      bubbles: true, composed: true,
      detail: { timestamp: timestamp }
    }));
    this._showView('main');
    if (!this._subscription) return; // preview / no real data — event only
    this._updateSubscriptionProperty('_last_reset_date', timestamp).then(() => {
      this._recompute();
    });
  }

  _handleHouseholdSave() {
    const value = this._selectedHousehold;
    this.dispatchEvent(new CustomEvent('cf-tracker:household-change', {
      bubbles: true, composed: true,
      detail: { householdSize: value }
    }));
    this._showView('main');
    if (!this._subscription) return; // preview / no real data — event only
    this._updateSubscriptionProperty('_household_size', value).then(() => {
      this._recompute();
    });
  }

  /* ── Inline Panel (Stats only) ── */
  _renderInlinePanel(content, extraClass) {
    return `
      <div class="cf-tracker__inline-panel cf-tracker__inline-panel--visible${extraClass}">
        <div class="cf-tracker__modal-section">
          ${content}
        </div>
      </div>
    `;
  }

  /* ── Event Binding (Shadow DOM — main + stats only) ── */
  _bindEvents() {
    this.shadowRoot.addEventListener('click', (e) => {
      const target = e.target.closest('[data-action]');
      if (!target) return;

      switch (target.getAttribute('data-action')) {
        case 'dismiss-alert':
          this._alertDismissed = true;
          this.render();
          break;

        case 'dismiss-location-alert':
          this._locationAlertDismissed = true;
          this.render();
          break;

        case 'show-reset':
          this._showView('reset');
          break;

        case 'show-household':
          this._tempHousehold = this._selectedHousehold;
          this._showView('household');
          break;

        case 'show-stats':
          this._showView('stats');
          break;

        case 'back':
          this._showView('main');
          break;
      }
    });
  }

  _showView(view) {
    this._currentView = view;
    this.render();
  }
}

export default CfTrackerWidget;
