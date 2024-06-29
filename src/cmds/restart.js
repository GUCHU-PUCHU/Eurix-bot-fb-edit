module.exports = {
  eurix: {
    name: "restart",
    version: "1.0.0",
    permission: "botadmin",
    credits: "manhIT",
    description: "Restart Bot",
    usages: "[command]",
    cooldown: 5,
    category: "system",
  },

  execute: async function ({ reply, api }) {
    reply(`${global.config.botname} bot is now restarting..`);
    setTimeout(() => {
      process.exit(1);
    }, 1000); 
  }
};