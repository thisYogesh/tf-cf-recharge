/**
 * Order Summary Widget
 * Self-contained Web Component for Recharge Affinity custom extension.
 * Zero external dependencies — all CSS, HTML, SVG inlined in Shadow DOM.
 */

/* ── SVG Icons ── */
const SVG_INFO = `<svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="6.5" cy="6.5" r="6" fill="#FFFFFF" stroke="#2C70BB" stroke-width="1"/><text x="6.5" y="10" text-anchor="middle" font-size="10.4" font-weight="400" fill="#2C70BB" style="font-family:'FT System',system-ui,sans-serif;letter-spacing:-0.1px">i</text></svg>`;

/* ── Styles ── */
const CF_ORDER_SUMMARY_STYLES = `
  :host {
    --cf-os-color-primary: #2C70BB;
    --cf-os-color-foreground: #202635;
    --cf-os-color-foreground-alt: #24293B;
    --cf-os-color-bg: #FFFFFF;
    --cf-os-color-bg-light: #F2F7FB;
    --cf-os-color-bg-accent: #ECF7FF;
    --cf-os-color-border: #D9E8F4;
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
    background: var(--cf-os-color-bg);
    border: 1px solid var(--cf-os-color-border);
    width: 100%;
  }

  /* ── Skeleton / Loading ── */
  .cf-order-summary__skeleton {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 120px;
    font-family: var(--cf-os-font-body);
    font-size: 14px;
    line-height: 20px;
    color: var(--cf-os-color-foreground);
    opacity: 0.5;
  }

  /* ── Error State ── */
  .cf-order-summary__error {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 80px;
    font-family: var(--cf-os-font-body);
    font-size: 14px;
    line-height: 20px;
    color: var(--cf-os-color-foreground);
    opacity: 0.6;
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

  /* ── Products Section ── */
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

  /* ── Product Image ── */
  .cf-order-summary__image-wrap {
    position: relative;
    width: 92px;
    height: 92px;
    flex-shrink: 0;
  }

  .cf-order-summary__image-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 92px;
    height: 92px;
    background: var(--cf-os-color-bg-light);
    transform: rotate(3.1deg);
  }

  .cf-order-summary__image-bg-accent {
    position: absolute;
    top: 0;
    left: 5px;
    width: 82px;
    height: 92px;
    background: var(--cf-os-color-bg-accent);
    opacity: 0.15;
    transform: rotate(3.1deg);
  }

  .cf-order-summary__image {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 45px;
    height: 51px;
    object-fit: contain;
    z-index: 1;
  }

  .cf-order-summary__qty-badge {
    position: absolute;
    top: -2px;
    right: -2px;
    width: 23px;
    height: 23px;
    border-radius: 50%;
    background: var(--cf-os-color-foreground);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    font-family: var(--cf-os-font-body);
    font-weight: 400;
    font-size: 14.95px;
    line-height: 21px;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    text-align: center;
    color: var(--cf-os-color-bg);
  }

  /* ── Product Info ── */
  .cf-order-summary__product-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
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

  /* ── Pill Button (Edit / Apply) ── */
  .cf-order-summary__pill-btn {
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

  .cf-order-summary__pill-btn:hover {
    background: var(--cf-os-color-bg-light);
  }

  /* ── Summary Section ── */
  .cf-order-summary__summary {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
    width: 100%;
  }

  .cf-order-summary__line-items {
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 100%;
  }

  .cf-order-summary__line-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .cf-order-summary__line-label {
    display: flex;
    align-items: center;
    gap: 4px;
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

  /* ── Promo Code Row ── */
  .cf-order-summary__promo-row {
    display: flex;
    flex-direction: row;
    gap: 14px;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .cf-order-summary__promo-input {
    width: 255px;
    max-width: 100%;
    height: 34px;
    padding: 0 12px;
    border-radius: 6px;
    border: 1px solid var(--cf-os-color-input-border);
    background: var(--cf-os-color-bg);
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

  /* ── Delivery Section ── */
  .cf-order-summary__delivery {
    display: flex;
    flex-direction: column;
    gap: 0;
    width: 100%;
  }

  .cf-order-summary__detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .cf-order-summary__detail-text {
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
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
    white-space: nowrap;
  }

  .cf-order-summary__edit-link:hover {
    opacity: 0.8;
  }

  /* ── Responsive: Mobile ── */
  @media screen and (max-width: 767px) {
    .cf-order-summary__heading {
      font-size: 16px;
      line-height: 21px;
      letter-spacing: -0.16px;
    }

    .cf-order-summary__image-wrap {
      width: 80px;
      height: 80px;
    }

    .cf-order-summary__image-bg {
      width: 80px;
      height: 80px;
    }

    .cf-order-summary__image-bg-accent {
      width: 71px;
      height: 80px;
    }

    .cf-order-summary__image {
      width: 40px;
      height: 44px;
    }

    .cf-order-summary__qty-badge {
      width: 20px;
      height: 18px;
      border-radius: 55px;
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

    .cf-order-summary__promo-input {
      width: auto;
      flex: 1;
      font-size: 10px;
      line-height: 15px;
      letter-spacing: 0.1px;
    }

    .cf-order-summary__promo-input::placeholder {
      font-size: 10px;
      line-height: 15px;
      letter-spacing: 0.1px;
    }

    .cf-order-summary__promo-row {
      justify-content: flex-start;
    }

    .cf-order-summary__detail-text {
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

/* ── Component ── */
class CfOrderSummaryWidget extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._data = null;
    this._loading = true;
    this._promoCode = '';
    this._retryCount = 0;
    this._maxRetries = 15;
  }

  connectedCallback() {
    this._renderSkeleton();
    this._fetchAndRender();
  }

  disconnectedCallback() {
    this._data = null;
  }

  /**
   * Called by Recharge Custom Extensions framework when configured events fire.
   * Re-fetches data and re-renders.
   */
  refresh() {
    this._loading = true;
    this._data = null;
    this._retryCount = 0;
    this._renderSkeleton();
    this._fetchAndRender();
  }

  /* ── Skeleton State ── */
  _renderSkeleton() {
    this.shadowRoot.innerHTML = `
      <style>${CF_ORDER_SUMMARY_STYLES}</style>
      <div class="cf-order-summary">
        <div class="cf-order-summary__skeleton">Loading order summary\u2026</div>
      </div>
    `;
  }

  /* ── Error State ── */
  _renderError() {
    this.shadowRoot.innerHTML = `
      <style>${CF_ORDER_SUMMARY_STYLES}</style>
      <div class="cf-order-summary">
        <div class="cf-order-summary__error">Unable to load order summary.</div>
      </div>
    `;
  }

  /* ── Data Fetching ── */
  async _fetchAndRender() {
    try {
      if (typeof window.recharge === 'undefined') {
        if (this._retryCount < this._maxRetries) {
          this._retryCount++;
          setTimeout(() => this._fetchAndRender(), 500);
          return;
        }
        console.warn('[cf-order-summary] Recharge SDK not found after retries');
        this._renderError();
        return;
      }

      const session = await window.recharge.auth.loginCustomerPortal();

      /* Fetch active subscriptions (required) */
      const subsResponse = await window.recharge.subscription.listSubscriptions(session, {
        limit: 25,
        sort_by: 'id-asc',
        status: 'Active'
      });
      const subscriptions = (subsResponse && subsResponse.subscriptions) ? subsResponse.subscriptions : [];

      if (subscriptions.length === 0) {
        this._renderError();
        return;
      }

      /* Fetch addresses (optional) */
      let addresses = [];
      try {
        if (window.recharge.address && typeof window.recharge.address.listAddresses === 'function') {
          const addrResponse = await window.recharge.address.listAddresses(session);
          addresses = (addrResponse && addrResponse.addresses) ? addrResponse.addresses : [];
        }
      } catch (e) {
        console.warn('[cf-order-summary] Could not fetch addresses:', e);
      }

      /* Fetch payment methods (optional) */
      let paymentMethods = [];
      try {
        if (window.recharge.paymentMethod && typeof window.recharge.paymentMethod.listPaymentMethods === 'function') {
          const pmResponse = await window.recharge.paymentMethod.listPaymentMethods(session);
          paymentMethods = (pmResponse && pmResponse.payment_methods) ? pmResponse.payment_methods : [];
        }
      } catch (e) {
        console.warn('[cf-order-summary] Could not fetch payment methods:', e);
      }

      /* Fetch next queued charge for order totals (optional) */
      let nextCharge = null;
      try {
        if (window.recharge.charge && typeof window.recharge.charge.listCharges === 'function') {
          const chargeResponse = await window.recharge.charge.listCharges(session, {
            limit: 1,
            sort_by: 'scheduled_at-asc',
            status: 'queued'
          });
          const charges = (chargeResponse && chargeResponse.charges) ? chargeResponse.charges : [];
          nextCharge = charges[0] || null;
        }
      } catch (e) {
        console.warn('[cf-order-summary] Could not fetch charges:', e);
      }

      this._data = { subscriptions, addresses, paymentMethods, nextCharge };
      this._loading = false;
      this._render();

    } catch (err) {
      console.error('[cf-order-summary] Error fetching data:', err);
      this._renderError();
    }
  }

  /* ── Main Render ── */
  _render() {
    const data = this._data;
    if (!data) return;

    this.shadowRoot.innerHTML = `
      <style>${CF_ORDER_SUMMARY_STYLES}</style>
      <div class="cf-order-summary">
        ${this._renderProductsSection(data.subscriptions)}
        ${this._renderSummarySection(data)}
        ${this._renderDeliverySection(data)}
      </div>
    `;

    this._bindEvents();
  }

  /* ── Section A: In Your Order ── */
  _renderProductsSection(subscriptions) {
    const cards = subscriptions.map(sub => this._renderProductCard(sub)).join('');
    return `
      <span class="cf-order-summary__heading">In your order</span>
      <div class="cf-order-summary__products">
        ${cards}
      </div>
    `;
  }

  _renderProductCard(sub) {
    const title = sub.product_title || 'Product';
    const price = this._formatPrice(sub.price, sub.presentment_currency);
    const qty = sub.quantity || 1;
    const imageUrl = this._getProductImage(sub);

    const imageTag = imageUrl
      ? `<img class="cf-order-summary__image" src="${imageUrl}" alt="${this._escapeHtml(title)}" loading="lazy" />`
      : '';

    return `
      <div class="cf-order-summary__product">
        <div class="cf-order-summary__image-wrap">
          <div class="cf-order-summary__image-bg"></div>
          <div class="cf-order-summary__image-bg-accent"></div>
          ${imageTag}
          <div class="cf-order-summary__qty-badge">${qty}</div>
        </div>
        <div class="cf-order-summary__product-info">
          <div class="cf-order-summary__product-text">
            <span class="cf-order-summary__product-name">${this._escapeHtml(title)}</span>
            <span class="cf-order-summary__product-price">${price}</span>
          </div>
          <button class="cf-order-summary__pill-btn" type="button" data-action="edit-product" data-id="${sub.id}">Edit</button>
        </div>
      </div>
    `;
  }

  /* ── Section B: Order Summary ── */
  _renderSummarySection(data) {
    const subs = data.subscriptions;
    const charge = data.nextCharge;
    const currency = (subs[0] && subs[0].presentment_currency) ? subs[0].presentment_currency : 'USD';

    /* Compute subtotal from subscriptions */
    let subtotal = 0;
    for (const sub of subs) {
      const p = parseFloat(sub.price) || 0;
      const q = parseInt(sub.quantity, 10) || 1;
      subtotal += p * q;
    }

    /* Taxes and shipping from charge data if available */
    let taxes = null;
    let shipping = null;
    let total = null;

    if (charge) {
      taxes = parseFloat(charge.tax_lines_price || charge.total_tax || 0);
      shipping = parseFloat(charge.shipping_lines_price || charge.total_shipping || 0);
      total = parseFloat(charge.total_price || 0);
    }

    if (total === null || isNaN(total)) {
      total = subtotal + (taxes || 0) + (shipping || 0);
    }

    const subtotalStr = this._formatMoney(subtotal, currency);
    const taxesStr = (taxes !== null && !isNaN(taxes)) ? this._formatMoney(taxes, currency) : '$0.00 ' + currency;
    const shippingStr = (shipping !== null && !isNaN(shipping) && shipping > 0) ? this._formatMoney(shipping, currency) : 'FREE';
    const totalStr = this._formatMoney(total, currency);

    return `
      <span class="cf-order-summary__heading">Order Summary</span>
      <div class="cf-order-summary__summary">
        <div class="cf-order-summary__line-items">
          <div class="cf-order-summary__line-row">
            <span class="cf-order-summary__line-label">Subtotal</span>
            <span class="cf-order-summary__line-value">${subtotalStr}</span>
          </div>
          <div class="cf-order-summary__line-row">
            <span class="cf-order-summary__line-label">
              <span class="cf-order-summary__info-icon">${SVG_INFO}</span>
              Taxes
            </span>
            <span class="cf-order-summary__line-value">${taxesStr}</span>
          </div>
          <div class="cf-order-summary__line-row">
            <span class="cf-order-summary__line-label">Shipping:</span>
            <span class="cf-order-summary__line-value">${shippingStr}</span>
          </div>
        </div>
        <div class="cf-order-summary__total-row">
          <span class="cf-order-summary__total-label">
            <span class="cf-order-summary__info-icon">${SVG_INFO}</span>
            Order Total
          </span>
          <span class="cf-order-summary__total-value">${totalStr}</span>
        </div>
        <div class="cf-order-summary__promo-row">
          <input
            type="text"
            class="cf-order-summary__promo-input"
            placeholder="Enter promo code"
            data-ref="promo-input"
          />
          <button class="cf-order-summary__pill-btn" type="button" data-action="apply-promo">Apply</button>
        </div>
      </div>
    `;
  }

  /* ── Section C: Delivery Address & Payment ── */
  _renderDeliverySection(data) {
    const address = (data.addresses && data.addresses.length > 0) ? data.addresses[0] : null;
    const pm = (data.paymentMethods && data.paymentMethods.length > 0) ? data.paymentMethods[0] : null;

    const addressText = address ? (address.address1 || '\u2014') : '\u2014';

    let paymentText = '\u2014';
    if (pm) {
      const brand = pm.payment_type || pm.brand || pm.card_brand || 'Card';
      const last4 = pm.payment_details
        ? (pm.payment_details.last4 || pm.payment_details.last_four || '')
        : '';
      if (last4) {
        paymentText = `${brand} ending in ${last4}`;
      } else {
        paymentText = brand;
      }
    }

    return `
      <span class="cf-order-summary__heading">Delivery Address &amp; Payment</span>
      <div class="cf-order-summary__delivery">
        <div class="cf-order-summary__detail-row">
          <span class="cf-order-summary__detail-text">${this._escapeHtml(addressText)}</span>
          <button class="cf-order-summary__edit-link" type="button" data-action="edit-address">Edit Address</button>
        </div>
        <div class="cf-order-summary__detail-row">
          <span class="cf-order-summary__detail-text">${this._escapeHtml(paymentText)}</span>
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
        case 'edit-product': {
          const subId = target.getAttribute('data-id');
          this.dispatchEvent(new CustomEvent('cf-order-summary:edit-product', {
            bubbles: true,
            composed: true,
            detail: { subscriptionId: subId }
          }));
          this._navigateTo('/subscriptions');
          break;
        }

        case 'apply-promo': {
          const input = this.shadowRoot.querySelector('[data-ref="promo-input"]');
          const code = input ? input.value.trim() : '';
          if (!code) return;
          this.dispatchEvent(new CustomEvent('cf-order-summary:apply-promo', {
            bubbles: true,
            composed: true,
            detail: { promoCode: code }
          }));
          try {
            document.dispatchEvent(new CustomEvent('Recharge::order::openDiscountModal'));
          } catch (err) {
            console.warn('[cf-order-summary] Could not dispatch discount modal event:', err);
          }
          break;
        }

        case 'edit-address':
          this._navigateTo('/shipping');
          break;

        case 'edit-payment':
          this._navigateTo('/payment_methods');
          break;
      }
    });
  }

  /* ── Helpers ── */
  _navigateTo(route) {
    const currentPath = window.location.pathname;
    const baseMatch = currentPath.match(/^(\/tools\/recurring)/);
    const basePath = baseMatch ? baseMatch[1] : '/tools/recurring';
    window.location.href = basePath + route;
  }

  _formatPrice(price, currency) {
    const num = parseFloat(price);
    if (isNaN(num)) return price || '\u2014';
    const formatted = num.toFixed(2);
    return `${formatted} ${currency || 'USD'}`;
  }

  _formatMoney(amount, currency) {
    const num = parseFloat(amount);
    if (isNaN(num)) return '\u2014';
    const formatted = num.toFixed(2);
    return `$${formatted} ${currency || 'USD'}`;
  }

  _getProductImage(sub) {
    if (sub.product && sub.product.images && sub.product.images.length > 0) {
      return sub.product.images[0].src || sub.product.images[0].original || '';
    }
    if (sub.product && sub.product.image) {
      return sub.product.image.src || sub.product.image.original || sub.product.image;
    }
    if (sub.image) {
      return sub.image;
    }
    if (sub.shopify_product_id) {
      return '';
    }
    return '';
  }

  _escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
}

export default CfOrderSummaryWidget;
