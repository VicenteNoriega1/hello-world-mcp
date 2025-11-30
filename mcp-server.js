require('dotenv').config();
const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} = require('@modelcontextprotocol/sdk/types.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const OpenAI = require('openai');

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const server = new Server({
  name: 'chatgpt-mcp-server',
  version: '1.0.0',
});

// Define the "ask_chatgpt" tool
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'ask_chatgpt',
        description: 'Ask ChatGPT a question',
        inputSchema: {
          type: 'object',
          properties: {
            question: {
              type: 'string',
              description: 'The question to ask ChatGPT',
            },
          },
          required: ['question'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === 'ask_chatgpt') {
    const { question } = request.params.arguments;
    console.log(`[MCP] Received question: ${question}`);

    try {
      const message = await client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: question,
          },
        ],
      });

      const answer = message.content[0].text;
      return {
        content: [
          {
            type: 'text',
            text: answer,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  return {
    content: [
      {
        type: 'text',
        text: 'Unknown tool',
      },
    ],
    isError: true,
  };
});

// Start the server
(async () => {
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ Error: OPENAI_API_KEY not set');
    console.log('📝 Setup steps:');
    console.log('1. Copy .env.example to .env');
    console.log('2. Get your API key from https://platform.openai.com/api-keys');
    console.log('3. Add your key to .env');
    process.exit(1);
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log('[MCP] ChatGPT server running on stdio');
})();
