const axios = require('axios');

module.exports = {
  eurix: {
    name: "claude",
    version: "1.0.0",
    description: "Interact with Claude API",
    credits: "Eugene Aguilar && Kim Joseph DG Bien API",
    permission: 0,
    usages: "[ ask ]",
    cooldown: 0,
  },
  execute: async function ({ api, event, args, reply }) {
    try {
      const ask = args.join(" ");
      if (!ask) {
        return reply(`${global.config.prefix}${this.eurix.name} ${this.eurix.usages}`);
      }

      const res = await axios.get(`https://hiroshi-rest-api.replit.app/ai/claude?ask=${encodeURIComponent(ask)}`);
      const response = res.data.response;
      reply(response);
    } catch (error) {
      reply(error.message);
      console.log(error);
    }
  }
};