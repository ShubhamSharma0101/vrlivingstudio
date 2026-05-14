Ecommerce Web App — Complete System Architecture Documentation
Project Overview
Modern ecommerce web application using:
•	Next.js
•	Cloudflare Pages
•	Cloudflare DNS
•	Supabase PostgreSQL
•	Prisma ORM
•	Clerk Authentication
•	Cloudflare R2 Storage
•	Razorpay Payments
•	Tailwind CSS
•	shadcn/ui
Goal:
•	scalable
•	production-safe
•	low-cost
•	solo developer friendly
•	modern architecture
________________________________________
1. Tech Stack
Layer	Technology	Purpose
Frontend	Next.js App Router	UI + SSR
Styling	Tailwind CSS	Styling
Components	shadcn/ui	UI components
Auth	Clerk	Authentication
Database	Supabase PostgreSQL	Main database
ORM	Prisma	Database access
Storage	Cloudflare R2	Product images
Hosting	Cloudflare Pages	Deployment
DNS	Cloudflare DNS	Domain management
Payments	Razorpay	Payment gateway
Validation	Zod	Input validation
Forms	React Hook Form	Forms
State	Zustand (optional)	UI state
Image Optimization	Next/Image	Images
Email	Resend (future)	Email notifications
Error Tracking	Sentry (future)	Monitoring
________________________________________
2. Core System Modules
Customer Side
•	authentication
•	product browsing
•	product search
•	cart
•	checkout
•	payments
•	order tracking
•	profile management
Admin Side
•	dashboard
•	product management
•	inventory management
•	order management
•	refund handling
•	inventory reconciliation
•	analytics
________________________________________
3. Core Business Rules
Inventory Rules
Cart does NOT reserve inventory
Inventory only changes when:
•	order confirmed
•	refund + restock
•	admin inventory update
Final stock validation happens AFTER payment verification
Stock deduction must happen inside DB transaction
________________________________________
Payment Rules
Never trust frontend payment success
Verify Razorpay signature server-side
Webhooks are source of truth
Order created BEFORE payment
________________________________________
Pricing Rules
Product price snapshot stored in OrderItem
Price remains locked during checkout/payment
________________________________________
Security Rules
Never trust frontend:
•	prices
•	totals
•	stock
•	payment status
•	roles
All critical validation happens server-side
________________________________________
4. Database Tables
Core Tables
User
Stores:
•	clerk user mapping
•	customer data
•	roles
Product
Stores:
•	title
•	slug
•	description
•	stock
•	price
•	status
ProductImage
Stores:
•	image URLs
•	gallery images
•	primary image
Category
Stores:
•	category hierarchy
CartItem
Stores:
•	user cart items
Address
Stores:
•	customer addresses
Order
Stores:
•	order level data
•	totals
•	statuses
•	payment states
OrderItem
Stores:
•	product snapshot
•	purchase price snapshot
•	quantities
PaymentTransaction
Stores:
•	Razorpay transaction info
•	refunds
•	failures
InventoryMovement
Stores:
•	inventory audit history
________________________________________
5. Database Schema Draft
User
model User {
  id          String   @id @default(cuid())

  clerkId     String   @unique
  email       String   @unique
  name        String?

  role        String   @default("customer")

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  cartItems   CartItem[]
  orders      Order[]
  addresses   Address[]
}
________________________________________
Category
model Category {
  id          String    @id @default(cuid())

  name        String
  slug        String    @unique

  createdAt   DateTime  @default(now())

  products    Product[]
}
________________________________________
Product
model Product {
  id              String   @id @default(cuid())

  title           String
  slug            String   @unique
  description     String

  price           Float
  stock           Int

  isActive        Boolean  @default(true)

  categoryId      String
  category        Category @relation(fields: [categoryId], references: [id])

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  images          ProductImage[]
  cartItems       CartItem[]
  orderItems      OrderItem[]
}
________________________________________
ProductImage
model ProductImage {
  id          String   @id @default(cuid())

  productId   String
  product     Product  @relation(fields: [productId], references: [id])

  url         String

  isPrimary   Boolean  @default(false)
  sortOrder   Int      @default(0)

  createdAt   DateTime @default(now())
}
________________________________________
CartItem
model CartItem {
  id          String   @id @default(cuid())

  userId      String
  user        User     @relation(fields: [userId], references: [id])

  productId   String
  product     Product  @relation(fields: [productId], references: [id])

  quantity    Int

  createdAt   DateTime @default(now())
}
________________________________________
Address
model Address {
  id            String   @id @default(cuid())

  userId        String
  user          User     @relation(fields: [userId], references: [id])

  fullName      String
  phone         String

  line1         String
  line2         String?

  city          String
  state         String
  postalCode    String
  country       String

  isDefault     Boolean  @default(false)

  createdAt     DateTime @default(now())
}





________________________________________
Order
model Order {
  id                    String   @id @default(cuid())

  userId                String
  user                  User     @relation(fields: [userId], references: [id])

  status                String
  paymentStatus         String

  subtotal              Float
  shippingAmount        Float
  totalAmount           Float

  inventoryIssue        Boolean  @default(false)

  razorpayOrderId       String?
  razorpayPaymentId     String?

  addressSnapshot       Json

  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  items                 OrderItem[]
  paymentTransactions   PaymentTransaction[]
}
________________________________________
OrderItem
model OrderItem {
  id            String   @id @default(cuid())

  orderId       String
  order         Order    @relation(fields: [orderId], references: [id])

  productId     String
  product        Product @relation(fields: [productId], references: [id])

  title         String
  image         String

  price         Float
  quantity      Int

  createdAt     DateTime @default(now())
}
________________________________________
PaymentTransaction
model PaymentTransaction {
  id                    String   @id @default(cuid())

  orderId               String
  order                 Order    @relation(fields: [orderId], references: [id])

  razorpayPaymentId     String?

  amount                Float

  status                String

  createdAt             DateTime @default(now())
}
________________________________________
InventoryMovement
model InventoryMovement {
  id            String   @id @default(cuid())

  productId     String

  type          String

  quantity      Int

  note          String?

  createdAt     DateTime @default(now())
}
________________________________________
6. Order Status Definitions
Status	Meaning
pending	order created before payment
confirmed	payment verified + stock deducted
on_hold	inventory/manual review needed
shipped	order shipped
delivered	order delivered
cancelled	order cancelled
refunded	refund completed
________________________________________
7. Payment Status Definitions
Status	Meaning
pending	payment not completed
paid	payment verified
failed	payment failed
refunded	payment refunded
________________________________________
8. Public Pages
Route	Purpose
/	homepage
/products	product listing
/products/[slug]	product detail
/categories/[slug]	category products
/cart	cart page
/sign-in	login
/sign-up	register
________________________________________
9. Protected User Pages
Route	Purpose
/checkout	checkout
/orders	user orders
/orders/[id]	order detail
/account	profile
/addresses	saved addresses
________________________________________
10. Admin Pages
Route	Purpose
/admin	dashboard
/admin/products	products
/admin/products/new	create product
/admin/products/[id]	edit product
/admin/categories	categories
/admin/orders	order management
/admin/orders/[id]	order review
/admin/inventory	inventory management
/admin/payments	payments
/admin/customers	customers
________________________________________
11. API Route Structure
Authenticated APIs
Route	Purpose
/api/cart	cart CRUD
/api/checkout	create checkout
/api/orders	user orders
/api/payment/verify	payment verification
/api/webhooks/razorpay	payment webhook
________________________________________
Admin APIs
Route	Purpose
/api/admin/products	product CRUD
/api/admin/orders	order management
/api/admin/inventory	stock management
/api/admin/refunds	refunds
________________________________________
12. Authentication Flow
Guest Flow
Guest User
 ↓
Browse Products
 ↓
Add To Cart
 ↓
Checkout
 ↓
Redirect To Login
________________________________________
Logged In Flow
User Login
 ↓
Clerk Session
 ↓
Merge Guest Cart
 ↓
Proceed Checkout
________________________________________
13. Cart Flow
Guest Cart
Uses:
•	localStorage
________________________________________
Logged In Cart
Uses:
•	CartItem table
________________________________________
Cart Merge
Guest Cart
 ↓
Login
 ↓
Merge quantities
 ↓
Save DB cart
 ↓
Clear localStorage
________________________________________
14. Checkout Flow
Cart
 ↓
Validate Auth
 ↓
Validate Cart
 ↓
Validate Inventory
 ↓
Create Pending Order
 ↓
Create Razorpay Order
 ↓
Open Payment Gateway
________________________________________
15. Payment Flow
User Payment
 ↓
Verify Razorpay Signature
 ↓
BEGIN DB TRANSACTION
 ↓
FINAL inventory validation
 ↓
Deduct stock
 ↓
Update order
 ↓
Commit transaction
________________________________________
16. Inventory Conflict Flow
Payment Success
 ↓
Stock unavailable
 ↓
Order → ON_HOLD
 ↓
Admin review
________________________________________
17. Refund Flow
Admin refund request
 ↓
Razorpay refund API
 ↓
Update payment status
 ↓
Update order status
________________________________________
18. Admin Inventory Workflow
Correct Flow
Add inventory
 ↓
Approve order
 ↓
Automatic stock deduction
________________________________________
19. Product Image Architecture
Image Storage
Cloudflare R2 stores:
•	original images
•	optimized images
Database stores:
•	URLs only
________________________________________
Product Images
Supports:
•	primary image
•	gallery images
•	image sorting
________________________________________
20. Middleware Protection
Protected Routes
•	/checkout
•	/orders
•	/account
•	/admin
________________________________________
Middleware Responsibilities
•	validate auth
•	validate admin role
•	redirects
________________________________________
21. Security Architecture
Server-Side Validation Required
Validate:
•	prices
•	stock
•	totals
•	payment signatures
•	user roles
________________________________________
Never Trust Frontend
Frontend is UI only.
Server is source of truth.
________________________________________
Payment Security
Razorpay secret keys only on server
Verify webhook signatures
Use HTTPS only
________________________________________
22. Important Professional Rules
Rule 1
Create order BEFORE payment.
________________________________________
Rule 2
Stock deducted AFTER verified payment.
________________________________________
Rule 3
Use DB transactions for inventory updates.
________________________________________
Rule 4
Keep payment status and order status separate.
________________________________________
Rule 5
Use OrderItem snapshots.
________________________________________
Rule 6
Never hard delete important business data.
________________________________________
Rule 7
Webhooks are source of truth.
________________________________________
Rule 8
Use InventoryMovement for audit history.
________________________________________
23. Recommended Folder Structure
src/
 ├── app/
 ├── components/
 ├── features/
 ├── lib/
 ├── server/
 ├── hooks/
 ├── types/
 ├── validations/
 ├── actions/
 └── prisma/
________________________________________
24. Environment Variables
Clerk
•	CLERK_SECRET_KEY
•	NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
Supabase
•	DATABASE_URL
Razorpay
•	RAZORPAY_KEY_ID
•	RAZORPAY_KEY_SECRET
R2
•	R2_ACCESS_KEY_ID
•	R2_SECRET_ACCESS_KEY
•	R2_BUCKET_NAME
________________________________________
25. Build Order Roadmap
Phase 1
•	documentation
•	schema
•	architecture
Phase 2
•	project setup
•	auth setup
•	prisma setup
Phase 3
•	products
•	categories
•	product images
Phase 4
•	cart
•	checkout
•	addresses
Phase 5
•	payments
•	order system
•	inventory transactions
Phase 6
•	admin dashboard
•	inventory management
•	refunds
Phase 7
•	optimization
•	SEO
•	analytics
•	emails
________________________________________
26. Future Scalability Features
Future additions:
•	coupons
•	reviews
•	wishlist
•	shipment tracking
•	notifications
•	analytics dashboard
•	search engine
•	recommendation engine
•	multi-vendor
•	multi-warehouse
________________________________________
27. MVP Scope
V1 Includes
•	authentication
•	products
•	categories
•	cart
•	checkout
•	Razorpay
•	order history
•	admin product management
•	inventory management
________________________________________
Excluded From V1
•	coupons
•	reviews
•	wishlist
•	advanced analytics
•	multi-vendor
•	shipment tracking
•	recommendation system
________________________________________
28. Deployment Architecture
Frontend
Cloudflare Pages
Database
Supabase PostgreSQL
Storage
Cloudflare R2
DNS
Cloudflare DNS
Auth
Clerk
Payments
Razorpay
________________________________________
29. Final Architecture Philosophy
Frontend
Responsible for:
•	UI
•	forms
•	user interaction
________________________________________
Backend
Responsible for:
•	business logic
•	security
•	validation
•	payments
•	inventory
________________________________________
Database
Responsible for:
•	source of truth
•	transactions
•	relationships
•	consistency
________________________________________
30. Final Professional Principles
•	Build vertical slices
•	Never trust frontend
•	Prefer simplicity for V1
•	Protect inventory with transactions
•	Keep systems auditable
•	Use snapshots for orders
•	Design for failures first
•	Separate payment and order states
•	Avoid premature optimization












Ecommerce App — Phase-wise Production Roadmap
This roadmap divides the complete production into practical phases so a solo developer can build the system in a stable order without constant rewrites.
________________________________________
Phase 0 — Product Definition and Scope Lock
Goal
Decide exactly what the first version will include and what will be postponed.
Outcomes
•	Final MVP feature list
•	Final tech stack decision
•	Final user roles
•	Final business rules
•	Final order and payment rules
Tasks
•	Define customer journey
•	Define admin journey
•	Define inventory rules
•	Define payment rules
•	Define refund rules
•	Decide what is out of scope for V1
Deliverable
A locked product scope document.
________________________________________
Phase 1 — System Design and Documentation
Goal
Design the full system before writing application logic.
Outcomes
•	Complete architecture document
•	Complete database schema draft
•	Route map
•	API map
•	Security rules
•	Status definitions
Tasks
•	Document frontend pages
•	Document backend responsibilities
•	Document database tables
•	Document route groups
•	Document auth flow
•	Document cart flow
•	Document checkout flow
•	Document payment flow
•	Document admin flow
Deliverable
A full architecture blueprint that guides all development.
________________________________________
Phase 2 — Database Schema and Data Model
Goal
Create the foundation of the application.
Outcomes
•	Stable Prisma schema
•	Relations between tables
•	Status fields
•	Validation constraints
•	Snapshot strategy for orders
Core Tables
•	User
•	Product
•	ProductImage
•	Category
•	CartItem
•	Address
•	Order
•	OrderItem
•	PaymentTransaction
•	InventoryMovement
Tasks
•	Design all tables
•	Add indexes and unique constraints
•	Add enums for status fields
•	Decide required vs optional fields
•	Define cascade behavior
•	Define order snapshot fields
Deliverable
A production-ready database schema.
________________________________________
Phase 3 — Project Setup and Infrastructure
Goal
Create the actual codebase and connect all base services.
Outcomes
•	Working Next.js project
•	Cloudflare deployment setup
•	Supabase database connected
•	Clerk authentication connected
•	Prisma connected
•	Tailwind and shadcn/ui installed
Tasks
•	Initialize Next.js project
•	Set up repository structure
•	Configure environment variables
•	Connect Supabase
•	Run Prisma migrations
•	Configure Cloudflare project
•	Prepare R2 bucket
•	Prepare domain and DNS
Deliverable
A running app shell with connected infrastructure.
________________________________________
Phase 4 — Authentication and Route Protection
Goal
Build secure login and user identity handling.
Outcomes
•	Sign in page
•	Sign up page
•	Session handling
•	Protected routes
•	Role-based access
•	User sync into local DB
Tasks
•	Add Clerk auth
•	Configure middleware
•	Protect checkout and order pages
•	Protect admin routes
•	Sync Clerk users into User table
•	Store and validate user roles
Deliverable
A secure authentication system.
________________________________________
Phase 5 — Public Storefront and Catalog
Goal
Build the customer-facing shopping experience.
Outcomes
•	Homepage
•	Product listing page
•	Product detail page
•	Category pages
•	Search and filtering
•	Product image gallery
Tasks
•	Build product card components
•	Build product grid
•	Build category navigation
•	Build product detail layout
•	Fetch products from DB
•	Display primary and gallery images
•	Add SEO metadata
Deliverable
A working product catalog customers can browse.
________________________________________
Phase 6 — Cart System
Goal
Build guest and logged-in cart handling.
Outcomes
•	Guest cart in localStorage
•	Logged-in cart in database
•	Cart merge after login
•	Quantity changes
•	Remove item flow
Tasks
•	Create cart state logic
•	Build cart page
•	Build cart badge/count
•	Merge guest cart into DB cart on login
•	Revalidate product existence on cart load
•	Revalidate stock on checkout
Deliverable
A reliable cart system that works before and after login.
________________________________________
Phase 7 — Checkout and Address Management
Goal
Build the order placement flow before payment.
Outcomes
•	Checkout page
•	Address form
•	Address save/reuse
•	Final order summary
•	Server-side total calculation
Tasks
•	Build checkout form
•	Validate user session
•	Validate cart contents
•	Validate latest product prices
•	Validate inventory before payment
•	Save address snapshot
•	Create pending order before payment
Deliverable
A checkout system that creates a pending order safely.
________________________________________
Phase 8 — Payment Gateway Integration
Goal
Connect payment processing and verification.
Outcomes
•	Razorpay order creation
•	Razorpay checkout popup
•	Payment verification endpoint
•	Payment transaction records
•	Success and failure handling
Tasks
•	Create Razorpay order from server
•	Pass secure payment data to frontend
•	Verify signature server-side
•	Store payment transaction record
•	Handle failed payments
•	Keep payment status separate from order status
Deliverable
A production-safe payment flow.
________________________________________
Phase 9 — Inventory Management and Conflict Handling
Goal
Prevent overselling and handle checkout conflicts.
Outcomes
•	Final inventory validation after payment
•	Stock deduction in transaction
•	ON_HOLD order handling
•	Admin decision workflow
•	Inventory movement history
Tasks
•	Check inventory at checkout start
•	Recheck inventory after payment verification
•	Deduct stock atomically
•	Put conflicting orders on hold
•	Add restock and adjustment records
•	Support admin approval or refund decision
Deliverable
A safe inventory system that prevents data mismatch.
________________________________________
Phase 10 — Order System and Order Tracking
Goal
Let users and admins track order progress.
Outcomes
•	Order history page
•	Order detail page
•	Order status updates
•	Payment status display
•	Admin order review queue
Tasks
•	Build user order list
•	Build order detail view
•	Build order status lifecycle
•	Store order item snapshots
•	Keep past orders stable even if product changes later
Deliverable
A complete order management system.
________________________________________
Phase 11 — Admin Dashboard
Goal
Give the store owner control over the business.
Outcomes
•	Admin login access
•	Product CRUD
•	Category CRUD
•	Inventory update screen
•	Order review screen
•	Refund screen
•	Dashboard analytics
Tasks
•	Build admin layout
•	Build product form
•	Build image upload flow
•	Build stock update flow
•	Build order approval / hold / refund actions
•	Add role-based access checks
Deliverable
A fully functional admin control panel.
________________________________________
Phase 12 — File Storage and Media Handling
Goal
Manage product images properly and cheaply.
Outcomes
•	Cloudflare R2 storage setup
•	Image upload flow
•	Image URL storage in DB
•	Primary and gallery image support
Tasks
•	Upload images to R2
•	Store URLs in ProductImage table
•	Support multiple images per product
•	Compress images before upload
•	Use proper naming conventions
Deliverable
A scalable product media system.
________________________________________
Phase 13 — Security Hardening
Goal
Make the app safe for production.
Outcomes
•	Route protection
•	Admin protection
•	Server-side validation
•	Payment integrity
•	Inventory safety
•	Input sanitization
Tasks
•	Add middleware checks
•	Add Zod validation
•	Add request validation on every critical route
•	Protect admin APIs
•	Verify payments server-side only
•	Use transactions for stock changes
Deliverable
A hardened production-ready app.
________________________________________
Phase 14 — SEO, Performance, and UX Optimization
Goal
Improve speed, discoverability, and usability.
Outcomes
•	Better page speed
•	Better SEO
•	Better image loading
•	Better mobile UX
•	Better metadata
Tasks
•	Add metadata to pages
•	Add sitemap and robots.txt
•	Use lazy loading for images
•	Add caching where safe
•	Optimize product listing performance
•	Improve mobile layouts
Deliverable
A fast and search-friendly ecommerce experience.
________________________________________
Phase 15 — Testing and Production Readiness
Goal
Reduce bugs before launch.
Outcomes
•	Tested checkout flow
•	Tested payment flow
•	Tested inventory mismatch handling
•	Tested admin actions
•	Tested refunds
Tasks
•	Test guest cart
•	Test login merge
•	Test payment success
•	Test payment failure
•	Test webhook retries
•	Test order state changes
•	Test role-based access
Deliverable
A stable release candidate.
________________________________________
Phase 16 — Deployment and Launch
Goal
Release the app to production.
Outcomes
•	Cloudflare deployment live
•	Domain connected
•	Production environment variables set
•	Monitoring ready
Tasks
•	Deploy frontend
•	Configure production Supabase DB
•	Configure production Razorpay keys
•	Configure production Clerk keys
•	Connect custom domain
•	Verify SSL and DNS
Deliverable
A live production ecommerce app.
________________________________________
Phase 17 — Post-Launch Improvements
Goal
Improve the app based on real usage.
Possible Additions
•	coupons
•	reviews
•	wishlist
•	email notifications
•	order tracking integration
•	search engine
•	analytics dashboard
•	abandoned cart recovery
•	recommendation engine
•	multi-warehouse inventory
Deliverable
A roadmap for growth after launch.
________________________________________
Recommended Build Priority for a Solo Developer
Build in this exact order:
1.	scope and documentation
2.	database schema
3.	project setup
4.	auth
5.	catalog
6.	cart
7.	checkout
8.	payment
9.	inventory rules
10.	orders
11.	admin dashboard
12.	security and optimization
13.	launch
________________________________________
Simple Rule of Thumb
•	Document first
•	Design schema second
•	Code in small vertical slices third
•	Leave advanced features for later
This keeps the project manageable and avoids expensive rewrites.









Whenever you finish a task in your vrlivingstudio project, run these three commands in order:
1.	Check what changed: git status (This shows you which files you modified).
2.	Stage and Save: git add . git commit -m "Brief description of what you did"
3.	Upload to GitHub: git push


