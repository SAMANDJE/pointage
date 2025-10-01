# Aurore: Hotel Breakfast Service Manager

[cloudflarebutton]

Aurore is an elegant, high-performance web application designed to streamline the breakfast service at luxury hotels. It provides staff with a simple, intuitive interface to check-in guests by room number, view a live dashboard of service progress, and access historical reports. The system is built on Cloudflare's edge network for exceptional speed and reliability, ensuring a seamless experience during busy morning hours.

## Key Features

-   **Daily Session Management**: Easily start a new breakfast service session for the day with a single click.
-   **Rapid Guest Check-in**: Quickly enter a room number to mark a guest's breakfast as served.
-   **Duplicate Prevention**: The system prevents checking in the same room number more than once per day.
-   **Live Service Dashboard**: View a real-time list of all served rooms and a running total of guests served for the current day.
-   **Historical Reporting**: Access and review detailed reports from previous days' breakfast services.
-   **Print & Export**: Generate printable PDF or Excel reports for any given day's service, including room numbers and check-in times.
-   **Minimalist & Intuitive UI**: A clean, fast, and responsive interface designed for efficiency during busy service hours.

## Technology Stack

-   **Frontend**: React, React Router, Tailwind CSS, shadcn/ui, Zustand, Framer Motion
-   **Backend**: Cloudflare Workers, Hono
-   **Storage**: Cloudflare Durable Objects
-   **Tooling**: Vite, TypeScript, Bun

## Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later)
-   [Bun](https://bun.sh/)
-   [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone <repository-url>
    cd aurore
    ```

2.  **Install dependencies:**
    ```sh
    bun install
    ```

3.  **Run the development server:**
    The development server starts both the Vite frontend and the Wrangler backend concurrently.
    ```sh
    bun dev
    ```
    The application will be available at `http://localhost:3000`.

## Project Structure

-   `src/`: Contains the React frontend application source code.
    -   `pages/`: Top-level page components.
    -   `components/`: Reusable UI components.
    -   `lib/`: Utility functions, API client, and state management.
-   `worker/`: Contains the Cloudflare Worker backend code, built with Hono.
    -   `user-routes.ts`: API route definitions.
    -   `entities.ts`: Data models and persistence logic using Durable Objects.
-   `shared/`: Contains TypeScript types and mock data shared between the frontend and backend.

## Development

-   **Running the dev server**: `bun dev`
-   **Linting**: `bun lint`
-   **Building for production**: `bun build`

The initial list of hotel rooms is configured in `shared/mock-data.ts`. You can modify this file to set up the rooms for your hotel.

## Deployment

This project is designed for seamless deployment to Cloudflare's global network.

1.  **Login to Wrangler:**
    Ensure you are logged into your Cloudflare account.
    ```sh
    wrangler login
    ```

2.  **Deploy the application:**
    Run the deploy script, which builds the project and deploys it using Wrangler.
    ```sh
    bun deploy
    ```

Alternatively, you can deploy directly from your GitHub repository with a single click.

[cloudflarebutton]