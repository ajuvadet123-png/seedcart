# SeedCart — Modern Multi-Category E-Commerce Platform

A premium, full-stack, responsive multi-category e-commerce web platform built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase (PostgreSQL)**, featuring a dedicated **Admin Dashboard** and direct **WhatsApp Ordering System**.

---

## 🌟 Key Features

### 🛍️ Customer Storefront
- **Modern, Responsive Design**: Polished retail UI inspired by modern e-commerce leaders, optimized for mobile, tablet, and desktop.
- **Dynamic Multi-Category Navigation**: Supports Fashion, Electronics, Footwear, Beauty & Cosmetics, Home & Living, Toys, Sports, Watches & Jewellery, Stationery, and more.
- **Dedicated Category Pages**: Dedicated URLs (e.g. `/category/fashion-clothing`, `/category/cosmetics-beauty`) with subcategories, descriptions, and dynamic filters.
- **Instant Search & Filters**: Search by product name, SKU, brand, or description. Sort by price (low to high, high to low), newest, and featured status.
- **Rich Product Detail Pages**: Image gallery with thumbnail previews, dynamic variant selectors (Sizes, Colours, Custom Options), specifications table, and stock availability status.
- **Direct WhatsApp Ordering**:
  - Direct 1-click order button routing to **+91 97447 44960**.
  - Automatically generates and encodes order details: Product Name, Product ID / SKU, Price, Quantity, Selected Size, Selected Colour/Variant, and Direct Product Link.
  - Zero payment gateways, zero customer checkout forms, zero delivery address forms.

### 🛡️ Admin Management Dashboard (`/admin`)
- **Phone-Based Access**: Accessible at `/admin` using configured admin phone number (`9744744960`).
- **Secure Server-Side Sessions**: Validated server-side with secure HttpOnly JWT cookies and protected API routes.
- **Real-Time Overview Metrics**:
  - Total Products, Active Published Products, Drafts, Out-of-Stock items, Total Categories, Featured Items.
  - Recently added and updated products.
- **Product Management**:
  - Full CRUD operations: Create, Read, Update, Delete with confirmation.
  - Multi-image support (URLs and file upload).
  - Dynamic variant and option builder (Sizes, Colours, Custom Specs).
  - Instant badges & toggles: Featured, New Arrival, Best Seller, Published/Draft, In Stock/Out of Stock.
- **Category Management**:
  - Create, rename, edit description, assign images, and set display order.
  - Safety checks to prevent accidental data loss when deleting categories with active products.
- **Store Settings**:
  - Dynamically configure Store Name, Tagline, Description, Support Email/Phone, Hero Banner Title & Image, and WhatsApp Contact Number.
  - Changing the WhatsApp number immediately updates all customer ordering buttons across the website.

---

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router, Server Components & Server Actions)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, PostCSS, Lucide React Icons
- **Database**: Supabase / PostgreSQL (with `pg` connection pool)
- **Authentication**: Server-side JWT in HttpOnly secure cookies

---

## ⚙️ Environment Variables

Create `.env.local` in the project root:

```env
# Supabase Public API Configuration
NEXT_PUBLIC_SUPABASE_URL=https://wfwnycshxwingwqeljfg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_UfqXShZKLP9y0n5c_u1hgw__75T0RIA

# PostgreSQL Direct Connection String (Server-side)
DATABASE_URL=postgresql://postgres:2wrNRW-8xX!Gf_T@db.wfwnycshxwingwqeljfg.supabase.co:5432/postgres

# Admin & WhatsApp Configuration
ADMIN_PHONE=9744744960
WHATSAPP_NUMBER=919744744960
JWT_SECRET=seedcart-secret-jwt-key-for-admin-session-secure-tokens-2025

# Public Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 📦 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Initialize Database & Seed Categories
```bash
npm run db:init
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Admin Access
Navigate to [http://localhost:3000/admin](http://localhost:3000/admin) and enter phone number:
```
9744744960
```
