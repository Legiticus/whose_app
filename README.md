# WhoseApp

A real-time messaging application built with Node.js and WebSockets.

## Features

*   **Instant Messaging**: Real-time communication powered by Socket.io.
*   **Structured API**: Organized backend with dedicated models and routes.
*   **Testing Suite**: Integrated testing environment using Jest.
*   **Simple Frontend**: Clean, lightweight client-side interface.

## Tech Stack

*   **Runtime**: Node.js
*   **Communication**: WebSockets (Socket.io)
*   **Testing**: Jest
*   **Compiler**: Babel
*   **Frontend**: HTML, CSS, JavaScript

## Project Structure

```text
├── __test__/               # Test suites
├── client/                 # Frontend assets and UI logic
├── models/                 # Data schemas and logic
├── routes/                 # API endpoint definitions
├── sockets/				# WebSocket event handling
├── app.js                  # Application configuration
└── index.js                # Server entry point
```

## Installation Steps

### Clone the Repository
```bash
git clone https://github.com/Legiticus/whose_app.git
cd whose_app
```
### Install Dependancies
```bash
npm install
```
### Link Database
Create a local or public instance of a mongodb database and paste the link into the .env file
```bash
MONGO_URL = <connection link here>
```
### Run Client Webserver on Port 3000
```bash
npm run client
```
### Run Backend on Port 8747
```bash
npm run dev
```






