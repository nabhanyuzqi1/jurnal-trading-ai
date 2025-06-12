Jurnal Trading Cerdas (Advanced)
Jurnal Trading Cerdas is an advanced, web-based trading journal designed to help forex and market traders track, analyze, and optimize their performance. Built with modern web technologies and integrated with Google's Gemini AI, this tool goes beyond simple logging by providing deep insights, psychological analysis, and data-driven feedback.

This application is fully client-side and uses Firebase for backend services, ensuring user data is secure and synchronized across devices.

✨ Features
🔐 Secure Authentication: Easy and secure login using Google Account (Firebase Auth).

🗂️ Multi-Account Management: Create and manage multiple trading accounts (e.g., Real, Demo, Prop Firm) within a single user profile.

✍️ Detailed Trade Journaling: Log trades with essential details like pair, lot size, strategy, position, and profit/loss.

📊 Advanced Analytics Dashboard:

Equity Curve: Visualize your account balance growth over time.

Performance Metrics: Track key stats like total P/L, win rate, and total trades.

Doughnut & Bar Charts: Analyze performance broken down by currency pair and trading strategy.

🤖 Gemini AI Integration:

Overall Performance Analysis: Get AI-generated feedback on your trading patterns, common mistakes, and suggestions for improvement.

Psychological Analysis: Analyze your trading notes on a per-trade basis to identify psychological biases like FOMO or greed.

AI Risk Calculator: Calculate the optimal lot size based on your account balance, risk percentage, and stop loss, with an AI-powered "sanity check".

AI Market Outlook: Get an AI-generated summary of market sentiment based on the latest news headlines.

📈 Live Market Data:

TradingView Widget: Integrated chart widget for real-time market analysis.

Economic Calendar: Stay updated with high-impact news from Forex Factory.

Market News Feed: Aggregated news from top financial sources.

🔄 CSV Import & Export: Easily import your trading history from MetaTrader (MT4/MT5) or export your journal data for offline analysis.

📱 Fully Responsive Design: A clean, mobile-first interface built with Tailwind CSS ensures a seamless experience on any device.

🛠️ Tech Stack
Frontend: HTML5, Vanilla JavaScript (ES6 Modules), Tailwind CSS

Backend-as-a-Service (BaaS): Google Firebase

Authentication: For user login and management.

Firestore: As the NoSQL database for storing all user, account, and trade data.

APIs & Libraries:

Google Gemini API: For all AI-powered analytical features.

Chart.js: For creating interactive charts and graphs.

TradingView: For embeddable market charts.

RSS2JSON: To parse RSS feeds for news and the economic calendar.

🚀 Getting Started
To run this project locally, you will need your own API keys for Firebase and Google Gemini.

Clone the repository:

git clone https://github.com/your-username/jurnal-trading-cerdas.git
cd jurnal-trading-cerdas

Configure Firebase:

Go to the Firebase Console and create a new project.

Enable Google Authentication in the Authentication tab.

Create a Firestore Database and set up the security rules to allow read/write for authenticated users.

In your project settings, find your Firebase configuration object.

Get Google Gemini API Key:

Go to Google AI Studio and create an API key.

Update the Code:

Open the HTML file.

Locate the <script type="module"> section at the bottom.

Replace the placeholder firebaseConfig object with your own Firebase configuration.

Replace the placeholder geminiApiKey string with your own Google Gemini API key.

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const geminiApiKey = "YOUR_GEMINI_API_KEY";

Run the application:

Simply open the index.html file in your web browser. No web server is needed.

📖 How to Use
Login: Open the application and log in with your Google account.

Create an Account: Navigate to the Akun tab and create your first trading account by giving it a name and setting an initial balance.

Select Active Account: Click on the newly created account to set it as active. The app will now log all trades to this account.

Log a Trade: Go to the Jurnal tab to record a new trade. Fill in the form and save.

Analyze Performance: Switch to the Analisa tab to see your equity curve and performance charts update in real-time.

Get AI Insights: Use the AI features in the Analisa, Akun (Risk Calculator), and Jurnal (Mindset Analysis) tabs to gain deeper insights.

Stay Informed: Check the Berita and Pasar tabs for the latest market news and charts.

👤 Author
Nabhan Yuzqi Al Mubarok

📄 License
This project is open-source. Feel free to fork, modify, and use it for your personal needs.

