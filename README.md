# Store API Integration

A comprehensive REST API for managing store items and stores, built with Node.js, TypeScript, and Express. This project implements a complete API following OpenAPI V3 specification with full CRUD operations for stores and items.

## 🚀 Features

- **Complete CRUD Operations**: Create, read, and delete operations for stores and items
- **Request Validation**: Robust validation using Zod schemas
- **Duplicate Request Detection**: Prevents duplicate submissions using request ID tracking
- **Standardized Error Handling**: Consistent error codes and response formats
- **OpenAPI V3 Specification**: Complete API documentation
- **TypeScript Support**: Full type safety and IntelliSense
- **Database Integration**: Supabase backend with PostgreSQL
- **Request Logging**: Comprehensive request tracking and logging

## 📚 API Endpoints

### Store Management

#### GET `/v1/stores/all`

Retrieves a list of all available stores.

**Response:**

```json
[
  {
    "id": "store1",
    "name": "Fashion Store",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

#### GET `/v1/stores/{storeID}`

Retrieves information about a specific store.

**Parameters:**

- `storeID` (string, required): Unique identifier for the store

**Response:**

```json
{
  "id": "store1",
  "name": "Fashion Store",
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Item Management

#### POST `/v1/{storeID}/postitem`

Adds an item to a specific store.

**Parameters:**

- `storeID` (string, required): Unique identifier for the store

**Request Body:**

```json
{
  "requestId": "dfdfa124ae",
  "item": "Denim jeans",
  "size": "32",
  "description": "A pair of denim jeans size 32 for men",
  "tags": ["trendy", "male", "blue", "32", "denim"],
  "onOffer": true,
  "Price": "1000",
  "discount": 0
}
```

**Required Fields:**

- `requestId`: Uniquely identifies each API request
- `item`: Item being added to the store
- `size`: Size description of the item
- `onOffer`: Boolean indicating if item is on offer
- `Price`: Price of the item (string)
- `discount`: Discount amount (number)

**Optional Fields:**

- `description`: Elaboration on item added
- `tags`: Array of search terms associated with item

**Success Response (201):**

```json
{
  "requestId": "dfdfa124ae",
  "itemCode": "1234sdsfrer",
  "Description": "item created successfully"
}
```

#### GET `/v1/stores/{storeID}/items`

Retrieves all items in a specific store.

**Parameters:**

- `storeID` (string, required): Unique identifier for the store

**Response:**

```json
[
  {
    "id": "item1",
    "item": "Denim jeans",
    "size": "32",
    "description": "A pair of denim jeans size 32 for men",
    "tags": ["trendy", "male", "blue"],
    "onOffer": true,
    "Price": "1000",
    "discount": 0,
    "store_id": "store1",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

#### DELETE `/v1/stores/{storeID}/items/{itemCode}`

Removes a specific item from a store.

**Parameters:**

- `storeID` (string, required): Unique identifier for the store
- `itemCode` (string, required): Unique identifier for the item

**Response:** 204 No Content (successful deletion)

## 🔧 Error Handling

The API uses standardized error codes and response formats:

### Error Response Format

```json
{
  "requestId": "request-id",
  "errorCode": "XXYY",
  "Description": "Error description"
}
```

### HTTP Status Codes

| Status | Code | Description               |
| ------ | ---- | ------------------------- |
| 200    | -    | Success (GET requests)    |
| 201    | -    | Item created successfully |
| 204    | -    | Item deleted successfully |
| 400    | 04XY | Malformed request         |
| 404    | 44XY | Resource not found        |
| 405    | 45XY | Method not allowed        |
| 500    | 50XY | Internal server error     |
| 503    | 53QW | Duplicate request ID      |

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account and project

### 1. Clone the Repository

```bash
git clone https://github.com/rodweleo/api-integration-engineer-test.git
cd api-integration-engineer-test
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
PORT=3000
```

### 4. Database Setup

Ensure your Supabase project has the following tables:

#### `test_store_stores`

```sql
CREATE TABLE test_store_stores (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `test_store_items`

```sql
CREATE TABLE test_store_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item TEXT NOT NULL,
  size TEXT NOT NULL,
  description TEXT,
  tags TEXT[],
  onOffer BOOLEAN NOT NULL,
  Price TEXT NOT NULL,
  discount NUMERIC NOT NULL,
  store_id TEXT REFERENCES test_store_stores(id),
  request_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `test_store_processed_requests`

```sql
CREATE TABLE test_store_processed_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id TEXT UNIQUE NOT NULL,
  request_data JSONB,
  response_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🚀 Development

### Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3000`

### Build for Production

```bash
npm run build
npm start
```

## 📚 API Documentation

### OpenAPI Specification

The complete OpenAPI V3 specification is available in `openapi.yaml`. This file contains:

- Detailed endpoint documentation
- Request/response schemas
- Example requests and responses
- Error code definitions

### Interactive Documentation

To enable Swagger UI for interactive API testing:

1. Install additional dependencies:

```bash
npm install swagger-ui-express @types/swagger-ui-express js-yaml @types/js-yaml
```

2. Update `src/app.ts` to include Swagger UI:

```typescript
import swaggerUi from "swagger-ui-express";
import * as fs from "fs";
import * as yaml from "js-yaml";

// Load OpenAPI specification
const openApiSpec = yaml.load(fs.readFileSync("./openapi.yaml", "utf8"));

// Serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiSpec as any));
```

3. Access the interactive documentation at:

```
http://localhost:3000/api-docs
```

## 🧪 Testing

### Manual Testing

You can test the API using:

- **cURL**: Command-line HTTP client
- **Postman**: API development environment
- **Swagger UI**: Interactive documentation (if enabled)

### Example cURL Commands

#### Get all stores

```bash
curl -X GET http://localhost:3000/v1/stores/all
```

#### Get specific store

```bash
curl -X GET http://localhost:3000/v1/stores/store1
```

#### Add item to store

```bash
curl -X POST http://localhost:3000/v1/store1/postitem \
  -H "Content-Type: application/json" \
  -d '{
    "requestId": "test123",
    "item": "Denim jeans",
    "size": "32",
    "description": "A pair of denim jeans",
    "tags": ["trendy", "male"],
    "onOffer": true,
    "Price": "1000",
    "discount": 0
  }'
```

#### Get items from store

```bash
curl -X GET http://localhost:3000/v1/stores/store1/items
```

#### Delete item

```bash
curl -X DELETE http://localhost:3000/v1/stores/store1/items/item123
```

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:

- Create an issue in the repository

## 🔒 Security Features

- **Request ID Validation**: Prevents duplicate request processing
- **Input Validation**: Comprehensive validation using Zod schemas
- **Error Sanitization**: Safe error messages without exposing internal details
- **Database Security**: Supabase Row Level Security (RLS) support

## 🚀 Deployment

### Environment Variables

Ensure all required environment variables are set in your production environment:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `PORT` (optional, defaults to 3000)

### Build and Deploy

```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:

- Create an issue in the repository
