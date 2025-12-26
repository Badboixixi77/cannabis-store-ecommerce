# Cannabis Store E-commerce Platform

A full-stack e-commerce platform built with Next.js, Node.js, PostgreSQL, and Stripe for cannabis products.

## 🚀 Features

- **Frontend (Next.js 14)**
  - Modern React with TypeScript
  - Tailwind CSS for styling
  - User authentication & registration
  - Product catalog with search
  - Shopping cart functionality
  - Responsive design

- **Backend (Node.js/Express)**
  - RESTful API
  - JWT authentication
  - PostgreSQL database
  - Stripe payment integration
  - Admin panel capabilities
  - Security middleware

- **Database (PostgreSQL)**
  - User management
  - Product catalog
  - Order processing
  - Cart persistence

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- Stripe account for payments
- npm or yarn

## 🛠️ Installation

### 1. Clone and Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install

# Install backend dependencies
cd ../backend && npm install
```

### 2. Database Setup

```bash
# Create PostgreSQL database
createdb cannabis_store

# Run the schema
psql cannabis_store < database/schema.sql
```

### 3. Environment Configuration

**Backend (.env)**
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=5000
FRONTEND_URL=http://localhost:3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cannabis_store
DB_USER=your_username
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_super_secret_jwt_key_here

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

**Frontend (.env.local)**
```bash
cd frontend
touch .env.local
```

Edit `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

### 4. Stripe Setup

1. Create a Stripe account at https://stripe.com
2. Get your API keys from the Stripe dashboard
3. Set up webhooks for payment processing:
   - Endpoint: `http://localhost:5000/api/payments/webhook`
   - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`

## 🚀 Running the Application

### Development Mode

```bash
# Run both frontend and backend
npm run dev

# Or run separately:
npm run dev:frontend  # Frontend on http://localhost:3000
npm run dev:backend   # Backend on http://localhost:5000
```

### Production Build

```bash
# Build frontend
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
cannabis-store/
├── frontend/                 # Next.js frontend
│   ├── app/                 # App router pages
│   ├── components/          # React components
│   ├── contexts/           # React contexts
│   └── public/             # Static assets
├── backend/                 # Node.js backend
│   ├── routes/             # API routes
│   ├── middleware/         # Express middleware
│   ├── config/             # Configuration files
│   └── server.js           # Main server file
└── database/               # Database schema
    └── schema.sql          # PostgreSQL schema
```

## 🔐 Security Features

- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation

## 💳 Payment Processing

- Stripe integration for secure payments
- Webhook handling for payment events
- Order status updates
- Payment intent creation

## 🛡️ Legal Compliance

**Important**: This platform is designed for educational purposes. Before deploying for cannabis sales:

1. Verify local cannabis laws and regulations
2. Obtain necessary licenses and permits
3. Implement age verification
4. Add compliance features as required
5. Consult with legal experts

## 🚀 Deployment

### Vercel (Frontend)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Backend Deployment

- Railway, Heroku, or DigitalOcean
- Set up PostgreSQL database
- Configure environment variables
- Set up Stripe webhooks with production URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is for educational purposes. Please ensure compliance with local laws before commercial use.

## 🆘 Support

For issues and questions:
1. Check the documentation
2. Review existing issues
3. Create a new issue with detailed information

---

**Disclaimer**: This software is provided for educational purposes only. Users are responsible for ensuring compliance with all applicable laws and regulations regarding cannabis sales in their jurisdiction.