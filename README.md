# Farmer Market API

## Authentication

- **POST /auth/login:** User login
- **POST /auth/register:** User registration
- **POST /auth/refresh:** Refresh access token
- **POST /auth/email-available:** Check email availability
- **POST /auth/email-token-confirm:** Confirm email token
- **POST /auth/forgot-password:** Reset password
- **POST /auth/validate-reset-token:** Validate reset token
- **POST /auth/password-token-confirm:** Confirm password reset token
- **POST /auth/require-token:** Require confirmation token

## Dashboard

- **GET /dashboard:** Get dashboard info 

## Markets

- **GET /markets/get-all-open:** Get all open markets
- **GET /markets/get-all:** Get all markets 
- **GET /markets/get-by-id:** Get market by ID 
- **POST /markets/create:** Create a market 
- **PUT /markets/update-by-id:** Update market by ID 
- **PUT /markets/toggle-open-status:** Toggle market open status 

## Prices

- **GET /prices/get-prices-by-date:** Get prices by date
- **GET /prices/get-todays-user-prices:** Get today's prices for a vendor
- **GET /prices/get-products-without-todays-prices:** Get products without today's prices for a vendor
- **GET /prices/get-monthly-prices:** Get monthly prices for a vendor
- **POST /prices/add-product-price:** Add a new product price for a vendor
- **PUT /prices/update-product-price:** Update a product price for a vendor
- **DELETE /prices/delete-product-price:** Delete a product price for a vendor
- **POST /prices/keep-prices:** Keep product prices for a vendor

## Products

- **GET /products/get-all-products:** Get all products 
- **POST /products/add-new-product:** Add a new product 
- **PUT /products/update-product:** Update product information 
- **DELETE /products/delete-product:** Delete a product 
- **GET /products/get-users-products:** Get products associated with a vendor
- **GET /products/users-who-sell-product:** Get vendors selling a specific product
- **GET /products/get-products-not-associated-with-user:** Get products not associated with a vendor
- **POST /products/add-user-product:** Associate products with a vendor
- **DELETE /products/delete-user-product:** Disassociate products from a vendor

## Search

- **GET /search:** Perform a search

## Users

- **GET /users/get-all-approved:** Get all approved users 
- **GET /users/get-by-id:** Get user information by ID 
- **GET /users/get-all-unapproved:** Get all unapproved users 
- **POST /users/create:** Create a new user 
- **PUT /users/update:** Update user information 
- **POST /users/update-user-info:** Update user information for admin purposes 
- **POST /users/add-markets-to-user:** Associate markets with a user 
- **DELETE /users/delete:** Delete a user 
- **PUT /users/approve:** Approve a user 
- **PUT /users/reject:** Reject a user 
- **PUT /users/toggle-active-status:** Toggle the active status of a user 
