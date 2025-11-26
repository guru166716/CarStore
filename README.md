# Prisms Car Explorer - React Assignment

A production-ready React application for browsing car listings, built with TypeScript, Vite, and Tailwind CSS.

## 🚀 Quick Start

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Run Development Server**
    ```bash
    npm run dev
    ```

## 🛠 Project Structure

-   `src/services/api.ts`: Centralized API logic. **Note:** Verify endpoint paths here.
-   `src/pages/`: Route views (Home, CarDetails).
-   `src/components/`: Reusable UI (CarCard, Loader, etc.).
-   `src/types.ts`: TypeScript interfaces.

## 📦 Deployment Guide (Netlify)

This project is optimized for deployment on Netlify.

### Option 1: Drag & Drop (Easiest)
1.  Run the build command locally:
    ```bash
    npm run build
    ```
2.  This creates a `dist` folder in your project root.
3.  Log in to [Netlify Drop](https://app.netlify.com/drop).
4.  Drag and drop the `dist` folder onto the page.
5.  Your site is live!

### Option 2: Git Integration (Recommended)
1.  Push this code to a GitHub repository.
2.  Log in to Netlify and click "Add new site" > "Import an existing project".
3.  Select GitHub and choose your repository.
4.  Netlify will auto-detect the settings:
    -   **Build Command:** `npm run build`
    -   **Publish Directory:** `dist`
5.  Click **Deploy Site**.

### Note on Client-Side Routing
This app uses `HashRouter` (`/#/cars/1`) to ensure compatibility with static hosting (like Netlify) without requiring complex redirect rules for `index.html`.
