class PayFastCheckout {
  constructor() {
    this.products = PAYFAST_CONFIG.products;
    this.shipping = PAYFAST_CONFIG.shipping;
    this.selectedShipping = null;
    this.currentProduct = null;
    this.setupEventListeners();
    this.injectModal();
  }

  setupEventListeners() {
    document.querySelectorAll('[data-product]').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const productKey = button.dataset.product;
        this.initiateCheckout(productKey);
      });
    });
  }

  initiateCheckout(productKey) {
    const product = this.products[productKey];
    if (!product) { alert('Product not found'); return; }

    if (PAYFAST_CONFIG.merchantId === 'YOUR_MERCHANT_ID' ||
        PAYFAST_CONFIG.merchantKey === 'YOUR_MERCHANT_KEY') {
      alert('Payment system is not configured yet. Please contact us directly.');
      return;
    }

    this.currentProduct = product;
    this.selectedShipping = null;
    this.openModal(product);
  }

  injectModal() {
    const style = document.createElement('style');
    style.textContent = `
      .mla-modal-overlay {
        display: none;
        position: fixed;
        inset: 0;
        background: rgba(55, 44, 33, 0.55);
        backdrop-filter: blur(4px);
        z-index: 1000;
        align-items: center;
        justify-content: center;
        padding: 1.5rem;
      }
      .mla-modal-overlay.open { display: flex; }
      .mla-modal {
        background: #faf7f3;
        max-width: 480px;
        width: 100%;
        padding: 2.8rem;
        position: relative;
        animation: modalIn .25s ease;
      }
      @keyframes modalIn {
        from { opacity: 0; transform: translateY(16px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .mla-modal-close {
        position: absolute;
        top: 1.2rem; right: 1.4rem;
        background: none; border: none;
        font-size: 1.4rem; cursor: pointer;
        color: #909180;
        line-height: 1;
        padding: 0.2rem 0.4rem;
      }
      .mla-modal-close:hover { color: #372c21; }
      .mla-modal-eyebrow {
        font-size: 0.7rem;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: #909180;
        margin-bottom: 0.5rem;
      }
      .mla-modal-title {
        font-family: 'Nunito', sans-serif;
        font-size: 1.5rem;
        font-weight: 300;
        color: #372c21;
        margin-bottom: 0.3rem;
      }
      .mla-modal-product-price {
        font-size: 0.88rem;
        color: #909180;
        margin-bottom: 2rem;
      }
      .mla-shipping-label {
        font-size: 0.7rem;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: #909180;
        margin-bottom: 0.9rem;
        display: block;
      }
      .mla-shipping-options { display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 2rem; }
      .mla-shipping-option {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem 1.2rem;
        border: 1px solid #cfc1aa;
        cursor: pointer;
        transition: border-color 0.2s, background 0.2s;
        background: #fff;
      }
      .mla-shipping-option:hover { border-color: #909180; }
      .mla-shipping-option.selected {
        border-color: #909180;
        background: #ede5d8;
      }
      .mla-shipping-option input[type="radio"] {
        accent-color: #909180;
        width: 1rem; height: 1rem;
        flex-shrink: 0;
        cursor: pointer;
      }
      .mla-shipping-option-info { flex: 1; }
      .mla-shipping-option-name {
        font-size: 0.9rem;
        font-weight: 700;
        color: #372c21;
        display: block;
        margin-bottom: 0.15rem;
      }
      .mla-shipping-option-desc {
        font-size: 0.78rem;
        color: #909180;
      }
      .mla-shipping-option-price {
        font-size: 0.9rem;
        font-weight: 700;
        color: #372c21;
      }
      .mla-modal-divider {
        border: none;
        border-top: 1px solid #cfc1aa;
        margin-bottom: 1.2rem;
      }
      .mla-modal-total {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        margin-bottom: 1.6rem;
      }
      .mla-modal-total-label {
        font-size: 0.78rem;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        color: #909180;
      }
      .mla-modal-total-amount {
        font-size: 1.6rem;
        font-weight: 900;
        color: #909180;
        transition: color 0.2s;
      }
      .mla-modal-total-amount.confirmed { color: #372c21; }
      .mla-modal-proceed {
        width: 100%;
        background: #909180;
        color: #faf7f3;
        border: none;
        padding: 1rem;
        font-family: 'Nunito', sans-serif;
        font-size: 0.78rem;
        font-weight: 700;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        cursor: pointer;
        transition: background 0.25s, transform 0.2s;
        min-height: 48px;
      }
      .mla-modal-proceed:hover:not(:disabled) { background: #372c21; transform: translateY(-2px); }
      .mla-modal-proceed:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }
      .mla-modal-note {
        font-size: 0.72rem;
        color: #909180;
        text-align: center;
        margin-top: 0.9rem;
      }
    `;
    document.head.appendChild(style);

    const overlay = document.createElement('div');
    overlay.className = 'mla-modal-overlay';
    overlay.id = 'mlaModalOverlay';
    overlay.innerHTML = `
      <div class="mla-modal" role="dialog" aria-modal="true" aria-labelledby="mlaModalTitle">
        <button class="mla-modal-close" id="mlaModalClose" aria-label="Close">&times;</button>
        <p class="mla-modal-eyebrow">Almost there</p>
        <h2 class="mla-modal-title" id="mlaModalTitle">Choose your shipping</h2>
        <p class="mla-modal-product-price" id="mlaModalProductLine"></p>
        <span class="mla-shipping-label">Delivery option</span>
        <div class="mla-shipping-options" id="mlaShippingOptions"></div>
        <hr class="mla-modal-divider">
        <div class="mla-modal-total">
          <span class="mla-modal-total-label">Total (incl. shipping)</span>
          <span class="mla-modal-total-amount" id="mlaTotalAmount">—</span>
        </div>
        <button class="mla-modal-proceed" id="mlaModalProceed" disabled>Proceed to Payment</button>
        <p class="mla-modal-note">You'll be redirected to PayFast's secure checkout.</p>
      </div>
    `;
    document.body.appendChild(overlay);

    // Close handlers
    document.getElementById('mlaModalClose').addEventListener('click', () => this.closeModal());
    overlay.addEventListener('click', (e) => { if (e.target === overlay) this.closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') this.closeModal(); });

    // Proceed button
    document.getElementById('mlaModalProceed').addEventListener('click', () => {
      if (this.selectedShipping && this.currentProduct) {
        const shippingOption = this.shipping[this.selectedShipping];
        const total = this.currentProduct.price + shippingOption.price;
        this.submitPayment(this.currentProduct, shippingOption, total);
        this.closeModal();
      }
    });
  }

  openModal(product) {
    const overlay = document.getElementById('mlaModalOverlay');
    const productLine = document.getElementById('mlaModalProductLine');
    const optionsContainer = document.getElementById('mlaShippingOptions');
    const totalEl = document.getElementById('mlaTotalAmount');
    const proceedBtn = document.getElementById('mlaModalProceed');

    // Set product line
    productLine.textContent = `${product.name} — R${product.price.toFixed(2)}`;

    // Reset state
    totalEl.textContent = '—';
    totalEl.classList.remove('confirmed');
    proceedBtn.disabled = true;
    this.selectedShipping = null;

    // Build shipping options
    optionsContainer.innerHTML = '';
    Object.entries(this.shipping).forEach(([key, option]) => {
      const el = document.createElement('label');
      el.className = 'mla-shipping-option';
      el.innerHTML = `
        <input type="radio" name="mla-shipping" value="${key}">
        <div class="mla-shipping-option-info">
          <span class="mla-shipping-option-name">${option.label}</span>
          <span class="mla-shipping-option-desc">${option.description}</span>
        </div>
        <span class="mla-shipping-option-price">R${option.price.toFixed(2)}</span>
      `;
      el.querySelector('input').addEventListener('change', () => {
        document.querySelectorAll('.mla-shipping-option').forEach(o => o.classList.remove('selected'));
        el.classList.add('selected');
        this.selectedShipping = key;
        const total = product.price + option.price;
        totalEl.textContent = `R${total.toFixed(2)}`;
        totalEl.classList.add('confirmed');
        proceedBtn.disabled = false;
      });
      optionsContainer.appendChild(el);
    });

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    document.getElementById('mlaModalOverlay').classList.remove('open');
    document.body.style.overflow = '';
  }

  generateSignature(data) {
    let sigStr = '';
    const orderedKeys = [
      'merchant_id', 'merchant_key', 'return_url', 'cancel_url', 'notify_url',
      'name_first', 'name_last', 'email_address',
      'item_name', 'item_description', 'custom_str1',
      'amount', 'currency'
    ];
    orderedKeys.forEach(key => {
      if (data[key] !== undefined && data[key] !== '') {
        sigStr += `${key}=${encodeURIComponent(data[key]).replace(/%20/g, '+')}&`;
      }
    });
    // Remove trailing &
    sigStr = sigStr.slice(0, -1);
    if (PAYFAST_CONFIG.passPhrase) {
      sigStr += `&passphrase=${encodeURIComponent(PAYFAST_CONFIG.passPhrase)}`;
    }
    return CryptoJS.MD5(sigStr).toString();
  }

  submitPayment(product, shippingOption, total) {
    const reference = `MLA-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const paymentData = {
      merchant_id: PAYFAST_CONFIG.merchantId,
      merchant_key: PAYFAST_CONFIG.merchantKey,
      return_url: PAYFAST_CONFIG.returnUrl,
      cancel_url: PAYFAST_CONFIG.cancelUrl,
      notify_url: PAYFAST_CONFIG.notifyUrl,
      name_first: 'Customer',
      name_last: 'Purchase',
      email_address: 'customer@example.com',
      item_name: `${product.name} + ${shippingOption.label}`,
      item_description: `${product.description}. Shipping: ${shippingOption.description}`,
      custom_str1: reference,
      amount: total.toFixed(2),
      currency: PAYFAST_CONFIG.currency
    };

    try {
      paymentData.signature = this.generateSignature(paymentData);
    } catch (e) {
      console.warn('Signature generation failed:', e);
    }

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = PAYFAST_CONFIG.testMode ? PAYFAST_CONFIG.testUrl : PAYFAST_CONFIG.liveUrl;
    form.style.display = 'none';

    for (let [key, value] of Object.entries(paymentData)) {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new PayFastCheckout());
} else {
  new PayFastCheckout();
}
