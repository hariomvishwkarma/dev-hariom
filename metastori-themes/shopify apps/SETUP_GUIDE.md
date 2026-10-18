# Shopify Shipping Protection App - Complete Setup Guide

## 📋 Prerequisites

You already have (✅):
- HTML, CSS, JavaScript knowledge
- Liquid knowledge
- Basic app development knowledge

You need to learn:
- React (for admin dashboard)
- GraphQL (for Shopify APIs)
- Node.js basics
- Next.js framework

---

## 🚀 PHASE 1: Initial Setup (TODAY)

### Step 1: Install Required Tools

**Windows Setup:**
```bash
# 1. Install Node.js (v18 or higher)
# Download from: https://nodejs.org/
# Verify installation
node --version
npm --version

# 2. Install Shopify CLI (latest version)
npm install -g @shopify/cli

# 3. Verify Shopify CLI
shopify version
```

### Step 2: Create Shopify App Project

```bash
# Navigate to your workspace
cd d:\Work\GitHub\metastori\shopify\ apps

# Create new Shopify app with Next.js template
shopify app create node

# When prompted, choose:
# - App name: "Shipping Protection"
# - Template: "Node.js with Next.js"
```

### Step 3: Project Structure Created
```
shipping-protection/
├── app/
│   ├── api/               # Backend routes
│   ├── admin/            # Admin dashboard pages
│   ├── layout.js         # Next.js layout
│   └── globals.css
├── public/
├── shopify.app.toml      # App configuration
├── package.json
├── .env.example
└── README.md
```

### Step 4: Environment Setup

```bash
# Navigate to project
cd shipping-protection

# Install dependencies
npm install

# Create .env.local file
# Copy from .env.example and add your Shopify store details
```

### Step 5: Get Your Development Store

1. Go to [Shopify Partner Dashboard](https://partners.shopify.com/)
2. Create a Development Store
3. Install your app on the development store
4. Generate access tokens

### Step 6: First Run

```bash
# Start development server
npm run dev

# This will:
# - Start Next.js server on localhost:3000
# - Create ngrok tunnel for Shopify webhooks
# - Install app on your dev store
```

---

## 📚 PHASE 2: Understanding Shopify App Structure

### Key Files to Understand:

**shopify.app.toml** - App configuration
- Scopes (permissions)
- API version
- App URLs

**app/api/** - Backend logic
- Webhooks handling
- API endpoints

**app/admin/** - Admin dashboard
- React components
- Product management

**app/routes/api/** - GraphQL queries

---

## 🔧 PHASE 3: Core Concepts to Learn

### 1. Shopify Admin API (GraphQL)
```graphql
# Example: Create a product
mutation {
  productCreate(input: {
    title: "Shipping Protection"
    productType: "Protection"
  }) {
    product {
      id
      title
    }
  }
}
```

### 2. Shopify Storefront API (Customer-facing)
```graphql
# Example: Cart operations
mutation {
  cartLinesAdd(cartId: "...", lines: [...]) {
    cart {
      id
      lines {
        id
        quantity
      }
    }
  }
}
```

### 3. Webhooks (Real-time events)
- `orders/create` - When order is placed
- `carts/update` - When cart changes
- `products/create` - When product is created

---

## 🎯 Next Steps After Setup

1. **Learn React** - 2-3 days
   - Components, hooks, state management
   - Tutorial: [React Official](https://react.dev/)

2. **Learn GraphQL** - 1-2 days
   - Queries and mutations
   - Working with Shopify API

3. **Build Protection Product** - 1 day
   - Create via Admin API
   - Store product ID in app

4. **Build Cart UI** - 2-3 days
   - Fetch product from Storefront API
   - Add checkbox toggle in cart

5. **Admin Dashboard** - 3-4 days
   - Display stats
   - Chart library (Recharts)

---

## 🤔 Common Questions for Beginners

**Q: Do I need a real Shopify store?**
A: No, use a free Development Store from Partner Dashboard.

**Q: Is Liquid needed for apps?**
A: Not for standard apps. Liquid is for themes only.

**Q: How do I add UI to the store?**
A: Using App Blocks (JavaScript/UI Extension) or Checkout Extensions.

**Q: Where does customer data go?**
A: Your app's database (or Shopify Metafields).

---

## ⚠️ Important Reminders

1. Never commit `.env.local` to git
2. Use development store for testing
3. Ask for proper scopes (permissions)
4. Always validate customer data
5. Follow Shopify's security best practices

---

## 📖 Resources

- [Shopify Developer Docs](https://shopify.dev/)
- [Shopify CLI Docs](https://shopify.dev/docs/apps/tools/cli)
- [GraphQL API Reference](https://shopify.dev/api/admin-graphql)
- [App Structure Guide](https://shopify.dev/docs/apps/getting-started/create)
- [Storefront API Guide](https://shopify.dev/api/storefront)

---

## Ready to Start?

Run this command:
```bash
cd d:\Work\GitHub\metastori\shopify\ apps
shopify app create node
```

Let me know when you finish setup! Then we'll start building the protection product.
