// Stripe Checkout Handler
// This file handles the checkout process for both products

class StripeCheckout {
  constructor() {
    this.products = STRIPE_CONFIG.products;
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

  async initiateCheckout(productKey) {
    const product = this.products[productKey];
    
    if (!product) {
      console.error(`Product not found: ${productKey}`);
      alert('Product not found');
      return;
    }

    if (!product.priceId.includes('price_')) {
      console.error('Stripe Price ID not configured. Please update stripe-config.js with your actual Price IDs from Stripe Dashboard.');
      alert('Payment system is not properly configured. Please contact support.');
      return;
    }

    try {
      // Show loading state
      const button = event?.target;
      if (button) {
        const originalText = button.textContent;
        button.textContent = 'Loading...';
        button.disabled = true;
      }

      // Create checkout session by calling Stripe API
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: product.priceId,
          productName: product.name,
          quantity: 1
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const session = await response.json();

      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({
        sessionId: session.id
      });

      if (error) {
        console.error('Checkout error:', error);
        alert(`Checkout error: ${error.message}`);
      }

      // Restore button state
      if (button) {
        button.textContent = originalText;
        button.disabled = false;
      }

    } catch (error) {
      console.error('Checkout error:', error);
      alert('An error occurred. Please try again.');
      
      // Restore button state
      if (button) {
        button.textContent = originalText;
        button.disabled = false;
      }
    }
  }

  // Alternative: Use Stripe Payment Links (no backend required)
  // Uncomment this method and update the HTML to use it instead
  openPaymentLink(productKey) {
    const product = this.products[productKey];
    
    if (!product.priceId.includes('price_')) {
      console.error('Stripe Price ID not configured.');
      alert('Payment system is not properly configured.');
      return;
    }

    // Open Stripe Payment Link in new window
    // You can get the payment link from your Stripe Dashboard > Products
    const paymentLinkUrl = `https://buy.stripe.com/${product.priceId}`; // This is a template
    window.open(paymentLinkUrl, '_blank');
  }
}

// Initialize checkout when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new StripeCheckout();
  });
} else {
  new StripeCheckout();
}
