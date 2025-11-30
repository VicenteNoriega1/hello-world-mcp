#!/usr/bin/env node

require('dotenv').config();

console.log(`
╔════════════════════════════════════════════════════╗
║      🤖 ChatGPT + MCP Hello World App 🤖           ║
╚════════════════════════════════════════════════════╝

📚 Available Scripts:

  npm run client      - Run the ChatGPT client demo
  npm run mcp-server  - Start the MCP server

🚀 Quick Start:

  1. Copy .env.example to .env
     $ cp .env.example .env

  2. Add your OpenAI API key from https://platform.openai.com/api-keys
     Edit .env and replace sk-your-api-key-here

  3. Install dependencies
     $ npm install

  4. Run the ChatGPT client demo
     $ npm run client

  5. Or start the MCP server
     $ npm run mcp-server

📖 Learn More:
  - OpenAI SDK: https://github.com/openai/node-sdk
  - Model Context Protocol: https://modelcontextprotocol.io
  - ChatGPT API Docs: https://platform.openai.com/docs
`);

