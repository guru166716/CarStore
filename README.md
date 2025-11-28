# 🚗 Prisms Car Explorer

**Prisms Car Explorer** is a production-grade React application designed to simulate a modern automotive marketplace. Built with **React 19**, **TypeScript**, and **Tailwind CSS**, it features a resilient architecture that handles real-world data fetching scenarios including API failures and loading states.

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC)

## 🌟 Key Features

### 🔍 Advanced Discovery
-   **Smart Filtering:** Sidebar filters for Brand, Fuel Type, and Price Range (Dynamic Slider).
-   **Real-time Search:** Instant search functionality for vehicle makes and models.
-   **Intelligent Sorting:** Sort inventory by Price, Year, and Mileage.
-   **Smart Badging:** Automated badges for "Great Deal", "Low Mileage", and "New Arrival".

### ⚖️ Decision Tools
-   **Vehicle Comparison:** Select up to 3 cars to compare specifications (Price, Mileage, Engine) side-by-side in a detailed modal.
-   **Loan Calculator:** Integrated monthly payment estimator with adjustable Down Payment, APR, and Loan Term.
-   **Favorites System:** Persisted wishlist functionality using LocalStorage.

### 🎨 Modern UI/UX
-   **Dark Mode:** Fully supported dark theme with a toggle switch.
-   **Responsive Design:** Mobile-first layout with collapsible sidebars and adaptive grids.
-   **Interactive Elements:** Toast notifications, skeleton loaders, and image galleries.

### 🛡️ Robust Architecture
-   **Resilient API Layer:** Implements a "Mock Data Fallback" system. If the external API fails (CORS, 500 error, Offline), the app seamlessly switches to high-quality mock data without disrupting the user.
-   **Type Safety:** Strict TypeScript interfaces for all data models and components.

---

## 🚀 Getting Started

### Prerequisites
-   Node.js (v16 or higher)
-   npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/prisms-car-explorer.git
    cd prisms-car-explorer
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Open `http://localhost:5173` to view it in the browser.

4.  **Build for Production**
    ```bash
    npm run build
    ```

---

## 📦 Deployment Guide (Netlify)

This project is optimized for static hosting.

### Option 1: Drag & Drop (Fastest)
1.  Run `npm run build`.
2.  Locate the `dist` folder in your project root.
3.  Drag the `dist` folder into [Netlify Drop](https://app.netlify.com/drop).

### Option 2: Git Integration (Recommended)
1.  Push code to GitHub.
2.  Import project in Netlify.
3.  **Build Command:** `npm run build`
4.  **Publish Directory:** `dist`

> **Note on Routing:** This app uses `HashRouter` to prevent 404 errors on page refresh when hosted on static servers like Netlify or GitHub Pages.

---

## 📂 Project Structure

```
src/
├── components/       # Reusable UI components (CarCard, Loader, Toast, etc.)
├── pages/            # Page views (Home, CarDetails)
├── services/         # API handling and Mock Data logic
├── types.ts          # TypeScript interfaces
├── App.tsx           # Main Router and Theme Context
└── main.tsx          # Entry point
```

## 📝 License

This project is open source and available under the [MIT License](LICENSE).