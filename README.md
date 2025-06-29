# Turtelli

A simplified web application for displaying Turtle Trading signals.

## Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd TurtleTrader
    ```

2.  **Install client dependencies:**
    ```bash
    cd client
    npm install
    ```

3.  **Install functions dependencies:**
    ```bash
    cd ../functions
    npm install
    ```

4.  **Configure Firebase:**
    - Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/).
    - In the project settings, get your Firebase config and paste it into `client/src/firebase.ts`.
    - Generate a private key for the Admin SDK in the project settings and save it as `turtletrader-295e8-firebase-adminsdk.json` in the `functions` directory.

5.  **Configure Alpha Vantage:**
    - Get an API key from [https://www.alphavantage.co/](https://www.alphavantage.co/).
    - Set the API key as an environment variable for the Firebase Functions.

## Deployment

1.  **Build the client:**
    ```bash
    cd client
    npm run build
    ```

2.  **Deploy to Firebase:**
    ```bash
    firebase deploy
    ```

## Testing

-   **Client:**
    ```bash
    cd client
    npm test
    ```
-   **Functions:**
    ```bash
    cd functions
    npm run test
    ```
