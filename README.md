# Product Catalog API

A RESTful API built with **Node.js**, **Express.js**, and **MongoDB** that allows users to manage products, their variants, pricing, and inventory. The API also supports discount application, search, and filtering capabilities.

---

## Features

- Full CRUD for Products and Variants  
- Dynamic price calculation (percentage or fixed discount)  
- Real-time inventory tracking  
- Search and filter by name, category, and price range  
- Clean and intuitive RESTful routing  
- Proper input validation and error handling  
- Swagger/OpenAPI documentation

---

## ⚙️ Setup and Installation

### Prerequisites

- Node.js (v18+)
- Express
- MongoDB (local or Atlas)
- Git

### Installation

- Clone the repository
git clone [https://github.com/yourusername/product-catalog-api.git](https://github.com/Skomaiya/product-catalog-API.git)
(cd product-catalog-api)

- Install dependencies
(npm install)

- Create a .env file with the following variables
(MONGODB_URI=<your-mongodb-url>
PORT=5000
JWT_SECRET=<your-secret-key>)


- Start the server
(npm run dev)

---

### Products

# Create Product
``` http
POST /api/products
```

**Request Body**

```json
{
  "name": "Wireless Mouse",
  "description": "Ergonomic wireless mouse with Bluetooth",
  "category": "Electronics",
  "price": 35.99,
  "inventory": 50
}
```

**Success Response**

```json
{
  "message": "Product created successfully",
  "product": { ... }
}
```

**Get All Products (with filtering)**
``` http
GET /api/products?category=Electronics&minPrice=20&maxPrice=50&search=mouse
``` 

**Success Response**

```json
[
  {
    "_id": "...",
    "name": "Wireless Mouse",
    "price": 35.99,
    "category": "Electronics"
  }
]
```
**Get Single Product**
``` http
GET /api/products/:id
```

**Response**

- 200 OK
- 404 Not Found

**Update Product**

``` http
PUT /api/products/:id
```

**Request Body**

``` json
{
  "price": 29.99
}
```

**Response**

- 200 OK
- 404 Not Found

**Delete Product**
``` http
DELETE /api/products/:id
```

**Response**

- 200 OK
- 404 Not Found

# Variants
**Create Variant**
``` http
POST /api/products/:productId/variants
```

**Request Body**

``` json
{
  "name": "Wireless Mouse - Red",
  "price": 32.99,
  "inventory": 20,
  "discount": 10,
  "discountType": "percentage"
}
```

**Success Response**

``` jsom
{
  "message": "Variant created successfully",
  "variant": { ... }
}
```

**Get Variants by Product**
``` http
GET /api/products/:productId/variants
```

**Success Response**

``` json
[
  {
    "_id": "...",
    "name": "Wireless Mouse - Red",
    "price": 32.99,
    "inventory": 20,
    "discount": 10,
    "discountType": "percentage"
  }
]
```

**Update Variant**
``` http
PUT /api/variants/:id
```

**Request Body**
``` json
{
  "price": 30.99,
  "discount": 5,
  "discountType": "fixed"
}
```

- 200 OK
- Returns finalPrice (max 2 decimal places)

**Delete Variant**
``` http
DELETE /api/variants/:id
```

- 200 OK

# Price
``` http
GET http://localhost:5000/api/pricing/product/687a6c7982f69e074cd53a56/
```

**Success Response**
``` json
{
	"status": "success",
	"data": {
		"_id": "687a6c7982f69e074cd53a56",
		"name": "Wireless Mouse",
		"description": "Ergonomic wireless mouse with Bluetooth",
		"category": {
			"_id": "687a6734bd4eaa4f3e037c6f",
			"name": "Electronics",
			"description": "Devices, gadgets, and digital accessories",
			"createdAt": "2025-07-18T15:24:36.118Z",
			"updatedAt": "2025-07-19T01:51:01.693Z",
			"__v": 0
		},
		"price": 45.99,
		"discount": 10,
		"discountType": "percentage",
		"inventory": 65,
		"createdAt": "2025-07-18T15:47:05.678Z",
		"__v": 0,
		"finalPrice": 41.39,
	}
}
```


# Error Handling

- 400 Bad Request – Invalid input
- 404 Not Found – Product or variant doesn't exist
- 500 Internal Server Error – Server-side error

**All error responses follow:**

``` json
{
  "error": "Product not found"
}
```

# Assumptions & Limitations

- Discounts are applied to individual variants, not parent products.
- Final price is rounded to 2 decimal places.
- Inventory is tracked per variant, not across all variants of a product.
- No user authentication (public API).
- No pagination or sorting for now.
- Limited to basic category text filtering.

# API Documentation with Swagger
- Visit: http://localhost:5000/api-docs
(Assumes Swagger UI is enabled)

# Contact & Contribution
**Want to contribute or have questions?**
**Raise an issue or submit a pull request on GitHub.**



# Youtube link:
- Demo video: https://youtu.be/QwGk-wpnRNg
- Full demo video: https://youtu.be/WF6KWko5Ous
