const websocket = require("websocket");
const axios = require("axios"); // Import axios library
const client = new websocket.client();

console.log('starting websocket connection...')
const APIKEY = "0b3ddb76-d94e-48ba-95a9-433e90b710fe"; // replace 
const SUBSCRIPTIONID = "b91362d6-2a05-4606-be85-e4f557a77307"; // replace
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1185871848920059994/nw5vhTrCS-I0gSrGZ2H6yDuTbsDsy-Gys_aL040Udn9LVZMqU9H08Y6YsvVz7zNI2m0e"; // replace with your Discord webhook URL

client.on("connect", (connection) => {
  connection.on("message", (message) => {
    if (!message || message.type !== "utf8") return;
    const data = JSON.parse(message.utf8Data);
    if (!data || !Array.isArray(data.data)) return;

    data.data.forEach(transaction => {
      if (transaction.mint === '11111111111111111111111111111111') {
        const solAmount = transaction.amount / 1000000000; // Convert lamports to SOL
        console.log("Amount (SOL):", solAmount);
        if (solAmount > 10) {
          console.log("Source:", transaction.source);
          // Send message to Discord webhook
          axios.post(DISCORD_WEBHOOK_URL, {
            content: `Transaction source: ${transaction.source}`
          })
          .then(response => {
            console.log("Message sent to Discord");
          })
          .catch(error => {
            console.error("Error sending message to Discord:", error.message);
          });
        }
      }
    });
  });

  connection.sendUTF(
    JSON.stringify({
      action: "subscribe",
      apiKey: APIKEY,
      subscriptionId: SUBSCRIPTIONID,
    })
  );
});

client.connect("wss://kiki-stream.hellomoon.io");
