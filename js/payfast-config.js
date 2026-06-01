// PayFast Configuration for Mason's Little Aid
// Update these values with your PayFast merchant details

const PAYFAST_CONFIG = {
  // Your PayFast Merchant ID and Key
  // Currently using TEST credentials for sandbox testing
  // Get your LIVE credentials from: https://www.payfast.co.za/user/login (login to dashboard)
  // Go to: Settings → Merchant Profile → Merchant Details
  merchantId: '10000100', // Test Merchant ID (change to your live ID when ready)
  merchantKey: '46f1db6c4f61c1997cdb629c387acc63', // Test Merchant Key (change to your live key)
  
  // PayFast URLs
  testUrl: 'https://sandbox.payfast.co.za/eng/process', // Test/Sandbox
  liveUrl: 'https://www.payfast.co.za/eng/process', // Live
  
  // Use test or live (true = test mode, false = live)
  testMode: true,
  
  // Your website domain
  returnUrl: window.location.origin + '/success.html', // Where to redirect after payment
  cancelUrl: window.location.origin + '/', // Where to redirect if cancelled
  notifyUrl: window.location.origin + '/success.html', // Webhook (optional)
  
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
