const websocket = require("websocket");
const axios = require("axios"); // Import axios library
const client = new websocket.client();

console.log('starting websocket connection...')
const APIKEY = ""; // replace 
const SUBSCRIPTIONID = ""; // replace
const DISCORD_WEBHOOK_URL = ""; // replace with your Discord webhook URL

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
