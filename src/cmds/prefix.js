module.exports = {
  eurix: {
    name: "prefix",
    version: "1.0.0",
    credits: "Eugene Aguilar",
    description: "Bot prefix",
    permission: 0,
    cooldown: 0,
    usages: "Simply type 'prefix' to know the bot's prefix",
    category: "system",
  },
  onChat: async function ({ api, event }) {
    const message = event.body;
    try {
      if (
        message.toLowerCase() === "prefix" ||
        message.toLowerCase() === "ano prefix"
      ) {
        return api.sendMessage(
          `This is my prefix: ${global.config.prefix}`,
          event.threadID,
          event.messageID,
        );
      }
    } catch (error) {
      console.error(error);
    }
  },
  execute: async function ({ api, event }) {},
};
