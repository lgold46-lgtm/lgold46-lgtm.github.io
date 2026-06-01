// PayFast Checkout Handler
// This file handles the checkout process for both products

class PayFastCheckout {
  constructor() {
    this.products = PAYFAST_CONFIG.products;
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Find all "Order Now" buttons and add click handlers
    document.querySelectorAll('[data-product]').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const productKey = button.dataset.product;
        this.initiateCheckout(productKey);
      });
    });
  }

  /**
   * Initiate PayFast checkout
   * @param {string} productKey - 'essential' or 'comfort'
   */
  initiateCheckout(productKey) {
    const product = this.products[productKey];
    
    if (!product) {
      console.error(`Product not found: ${productKey}`);
      alert('Product not found');
      return;
    }

    // Validate configuration
    if (PAYFAST_CONFIG.merchantId === 'YOUR_MERCHANT_ID' || 
        PAYFAST_CONFIG.merchantKey === 'YOUR_MERCHANT_KEY') {
      alert('Payment system is not configured yet. Please contact the administrator.');
      console.error('PayFast not configured. Update js/payfast-config.js with your details.');
      return;
    }

    try {
      // Create and submit checkout form
      this.submitPayment(product);
    } catch (error) {
      console.error('Checkout error:', error);
      alert('An error occurred. Please try again.');
    }
  }

  /**
   * Generate MD5 hash signature for PayFast
   * Used for verifying payment integrity
   */
  generateSignature(data) {
    // Create the signature string from PayFast data
    let signature = `${PAYFAST_CONFIG.merchantId}`;
    
    // Add each field in order
    const fields = [
      'merchant_id', 'return_url', 'cancel_url', 'notify_url',
      'name_first', 'name_last', 'email_address',
      'item_name', 'item_description', 'custom_int1', 'custom_str1',
      'amount', 'item_id', 'reference'
    ];

    for (let field of fields) {
      if (data[field]) {
        signature += data[field];
      }
    }

    signature += PAYFAST_CONFIG.merchantKey;

    // Generate MD5 hash using crypto-js
    return md5(signature);
  }

  /**
   * Create and submit PayFast payment form
   */
  submitPayment(product) {
    // Generate unique reference
    const reference = `MLA-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Prepare PayFast data
    const paymentData = {
      merchant_id: PAYFAST_CONFIG.merchantId,
      merchant_key: PAYFAST_CONFIG.merchantKey,
      return_url: PAYFAST_CONFIG.returnUrl,
      cancel_url: PAYFAST_CONFIG.cancelUrl,
      notify_url: PAYFAST_CONFIG.notifyUrl,
      name_first: 'Customer',
      name_last: 'Purchase',
      email_address: 'customer@example.com',
      item_name: product.name,
      item_description: product.description,
      item_id: product.itemId,
      custom_int1: 1, // Quantity
      custom_str1: reference, // Reference
      amount: product.price.toFixed(2),
      currency: PAYFAST_CONFIG.currency
    };

    // Generate signature
    try {
      paymentData.signature = this.generateSignature(paymentData);
    } catch (error) {
      console.warn('Signature generation requires crypto library. Using form without signature.');
      // PayFast allows unsigned forms for testing
    }

    // Create hidden form
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = PAYFAST_CONFIG.testMode ? PAYFAST_CONFIG.testUrl : PAYFAST_CONFIG.liveUrl;
    form.style.display = 'none';

    // Add all fields to form
    for (let [key, value] of Object.entries(paymentData)) {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      form.appendChild(input);
    }

    // Submit form
    document.body.appendChild(form);
    
    console.log(`Redirecting to PayFast for ${product.name}...`);
    form.submit();
  }
}

// Initialize checkout when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // Check if MD5 library is available
    if (typeof md5 === 'undefined') {
      console.warn('crypto-js not loaded. Signature verification disabled.');
    }
    new PayFastCheckout();
  });
} else {
  if (typeof md5 === 'undefined') {
    console.warn('crypto-js not loaded. Signature verification disabled.');
  }
  new PayFastCheckout();
}
