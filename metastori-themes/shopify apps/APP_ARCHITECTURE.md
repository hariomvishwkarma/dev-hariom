# Shipping Protection App - Architecture & Features

## 🏗️ App Architecture

```
┌─────────────────────────────────────────────────┐
│          SHOPIFY STORE (Frontend)               │
├─────────────────────────────────────────────────┤
│  Product Page     Cart Page      Cart Drawer    │
│                                                  │
│  • Product Info   • Line Items   • Checkbox ✓   │
│  • Reviews        • Shipping     • Add/Remove    │
│                                                  │
└──────────────┬──────────────────┬───────────────┘
               │                  │
               ▼                  ▼
    ┌─────────────────────────────────────┐
    │  SHOPIFY STOREFRONT API             │
    │  (Public - No auth needed)          │
    │                                     │
    │  • Fetch Products                   │
    │  • Add to Cart                      │
    │  • Get Cart Info                    │
    └─────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────┐
│       YOUR APP BACKEND (Node.js + Next.js)      │
├─────────────────────────────────────────────────┤
│  Dashboard          API Routes      Webhooks    │
│  (Admin Panel)      (Cart Logic)    (Events)    │
│                                                  │
│  • Statistics       • Add Product   • Order     │
│  • Charts           • Store Data    • Cart      │
│  • Settings         • Get Data      • Customer  │
└──────────────┬──────────────────┬───────────────┘
               │                  │
               ▼                  ▼
    ┌─────────────────────────────────────┐
    │  SHOPIFY ADMIN API (GraphQL)        │
    │  (Authenticated - App access token) │
    │                                     │
    │  • Create Protection Product        │
    │  • Get Store Info                   │
    │  • Manage Metafields                │
    │  • Access Orders                    │
    └─────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────┐
│         YOUR DATABASE                           │
├─────────────────────────────────────────────────┤
│  • Customer Protection Data                     │
│  • Analytics & Statistics                       │
│  • App Settings per Store                       │
└─────────────────────────────────────────────────┘
```

---

## 📦 Protection Product Structure

### In Shopify Store:
```javascript
{
  id: "gid://shopify/Product/123456",
  title: "Shipping Protection",
  handle: "shipping-protection",
  description: "Protect your shipment from loss or damage",
  price: 2.99,           // or % based on cart total
  vendor: "YourAppName",
  productType: "Protection",
  isHidden: true,        // Don't show in collections
  status: "ACTIVE",
  
  // Store in Metafield:
  metafield: {
    namespace: "shipping_protection",
    key: "product_type",
    value: "protection"
  }
}
```

---

## 🛒 Cart Drawer Flow

### 1. **Load Cart Drawer**
```
Customer visits store
       ↓
Cart drawer loads
       ↓
App fetches Protection Product (Storefront API)
       ↓
Display checkbox: "Add Shipping Protection (+$2.99)"
```

### 2. **Customer Adds Protection**
```
Customer clicks checkbox ✓
       ↓
Call cartLinesAdd mutation (Storefront API)
       ↓
Send to App Backend to log event
       ↓
Cart updates with protection product
       ↓
Cart total increases
```

### 3. **Checkout**
```
Customer proceeds to checkout
       ↓
Protection product is in line items
       ↓
Charged as normal line item
       ↓
Order created with protection product
```

### 4. **Order Webhook**
```
Order placed
       ↓
Webhook: orders/create fires
       ↓
App receives webhook
       ↓
Check if protection product is in order
       ↓
Store in database:
{
  orderId: "...",
  customerId: "...",
  hasProtection: true,
  protectionPrice: 2.99,
  orderTotal: 150.00,
  date: "2026-05-28"
}
```

---

## 📊 Admin Dashboard Data

### Dashboard will show:
```
┌──────────────────────────────┐
│  Shipping Protection Stats   │
├──────────────────────────────┤
│                              │
│  Total Revenue:    $4,250    │
│  Protection Sales:    142    │
│  Adoption Rate:      15.3%   │
│  Avg per Order:      $2.99   │
│                              │
│  Chart: Sales over time      │
│  Chart: Adoption rate        │
│                              │
│  Settings:                   │
│  - Product Price: $2.99      │
│  - Pricing Type: Fixed       │
│  - Description Text          │
│                              │
└──────────────────────────────┘
```

---

## 🔌 API Endpoints You'll Create

### Backend Routes (in `app/api/`):

```
POST   /api/protection/create-product
       → Create protection product in Shopify

GET    /api/protection/product-info
       → Get protection product details

GET    /api/dashboard/stats
       → Get statistics for admin dashboard

POST   /api/webhooks/orders/create
       → Handle new orders

POST   /api/cart/add-protection
       → Add protection to cart (optional, can use Storefront API)

GET    /api/settings
       → Get app settings per store
```

---

## 🔑 Scopes Your App Needs

Add to `shopify.app.toml`:
```toml
scopes = [
  "write_products",           # Create protection product
  "read_products",            # Read product info
  "read_orders",              # Access orders via webhook
  "read_customers",           # Customer data
  "write_metafields",         # Store custom data
  "read_metafields",          # Read custom data
]
```

---

## 📅 Implementation Timeline

| Phase | Task | Days |
|-------|------|------|
| 1 | Setup & Environment | 1 |
| 2 | Learn React Basics | 3 |
| 3 | Create Protection Product | 1 |
| 4 | Build Cart Drawer UI | 3 |
| 5 | Connect Storefront API | 2 |
| 6 | Admin Dashboard | 4 |
| 7 | Webhooks & Database | 2 |
| 8 | Testing & Refinement | 2 |
| 9 | App Store Submission | 1 |
| **Total** | | **19 days** |

---

## 🎓 Learning Path

### Week 1: Setup & Basics
- [ ] Install Shopify CLI
- [ ] Create app project
- [ ] Deploy to dev store
- [ ] Learn React basics
- [ ] Understand GraphQL

### Week 2: Core Functionality
- [ ] Create protection product
- [ ] Build cart drawer checkbox
- [ ] Connect Storefront API
- [ ] Add to cart functionality

### Week 3: Dashboard & Advanced
- [ ] Build admin dashboard
- [ ] Display statistics
- [ ] Setup webhooks
- [ ] Database integration

### Week 4: Refinement
- [ ] Testing
- [ ] Bug fixes
- [ ] Security review
- [ ] App store submission

---

## ✅ Success Checklist

- [ ] App installs on dev store
- [ ] Protection product created automatically
- [ ] Cart drawer shows checkbox
- [ ] Protection can be added/removed
- [ ] Data stored in database
- [ ] Admin dashboard displays data
- [ ] Webhooks working
- [ ] No console errors
- [ ] Responsive design
- [ ] App approved & published

---

Now follow the SETUP_GUIDE.md to begin! 🚀
