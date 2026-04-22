# Data Management

## 📁 CSV Files Location

**Large CSV files are stored here and excluded from Git**

### 📋 Current Files
- `customers.csv` - Customer information
- `orders.csv` - Order data  
- `order_items.csv` - Order line items
- `order_payments.csv` - Payment information
- `products.csv` - Product catalog

### 📂 Directory Structure
```
db/data/
├── *.csv           # Large production files (Git ignored)
├── sample/         # Small samples for development
├── examples/       # Schema documentation
└── README.md       # This file
```

### 🔄 Getting Data
Download full datasets and place them in this directory. Use sample files in `sample/` for development.

### ⚠️ Important
All CSV files in this directory are excluded from Git to keep repository size manageable.
