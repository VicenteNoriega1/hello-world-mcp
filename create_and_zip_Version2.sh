#!/usr/bin/env bash
set -e

OUTDIR="hello-world-mcp"
ZIPNAME="${OUTDIR}.zip"

if [ -d "${OUTDIR}" ]; then
  echo "Directory '${OUTDIR}' already exists. Please remove it or move it first."
  exit 1
fi

mkdir -p "${OUTDIR}/public"

echo "Creating project files in ./${OUTDIR} ..."

cat > "${OUTDIR}/package.json" <<'EOF'
{
  "name": "hello-world-mcp-simple",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
EOF

cat > "${OUTDIR}/server.js" <<'EOF'
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
EOF

cat > "${OUTDIR}/public/index.html" <<'EOF'
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Hello World MCP — Simple</title>
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <style>
    body { font-family: system-ui, -apple-system, Arial; background:#f3f4f6; margin:0; padding:20px; }
    .container { max-width:700px; margin:0 auto; background:white; padding:16px; border-radius:8px; box-shadow:0 6px 18px rgba(0,0,0,0.08); }
    .messages { min-height:120px; border:1px solid #e5e7eb; padding:10px; border-radius:6px; margin-bottom:10px; background:#fff; display:flex; flex-direction:column; }
    .msg { padding:8px; margin-bottom:6px; border-radius:6px; }
    .msg.user { background:#e6f7ff; align-self:flex-end; }
    .msg.bot { background:#f3f4f6; align-self:flex-start; }
    .row { display:flex; gap:8px; }
    input[type="text"] { flex:1; padding:8px; border-radius:6px; border:1px solid #d1d5db; }
    button { padding:8px 12px; border-radius:6px; border:none; background:#2563eb; color:white; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Hello World MCP — Simple</h2>
    <p>A tiny example that replies: "Hello, &lt;your message&gt;!"</p>

    <div id="messages" class="messages" aria-live="polite"></div>

    <div class="row" style="margin-top:10px;">
      <input id="input" type="text" placeholder="Type your name or a message..." />
      <button id="send">Send</button>
    </div>

    <p style="margin-top:10px; color:#6b7280; font-size:13px;">This app uses a local handler at <code>/apps</code> and does not call OpenAI.</p>
  </div>

  <script>
    const messagesEl = document.getElementById("messages");
    const inputEl = document.getElementById("input");
    const sendBtn = document.getElementById("send");

    function addMessage(text, role) {
      const d = document.createElement("div");
      d.className = "msg " + (role === "user" ? "user" : "bot");
      d.textContent = text;
      messagesEl.appendChild(d);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    addMessage("Hello! Type something and press Send.", "bot");

    async function send() {
      const text = inputEl.value.trim();
      if (!text) return;
      addMessage(text, "user");
      inputEl.value = "";
      addMessage("Thinking...", "bot");

      try {
        const res = await fetch("/apps", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "call",
            method: "chat",
            input: [{ role: "user", content: text }]
          })
        });
        const json = await res.json();
        const botNodes = Array.from(messagesEl.querySelectorAll(".msg.bot"));
        if (botNodes.length) {
          const lastBot = botNodes[botNodes.length - 1];
          if (lastBot && lastBot.textContent === "Thinking...") {
            lastBot.remove();
          }
        }

        const output = Array.isArray(json.output) ? json.output : [];
        const first = output[0];
        const botText = first && first.content ? first.content : "No reply.";
        addMessage(botText, "bot");
      } catch (err) {
        console.error(err);
        addMessage("Error contacting app handler.", "bot");
      }
    }

    sendBtn.addEventListener("click", send);
    inputEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") send();
    });
  </script>
</body>
</html>
EOF

cat > "${OUTDIR}/public/ai-app.json" <<'EOF'
{
  "id": "hello-world-mcp-simple",
  "name": "Hello World MCP (Simple)",
  "description": "A minimal Hello World ChatGPT App (MCP) example for beginners.",
  "version": "0.0.1",
  "author": {
    "name": "You"
  },
  "endpoints": {
    "handler": "/apps"
  },
  "permissions": ["chat"],
  "ui": {
    "homepage": "/"
  }
}
EOF

cat > "${OUTDIR}/README.md" <<'EOF'
# Hello World MCP — Simple Apps SDK Example

This is a tiny, beginner-friendly example of a ChatGPT App (MCP) using the Apps SDK pattern.

Run locally:
1. npm install
2. npm start
3. Open http://localhost:3000
EOF

