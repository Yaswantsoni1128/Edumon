# Edumon: Smart School Tracker
---

### 🔗 Live Demo
Check out the live application here: [https://edumon.vercel.app](https://edumon.vercel.app)

---

### Steps to Run Locally
1. Clone the repository:
   ```sh
   git clone https://github.com/Yaswantsoni1128/Edumon.git
   cd Edumon
   ```
2. Install dependencies for frontend:
   ```sh
   cd Backend
   npm install
   npm run dev
   
   ```
2. Install dependencies for backend:
   ```sh
   cd Frontend
   npm install
   npm start
   ```
3. Set up environment variables:
   - Create a `.env` file in the backend directory and add the necessary configurations.
   ```sh
   PORT = 8000
   MONGO_URL = YOUR_MONGO_URI
   SECRET_KEY = YOUR_SECRET_KEY
   ```
      - Create a `.env` file in the Frontend directory and add the necessary configurations.
   ```sh
   VITE_BASE_URL = base_url_backend
   ```

4. Start the development servers:
   ```sh
   cd Backend
   npm start  # Runs backend server
   cd ../Frontend
   npm run dev    # Runs frontend server
   ```

---

###  Created by
Yaswant (https://github.com/Yaswantsoni1128)

