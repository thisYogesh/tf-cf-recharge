/**
 * Order Summary Widget
 * Self-contained Web Component for Recharge Affinity custom extension.
 * Renders order summary on the Affinity portal overview page.
 * Zero external dependencies — all CSS, HTML, SVG inlined in Shadow DOM.
 */

const CF_ORDER_SUMMARY_STYLES = `
  :host {
    --cf-os-color-primary: #2C70BB;
    --cf-os-color-foreground: #202635;
    --cf-os-color-foreground-alt: #24293B;
    --cf-os-color-border: #D9E8F4;
    --cf-os-color-input-border: #D3D8DD;
    --cf-os-color-background: #FFFFFF;
    --cf-os-color-img-bg: #F2F7FB;
    --cf-os-color-img-overlay: #ECF7FF;

    --cf-os-font-body: 'FT System', system-ui, sans-serif;
    --cf-os-font-inter: 'Inter', system-ui, sans-serif;

    display: block;
    width: 100%;
    box-sizing: border-box;
  }

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  /* ── Main Container ── */
  .cf-order-summary {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 0 18px 20px 18px;
    background: var(--cf-os-color-background);
    border: 1px solid var(--cf-os-color-border);
    border-radius: 4px;
    width: 100%;
  }

  /* ── Section Headings ── */
  .cf-order-summary__heading {
    font-family: var(--cf-os-font-body);
    font-weight: 400;
    font-size: 20px;
    line-height: 26px;
    letter-spacing: -0.2px;
    color: var(--cf-os-color-foreground);
    padding-top: 20px;
  }

  .cf-order-summary__heading:first-child {
    padding-top: 20px;
  }

  /* ── Products List ── */
  .cf-order-summary__products {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  /* ── Product Card Row ── */
  .cf-order-summary__product {
    display: flex;
    flex-direction: row;
    gap: 20px;
    align-items: center;
  }

  /* ── Image Frame ── */
  .cf-order-summary__img-frame {
    position: relative;
    width: 92px;
    height: 92px;
    flex-shrink: 0;
  }

  .cf-order-summary__img-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 92px;
    height: 92px;
    background: var(--cf-os-color-img-bg);
    transform: rotate(3.1deg);
  }

  .cf-order-summary__img-bg--overlay {
    position: absolute;
    top: 0;
    left: 5px;
    width: 82px;
    height: 92px;
    background: var(--cf-os-color-img-overlay);
    opacity: 0.15;
    transform: rotate(3.1deg);
  }

  .cf-order-summary__img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
    width: 45px;
    height: 51px;
    object-fit: contain;
    display: block;
  }

  /* ── Quantity Badge ── */
  .cf-order-summary__qty-badge {
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
    font-family: var(--cf-os-font-body);
    font-weight: 400;
    font-size: 14.95px;
    line-height: 21px;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    text-align: center;
    color: var(--cf-os-color-background);
  }

  /* ── Product Info Column ── */
  .cf-order-summary__product-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
    min-width: 0;
  }

  .cf-order-summary__product-details {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .cf-order-summary__product-title {
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

  /* ── Edit Pill Button ── */
  .cf-order-summary__edit-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    border-radius: 42px;
    border: 1px solid var(--cf-os-color-foreground);
    background: var(--cf-os-color-background);
    padding: 6px 20px 8px 20px;
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

  .cf-order-summary__edit-btn:hover {
    background: #f0f4f8;
  }

  /* ── Summary Section ── */
  .cf-order-summary__summary-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
    width: 100%;
  }

  /* ── Line Items ── */
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

  /* ── Info Icon ── */
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

  /* ── Order Total Row ── */
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

  /* ── Promo Code Section ── */
  .cf-order-summary__promo {
    display: flex;
    flex-direction: row;
    gap: 14px;
    align-items: center;
    width: 100%;
  }

  .cf-order-summary__promo-input-wrap {
    flex: 1;
    min-width: 0;
  }

  .cf-order-summary__promo-input {
    width: 100%;
    height: 34px;
    border-radius: 6px;
    border: 1px solid var(--cf-os-color-input-border);
    background: var(--cf-os-color-background);
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

  /* ── Apply Pill Button ── */
  .cf-order-summary__apply-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    border-radius: 42px;
    border: 1px solid var(--cf-os-color-foreground);
    background: var(--cf-os-color-background);
    padding: 6px 20px 8px 20px;
    font-family: var(--cf-os-font-body);
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    text-align: center;
    color: var(--cf-os-color-foreground);
    cursor: pointer;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .cf-order-summary__apply-btn:hover {
    background: #f0f4f8;
  }

  /* ── Detail Rows (Address / Payment) ── */
  .cf-order-summary__details {
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

  .cf-order-summary__detail-link {
    font-family: var(--cf-os-font-body);
    font-weight: 400;
    font-size: 16px;
    line-height: 23px;
    color: var(--cf-os-color-primary);
    text-decoration: underline;
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
  }

  .cf-order-summary__detail-link:hover {
    opacity: 0.8;
  }

  /* ── Loading State ── */
  .cf-order-summary__loading {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 0;
    font-family: var(--cf-os-font-body);
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: var(--cf-os-color-foreground);
    opacity: 0.6;
  }

  /* ── Responsive (Mobile) ── */
  @media (max-width: 767px) {
    .cf-order-summary__heading {
      font-size: 16px;
      line-height: 21px;
      letter-spacing: -0.16px;
    }

    .cf-order-summary__img-frame {
      width: 80px;
      height: 80px;
    }

    .cf-order-summary__img-bg {
      width: 80px;
      height: 80px;
    }

    .cf-order-summary__img-bg--overlay {
      width: 71px;
      height: 80px;
      left: 4px;
    }

    .cf-order-summary__img {
      width: 40px;
      height: 44px;
    }

    .cf-order-summary__qty-badge {
      width: 20px;
      height: 18px;
      border-radius: 55px;
      font-family: var(--cf-os-font-inter);
      font-size: 13px;
      line-height: 16px;
      letter-spacing: 0.52px;
    }

    .cf-order-summary__product-title {
      font-size: 14px;
      line-height: 20px;
      letter-spacing: 0.14px;
    }

    .cf-order-summary__product-price {
      font-size: 12px;
      line-height: 17px;
      letter-spacing: 0.12px;
    }

    .cf-order-summary__line-label,
    .cf-order-summary__line-value {
      font-size: 12px;
      line-height: 17px;
      letter-spacing: 0.12px;
    }

    .cf-order-summary__total-label,
    .cf-order-summary__total-value {
      font-size: 14px;
      line-height: 20px;
      letter-spacing: -0.14px;
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

    .cf-order-summary__detail-text {
      font-size: 14px;
      line-height: 20px;
      letter-spacing: -0.14px;
    }

    .cf-order-summary__detail-link {
      font-size: 14px;
      line-height: 20px;
    }
  }
`;

/* ── SVG Icons ── */
const SVG_INFO_CIRCLE = `<svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="6.5" cy="6.5" r="5.5" fill="#FFFFFF" stroke="#2C70BB" stroke-width="1"/><text x="6.5" y="10" text-anchor="middle" font-size="10.4" font-weight="400" fill="#2C70BB" style="font-family:'FT System',system-ui,sans-serif;letter-spacing:-0.1px">i</text></svg>`;

class CfOrderSummaryWidget extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._subscriptions = [];
    this._session = null;
    this._address = null;
    this._paymentInfo = null;
    this._loading = true;
    this._initRetries = 0;
    this._orderChangedHandler = null;
  }

  connectedCallback() {
    this._render();
    this._init();

    this._orderChangedHandler = () => {
      this._loading = true;
      this._render();
      this._subscriptions = [];
      this._address = null;
      this._paymentInfo = null;
      this._fetchData();
    };
    document.addEventListener('Recharge::action::orderChanged', this._orderChangedHandler);
  }

  disconnectedCallback() {
    if (this._orderChangedHandler) {
      document.removeEventListener('Recharge::action::orderChanged', this._orderChangedHandler);
      this._orderChangedHandler = null;
    }
  }

  refresh() {
    this._loading = true;
    this._render();
    this._fetchData();
  }

  /* ── Initialization (polls for Recharge SDK) ── */
  _init() {
    if (typeof recharge !== 'undefined' && recharge.auth) {
      this._fetchData();
      return;
    }
    if (this._initRetries < 20) {
      this._initRetries++;
      setTimeout(() => this._init(), 1000);
    } else {
      this._loading = false;
      this._render();
    }
  }

  /* ── Data Fetching ── */
  async _fetchData() {
    try {
      if (!this._session) {
        this._session = await recharge.auth.loginCustomerPortal();
      }

      const res = await recharge.subscription.listSubscriptions(this._session, {
        limit: 25,
        sort_by: 'id-asc',
        status: 'Active',
        include: 'address'
      });
      this._subscriptions = (res && res.subscriptions) || [];

      /* Try to extract address from subscription include data */
      if (this._subscriptions.length > 0) {
        const sub = this._subscriptions[0];
        if (sub.include && sub.include.address) {
          this._address = sub.include.address;
        }
      }

      /* Try to fetch addresses if not available from include */
      if (!this._address) {
        try {
          if (recharge.address && recharge.address.listAddresses) {
            const addrRes = await recharge.address.listAddresses(this._session, { limit: 1 });
            if (addrRes && addrRes.addresses && addrRes.addresses.length > 0) {
              this._address = addrRes.addresses[0];
            }
          }
        } catch (e) {
          /* Address API may not be available via storefront SDK */
        }
      }

      /* Try to fetch payment methods */
      try {
        if (recharge.paymentMethod && recharge.paymentMethod.listPaymentMethods) {
          const pmRes = await recharge.paymentMethod.listPaymentMethods(this._session);
          if (pmRes && pmRes.payment_methods && pmRes.payment_methods.length > 0) {
            this._paymentInfo = pmRes.payment_methods[0];
          }
        }
      } catch (e) {
        /* Payment method API may not be available via storefront SDK */
      }

      this._loading = false;
      this._render();
    } catch (err) {
      console.error('[CF Order Summary] Data fetch failed:', err);
      this._loading = false;
      this._render();
    }
  }

  /* ── Price Formatting ── */
  _formatProductPrice(price, currency) {
    const num = parseFloat(price);
    if (isNaN(num)) return price || '0.00';
    return num.toFixed(2) + ' ' + (currency || 'USD');
  }

  _formatSummaryPrice(price, currency) {
    const num = parseFloat(price);
    if (isNaN(num)) return '$' + (price || '0.00');
    return '$' + num.toFixed(2) + ' ' + (currency || 'USD');
  }

  /* ── Address Formatting ── */
  _formatAddress() {
    if (!this._address) return 'View in account';
    return this._address.address1 || 'View in account';
  }

  /* ── Payment Formatting ── */
  _formatPayment() {
    if (!this._paymentInfo) return 'View in account';
    const details = this._paymentInfo.payment_details || this._paymentInfo;
    const brand = details.brand || details.card_brand || 'Card';
    const last4 = details.last4 || details.card_last4 || '****';
    return brand + ' ending in ' + last4;
  }

  /* ── Main Render ── */
  _render() {
    if (this._loading) {
      this.shadowRoot.innerHTML = `
        <style>${CF_ORDER_SUMMARY_STYLES}</style>
        <div class="cf-order-summary">
          <div class="cf-order-summary__loading">Loading order details\u2026</div>
        </div>
      `;
      return;
    }

    const hasData = this._subscriptions.length > 0;
    this.shadowRoot.innerHTML = `
      <style>${CF_ORDER_SUMMARY_STYLES}</style>
      ${hasData ? this._renderContent() : this._renderFallback()}
    `;

    this._bindEvents();
  }

  /* ── Render with live API data ── */
  _renderContent() {
    const subs = this._subscriptions;
    const currency = subs[0].presentment_currency || 'USD';

    const subtotal = subs.reduce(function(sum, s) {
      return sum + (parseFloat(s.price) || 0) * (s.quantity || 1);
    }, 0);

    return this._renderOrderSummary({
      products: subs.map(function(s) {
        return {
          id: s.id,
          title: s.product_title || 'Product',
          variantTitle: s.variant_title || '',
          price: s.price || '0.00',
          currency: currency,
          quantity: s.quantity || 1,
          imageUrl: s.product_image_url || s.image || null
        };
      }),
      subtotal: subtotal.toFixed(2),
      taxes: '0.00',
      shipping: 'FREE',
      total: subtotal.toFixed(2),
      currency: currency,
      address: this._formatAddress(),
      payment: this._formatPayment()
    });
  }

  /* ── Render with placeholder data (Figma design defaults) ── */
  _renderFallback() {
    return this._renderOrderSummary({
      products: [{
        id: null,
        title: 'Pitcher Replacement Filter',
        variantTitle: '',
        price: '50.00',
        currency: 'USD',
        quantity: 1,
        imageUrl: null
      }],
      subtotal: '50.00',
      taxes: '0.00',
      shipping: 'FREE',
      total: '50.00',
      currency: 'USD',
      address: '1601 80th Street',
      payment: 'Visa ending in 4242'
    });
  }

  /* ── Shared Render (data-agnostic) ── */
  _renderOrderSummary(data) {
    const productsHtml = data.products.map(function(p) {
      const subIdAttr = p.id ? ' data-sub-id="' + p.id + '"' : '';
      const imageHtml = p.imageUrl
        ? '<img class="cf-order-summary__img" src="' + p.imageUrl + '" alt="' + p.title + '" loading="lazy" />'
        : '';

      return '<div class="cf-order-summary__product">'
        + '<div class="cf-order-summary__img-frame">'
          + '<div class="cf-order-summary__img-bg"></div>'
          + '<div class="cf-order-summary__img-bg--overlay"></div>'
          + imageHtml
          + '<div class="cf-order-summary__qty-badge">' + p.quantity + '</div>'
        + '</div>'
        + '<div class="cf-order-summary__product-info">'
          + '<div class="cf-order-summary__product-details">'
            + '<span class="cf-order-summary__product-title">' + p.title + '</span>'
            + '<span class="cf-order-summary__product-price">' + parseFloat(p.price).toFixed(2) + ' ' + p.currency + '</span>'
          + '</div>'
          + '<button class="cf-order-summary__edit-btn" type="button" data-action="edit-subscription"' + subIdAttr + '>Edit</button>'
        + '</div>'
      + '</div>';
    }).join('');

    return '<div class="cf-order-summary">'
      /* ── In your order ── */
      + '<h3 class="cf-order-summary__heading">In your order</h3>'
      + '<div class="cf-order-summary__products">'
        + productsHtml
      + '</div>'

      /* ── Order Summary ── */
      + '<h3 class="cf-order-summary__heading">Order Summary</h3>'
      + '<div class="cf-order-summary__summary-section">'
        + '<div class="cf-order-summary__line-items">'
          /* Subtotal */
          + '<div class="cf-order-summary__line-row">'
            + '<span class="cf-order-summary__line-label">Subtotal</span>'
            + '<span class="cf-order-summary__line-value">$' + parseFloat(data.subtotal).toFixed(2) + ' ' + data.currency + '</span>'
          + '</div>'
          /* Taxes */
          + '<div class="cf-order-summary__line-row">'
            + '<span class="cf-order-summary__line-label">'
              + '<span class="cf-order-summary__info-icon">' + SVG_INFO_CIRCLE + '</span>'
              + 'Taxes'
            + '</span>'
            + '<span class="cf-order-summary__line-value">$' + parseFloat(data.taxes).toFixed(2) + ' ' + data.currency + '</span>'
          + '</div>'
          /* Shipping */
          + '<div class="cf-order-summary__line-row">'
            + '<span class="cf-order-summary__line-label">Shipping:</span>'
            + '<span class="cf-order-summary__line-value">' + data.shipping + '</span>'
          + '</div>'
        + '</div>'
        /* Order Total */
        + '<div class="cf-order-summary__total-row">'
          + '<span class="cf-order-summary__total-label">'
            + '<span class="cf-order-summary__info-icon">' + SVG_INFO_CIRCLE + '</span>'
            + 'Order Total'
          + '</span>'
          + '<span class="cf-order-summary__total-value">$' + parseFloat(data.total).toFixed(2) + ' ' + data.currency + '</span>'
        + '</div>'
        /* Promo Code */
        + '<div class="cf-order-summary__promo">'
          + '<div class="cf-order-summary__promo-input-wrap">'
            + '<input type="text" class="cf-order-summary__promo-input" placeholder="Enter promo code" />'
          + '</div>'
          + '<button class="cf-order-summary__apply-btn" type="button" data-action="apply-promo">Apply</button>'
        + '</div>'
      + '</div>'

      /* ── Delivery Address & Payment ── */
      + '<h3 class="cf-order-summary__heading">Delivery Address &amp; Payment</h3>'
      + '<div class="cf-order-summary__details">'
        /* Address Row */
        + '<div class="cf-order-summary__detail-row">'
          + '<span class="cf-order-summary__detail-text">' + data.address + '</span>'
          + '<button class="cf-order-summary__detail-link" type="button" data-action="edit-address">Edit Address</button>'
        + '</div>'
        /* Payment Row */
        + '<div class="cf-order-summary__detail-row">'
          + '<span class="cf-order-summary__detail-text">' + data.payment + '</span>'
          + '<button class="cf-order-summary__detail-link" type="button" data-action="edit-payment">Edit Payment</button>'
        + '</div>'
      + '</div>'
    + '</div>';
  }

  /* ── Event Binding (delegated on Shadow DOM root) ── */
  _bindEvents() {
    this.shadowRoot.addEventListener('click', (e) => {
      const target = e.target.closest('[data-action]');
      if (!target) return;

      const action = target.getAttribute('data-action');

      switch (action) {
        case 'edit-subscription': {
          const subId = target.getAttribute('data-sub-id');
          if (subId) {
            this.dispatchEvent(new CustomEvent('cf-order-summary:edit-subscription', {
              bubbles: true, composed: true,
              detail: { subscriptionId: subId }
            }));
            window.location.href = '/tools/recurring/subscriptions/' + subId;
          }
          break;
        }

        case 'apply-promo': {
          const input = this.shadowRoot.querySelector('.cf-order-summary__promo-input');
          const code = input ? input.value.trim() : '';
          if (code) {
            this.dispatchEvent(new CustomEvent('cf-order-summary:apply-promo', {
              bubbles: true, composed: true,
              detail: { code: code }
            }));
            target.textContent = 'Applied!';
            setTimeout(function() { target.textContent = 'Apply'; }, 2000);
          }
          break;
        }

        case 'edit-address':
          this.dispatchEvent(new CustomEvent('cf-order-summary:edit-address', {
            bubbles: true, composed: true
          }));
          window.location.href = '/tools/recurring/shipping';
          break;

        case 'edit-payment':
          this.dispatchEvent(new CustomEvent('cf-order-summary:edit-payment', {
            bubbles: true, composed: true
          }));
          window.location.href = '/tools/recurring/payment_methods';
          break;
      }
    });
  }
}

export default CfOrderSummaryWidget;
