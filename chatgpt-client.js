require('dotenv').config();
const OpenAI = require('openai');

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function chat(userMessage) {
  console.log(`\nUser: ${userMessage}`);
  
  try {
    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
      ],
    });

    const assistantMessage = message.content[0].text;
    console.log(`Assistant: ${assistantMessage}\n`);
    return assistantMessage;
  } catch (error) {
    console.error('Error calling OpenAI API:', error.message);
    throw error;
  }
}

// Example usage
(async () => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error('❌ Error: OPENAI_API_KEY not set');
      console.log('📝 Setup steps:');
      console.log('1. Copy .env.example to .env');
      console.log('2. Get your API key from https://platform.openai.com/api-keys');
      console.log('3. Add your key to .env');
      process.exit(1);
    }

    console.log('🤖 ChatGPT Hello World Client\n');
    await chat('Hello! What is the Model Context Protocol (MCP)?');
    await chat('How can I use MCP with ChatGPT?');
  } catch (error) {
    process.exit(1);
  }
})();

module.exports = { chat };
