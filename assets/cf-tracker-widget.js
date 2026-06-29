/**
 * Pitcher Filter Health Tracker Widget
 * Self-contained Web Component for Recharge Affinity custom extension.
 * Zero external dependencies — all CSS, HTML, SVG inlined in Shadow DOM.
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

class CfTrackerWidget extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._currentView = 'main';
    this._alertDismissed = false;
    this._locationAlertDismissed = false;
    this._selectedHousehold = null;
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
    this._selectedHousehold = this.getAttribute('household-size') || '2';
    this._containerWidth = 0;

    /* Track container width via ResizeObserver for reliable desktop/mobile detection */
    this._resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width;
        if (this._containerWidth !== newWidth) {
          this._containerWidth = newWidth;
          /* Re-render sub-views to switch between modal and inline layout */
          if (this._currentView !== 'main') {
            this.render();
          }
        }
      }
    });
    this._resizeObserver.observe(this);

    /* Defer first render to ensure layout is computed */
    requestAnimationFrame(() => {
      this._containerWidth = this.offsetWidth;
      this.render();
    });
  }

  disconnectedCallback() {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }
    this._removePortalOverlay();
  }

  attributeChangedCallback() {
    if (this.isConnected) {
      this._selectedHousehold = this.getAttribute('household-size') || this._selectedHousehold || '2';
      this.render();
    }
  }

  refresh() {
    this.render();
  }

  /* ── Data Getters ── */
  get daysLeft() {
    return parseInt(this.getAttribute('days-left') || '28', 10);
  }

  get totalDays() {
    return parseInt(this.getAttribute('total-days') || '60', 10);
  }

  get deliveredDate() {
    return this.getAttribute('delivered-date') || 'Mar 21';
  }

  get replaceDate() {
    return this.getAttribute('replace-date') || 'Apr 21';
  }

  get householdSize() {
    return this._selectedHousehold || '2';
  }

  get zipCode() {
    return this.getAttribute('zip-code') || '84098';
  }

  get contaminantCount() {
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
    const percentage = Math.min(Math.max(this.daysLeft / this.totalDays, 0), 1);

    const arcR = 126;
    const arcCx = 135;
    const arcCy = 130;
    const arcPath = `M ${arcCx - arcR} ${arcCy} A ${arcR} ${arcR} 0 0 1 ${arcCx + arcR} ${arcCy}`;
    const arcLength = Math.PI * arcR;
    const fillLength = arcLength * percentage;

    const bgImage = this.getAttribute('bg-image');
    const bgVideo = this.getAttribute('bg-video');
    const bgStyle = (!bgVideo && bgImage) ? `background-image: url('${bgImage}');` : '';
    const videoHtml = bgVideo
      ? `<video class="cf-tracker__bg-video" autoplay loop muted playsinline><source src="${bgVideo}" type="video/mp4"></video>`
      : '';

    const showMain = this._currentView !== 'stats';

    this.shadowRoot.innerHTML = `
      <style>${CF_STYLES}</style>
      <div class="cf-tracker" id="cf-root" style="${bgStyle}">
        ${videoHtml}
        ${showMain ? this._renderMain(arcPath, arcLength, fillLength) : ''}
        ${this._currentView === 'stats' ? this._renderStatsView() : ''}
      </div>
    `;

    this._bindEvents();

    const bgVid = this.shadowRoot.querySelector('.cf-tracker__bg-video');
    if (bgVid) bgVid.play().catch(function() {});

    this._removePortalOverlay();
    if (this._currentView === 'reset') {
      this._createPortalOverlay(this._renderResetContent());
    } else if (this._currentView === 'household') {
      this._createPortalOverlay(this._renderHouseholdContent());
    }
  }

  /* ── Main Tracker View ── */
  _renderMain(arcPath, arcLength, fillLength) {
    const hasLocationAlert = this.locationAlertMessage || (this.zipCode && this.contaminantCount);
    const locationText = this.locationAlertMessage || `${this.zipCode}: Actively protecting from ${this.contaminantCount} contaminants in local drinking water. See What's in Your Water \u2192`;

    return `
      <span class="cf-tracker__title">Pitcher Filter Health</span>

      <div class="cf-tracker__arc-lockup">
        <div class="cf-tracker__dates">
          <span class="cf-tracker__date-label">Delivered<br>${this.deliveredDate}</span>
          <span class="cf-tracker__date-label cf-tracker__date-label--end">Replace By<br>${this.replaceDate}</span>
        </div>
        <div class="cf-tracker__counter-wrap">
          <svg class="cf-tracker__arc-svg" viewBox="0 0 270 134" xmlns="http://www.w3.org/2000/svg">
            <path class="cf-tracker__arc-bg" d="${arcPath}" />
            <path class="cf-tracker__arc-fill" d="${arcPath}"
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
          this.dispatchEvent(new CustomEvent('cf-tracker:reset', {
            bubbles: true, composed: true,
            detail: { timestamp: new Date().toISOString() }
          }));
          this._showView('main');
          break;

        case 'save-household':
          this.dispatchEvent(new CustomEvent('cf-tracker:household-change', {
            bubbles: true, composed: true,
            detail: { householdSize: this._selectedHousehold }
          }));
          this._showView('main');
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
