class PayFastCheckout {
  constructor() {
    this.products = PAYFAST_CONFIG.products;
    this.shipping = PAYFAST_CONFIG.shipping;
    this.selectedShipping = null;
    this.currentProduct = null;
    this.quantity = 1;
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
        max-height: 90vh;
        overflow-y: auto;
        overscroll-behavior: contain;
      }
      .mla-modal::-webkit-scrollbar { width: 4px; }
      .mla-modal::-webkit-scrollbar-track { background: transparent; }
      .mla-modal::-webkit-scrollbar-thumb { background: #909180; border-radius: 999px; }
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
      .mla-quantity-row {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 0.5rem;
      }
      .mla-qty-btn {
        width: 2.2rem;
        height: 2.2rem;
        border: 1px solid #cfc1aa;
        background: #fff;
        color: #372c21;
        font-size: 1.2rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: border-color 0.2s, background 0.2s;
        flex-shrink: 0;
        line-height: 1;
      }
      .mla-qty-btn:hover { border-color: #909180; background: #ede5d8; }
      .mla-qty-btn:disabled { opacity: 0.35; cursor: not-allowed; }
      .mla-qty-value {
        font-size: 1.1rem;
        font-weight: 700;
        color: #372c21;
        min-width: 1.5rem;
        text-align: center;
      }
      .mla-qty-subtotal {
        font-size: 0.82rem;
        color: #909180;
        margin-left: 0.4rem;
      }
      .mla-fields-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.8rem;
        margin-bottom: 0.8rem;
      }
      .mla-field-group {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
        margin-bottom: 0.8rem;
      }
      .mla-field-label {
        font-size: 0.7rem;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: #909180;
      }
      .mla-required { color: #909180; }
      .mla-optional {
        font-size: 0.65rem;
        letter-spacing: 0.1em;
        color: #909180;
        opacity: 0.7;
        text-transform: none;
      }
      .mla-field-input {
        background: #fff;
        border: 1px solid #cfc1aa;
        padding: 0.75rem 1rem;
        font-family: 'Nunito', sans-serif;
        font-size: 0.88rem;
        color: #372c21;
        outline: none;
        transition: border-color 0.2s;
        width: 100%;
        min-height: 44px;
      }
      .mla-field-input:focus { border-color: #909180; }
      .mla-field-input.mla-error { border-color: #c0392b; }
      .mla-validation-msg {
        font-size: 0.75rem;
        color: #c0392b;
        margin-bottom: 0.8rem;
        min-height: 1rem;
      }
      @media (max-width: 480px) {
        .mla-fields-row { grid-template-columns: 1fr; }
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
        <h2 class="mla-modal-title" id="mlaModalTitle">Your details</h2>
        <p class="mla-modal-product-price" id="mlaModalProductLine"></p>

        <div class="mla-fields-row">
          <div class="mla-field-group">
            <label class="mla-field-label">First Name <span class="mla-required">*</span></label>
            <input class="mla-field-input" type="text" id="mlaFirstName" placeholder="Jane">
          </div>
          <div class="mla-field-group">
            <label class="mla-field-label">Last Name <span class="mla-required">*</span></label>
            <input class="mla-field-input" type="text" id="mlaLastName" placeholder="Smith">
          </div>
        </div>
        <div class="mla-field-group">
          <label class="mla-field-label">Email Address <span class="mla-required">*</span></label>
          <input class="mla-field-input" type="email" id="mlaEmail" placeholder="jane@example.com">
        </div>
        <div class="mla-field-group" style="margin-bottom:1.6rem;">
          <label class="mla-field-label">Phone Number <span class="mla-optional">(optional)</span></label>
          <input class="mla-field-input" type="tel" id="mlaPhone" placeholder="+27 71 000 0000">
        </div>

        <span class="mla-shipping-label">Quantity</span>
        <div class="mla-quantity-row">
          <button class="mla-qty-btn" id="mlaQtyMinus">−</button>
          <span class="mla-qty-value" id="mlaQtyValue">1</span>
          <button class="mla-qty-btn" id="mlaQtyPlus">+</button>
          <span class="mla-qty-subtotal" id="mlaQtySubtotal"></span>
        </div>

        <span class="mla-shipping-label" style="margin-top:1.6rem;">Delivery option</span>
        <div class="mla-shipping-options" id="mlaShippingOptions"></div>
        <hr class="mla-modal-divider">
        <div class="mla-modal-total">
          <span class="mla-modal-total-label">Total (incl. shipping)</span>
          <span class="mla-modal-total-amount" id="mlaTotalAmount">—</span>
        </div>
        <div id="mlaValidationMsg" class="mla-validation-msg"></div>
        <button class="mla-modal-proceed" id="mlaModalProceed" disabled>Proceed to Payment</button>
        <p class="mla-modal-note">You'll be redirected to PayFast's secure checkout.</p>
      </div>
    `;
    document.body.appendChild(overlay);

    const self = this;
    document.getElementById('mlaModalClose').addEventListener('click', () => self.closeModal());
    overlay.addEventListener('click', (e) => { if (e.target === overlay) self.closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') self.closeModal(); });

    document.getElementById('mlaModalProceed').addEventListener('click', () => {
      if (self.selectedShipping && self.currentProduct) {

        // Get field values
        const firstName = document.getElementById('mlaFirstName').value.trim();
        const lastName = document.getElementById('mlaLastName').value.trim();
        const email = document.getElementById('mlaEmail').value.trim();
        const phone = document.getElementById('mlaPhone').value.trim();
        const validationMsg = document.getElementById('mlaValidationMsg');

        // Clear previous errors
        ['mlaFirstName','mlaLastName','mlaEmail'].forEach(id => {
          document.getElementById(id).classList.remove('mla-error');
        });
        validationMsg.textContent = '';

        // Validate
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!firstName) {
          document.getElementById('mlaFirstName').classList.add('mla-error');
          validationMsg.textContent = 'Please enter your first name.';
          return;
        }
        if (!lastName) {
          document.getElementById('mlaLastName').classList.add('mla-error');
          validationMsg.textContent = 'Please enter your last name.';
          return;
        }
        if (!email || !emailRegex.test(email)) {
          document.getElementById('mlaEmail').classList.add('mla-error');
          validationMsg.textContent = 'Please enter a valid email address.';
          return;
        }

        const shippingOption = self.shipping[self.selectedShipping];
        const total = (self.currentProduct.price * self.quantity) + shippingOption.price;
        self.submitPayment(self.currentProduct, shippingOption, total, firstName, lastName, email, phone);
        self.closeModal();
      }
    });
  }

  openModal(product) {
    const overlay = document.getElementById('mlaModalOverlay');
    const productLine = document.getElementById('mlaModalProductLine');
    const optionsContainer = document.getElementById('mlaShippingOptions');
    const totalEl = document.getElementById('mlaTotalAmount');
    const proceedBtn = document.getElementById('mlaModalProceed');
    const qtyValue = document.getElementById('mlaQtyValue');
    const qtySubtotal = document.getElementById('mlaQtySubtotal');
    const qtyMinus = document.getElementById('mlaQtyMinus');
    const qtyPlus = document.getElementById('mlaQtyPlus');

    // Reset fields
    document.getElementById('mlaFirstName').value = '';
    document.getElementById('mlaLastName').value = '';
    document.getElementById('mlaEmail').value = '';
    document.getElementById('mlaPhone').value = '';
    document.getElementById('mlaValidationMsg').textContent = '';
    ['mlaFirstName','mlaLastName','mlaEmail'].forEach(id => {
      document.getElementById(id).classList.remove('mla-error');
    });

    // Quantity display update helper
    const updateTotal = () => {
      const shippingPrice = this.selectedShipping ? this.shipping[this.selectedShipping].price : null;
      qtySubtotal.textContent = `R${(product.price * this.quantity).toFixed(2)}`;
      qtyMinus.disabled = this.quantity <= 1;
      qtyValue.textContent = this.quantity;
      if (shippingPrice !== null) {
        const total = (product.price * this.quantity) + shippingPrice;
        totalEl.textContent = `R${total.toFixed(2)}`;
        totalEl.classList.add('confirmed');
      }
    };

    // Init quantity display
    qtyValue.textContent = '1';
    qtySubtotal.textContent = `R${product.price.toFixed(2)}`;
    qtyMinus.disabled = true;

    qtyMinus.onclick = () => {
      if (this.quantity > 1) { this.quantity--; updateTotal(); }
    };
    qtyPlus.onclick = () => {
      if (this.quantity < 10) { this.quantity++; updateTotal(); }
    };

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
        <span class="mla-shipping-option-price">${option.price === 0 ? 'Free' : 'R' + option.price.toFixed(2)}</span>
      `;
      el.querySelector('input').addEventListener('change', () => {
        document.querySelectorAll('.mla-shipping-option').forEach(o => o.classList.remove('selected'));
        el.classList.add('selected');
        this.selectedShipping = key;
        proceedBtn.disabled = false;
        updateTotal();
      });
      optionsContainer.appendChild(el);
    });

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

submitPayment(product, shippingOption, total, firstName, lastName, email, phone) {
    const reference = `MLA-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const paymentData = {
      merchant_id: PAYFAST_CONFIG.merchantId,
      merchant_key: PAYFAST_CONFIG.merchantKey,
      return_url: PAYFAST_CONFIG.returnUrl,
      cancel_url: PAYFAST_CONFIG.cancelUrl,
      notify_url: PAYFAST_CONFIG.notifyUrl,
      name_first: firstName,
      name_last: lastName,
      email_address: email,
      cell_number: phone || '',
      item_name: `${product.name} x${this.quantity} + ${shippingOption.label}`,
      item_description: `${product.name} x${this.quantity} @ R${product.price.toFixed(2)} each. Shipping: ${shippingOption.label} (${shippingOption.description})`,
      custom_str1: reference,
      amount: total.toFixed(2),
      currency: PAYFAST_CONFIG.currency
    };

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = PAYFAST_CONFIG.testMode ? PAYFAST_CONFIG.testUrl : PAYFAST_CONFIG.liveUrl;
    form.style.display = 'none';

    for (let [key, value] of Object.entries(paymentData)) {
      if (value !== '') {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form.appendChild(input);
      }
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
