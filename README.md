# hello-world-mcp

A minimal **ChatGPT + Model Context Protocol (MCP)** hello world app for beginners using the official OpenAI SDK.

## What's Included

- **`app.js`** – Main entry point with setup instructions
- **`chatgpt-client.js`** – Simple ChatGPT client that calls the OpenAI API directly
- **`mcp-server.js`** – MCP server that exposes ChatGPT as a tool
- **`package.json`** – Dependencies: `openai`, `@modelcontextprotocol/sdk`, `dotenv`
- **`.env.example`** – Template for environment variables

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Add Your OpenAI API Key
```bash
cp .env.example .env
# Edit .env and replace sk-your-api-key-here with your actual key
# Get your key from https://platform.openai.com/api-keys
```

### 3. Run the App
```bash
# Display setup info and available commands
npm start

# Run the ChatGPT client demo
npm run client

# Start the MCP server
npm run mcp-server
```

## How It Works

### ChatGPT Client (`chatgpt-client.js`)
- Calls the OpenAI API using the `openai` SDK
- Sends messages to Claude and receives responses
- Good for learning how to use the SDK directly

### MCP Server (`mcp-server.js`)
- Runs as a Model Context Protocol server
- Exposes an `ask_chatgpt` tool that clients can call
- Communicates over stdio (perfect for Claude desktop app integration)

## Next Steps

1. **Get an API key** – Sign up at https://platform.openai.com
2. **Add it to `.env`** – Copy your key into the `OPENAI_API_KEY` variable
3. **Test the client** – Run `npm run client` to chat with ChatGPT
4. **Explore MCP** – Run `npm run mcp-server` to start the protocol server

## Resources

- [OpenAI Node SDK](https://github.com/openai/node-sdk)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [ChatGPT API Docs](https://platform.openai.com/docs)
- [MCP Getting Started](https://modelcontextprotocol.io/docs)

