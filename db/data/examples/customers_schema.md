# Customers Schema
## File: customers.csv

### Description
Contains customer demographic and location information.

### Columns

| Column Name | Data Type | Description | Example |
|-------------|-----------|-------------|---------|
| customer_id | string | Unique customer identifier | "06b8999e2fba1a1fbc88172c00ba8bc7" |
| customer_unique_id | string | Global unique customer ID | "861eff4711a542e4b93843c6dd7febb0" |
| customer_zip_code_prefix | string | ZIP code prefix | "14409" |
| customer_city | string | City name | "franca" |
| customer_state | string | State abbreviation | "SP" |

### Notes
- `customer_id` is the primary key for this table
- `customer_unique_id` may be used to identify customers across multiple orders
- ZIP codes are stored as strings to preserve leading zeros
- State abbreviations follow Brazilian state codes
