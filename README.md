# CSE 340 Motors – Week 05

## Overview
This is the continuation of the **Motors project** for CSE 340.  
In **Week 05**, authentication and authorization were added using **JWT**, and the **Team Activity** was completed (update vehicle data).

Live project: [Render Deployment](https://cse340-motors-iwkd.onrender.com/)

---

## Features Implemented in W05

### 🔑 Learning Activities
- **User Registration & Login**  
  - Secure registration with hashed passwords (`bcryptjs`).  
  - User login using JWT, with token stored in an **HTTPOnly cookie**.  

- **Account Management Page**  
  - New `/account/` route that loads after successful login.  
  - Includes links to inventory management and logout.  

- **Route Protection with JWT**  
  - Middleware `checkJWT` ensures that only logged-in users can access management pages:  
    - `/inventory/management`  
    - `/inventory/vehicle/add`  
    - `/inventory/classification/add`  
    - `/inventory/edit/:id`  
    - `/inventory/update`  

- **Error Handling Middleware**  
  - `handleErrors` wrapper added to catch async controller errors and pass them to Express error handling.  

### 👥 Team Activity
- **Update Vehicle Functionality**  
  - Added controller methods `buildEditVehicle` and `updateVehicle`.  
  - New route `/inventory/edit/:invId` shows a form with the vehicle’s current data.  
  - Submitting the form updates the database record and redirects to `/inventory/management`.  
  - New view `views/inventory/editVehicle.ejs`.  

---

## Project Structure

controllers/
accountController.js
invController.js
models/
accountModel.js
routes/
account-routes.js
inventory-routes.js
utilities/
index.js (getNav, checkJWT, handleErrors, helpers)
views/
account/ (login.ejs, register.ejs, management.ejs)
inventory/ (editVehicle.ejs + existing views)


---

## How to Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/nunosilvaferreira/cse340-motors.git
   cd cse340-motors
   
Install dependencies:

npm install
Create a .env file in the root folder:

DATABASE_URL=postgresql://username:password@host:5432/dbname?ssl=true
NODE_ENV=development
ACCESS_TOKEN_SECRET=your_random_generated_secret
Run the server:


npm start
Open in browser:

Register: http://localhost:3000/account/register

Login: http://localhost:3000/account/login

Account Management: http://localhost:3000/account/

Deployment
The project is deployed on Render:
👉 https://cse340-motors-iwkd.onrender.com/