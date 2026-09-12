# 📈 StockAI by Asile

A premium web-based application that predicts future stock prices using Machine Learning (LSTM). Built with **Django** (Backend + ML API), **React** (Frontend), and **TensorFlow/Keras** (for time series forecasting).

> **Note from the Creator:** Built by Asile to predict the unpredictable (because guessing is for amateurs). Disclaimer: This is not financial advice. If you strike it rich, I gladly accept thank-you notes and/or yachts. 🛥️

---

## 🚀 Features

- **AI-Powered Forecasts:** Leverages a custom-trained LSTM Neural Network to forecast 30-day stock price trajectories based on historical patterns.
- **Instant Snapshots:** All predictions are intelligently saved to the database. Clicking a past search from your profile instantly reloads the exact snapshot without waiting for the ML model.
- **Interactive Data Visualization:** Beautiful, fully responsive charts built with Recharts. Toggle historical prices, 100-DMA, 200-DMA, and the AI forecast.
- **Smart Analytics:** Evaluates model confidence using R² Score, RMSE, and MSE.
- **Secure Accounts:** Full JWT authentication via Django REST Framework (Login via Username or Email).
- **Premium Aesthetics:** Dark mode glassmorphism UI with subtle micro-animations and custom CSS tooltips.

---

## 🛠 Tech Stack

### Frontend
- **React (Vite)**
- **Recharts** (Data Visualization)
- **React Hot Toast** (Notifications)
- **Vanilla CSS** (Custom Design System)

### Backend & ML
- **Django & Django REST Framework (DRF)**
- **TensorFlow & Keras** (LSTM Model)
- **yfinance** (Live Market Data)
- **scikit-learn** (Data Preprocessing & Scaling)
- **Pandas & NumPy**

---

## 📦 Local Setup Instructions

### 1. Clone the repo
```bash
git clone https://github.com/asileayuba/stock-prediction-portal.git
cd stock-prediction-portal
```

### 2. Setup the Backend (Django + ML)
```bash
cd backend-drf

# Create a virtual environment and activate it
python -m venv env
source env/bin/activate  # On Windows use: env\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations
python manage.py migrate

# Start the Django development server
python manage.py runserver
```

### 3. Setup the Frontend (React)
Open a new terminal window:
```bash
cd frontend-react

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

### 4. Ready to Go!
Visit `http://localhost:5173` in your browser. The frontend will automatically route API requests to your local Django server running on port `8000`.

---
*Created by Asile.*
