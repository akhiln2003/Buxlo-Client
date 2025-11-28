# BUXLO Client

This is the frontend client for the BUXLO application, built with React, Vite, and TypeScript. It provides the user interface for interacting with the BUXLO microservices.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [Building for Production](#building-for-production)
- [Linting](#linting)

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/akhiln2003/Buxlo-Client.git
   ```
2. Navigate to the `client` directory:
   ```bash
   cd client
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```

## Usage

To start the development server, run:

```bash
npm run dev
```

This will start the Vite development server, and you can view the application in your browser at `http://localhost:5173`.

## Environment Variables

This application requires the following environment variables to be set. You can create a `.env` file in the root of the `client` directory and add the following:

| Variable                  | Description                                    | Default Value                                   |
| ------------------------- | ---------------------------------------------- | ----------------------------------------------- |
| `VITE_GOOGLE_CLIENT_ID`   | The client ID for Google OAuth.                | `1007812232966-...`                               |
| `GOOGLE_CLIENT_SECRET`    | The client secret for Google OAuth.            | `GOCSPX-...`                                    |
| `VITE_AUTH_API_URl`       | The base URL of the API gateway.               | `http://localhost:4000/api`                     |
| `VITE_API_CHAT`           | The API endpoint for the chat service.         | `http://localhost:4004/api`                |
| `VITE_API_NOTIFICATION`   | The API endpoint for the notification service. | `http://localhost:4005/api`        |
| `VITE_ADMIN_ID`           | The ID of the admin user.                      | `690710c480a09175d4ff33f5`                      |
| `VITE_VIICE_SERVER`       | The STUN server for WebRTC.                    | `stun:stun.l.google.com:19302`                  |


## Building for Production

To build the application for production, run:

```bash
npm run build
```

This will create a `dist` directory with the optimized and minified production build.

## Linting

To lint the codebase, run:

```bash
npm run lint
```
This will check the code for any linting errors and warnings.