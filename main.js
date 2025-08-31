const { Client } = require('discord.js-selfbot-v13');

// This will run when the serverless function is invoked
module.exports = async (req, res) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get token from environment variable (set in Vercel dashboard)
  const token = process.env.DISCORD_TOKEN;
  
  if (!token) {
    return res.status(500).json({ error: 'Discord token not configured' });
  }

  try {
    const client = new Client({
      intents: ['Guilds', 'GuildMessages', 'DirectMessages'],
      checkUpdate: false
    });

    // Set up event handlers
    client.on('ready', async () => {
      console.log(`Logged in as ${client.user.tag}!`);
      
      try {
        await client.user.setActivity({
          name: '💤💤💤',
          type: 'PLAYING'
        });
        console.log('Streaming status set successfully!');
        
        // Send success response
        res.status(200).json({ 
          success: true, 
          message: `Status set for ${client.user.tag}` 
        });
      } catch (err) {
        console.error('Failed to set streaming status:', err);
        res.status(500).json({ error: 'Failed to set status', details: err.message });
      }
    });

    // Handle errors
    client.on('error', error => {
      console.error('Discord client error:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Client error', details: error.message });
      }
    });

    client.on('warn', warn => {
      console.warn('Discord client warning:', warn);
    });

    // Login to Discord
    await client.login(token);
    
    // Keep the function running for a short time to allow the status to be set
    // Note: Vercel functions have a timeout, so this isn't a permanent solution
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    // Destroy the client after setting status
    client.destroy();
    
  } catch (error) {
    console.error('Error initializing Discord client:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Initialization failed', details: error.message });
    }
  }
};
