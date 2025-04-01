const io = require("socket.io-client");

const token = "e9c2413c-d2d2-44c6-9849-704137418866"; // Replace with the actual token
const socket = io("http://localhost:5000", { query: { token } });

socket.on("connect", () => {
    console.log("✅ Connected to server!");
});

socket.on("message", (msg) => {
    console.log("📩 Message from server:", msg);
});

socket.on("error", (msg) => {
    console.log("❌ Error:", msg);
});

socket.on("disconnect", () => {
    console.log("❌ Disconnected from server.");
});
