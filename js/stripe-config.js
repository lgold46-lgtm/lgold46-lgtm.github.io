// Stripe Configuration
// Update these values with your actual Stripe keys from https://dashboard.stripe.com/developers/apikeys

const STRIPE_CONFIG = {
  // Your Stripe Publishable Key (public, safe to expose)
  // Get this from: https://dashboard.stripe.com/developers/apikeys
  publishableKey: 'pk_test_51234567890123456789', // REPLACE WITH YOUR KEY
  
  // Currency and country
  currency: 'ZAR',
  country: 'ZA',
  
  // Products configuration
  // Get these Price IDs from your Stripe Dashboard > Products
  products: {
    essential: {
      priceId: 'price_1234567890123456789012345', // REPLACE WITH YOUR PRICE ID
      name: 'Essential Bag',
      price: 'R200',
      priceZAR: 20000, // Price in cents (R200.00)
      description: 'Handbag-sized first aid kit built for real life with kids'
    },
    comfort: {
      priceId: 'price_9876543210987654321098765', // REPLACE WITH YOUR PRICE ID
      name: 'Comfort Bag',
      price: 'R350',
      priceZAR: 35000, // Price in cents (R350.00)
      description: 'Premium first aid kit with extended supplies'
    }
  },
  
  // Success and cancel URLs (update with your domain)
  successUrl: window.location.origin + '/success.html',
  cancelUrl: window.location.origin + '/'
};

// Initialize Stripe
let stripe;

async function initializeStripe() {
  try {
    if (!STRIPE_CONFIG.publishableKey.includes('pk_')) {
      console.error('❌ Stripe publishable key not configured. Please update STRIPE_CONFIG.publishableKey');
      return false;
    }
    
    stripe = Stripe(STRIPE_CONFIG.publishableKey);
    console.log('✓ Stripe initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize Stripe:', error);
    return false;
  }
}

// Make sure Stripe is initialized when the page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeStripe);
} else {
  initializeStripe();
}
