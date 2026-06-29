/**
 * Order Summary Widget
 * Self-contained Web Component for Recharge Affinity custom extension.
 * Zero external dependencies — all CSS, HTML, SVG inlined in Shadow DOM.
 */

const SVG_INFO_CIRCLE = `<svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="6.5" cy="6.5" r="6" stroke="#2C70BB" stroke-width="1" fill="#FFFFFF"/><text x="6.5" y="10" text-anchor="middle" font-size="10.4" font-weight="400" fill="#2C70BB" style="font-family:'FT System',system-ui,sans-serif;letter-spacing:-0.1px">i</text></svg>`;

const SVG_INFO_DARK = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="6.5" stroke="#202635" stroke-width="1" fill="none"/><text x="8" y="11.5" text-anchor="middle" font-size="10" font-weight="400" fill="#202635" style="font-family:'FT System',system-ui,sans-serif">i</text></svg>`;

const CF_ORDER_SUMMARY_STYLES = `
  :host {
    --cf-os-color-primary: #2C70BB;
    --cf-os-color-foreground: #202635;
    --cf-os-color-foreground-alt: #24293B;
    --cf-os-color-bg: #FFFFFF;
    --cf-os-color-border: #D9E8F4;
    --cf-os-color-input-border: #D3D8DD;
    --cf-os-color-link: #2C70BB;
    --cf-os-color-img-bg: #F2F7FB;
    --cf-os-color-img-overlay: #ECF7FF;
    --cf-os-font-body: 'FT System', system-ui, sans-serif;
    --cf-os-font-mono: 'Inter', system-ui, sans-serif;

    display: block;
    width: 100%;
    box-sizing: border-box;
  }

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  /* ── Card Container ── */
  .cf-order-summary {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 0 18px 20px 18px;
    background: var(--cf-os-color-bg);
    border: 1px solid var(--cf-os-color-border);
    border-radius: 4px;
    width: 740px;
    max-width: 100%;
  }

  /* ── Section Titles ── */
  .cf-order-summary__section-title {
    font-family: var(--cf-os-font-body);
    font-weight: 400;
    font-size: 20px;
    line-height: 26px;
    letter-spacing: -0.2px;
    color: var(--cf-os-color-foreground);
    padding-top: 20px;
  }

  .cf-order-summary__section-title--first {
    padding-top: 20px;
  }

  /* ── Product Card ── */
  .cf-order-summary__product-card {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 20px;
  }

  .cf-order-summary__product-img-wrap {
    position: relative;
    width: 92px;
    height: 92px;
    flex-shrink: 0;
  }

  .cf-order-summary__product-img-bg {
    position: absolute;
    width: 92px;
    height: 92px;
    background: var(--cf-os-color-img-bg);
    border-radius: 2px;
    transform: rotate(3.1deg);
    top: 0;
    left: 0;
  }

  .cf-order-summary__product-img-bg--overlay {
    position: absolute;
    width: 82px;
    height: 92px;
    background: var(--cf-os-color-img-overlay);
    opacity: 0.15;
    border-radius: 2px;
    transform: rotate(3.1deg);
    top: 0;
    left: 5px;
  }

  .cf-order-summary__product-img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 45px;
    height: 51px;
    object-fit: contain;
    z-index: 1;
  }

  .cf-order-summary__product-qty-badge {
    position: absolute;
    top: -4px;
    right: -4px;
    z-index: 2;
    min-width: 23px;
    height: 23px;
    border-radius: 63px;
    background: var(--cf-os-color-foreground);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1px 9px;
  }

  .cf-order-summary__product-qty-text {
    font-family: var(--cf-os-font-body);
    font-weight: 400;
    font-size: 15px;
    line-height: 21px;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    text-align: center;
    color: var(--cf-os-color-bg);
  }

  .cf-order-summary__product-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .cf-order-summary__product-details {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .cf-order-summary__product-name {
    font-family: var(--cf-os-font-body);
    font-weight: 400;
    font-size: 18px;
    line-height: 25px;
    color: var(--cf-os-color-foreground-alt);
  }

  .cf-order-summary__product-price {
    font-family: var(--cf-os-font-body);
    font-weight: 400;
    font-size: 16px;
    line-height: 22px;
    color: var(--cf-os-color-foreground);
  }

  .cf-order-summary__edit-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 6px 20px 8px 20px;
    border-radius: 42px;
    border: 1px solid var(--cf-os-color-foreground);
    background: var(--cf-os-color-bg);
    font-family: var(--cf-os-font-body);
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    text-align: center;
    color: var(--cf-os-color-foreground);
    cursor: pointer;
    width: fit-content;
  }

  .cf-order-summary__edit-btn:hover {
    background: #f0f4f8;
  }

  /* ── Divider ── */
  .cf-order-summary__divider {
    width: 100%;
    height: 1px;
    background: var(--cf-os-color-border);
    border: none;
  }

  /* ── Order Summary Lines ── */
  .cf-order-summary__summary-lines {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .cf-order-summary__summary-detail {
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 100%;
  }

  .cf-order-summary__summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .cf-order-summary__summary-label {
    display: flex;
    align-items: center;
    gap: 4px;
    font-family: var(--cf-os-font-body);
    font-weight: 400;
    font-size: 16px;
    line-height: 22px;
    color: var(--cf-os-color-foreground);
  }

  .cf-order-summary__summary-value {
    font-family: var(--cf-os-font-body);
    font-weight: 400;
    font-size: 16px;
    line-height: 22px;
    text-align: right;
    color: var(--cf-os-color-foreground);
  }

  .cf-order-summary__info-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 13px;
    height: 13px;
    flex-shrink: 0;
  }

  .cf-order-summary__info-icon svg {
    width: 13px;
    height: 13px;
    display: block;
  }

  /* ── Total Row ── */
  .cf-order-summary__total-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .cf-order-summary__total-label {
    display: flex;
    align-items: center;
    gap: 4px;
    font-family: var(--cf-os-font-body);
    font-weight: 400;
    font-size: 18px;
    line-height: 25px;
    color: var(--cf-os-color-foreground);
  }

  .cf-order-summary__total-value {
    font-family: var(--cf-os-font-body);
    font-weight: 400;
    font-size: 18px;
    line-height: 25px;
    text-align: right;
    color: var(--cf-os-color-foreground);
  }

  /* ── Promo Code Row ── */
  .cf-order-summary__promo-row {
    display: flex;
    flex-direction: row;
    gap: 14px;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .cf-order-summary__promo-input-wrap {
    position: relative;
    flex: 1;
    max-width: 255px;
  }

  .cf-order-summary__promo-input {
    width: 100%;
    height: 34px;
    border-radius: 6px;
    border: 1px solid var(--cf-os-color-input-border);
    background: var(--cf-os-color-bg);
    padding: 0 12px;
    font-family: var(--cf-os-font-body);
    font-weight: 400;
    font-size: 14px;
    line-height: 21px;
    color: var(--cf-os-color-foreground);
    outline: none;
  }

  .cf-order-summary__promo-input::placeholder {
    color: var(--cf-os-color-foreground);
    opacity: 1;
  }

  .cf-order-summary__promo-input:focus {
    border-color: var(--cf-os-color-primary);
  }

  .cf-order-summary__promo-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 6px 20px 8px 20px;
    border-radius: 42px;
    border: 1px solid var(--cf-os-color-foreground);
    background: var(--cf-os-color-bg);
    font-family: var(--cf-os-font-body);
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    text-align: center;
    color: var(--cf-os-color-foreground);
    cursor: pointer;
    white-space: nowrap;
  }

  .cf-order-summary__promo-btn:hover {
    background: #f0f4f8;
  }

  .cf-order-summary__promo-msg {
    font-family: var(--cf-os-font-body);
    font-weight: 400;
    font-size: 12px;
    line-height: 17px;
    margin-top: 4px;
  }

  .cf-order-summary__promo-msg--success {
    color: #5ABE8A;
  }

  .cf-order-summary__promo-msg--error {
    color: #E55B4F;
  }

  /* ── Delivery Address & Payment ── */
  .cf-order-summary__address-section {
    display: flex;
    flex-direction: column;
    gap: 0;
    width: 100%;
  }

  .cf-order-summary__address-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .cf-order-summary__address-text {
    font-family: var(--cf-os-font-body);
    font-weight: 400;
    font-size: 16px;
    line-height: 22px;
    letter-spacing: -0.16px;
    color: var(--cf-os-color-foreground);
  }

  .cf-order-summary__address-text--bold {
    font-weight: 700;
  }

  .cf-order-summary__edit-link {
    font-family: var(--cf-os-font-body);
    font-weight: 400;
    font-size: 16px;
    line-height: 23px;
    text-decoration: underline;
    color: var(--cf-os-color-link);
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
  }

  .cf-order-summary__edit-link:hover {
    opacity: 0.8;
  }

  /* ── Loading State ── */
  .cf-order-summary__loading {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 18px;
    font-family: var(--cf-os-font-body);
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: #797D86;
  }

  /* ── Responsive — Mobile ── */
  @media screen and (max-width: 767px) {
    .cf-order-summary {
      width: 354px;
    }

    .cf-order-summary__section-title {
      font-size: 16px;
      line-height: 21px;
      letter-spacing: -0.16px;
    }

    .cf-order-summary__product-img-wrap {
      width: 80px;
      height: 80px;
    }

    .cf-order-summary__product-img-bg {
      width: 80px;
      height: 80px;
    }

    .cf-order-summary__product-img-bg--overlay {
      width: 71px;
      height: 80px;
    }

    .cf-order-summary__product-img {
      width: 40px;
      height: 44px;
    }

    .cf-order-summary__product-qty-badge {
      min-width: 20px;
      height: 18px;
      border-radius: 55px;
      padding: 1px 8px;
    }

    .cf-order-summary__product-qty-text {
      font-family: var(--cf-os-font-mono);
      font-size: 13px;
      line-height: 16px;
      letter-spacing: 0.52px;
    }

    .cf-order-summary__product-name {
      font-size: 14px;
      line-height: 20px;
      letter-spacing: 0.14px;
    }

    .cf-order-summary__product-price {
      font-size: 12px;
      line-height: 17px;
      letter-spacing: 0.12px;
    }

    .cf-order-summary__summary-label {
      font-size: 12px;
      line-height: 17px;
      letter-spacing: 0.12px;
    }

    .cf-order-summary__summary-value {
      font-size: 12px;
      line-height: 17px;
      letter-spacing: 0.12px;
    }

    .cf-order-summary__info-icon {
      width: 16px;
      height: 16px;
    }

    .cf-order-summary__info-icon svg {
      width: 16px;
      height: 16px;
    }

    .cf-order-summary__total-label {
      font-size: 14px;
      line-height: 20px;
      letter-spacing: -0.14px;
    }

    .cf-order-summary__total-value {
      font-size: 14px;
      line-height: 20px;
      letter-spacing: -0.14px;
    }

    .cf-order-summary__promo-input-wrap {
      max-width: 226px;
    }

    .cf-order-summary__promo-input {
      font-size: 10px;
      line-height: 15px;
      letter-spacing: 0.1px;
    }

    .cf-order-summary__address-text {
      font-size: 14px;
      line-height: 20px;
      letter-spacing: -0.14px;
    }

    .cf-order-summary__edit-link {
      font-size: 14px;
      line-height: 20px;
    }
  }
`;

class CfOrderSummaryWidget extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._session = null;
    this._subscriptionData = null;
    this._addressData = null;
    this._paymentData = null;
    this._promoMessage = '';
    this._promoStatus = '';
    this._loading = true;
    this._retryCount = 0;
    this._maxRetries = 20;
  }

  connectedCallback() {
    this._renderLoading();
    this._initData();
  }

  disconnectedCallback() {
    if (this._retryTimer) {
      clearTimeout(this._retryTimer);
      this._retryTimer = null;
    }
  }

  refresh() {
    this._loading = true;
    this._renderLoading();
    this._fetchData();
  }

  /* ── Data Initialization ── */
  _initData() {
    if (typeof recharge !== 'undefined' && recharge.auth) {
      this._fetchData();
    } else {
      this._retryInit();
    }
  }

  _retryInit() {
    this._retryCount++;
    if (this._retryCount > this._maxRetries) {
      this._loading = false;
      this._render();
      return;
    }
    this._retryTimer = setTimeout(() => {
      if (typeof recharge !== 'undefined' && recharge.auth) {
        this._fetchData();
      } else {
        this._retryInit();
      }
    }, 1000);
  }

  async _fetchData() {
    try {
      if (!this._session) {
        this._session = await recharge.auth.loginCustomerPortal();
      }

      const results = await Promise.allSettled([
        recharge.subscription.listSubscriptions(this._session, {
          limit: 10,
          sort_by: 'id-asc',
          status: 'Active'
        }),
        this._fetchAddresses(),
        this._fetchPaymentMethods()
      ]);

      if (results[0].status === 'fulfilled' && results[0].value) {
        const subs = results[0].value.subscriptions || [];
        this._subscriptionData = subs.length > 0 ? subs[0] : null;
      }

      if (results[1].status === 'fulfilled' && results[1].value) {
        this._addressData = results[1].value;
      }

      if (results[2].status === 'fulfilled' && results[2].value) {
        this._paymentData = results[2].value;
      }
    } catch (err) {
      console.error('[CF Order Summary] Data fetch failed:', err);
    }

    this._loading = false;
    this._render();
  }

  async _fetchAddresses() {
    try {
      if (recharge.address && recharge.address.listAddresses) {
        const res = await recharge.address.listAddresses(this._session);
        const addresses = res.addresses || res || [];
        return Array.isArray(addresses) && addresses.length > 0 ? addresses[0] : null;
      }
    } catch (e) {
      console.warn('[CF Order Summary] Address fetch unavailable:', e);
    }
    return null;
  }

  async _fetchPaymentMethods() {
    try {
      if (recharge.paymentMethod && recharge.paymentMethod.list) {
        const res = await recharge.paymentMethod.list(this._session);
        const methods = res.payment_methods || res || [];
        return Array.isArray(methods) && methods.length > 0 ? methods[0] : null;
      }
    } catch (e) {
      console.warn('[CF Order Summary] Payment fetch unavailable:', e);
    }
    return null;
  }

  /* ── Computed Data ── */
  get _productTitle() {
    return this._subscriptionData?.product_title || 'Pitcher Replacement Filter';
  }

  get _productPrice() {
    const price = this._subscriptionData?.price;
    if (price) {
      const num = parseFloat(price);
      return isNaN(num) ? price : num.toFixed(2) + ' USD';
    }
    return '50.00 USD';
  }

  get _quantity() {
    return this._subscriptionData?.quantity || 1;
  }

  get _subtotal() {
    const price = this._subscriptionData?.price;
    if (price) {
      const num = parseFloat(price);
      const qty = this._quantity;
      return isNaN(num) ? price : '$' + (num * qty).toFixed(2) + ' USD';
    }
    return '$50.00 USD';
  }

  get _total() {
    return this._subtotal;
  }

  get _productImageUrl() {
    if (this._subscriptionData?.shopify_product_id) {
      return 'https://cdn.shopify.com/s/files/1/1000/8959/4135/files/cf-filter-1000x-1-desktop-17038261.png?v=1780739700';
    }
    return 'https://cdn.shopify.com/s/files/1/1000/8959/4135/files/cf-filter-1000x-1-desktop-17038261.png?v=1780739700';
  }

  get _addressLine() {
    if (this._addressData) {
      const a = this._addressData;
      const street = a.address1 || '';
      return street || '\u2014';
    }
    return '1601 80th Street';
  }

  get _paymentLine() {
    if (this._paymentData) {
      const brand = this._paymentData.payment_details?.brand || 'Card';
      const last4 = this._paymentData.payment_details?.last4 || '****';
      return brand + ' ending in ' + last4;
    }
    return 'Visa ending in 4242';
  }

  /* ── Render ── */
  _renderLoading() {
    this.shadowRoot.innerHTML = `
      <style>${CF_ORDER_SUMMARY_STYLES}</style>
      <div class="cf-order-summary">
        <div class="cf-order-summary__loading">Loading order details\u2026</div>
      </div>
    `;
  }

  _render() {
    const infoIconDesktop = SVG_INFO_CIRCLE;
    const infoIconMobile = SVG_INFO_DARK;

    this.shadowRoot.innerHTML = `
      <style>${CF_ORDER_SUMMARY_STYLES}</style>
      <div class="cf-order-summary">
        ${this._renderProductSection()}
        <hr class="cf-order-summary__divider">
        ${this._renderSummarySection(infoIconDesktop)}
        <hr class="cf-order-summary__divider">
        ${this._renderAddressSection()}
      </div>
    `;

    this._bindEvents();
  }

  _renderProductSection() {
    return `
      <span class="cf-order-summary__section-title cf-order-summary__section-title--first">In your order</span>
      <div class="cf-order-summary__product-card">
        <div class="cf-order-summary__product-img-wrap">
          <div class="cf-order-summary__product-img-bg"></div>
          <div class="cf-order-summary__product-img-bg cf-order-summary__product-img-bg--overlay"></div>
          <img class="cf-order-summary__product-img"
               src="${this._productImageUrl}"
               alt="${this._productTitle}"
               loading="lazy">
          <div class="cf-order-summary__product-qty-badge">
            <span class="cf-order-summary__product-qty-text">${this._quantity}</span>
          </div>
        </div>
        <div class="cf-order-summary__product-info">
          <div class="cf-order-summary__product-details">
            <span class="cf-order-summary__product-name">${this._productTitle}</span>
            <span class="cf-order-summary__product-price">${this._productPrice}</span>
          </div>
          <button class="cf-order-summary__edit-btn" type="button" data-action="edit-subscription">Edit</button>
        </div>
      </div>
    `;
  }

  _renderSummarySection(infoIcon) {
    return `
      <span class="cf-order-summary__section-title">Order Summary</span>
      <div class="cf-order-summary__summary-lines">
        <div class="cf-order-summary__summary-detail">
          <div class="cf-order-summary__summary-row">
            <span class="cf-order-summary__summary-label">Subtotal</span>
            <span class="cf-order-summary__summary-value">${this._subtotal}</span>
          </div>
          <div class="cf-order-summary__summary-row">
            <span class="cf-order-summary__summary-label">Taxes <span class="cf-order-summary__info-icon">${infoIcon}</span></span>
            <span class="cf-order-summary__summary-value">$0.00 USD</span>
          </div>
          <div class="cf-order-summary__summary-row">
            <span class="cf-order-summary__summary-label">Shipping:</span>
            <span class="cf-order-summary__summary-value">FREE</span>
          </div>
        </div>
        <div class="cf-order-summary__total-row">
          <span class="cf-order-summary__total-label">Order Total <span class="cf-order-summary__info-icon">${infoIcon}</span></span>
          <span class="cf-order-summary__total-value">${this._total}</span>
        </div>
        <div class="cf-order-summary__promo-row">
          <div class="cf-order-summary__promo-input-wrap">
            <input class="cf-order-summary__promo-input"
                   type="text"
                   placeholder="Enter promo code"
                   id="cf-promo-input">
            ${this._promoMessage ? '<div class="cf-order-summary__promo-msg cf-order-summary__promo-msg--' + this._promoStatus + '">' + this._promoMessage + '</div>' : ''}
          </div>
          <button class="cf-order-summary__promo-btn" type="button" data-action="apply-promo">Apply</button>
        </div>
      </div>
    `;
  }

  _renderAddressSection() {
    return `
      <span class="cf-order-summary__section-title">Delivery Address & Payment</span>
      <div class="cf-order-summary__address-section">
        <div class="cf-order-summary__address-row">
          <span class="cf-order-summary__address-text"><strong>${this._addressLine}</strong></span>
          <button class="cf-order-summary__edit-link" type="button" data-action="edit-address">Edit Address</button>
        </div>
        <div class="cf-order-summary__address-row">
          <span class="cf-order-summary__address-text">${this._paymentLine}</span>
          <button class="cf-order-summary__edit-link" type="button" data-action="edit-payment">Edit Payment</button>
        </div>
      </div>
    `;
  }

  /* ── Event Binding ── */
  _bindEvents() {
    this.shadowRoot.addEventListener('click', (e) => {
      const target = e.target.closest('[data-action]');
      if (!target) return;

      const action = target.getAttribute('data-action');

      switch (action) {
        case 'edit-subscription': {
          this.dispatchEvent(new CustomEvent('cf-order-summary:edit-subscription', {
            bubbles: true,
            composed: true,
            detail: {
              subscriptionId: this._subscriptionData?.id
            }
          }));
          const subId = this._subscriptionData?.id;
          if (subId) {
            document.dispatchEvent(new CustomEvent('Recharge::click::manageSubscription', {
              detail: { subscriptionIds: [subId] }
            }));
          }
          break;
        }

        case 'apply-promo': {
          const input = this.shadowRoot.querySelector('#cf-promo-input');
          const code = input ? input.value.trim() : '';
          if (!code) {
            this._promoMessage = 'Please enter a promo code';
            this._promoStatus = 'error';
            this._render();
            return;
          }
          this._promoMessage = 'Promo code feature coming soon. Contact support for discounts.';
          this._promoStatus = 'error';
          this._render();
          console.warn('[CF Order Summary] Promo code API not available via Recharge Storefront SDK. Code entered:', code);
          break;
        }

        case 'edit-address': {
          window.location.href = '/tools/recurring/shipping';
          break;
        }

        case 'edit-payment': {
          window.location.href = '/tools/recurring/payment_methods';
          break;
        }
      }
    });
  }
}

export default CfOrderSummaryWidget;
