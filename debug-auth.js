// Test Authentication Status
// Paste this in browser console to check auth state

console.log("=== AUTH DEBUG ===");
console.log("Token:", localStorage.getItem("online_marketplace_access_token"));
console.log("Token exists:", !!localStorage.getItem("online_marketplace_access_token"));

// To clear token and test unauthenticated state:
// localStorage.removeItem("online_marketplace_access_token");
// Then refresh the page

// To set a dummy token and test authenticated state:
// localStorage.setItem("online_marketplace_access_token", "dummy-token");
// Then refresh the page
