const express = require("express");
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/apps", (req, res) => {
  const body = req.body || {};
  const input = Array.isArray(body.input) ? body.input : [];
  const lastMessage = input.length ? (input[input.length - 1].content || "") : "";
  const name = lastMessage.trim() ? lastMessage.trim() : "there";
  const reply = `Hello, ${name}! 👋 This is a Hello World reply from the MCP.`;

  res.json({
    output: [
      {
        type: "message",
        content: reply
      }
    ]
  });
});

const PORT = process.env.PORT || 3000;
ap.listen(PORT, () => {
  console.log(`Hello World MCP running: http://localhost:${PORT}`);
});
