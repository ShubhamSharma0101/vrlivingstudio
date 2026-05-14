# VR Living Studio — System Architecture & Instructions

## 1. Project Overview
A modern, scalable, production-safe e-commerce web application built for solo development and low-cost maintenance.

### Core Tech Stack
* **Frontend/Framework:** Next.js (App Router), React 19
* **Styling & UI:** Tailwind CSS, shadcn/ui
* **Authentication:** Clerk
* **Database & ORM:** Supabase PostgreSQL, Prisma
* **Storage:** Cloudflare R2 (Product Images)
* **Hosting & DNS:** Cloudflare Pages, Cloudflare DNS
* **Payments:** Razorpay
* **State & Validation:** Zustand, Zod, React Hook Form

---

## 2. Core Business & Security Rules (CRITICAL)
When generating code or building features, strictly adhere to these principles:

* **Never Trust the Frontend:** Prices, totals, stock levels, payment status, and user roles must ALWAYS be validated server-side.
* **Order Before Payment:** Orders must be created in a `pending` state *before* the Razorpay payment sequence begins.
* **Inventory Protection:** * The cart does *not* reserve inventory.
    * Final stock validation happens *after* payment verification.
    * Stock deduction MUST happen inside a database transaction.
* **Price Snapshots:** Product prices must be saved as snapshots inside the `OrderItem` table at checkout. Do not rely on dynamic relations for historical pricing.
* **Webhooks are Truth:** Verify Razorpay webhook signatures server-side. Do not rely on frontend payment success callbacks.
* **Data Integrity:** Never hard-delete important business data. Use `InventoryMovement` for audit histories.

---

## 3. Database Architecture (Prisma)
The database serves as the ultimate source of truth. 

**Core Models:**
* `User`: Maps to Clerk ID, stores customer data and roles.
* `Category` & `Product`: Manages catalog, stock, and active status.
* `ProductImage`: Stores Cloudflare R2 URLs, supports sorting/primary flags.
* `CartItem`: Persists cart data for logged-in users.
* `Address`: Manages saved customer addresses.
* `Order` & `OrderItem`: Handles order totals, states, and price/item snapshots.
* `PaymentTransaction`: Tracks Razorpay IDs, amounts, and statuses (Pending/Paid/Failed/Refunded).
* `InventoryMovement`: Audit trail for all stock adjustments.

---

## 4. Key Workflows

### Authentication Flow
1.  Guest browses and adds to `localStorage` cart.
2.  User logs in via Clerk.
3.  `localStorage` cart merges with DB `CartItem` table.
4.  Clear `localStorage`.

### Checkout & Payment Flow
1.  Validate session, cart contents, and live inventory.
2.  Calculate totals server-side.
3.  Create `Order` (Status: pending).
4.  Initialize Razorpay Order and open gateway.
5.  On Payment Success webhook -> Verify Signature.
6.  Begin DB Transaction -> Final stock check -> Deduct stock -> Update Order -> Commit.

### Inventory Conflict Flow
If payment succeeds but stock becomes unavailable during the transaction window:
1.  Set Order status to `on_hold`.
2.  Flag for Admin manual review (refund vs. restock).

---

## 5. Development Roadmap (Build Priority)
Develop features in strict vertical slices to avoid rewrites:
1.  **Phase 1-3:** Schema design, project setup, infrastructure (Supabase, Clerk, Cloudflare).
2.  **Phase 4:** Authentication & Route Protection.
3.  **Phase 5-6:** Storefront, Catalog, and Cart System (Guest & DB).
4.  **Phase 7-8:** Checkout flow and Razorpay Integration.
5.  **Phase 9-10:** Inventory transactions, Order System, and Tracking.
6.  **Phase 11-12:** Admin Dashboard (Product/Order/Stock CRUD) & R2 Image handling.
7.  **Phase 13+:** Security hardening, UX optimization, SEO, and Launch.

---

## 6. Git Workflow Standard
Commit code frequently using logical, bite-sized updates. 

When finishing a task, run these three commands in order:
1.  `git status` *(Review modified files)*
2.  `git add .` *(Stage all changes)*
3.  `git commit -m "feat/fix: Brief description of what was done"`
4.  `git push` *(Upload to GitHub main repository)*