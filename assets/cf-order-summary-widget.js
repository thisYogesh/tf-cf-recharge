/**
 * Order Summary Widget
 * Self-contained Web Component for Recharge Affinity custom extension.
 * Zero external dependencies — all CSS, HTML, SVG inlined in Shadow DOM.
 */

const CF_ORDER_SUMMARY_STYLES = `
  :host {
    --cf-os-color-foreground: #202635;
    --cf-os-color-foreground-alt: #24293B;
    --cf-os-color-primary: #2C70BB;
    --cf-os-color-border: #D9E8F4;
    --cf-os-color-bg: #FFFFFF;
    --cf-os-color-img-bg: #F2F7FB;
    --cf-os-color-img-bg-alt: #ECF7FF;
    --cf-os-color-input-border: #D3D8DD;
    --cf-os-font-body: 'FT System', system-ui, sans-serif;

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
    max-width: 740px;
    width: 100%;
    background: var(--cf-os-color-bg);
    border: 1px solid var(--cf-os-color-border);
    border-radius: 4px;
  }

  /* ── Section Headings ── */
  .cf-order-summary__heading {
    font-family: var(--cf-os-font-body);
    font-weight: 400;
    font-size: 20px;
    line-height: 26px;
    letter-spacing: -0.2px;
    color: var(--cf-os-color-foreground);
  }

  /* ── Product Card ── */
  .cf-order-summary__products {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .cf-order-summary__product {
    display: flex;
    flex-direction: row;
    gap: 20px;
    align-items: center;
  }

  .cf-order-summary__product-img-wrap {
    width: 92px;
    height: 92px;
    position: relative;
    flex-shrink: 0;
  }

  .cf-order-summary__product-img-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 92px;
    height: 92px;
    background: var(--cf-os-color-img-bg);
    transform: rotate(3.1deg);
    border-radius: 2px;
  }

  .cf-order-summary__product-img-bg-alt {
    position: absolute;
    top: 0;
    left: 5px;
    width: 82px;
    height: 92px;
    background: var(--cf-os-color-img-bg-alt);
    opacity: 0.15;
    transform: rotate(3.1deg);
    border-radius: 2px;
  }

  .cf-order-summary__product-img {
    position: relative;
    z-index: 1;
    width: 45px;
    height: 51px;
    object-fit: contain;
    display: block;
    margin: auto;
    top: 50%;
    transform: translateY(-50%);
  }

  .cf-order-summary__freq-badge {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 2;
    width: 23px;
    height: 23px;
    border-radius: 63px;
    background: var(--cf-os-color-foreground);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1px 9px;
  }

  .cf-order-summary__freq-badge-text {
    font-family: var(--cf-os-font-body);
    font-weight: 400;
    font-size: 15px;
    line-height: 21px;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    text-align: center;
    color: var(--cf-os-color-bg);
  }

  .cf-order-summary__product-details {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
    min-width: 0;
  }

  .cf-order-summary__product-text {
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

  .cf-order-summary__pill-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 6px 20px 8px;
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
    align-self: flex-start;
  }

  .cf-order-summary__pill-btn:hover {
    background: #f0f4f8;
  }

  /* ── Order Summary Lines ── */
  .cf-order-summary__totals {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
  }

  .cf-order-summary__lines {
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 100%;
  }

  .cf-order-summary__line {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .cf-order-summary__line-label-wrap {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .cf-order-summary__line-label {
    font-family: var(--cf-os-font-body);
    font-weight: 400;
    font-size: 16px;
    line-height: 22px;
    color: var(--cf-os-color-foreground);
  }

  .cf-order-summary__line-value {
    font-family: var(--cf-os-font-body);
    font-weight: 400;
    font-size: 16px;
    line-height: 22px;
    text-align: right;
    color: var(--cf-os-color-foreground);
  }

  /* Order Total row (larger) */
  .cf-order-summary__total-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .cf-order-summary__total-label-wrap {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .cf-order-summary__total-label {
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

  /* Info icon — desktop: outline circle, mobile: filled */
  .cf-order-summary__info-icon {
    width: 13px;
    height: 13px;
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .cf-order-summary__info-icon svg {
    width: 13px;
    height: 13px;
    display: block;
  }

  .cf-order-summary__info-icon--outline {
    display: inline-flex;
  }

  .cf-order-summary__info-icon--filled {
    display: none;
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
    flex: 1;
    position: relative;
    max-width: 255px;
  }

  .cf-order-summary__promo-input {
    width: 100%;
    height: 34px;
    border: 1px solid var(--cf-os-color-input-border);
    border-radius: 6px;
    background: var(--cf-os-color-bg);
    font-family: var(--cf-os-font-body);
    font-weight: 400;
    font-size: 14px;
    line-height: 21px;
    color: var(--cf-os-color-foreground);
    padding: 0 12px;
    outline: none;
  }

  .cf-order-summary__promo-input::placeholder {
    color: var(--cf-os-color-foreground);
    opacity: 0.6;
  }

  .cf-order-summary__promo-input:focus {
    border-color: var(--cf-os-color-primary);
  }

  /* ── Delivery & Payment ── */
  .cf-order-summary__delivery {
    display: flex;
    flex-direction: column;
    gap: 0;
    width: 100%;
  }

  .cf-order-summary__delivery-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .cf-order-summary__delivery-text {
    font-family: var(--cf-os-font-body);
    font-weight: 400;
    font-size: 16px;
    line-height: 22px;
    letter-spacing: -0.16px;
    color: var(--cf-os-color-foreground);
  }

  .cf-order-summary__edit-link {
    font-family: var(--cf-os-font-body);
    font-weight: 400;
    font-size: 16px;
    line-height: 23px;
    text-decoration: underline;
    color: var(--cf-os-color-primary);
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    white-space: nowrap;
  }

  .cf-order-summary__edit-link:hover {
    opacity: 0.8;
  }

  /* ── Loading Skeleton ── */
  .cf-order-summary__skeleton {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 0 18px 20px 18px;
    max-width: 740px;
    width: 100%;
    background: var(--cf-os-color-bg);
    border: 1px solid var(--cf-os-color-border);
    border-radius: 4px;
  }

  .cf-order-summary__skeleton-line {
    height: 16px;
    border-radius: 4px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: cf-os-shimmer 1.5s ease-in-out infinite;
  }

  .cf-order-summary__skeleton-line--short {
    width: 40%;
  }

  .cf-order-summary__skeleton-line--medium {
    width: 65%;
  }

  .cf-order-summary__skeleton-line--full {
    width: 100%;
  }

  .cf-order-summary__skeleton-product {
    display: flex;
    gap: 20px;
    align-items: center;
  }

  .cf-order-summary__skeleton-img {
    width: 92px;
    height: 92px;
    border-radius: 4px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: cf-os-shimmer 1.5s ease-in-out infinite;
    flex-shrink: 0;
  }

  .cf-order-summary__skeleton-text {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
  }

  @keyframes cf-os-shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* ── Mobile ── */
  @media (max-width: 767px) {
    .cf-order-summary {
      max-width: 354px;
    }

    .cf-order-summary__heading {
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

    .cf-order-summary__product-img-bg-alt {
      width: 71px;
      height: 80px;
    }

    .cf-order-summary__product-img {
      width: 40px;
      height: 44px;
    }

    .cf-order-summary__freq-badge {
      width: 20px;
      height: 18px;
      border-radius: 55px;
      padding: 1px 8px;
    }

    .cf-order-summary__freq-badge-text {
      font-family: 'Inter', var(--cf-os-font-body);
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

    .cf-order-summary__line-label {
      font-size: 12px;
      line-height: 17px;
      letter-spacing: 0.12px;
    }

    .cf-order-summary__line-value {
      font-size: 12px;
      line-height: 17px;
      letter-spacing: 0.12px;
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

    .cf-order-summary__info-icon {
      width: 16px;
      height: 16px;
    }

    .cf-order-summary__info-icon svg {
      width: 16px;
      height: 16px;
    }

    .cf-order-summary__info-icon--outline {
      display: none;
    }

    .cf-order-summary__info-icon--filled {
      display: inline-flex;
    }

    .cf-order-summary__delivery-text {
      font-size: 14px;
      line-height: 20px;
      letter-spacing: -0.14px;
    }

    .cf-order-summary__edit-link {
      font-size: 14px;
      line-height: 20px;
    }

    .cf-order-summary__promo-input-wrap {
      max-width: 226px;
    }

    .cf-order-summary__promo-input {
      font-size: 10px;
      line-height: 15px;
      letter-spacing: 0.1px;
    }

    .cf-order-summary__promo-input::placeholder {
      font-size: 10px;
      line-height: 15px;
      letter-spacing: 0.1px;
    }

    .cf-order-summary__skeleton {
      max-width: 354px;
    }

    .cf-order-summary__skeleton-img {
      width: 80px;
      height: 80px;
    }
  }
`;

/* ── SVG Icons ── */
const SVG_INFO_CIRCLE_OUTLINE = `<svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="6.5" cy="6.5" r="6" fill="#FFFFFF" stroke="#2C70BB" stroke-width="1"/><text x="6.5" y="10" text-anchor="middle" font-size="10.4" font-weight="400" fill="#2C70BB" style="font-family:'FT System',system-ui,sans-serif;letter-spacing:-0.1px">i</text></svg>`;

const SVG_INFO_CIRCLE_FILLED = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0C3.58 0 0 3.58 0 8C0 12.42 3.58 16 8 16C12.42 16 16 12.42 16 8C16 3.58 12.42 0 8 0ZM8.8 12H7.2V7.2H8.8V12ZM8.8 5.6H7.2V4H8.8V5.6Z" fill="#202635"/></svg>`;

class CfOrderSummaryWidget extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._session = null;
    this._subscriptions = [];
    this._addressLine = '';
    this._paymentLine = '';
    this._loaded = false;
  }

  connectedCallback() {
    this._renderSkeleton();
    this._init();
  }

  disconnectedCallback() {
    this._session = null;
  }

  refresh() {
    this._loaded = false;
    this._renderSkeleton();
    this._init();
  }

  /* ── Data Init ── */
  async _init() {
    try {
      await this._waitForRecharge();
      this._session = await recharge.auth.loginCustomerPortal();

      const res = await recharge.subscription.listSubscriptions(this._session, {
        limit: 25,
        sort_by: 'id-asc',
        status: 'Active'
      });
      this._subscriptions = res.subscriptions || [];

      await this._fetchAddressAndPayment();

      this._loaded = true;
      this._render();
    } catch (err) {
      console.error('[CF Order Summary] Init failed:', err);
      this._loaded = true;
      this._render();
    }
  }

  _waitForRecharge() {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const check = () => {
        if (typeof recharge !== 'undefined' && recharge.auth) {
          resolve();
          return;
        }
        if (++attempts > 30) {
          reject(new Error('Recharge SDK not available'));
          return;
        }
        setTimeout(check, 500);
      };
      check();
    });
  }

  async _fetchAddressAndPayment() {
    try {
      if (this._subscriptions.length > 0) {
        const sub = this._subscriptions[0];

        if (sub.address && sub.address.address1) {
          this._addressLine = sub.address.address1;
        } else if (sub.address_id) {
          try {
            const addrRes = await recharge.address.getAddress(this._session, sub.address_id);
            if (addrRes && addrRes.address && addrRes.address.address1) {
              this._addressLine = addrRes.address.address1;
            }
          } catch (_) {
            this._addressLine = '';
          }
        }

        try {
          const pmRes = await recharge.paymentMethod.listPaymentMethods(this._session, { limit: 1 });
          if (pmRes && pmRes.payment_methods && pmRes.payment_methods.length > 0) {
            const pm = pmRes.payment_methods[0];
            const brand = pm.billing_address && pm.billing_address.company ? pm.billing_address.company : (pm.payment_type || 'Card');
            const last4 = pm.payment_details && pm.payment_details.last4 ? pm.payment_details.last4 : '****';
            this._paymentLine = `${brand} ending in ${last4}`;
          }
        } catch (_) {
          this._paymentLine = '';
        }
      }
    } catch (_) {
      /* graceful fallback — render without address/payment */
    }
  }

  /* ── Render ── */
  _renderSkeleton() {
    this.shadowRoot.innerHTML = `
      <style>${CF_ORDER_SUMMARY_STYLES}</style>
      <div class="cf-order-summary__skeleton">
        <div class="cf-order-summary__skeleton-line cf-order-summary__skeleton-line--short"></div>
        <div class="cf-order-summary__skeleton-product">
          <div class="cf-order-summary__skeleton-img"></div>
          <div class="cf-order-summary__skeleton-text">
            <div class="cf-order-summary__skeleton-line cf-order-summary__skeleton-line--medium"></div>
            <div class="cf-order-summary__skeleton-line cf-order-summary__skeleton-line--short"></div>
          </div>
        </div>
        <div class="cf-order-summary__skeleton-line cf-order-summary__skeleton-line--short"></div>
        <div class="cf-order-summary__skeleton-line cf-order-summary__skeleton-line--full"></div>
        <div class="cf-order-summary__skeleton-line cf-order-summary__skeleton-line--full"></div>
        <div class="cf-order-summary__skeleton-line cf-order-summary__skeleton-line--full"></div>
        <div class="cf-order-summary__skeleton-line cf-order-summary__skeleton-line--short"></div>
        <div class="cf-order-summary__skeleton-line cf-order-summary__skeleton-line--full"></div>
        <div class="cf-order-summary__skeleton-line cf-order-summary__skeleton-line--full"></div>
      </div>
    `;
  }

  _render() {
    if (!this._subscriptions.length) {
      this.shadowRoot.innerHTML = '';
      return;
    }

    this.shadowRoot.innerHTML = `
      <style>${CF_ORDER_SUMMARY_STYLES}</style>
      <div class="cf-order-summary">
        ${this._renderProductsSection()}
        ${this._renderSummarySection()}
        ${this._renderDeliverySection()}
      </div>
    `;

    this._bindEvents();
  }

  _renderProductsSection() {
    const productCards = this._subscriptions.map((sub) => {
      const name = sub.product_title || 'Product';
      const price = sub.price ? this._formatPrice(sub.price) : '';
      const qty = sub.quantity || 1;
      const imageUrl = sub.variant_image || sub.product_image || '';

      return `
        <div class="cf-order-summary__product">
          <div class="cf-order-summary__product-img-wrap">
            <div class="cf-order-summary__product-img-bg"></div>
            <div class="cf-order-summary__product-img-bg-alt"></div>
            ${imageUrl ? `<img class="cf-order-summary__product-img" src="${imageUrl}" alt="${name}" loading="lazy">` : ''}
            <div class="cf-order-summary__freq-badge">
              <span class="cf-order-summary__freq-badge-text">${qty}</span>
            </div>
          </div>
          <div class="cf-order-summary__product-details">
            <div class="cf-order-summary__product-text">
              <span class="cf-order-summary__product-name">${name}</span>
              <span class="cf-order-summary__product-price">${price}</span>
            </div>
            <button class="cf-order-summary__pill-btn" type="button" data-action="edit-subscription" data-subscription-id="${sub.id}">Edit</button>
          </div>
        </div>
      `;
    }).join('');

    return `
      <span class="cf-order-summary__heading">In your order</span>
      <div class="cf-order-summary__products">
        ${productCards}
      </div>
    `;
  }

  _renderSummarySection() {
    const subtotal = this._calcSubtotal();
    const formattedSubtotal = this._formatPrice(subtotal);

    const infoIconHTML = `
      <span class="cf-order-summary__info-icon cf-order-summary__info-icon--outline">${SVG_INFO_CIRCLE_OUTLINE}</span>
      <span class="cf-order-summary__info-icon cf-order-summary__info-icon--filled">${SVG_INFO_CIRCLE_FILLED}</span>
    `;

    return `
      <span class="cf-order-summary__heading">Order Summary</span>
      <div class="cf-order-summary__totals">
        <div class="cf-order-summary__lines">
          <div class="cf-order-summary__line">
            <span class="cf-order-summary__line-label">Subtotal</span>
            <span class="cf-order-summary__line-value">${formattedSubtotal}</span>
          </div>
          <div class="cf-order-summary__line">
            <div class="cf-order-summary__line-label-wrap">
              ${infoIconHTML}
              <span class="cf-order-summary__line-label">Taxes</span>
            </div>
            <span class="cf-order-summary__line-value">$0.00 USD</span>
          </div>
          <div class="cf-order-summary__line">
            <span class="cf-order-summary__line-label">Shipping:</span>
            <span class="cf-order-summary__line-value">FREE</span>
          </div>
        </div>
        <div class="cf-order-summary__total-row">
          <div class="cf-order-summary__total-label-wrap">
            ${infoIconHTML}
            <span class="cf-order-summary__total-label">Order Total</span>
          </div>
          <span class="cf-order-summary__total-value">${formattedSubtotal}</span>
        </div>
        <div class="cf-order-summary__promo-row">
          <div class="cf-order-summary__promo-input-wrap">
            <input
              type="text"
              class="cf-order-summary__promo-input"
              placeholder="Enter promo code"
              aria-label="Promo code"
            >
          </div>
          <button class="cf-order-summary__pill-btn" type="button" data-action="apply-promo">Apply</button>
        </div>
      </div>
    `;
  }

  _renderDeliverySection() {
    const addressText = this._addressLine || '---';
    const paymentText = this._paymentLine || '---';

    return `
      <span class="cf-order-summary__heading">Delivery Address & Payment</span>
      <div class="cf-order-summary__delivery">
        <div class="cf-order-summary__delivery-row">
          <span class="cf-order-summary__delivery-text">${addressText}</span>
          <button class="cf-order-summary__edit-link" type="button" data-action="edit-address">Edit Address</button>
        </div>
        <div class="cf-order-summary__delivery-row">
          <span class="cf-order-summary__delivery-text">${paymentText}</span>
          <button class="cf-order-summary__edit-link" type="button" data-action="edit-payment">Edit Payment</button>
        </div>
      </div>
    `;
  }

  /* ── Helpers ── */
  _formatPrice(price) {
    const num = parseFloat(price);
    if (isNaN(num)) return price;
    return '$' + num.toFixed(2) + ' USD';
  }

  _calcSubtotal() {
    let total = 0;
    for (const sub of this._subscriptions) {
      const price = parseFloat(sub.price) || 0;
      const qty = parseInt(sub.quantity, 10) || 1;
      total += price * qty;
    }
    return total.toFixed(2);
  }

  /* ── Event Binding ── */
  _bindEvents() {
    this.shadowRoot.addEventListener('click', (e) => {
      const target = e.target.closest('[data-action]');
      if (!target) return;

      const action = target.getAttribute('data-action');

      switch (action) {
        case 'edit-subscription': {
          const subId = target.getAttribute('data-subscription-id');
          if (subId) {
            window.location.hash = '#/subscriptions';
          }
          break;
        }

        case 'apply-promo': {
          const input = this.shadowRoot.querySelector('.cf-order-summary__promo-input');
          const code = input ? input.value.trim() : '';
          if (!code) return;
          document.dispatchEvent(new CustomEvent('Recharge::order::openDiscountModal'));
          break;
        }

        case 'edit-address':
          window.location.hash = '#/shipping';
          break;

        case 'edit-payment':
          window.location.hash = '#/payment_methods';
          break;
      }
    });
  }
}

export default CfOrderSummaryWidget;
