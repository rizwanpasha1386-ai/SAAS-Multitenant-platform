require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");

const connectDB = require("./config/Dbconnection");
const socketAuth = require("./middlewares/socket.auth");
const projectChatSocket = require("./sockets/projectchat.socket");

const authRoute = require("./routes/auth.route");
const projectRoute = require("./routes/project.route");
const taskRoute = require("./routes/task.route");
const tenantRoute = require("./routes/tenant.route");

const app = express();
const server = http.createServer(app);

const frontendURL =
    process.env.FRONTEND_URL || "http://localhost:5173";

app.use(
    cors({
        origin: frontendURL,
        credentials: true
    })
);

app.use(cookieParser());
app.use(express.json());

app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is running"
    });
});

app.use("/api/auth", authRoute);
app.use("/api/tenant", tenantRoute);
app.use("/api/project", projectRoute);
app.use("/api/task", taskRoute);

const io = new Server(server, {
    cors: {
        origin: frontendURL,
        credentials: true
    }
});

io.use(socketAuth);

io.on("connection", socket => {
    console.log("Socket connected:", socket.user?.name);

    projectChatSocket(io, socket);

    socket.on("disconnect", () => {
        console.log("Socket disconnected");
    });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        await connectDB();

        server.listen(PORT, "0.0.0.0", () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Server startup failed:", error);
        process.exit(1);
    }
}

startServer();