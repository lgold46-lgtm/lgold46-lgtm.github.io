// PayFast Configuration for Mason's Little Aid
// Update these values with your PayFast merchant details

const PAYFAST_CONFIG = {
  // Your PayFast Merchant ID and Key
  // Get these from: https://www.payfast.co.za/user/login (login to dashboard)
  // Go to: Settings → Merchant Profile → Merchant Details
  merchantId: 'YOUR_MERCHANT_ID', // Replace with your 8-10 digit ID
  merchantKey: 'YOUR_MERCHANT_KEY', // Replace with your merchant key
  
  // PayFast URLs
  testUrl: 'https://sandbox.payfast.co.za/eng/process', // Test/Sandbox
  liveUrl: 'https://www.payfast.co.za/eng/process', // Live
  
  // Use test or live (true = test mode, false = live)
  testMode: true,
  
  // Your website domain
  returnUrl: window.location.origin + '/', // Where to redirect after payment
  cancelUrl: window.location.origin + '/', // Where to redirect if cancelled
  notifyUrl: window.location.origin + '/payfast-notify.php', // Webhook (optional)
  
  // Currency (ZAR for South Africa)
  currency: 'ZAR',
  
  // Products
  products: {
    essential: {
      name: 'Essential Bag',
      description: 'Handbag-sized first aid kit built for real life with kids',
      price: 200.00,
      itemId: 'essential-bag'
    },
    comfort: {
      name: 'Comfort Bag',
      description: 'Premium first aid kit with extended supplies',
      price: 350.00,
      itemId: 'comfort-bag'
    }
  }
};

// Validate configuration
function validatePayFastConfig() {
  if (PAYFAST_CONFIG.merchantId === 'YOUR_MERCHANT_ID') {
    console.warn('⚠️ PayFast Merchant ID not configured. Please update PAYFAST_CONFIG.merchantId');
    return false;
  }
  if (PAYFAST_CONFIG.merchantKey === 'YOUR_MERCHANT_KEY') {
    console.warn('⚠️ PayFast Merchant Key not configured. Please update PAYFAST_CONFIG.merchantKey');
    return false;
  }
  console.log('✓ PayFast configuration valid');
  return true;
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', validatePayFastConfig);
} else {
  validatePayFastConfig();
}
