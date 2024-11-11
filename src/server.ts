import express from "express";

const app = express();
const port = 3000;

app.use(express.static("public"));

// SSE route: sends events to clients
app.get("/events", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream"); // Specify SSE content type
  res.setHeader("Cache-Control", "no-cache"); // Disable caching
  res.setHeader("Connection", "keep-alive"); // Keep the connection alive

  let count = 0;
  const interval = setInterval(() => {
    // A custom event name that the client can listen for `event:`.
    res.write(
      `event: notification\ndata: New notification: Your order #${count} has shipped!\n\n`
    );
    count++;
  }, 5000); // Send a notification event every 5 seconds

  // Clean up when the connection is closed
  req.on("close", () => {
    console.log("Connection is closed.");
    clearInterval(interval);
    res.end();
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
