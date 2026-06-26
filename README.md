# 💳 Billing Portal

A full-stack SaaS billing portal built with Next.js, featuring role-based access control, real authentication, database, and Stripe payments.

## 🏗️ Built With
- **Next.js 16** — React framework
- **TypeScript** — Type safety
- **Tailwind CSS** — Styling
- **Clerk** — Authentication
- **PostgreSQL + Prisma** — Database (hosted on Neon)
- **Stripe** — Payments and webhooks
- **Vercel** — Deployment

## 👥 Roles & Permissions

| Permission | Admin | Billing Manager | Viewer |
|---|---|---|---|
| View Dashboard | ✅ | ✅ | ✅ |
| View Plans | ✅ | ✅ | ✅ |
| Change Plan | ✅ | ✅ | ❌ |
| View Invoices | ✅ | ✅ | ✅ |
| Download Invoices | ✅ | ✅ | ❌ |
| View Payment Methods | ✅ | ✅ | ✅ |
| Manage Payment Methods | ✅ | ✅ | ❌ |
| View Team | ✅ | ✅ | ❌ |
| Manage Team Roles | ✅ | ❌ | ❌ |

## 📄 Pages
- **/Dashboard** —  Consists of plan, summary, spend, and invoices
- **/plans** — Subscription plans with Stripe checkout
- **/invoices** — Invoice history
- **/payment-methods** — Cards on file
- **/team** — Team roster and role management

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/kishre26/Billing-Portal.git
cd Billing-Portal
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env.local` file:

- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
- CLERK_SECRET_KEY=your_clerk_secret_key
- NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
- NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
- NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
- NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
- DATABASE_URL=your_neon_database_url
- STRIPE_SECRET_KEY=your_stripe_secret_key
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
- STRIPE_STARTER_PRICE_ID=your_stripe_starter_price_id
- STRIPE_GROWTH_PRICE_ID=your_stripe_growth_price_id
- STRIPE_SCALE_PRICE_ID=your_stripe_scale_price_id
- STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
- NEXT_PUBLIC_APP_URL=http://localhost:3000

### 4. Set up the database
```bash
npx prisma migrate dev
npx prisma db seed
```

### 5. Run the dev server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🔑 Test Credentials
Use Stripe test card: `4242 4242 4242 4242` (any future expiry, any CVC)

## 📁 Project Structure
billing-portal/

├── app/

│   ├── api/

│   │   ├── checkout/     # Stripe checkout endpoint

│   │   └── webhook/      # Stripe webhook handler

│   ├── invoices/         # Invoices page

│   ├── payment-methods/  # Payment methods page

│   ├── plans/            # Plans page with Stripe

│   ├── sign-in/          # Clerk sign in

│   ├── sign-up/          # Clerk sign up

│   └── team/             # Team & roles page

├── components/

│   ├── Header.tsx        # Header with role switcher

│   └── Sidebar.tsx       # Role-gated navigation

├── lib/

│   ├── auth.ts           # Session helper

│   ├── data.ts           # Mock data (fallback)

│   ├── db.ts             # Prisma client

│   ├── rbac.ts           # Roles & permissions

│   ├── stripe.ts         # Stripe client

│   └── user.ts           # User sync helper

└── prisma/

└── schema.prisma     # Database schema

## 🔗 Live Demo
[billing-portal-dusky.vercel.app](https://billing-portal-dusky.vercel.app)

## 📝 License
MIT
