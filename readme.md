# WebSocket Hands-On Project

This is a full-stack WebSocket practice project using:

- **Node.js + WebSocket** on the server (inside `server/`)
- **Angular** frontend (inside `client/`)

The goal is to build a working real-time communication system using WebSockets

## 📁 Folder Structure
```plaintext
project-root/
├── server/   # Node.js WebSocket backend
└── client/   # Angular frontend
```


### `server/`

- Built with **Node.js**
- Uses **WebSocket (ws)**

### `client/`

- Built with **Angular**
- Connects to the WebSocket server
- Sends/receives real-time updates from the backend

## 🚀 Getting Started

1. Clone the repo

    ```bash
    git clone https://github.com/shobhit-28/ws-hand-on_1.git
    cd project-root
    ```

2. Set up the server

    ```bash
    cd server
    npm install
    npm run dev
    ```

3. Set up the client

    ```bash
    cd client
    npm install
    ng serve
    ```
