const { Client } = require('discord.js-selfbot-v13');

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get token from environment variable
  const token = process.env.DISCORD_TOKEN;
  
  if (!token) {
    return res.status(500).json({ error: 'Discord token not configured' });
  }

  try {
    const client = new Client({
      intents: ['Guilds', 'GuildMessages', 'DirectMessages'],
      checkUpdate: false
    });

    // Set up a promise to handle the ready event
    const statusPromise = new Promise(async (resolve, reject) => {
      client.on('ready', async () => {
        try {
          await client.user.setActivity({
            name: '💤💤💤',
            type: 'PLAYING'
          });
          
          console.log('Status set successfully!');
          resolve({ success: true, user: client.user.tag });
        } catch (err) {
          reject(err);
        } finally {
          client.destroy();
        }
      });

      client.on('error', reject);
      
      // Set a timeout to prevent hanging
      setTimeout(() => reject(new Error('Login timeout')), 10000);
    });

    // Login and set status
    await client.login(token);
    const result = await statusPromise;
    
    res.status(200).json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
}
