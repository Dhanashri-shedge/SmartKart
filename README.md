# SmartKart - Bulk Order Management System

A comprehensive platform for vendors and suppliers to manage bulk orders, payments, and deliveries efficiently.

## Features

### Vendor Features
- **Bulk Order Groups**: Create groups for bulk orders with multiple vendors
- **Bill Splitting**: Automatically split bills among vendors in a group
- **Nearby Suppliers**: Find farms and suppliers in your vicinity
- **UPI Payments**: Integrated UPI payment system
- **Supplier Rating**: Rate and review suppliers
- **Raw Material Prediction**: AI-powered next-day raw material prediction
- **Delivery Scheduling**: Schedule and track deliveries

### Supplier Features
- **Order Management**: Accept or reject incoming orders
- **Order History**: Complete order history and analytics
- **Real-time Updates**: Live notifications for new orders

## Tech Stack

- **Frontend**: React.js with Material-UI
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Real-time**: Socket.io
- **Payments**: UPI integration
- **Maps**: Google Maps API

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm run install-all
   ```
3. Set up environment variables (see `.env.example`)
4. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env` file in the root directory:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
UPI_MERCHANT_ID=your_upi_merchant_id
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Vendors
- `POST /api/vendors/groups` - Create bulk order group
- `GET /api/vendors/nearby-suppliers` - Find nearby suppliers
- `POST /api/vendors/predict-materials` - Get material prediction
- `POST /api/vendors/schedule-delivery` - Schedule delivery

### Suppliers
- `GET /api/suppliers/orders` - Get incoming orders
- `PUT /api/suppliers/orders/:id/status` - Accept/reject order
- `GET /api/suppliers/history` - Order history

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request 