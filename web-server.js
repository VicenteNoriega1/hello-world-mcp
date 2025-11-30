require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const OpenAI = require('openai');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Check API key on startup
if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-your-api-key-here') {
  console.warn('⚠️  Warning: OPENAI_API_KEY not set or is placeholder');
  console.log('📝 Add your real API key to .env file');
}

// API endpoint for chat
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message required' });
    }

    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-your-api-key-here') {
      return res.status(500).json({ error: 'OPENAI_API_KEY not configured. Add it to .env file.' });
    }

    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
    });

    const assistantMessage = response.content[0].text;
    res.json({ message: assistantMessage });
  } catch (error) {
    console.error('Error calling OpenAI API:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`
╔════════════════════════════════════════════════════╗
║      🤖 ChatGPT Web Server 🤖                      ║
╚════════════════════════════════════════════════════╝

🌐 Server running at: http://localhost:${port}

📝 Setup:
  1. Add your OpenAI API key to .env
  2. Run: npm install
  3. Visit http://localhost:${port} in your browser
`);
});
