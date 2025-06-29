# Turtelli - Turtle Trading Signals

This project is a web application that displays Turtle Trading signals for a set of stock market indices and individual stocks. It also includes simulated portfolios to track the performance of these signals.

## Setup

### Prerequisites

- Node.js (v16 or later)
- Firebase CLI

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd turtle-trader
   ```

2. **Install client dependencies:**

   ```bash
   cd client
   npm install
   ```

3. **Install functions dependencies:**

   ```bash
   cd ../functions
   npm install
   ```

4. **Set up Firebase:**

   - Create a new project on the [Firebase Console](https://console.firebase.google.com/).
   - Add a web app to your project and copy the Firebase configuration object.
   - Replace the placeholder configuration in `client/src/firebase.ts` with your actual configuration.
   - Enable Firestore and create a database.
   - Set up Firebase Authentication (even though it's not used for user login, it's good practice to have it configured).

5. **Set up Alpha Vantage API Key:**

   - Get a free API key from [Alpha Vantage](https://www.alphavantage.co/).
   - Set the API key as a Firebase environment variable:

     ```bash
     firebase functions:config:set alphavantage.key="YOUR_API_KEY"
     ```

## Deployment

1. **Build the client:**

   ```bash
   cd client
   npm run build
   ```

2. **Deploy to Firebase:**

   ```bash
   firebase deploy
   ```

## Testing

- **Client:** Run `npm test` in the `client` directory.
- **Functions:** Use the Firebase Emulator Suite to test functions locally. Run `firebase emulators:start` in the root directory.