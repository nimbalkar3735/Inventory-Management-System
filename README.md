# Inventory Management System

A full-stack, enterprise-grade **Inventory Management System** built for the SETTribe internship assessment. The application enables authenticated users to manage product inventories, product categories, stock levels, low-stock alerts, and perform real-time product searches and category filtering.

---

## 🌟 Key Features

- **User Authentication**: Secure user registration, BCrypt password hashing, login, and JWT-based session management.
- **Protected Dashboard**: Real-time metrics showing total products, total categories, low-stock count, total inventory monetary value, and recent activities.
- **Product Management (CRUD)**: Add, edit, view, delete, and list products with unique SKU constraints and category linkage.
- **Category Management (CRUD)**: Create, edit, list, and delete categories with foreign key integrity protection.
- **Stock Quantity Updates**: Instant patch updates for stock quantities and real-time inventory adjustments.
- **Search & Filtering**: Server-side search by Product Name or SKU, and category filtering.
- **Low Stock Monitoring**: Automatic highlight and dedicated view for products with stock levels below the low-stock threshold (`< 5`).
- **Responsive UI**: Responsive design styled with CSS design tokens, custom components, loading spinners, empty states, and feedback toasts.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19 + Vite
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios (with Request Interceptor for JWT Bearer token and Response Interceptor for 401 handling)
- **Styling**: Vanilla CSS (Custom design system with CSS custom properties)

### Backend
- **Java Version**: Java 17
- **Framework**: Spring Boot 3 / 4 (Spring Web, Spring Data JPA, Spring Security, Spring Validation)
- **Authentication**: JWT (`jjwt 0.12.6`) + BCrypt Password Encoder
- **Database**: MySQL 8.x
- **Build Tool**: Apache Maven

---

## 📁 Project Structure

```text
Inventory-Management-System/
├── backend/
│   ├── pom.xml
│   ├── mvnw / mvnw.cmd
│   └── src/
│       └── main/
│           ├── java/com/yugant/backend/
│           │   ├── config/          # Security & CORS Configuration
│           │   ├── controller/      # Auth, Category & Product REST Controllers
│           │   ├── dto/             # Request & Response DTOs
│           │   ├── entity/          # JPA Entities (User, Category, Product)
│           │   ├── exception/       # Global Exception Handler & Custom Exceptions
│           │   ├── repository/     # Data JPA Repositories
│           │   ├── security/       # JWT Filter & Token Provider Service
│           │   └── service/        # Business Logic Services
│           └── resources/
│               └── application.properties
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── .env
│   └── src/
│       ├── components/      # Navbar, FormInput, ProtectedRoute, Layout
│       ├── context/         # AuthContext (login, register, logout, JWT state)
│       ├── pages/           # Login, Register, Dashboard, Products, ProductForm, Categories, LowStock, NotFound
│       ├── services/        # Axios API Client instance
│       ├── styles/          # index.css (Design System)
│       ├── App.jsx          # Route Definitions
│       └── main.jsx
│
├── queries.sql              # Required 8 SQL queries
├── README.md                # Project Documentation
└── .gitignore               # Ignored files & environment variables
```

---

## 🗄️ Database Setup

1. Launch MySQL server (e.g. via XAMPP MySQL or local MySQL Server).
2. Create the database:
   ```sql
   CREATE DATABASE IF NOT EXISTS inventory_management_db;
   ```
3. The Spring Boot backend uses JPA for database initialization. If starting fresh, set `spring.jpa.hibernate.ddl-auto=update` once, or execute schema creation scripts.

---

## ⚙️ Environment Variables

The backend supports configurable environment variables in `application.properties`:

| Variable | Description | Default Value |
| :--- | :--- | :--- |
| `DB_URL` | MySQL JDBC Connection URL | `jdbc:mysql://localhost:3306/inventory_management_db` |
| `DB_USERNAME` | MySQL Database Username | `root` |
| `DB_PASSWORD` | MySQL Database Password | `root` |
| `JWT_SECRET` | Secret key for signing JWTs | Base64-encoded secret |
| `JWT_EXPIRATION_MS` | JWT expiration time in milliseconds | `86400000` (24h) |
| `LOW_STOCK_THRESHOLD` | Threshold for low stock warning | `5` |

For frontend (`frontend/.env`):
```properties
VITE_API_URL=http://localhost:8080/api
```

---

## 🚀 How to Run the Application

### 1. Start MySQL
Ensure your local MySQL service is active on port `3306`.

### 2. Start Spring Boot Backend
Navigate to the `backend` folder and start the application:

```bash
cd backend
# Set Java 17 path if not globally set
$env:JAVA_HOME="C:\Users\Yugant\.jdks\ms-17.0.20"

# Run Spring Boot app
.\mvnw.cmd spring-boot:run
```

The backend server will run at: **`http://localhost:8080`**

### 3. Start React Frontend
In a separate terminal, navigate to the `frontend` folder:

```bash
cd frontend
npm install
npm run dev
```

The React frontend application will run at: **`http://localhost:5173`**

---

## 🌐 API Endpoint Reference

### Authentication
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login user & receive JWT token

### Categories (`/api/categories`)
- `GET /api/categories` — List all categories
- `GET /api/categories/{id}` — Get category by ID
- `POST /api/categories` — Create category
- `PUT /api/categories/{id}` — Update category
- `DELETE /api/categories/{id}` — Delete category

### Products (`/api/products`)
- `GET /api/products` — List all products (Supports optional `?name=`, `?sku=`, `?categoryId=`)
- `GET /api/products/{id}` — Get product details
- `POST /api/products` — Create new product
- `PUT /api/products/{id}` — Update product
- `DELETE /api/products/{id}` — Delete product
- `PATCH /api/products/{id}/quantity` — Patch update stock quantity
- `GET /api/products/low-stock` — Fetch products with quantity < threshold

---

## 📊 SQL Assessment Queries (`queries.sql`)

The repository includes `queries.sql` containing all 8 standard SQL queries:
1. Display all products
2. Find product by SKU
3. Find low-stock products
4. Count products by category
5. Calculate total inventory value
6. Join products with categories
7. Update product quantity
8. Delete a product

---

## 🧪 End-to-End Workflow Verification

1. **User Registration**: Register a new user at `/register`.
2. **Login**: Log in at `/login` to acquire JWT token.
3. **Category Setup**: Navigate to `/categories` and create categories (e.g., *Electronics*, *Furniture*).
4. **Product Creation**: Navigate to `/products/new` and add products with SKUs, prices, quantities, and categories.
5. **Search & Filter**: Search products by name/SKU or filter by category on `/products`.
6. **Stock Management**: Update stock quantity inline on `/products` or restock via `/low-stock`.
7. **Low Stock Alerts**: Check `/low-stock` to inspect items falling below 5 units.
8. **Logout & Protection**: Click Logout to invalidate session and attempt accessing protected routes to confirm redirect.
