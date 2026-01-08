# Selav - Subscription Death Clock

![Selav Banner](https://picsum.photos/1200/400)

**Selav** is a privacy-first Progressive Web App (PWA) designed to track recurring expenses, monitor monthly burn rates, and manage free trials. 

It addresses the "Subscription Fatigue" problem by providing a clear, urgency-based interface ("Death Clock") that highlights bills due soon or trials about to expire.

🔗 **Live App:** [selav.srinikb.in](https://selav.srinikb.in)  
👨‍💻 **Created by:** [Srinivasan KB](https://srinivasan.online/)

---

## 🔐 Zero-Knowledge Privacy

Selav differentiates itself with a **Zero-Knowledge Encryption** architecture. 

*   **Client-Side Encryption:** When you set up your vault, you create a 4-digit PIN. This PIN is used to derive a 256-bit encryption key using PBKDF2.
*   **Encrypted Storage:** Subscription names, amounts, and your monthly income are encrypted in your browser *before* being sent to the database.
*   **No PIN Storage:** We do not store your PIN or the derived key on our servers. This means even the developers cannot read your financial data.

## ✨ Key Features

*   **Death Clock Indicators:** Visual cues (Red/Orange/Green) indicating urgency for upcoming bills.
*   **Monthly Burn Rate:** Automatically normalizes weekly, monthly, and yearly subscriptions to show your true monthly outflow.
*   **Trial Management:** Specific tracking for free trials with reminders before they auto-renew.
*   **Multi-Currency Support:** Native support for INR, USD, EUR, and GBP with automatic conversion for statistics.
*   **PWA Ready:** Installable on iOS and Android for a native app experience.
*   **Secure Auth:** Google OAuth integration via PocketBase for secure account management.

## 🛠 Tech Stack

*   **Frontend:** React (Vite), TypeScript
*   **UI Framework:** Tailwind CSS, Material UI (MUI)
*   **Backend:** PocketBase (Self-hosted)
*   **Encryption:** Crypto-JS (AES-256)
*   **Charts:** Recharts
*   **Animation:** Framer Motion

## 🚀 Getting Started

To run this project locally:

1.  **Clone the repository**
    ```bash
    git clone https://github.com/srinivasankb/Selav.git
    cd Selav
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    The app is pre-configured to point to the public PocketBase instance (`https://selavbase.srinikb.in`) for demonstration purposes. You can change this in `services/pocketbase.ts` if you wish to self-host the backend.

4.  **Run Development Server**
    ```bash
    npm run dev
    ```

## 📱 Installing as PWA

**iOS:**
1. Open [selav.srinikb.in](https://selav.srinikb.in) in Safari.
2. Tap the "Share" button.
3. Select "Add to Home Screen".

**Android:**
1. Open in Chrome.
2. Tap the menu (three dots).
3. Select "Install App" or "Add to Home Screen".

## 📄 License

This project is open source and available under the MIT License.

## 📬 Contact

For support or inquiries, please email: [hi@srinikb.in](mailto:hi@srinikb.in)