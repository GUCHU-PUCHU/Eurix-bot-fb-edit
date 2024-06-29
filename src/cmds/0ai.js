const axios = require("axios");

module.exports = {
    eurix: {
        name: "ai",
        version: "9.0.2",
        description: "Chat GPT-4",
        credits: "Eugene Aguilar",
        permission: "user",
        usages: "ai [ ask ]",
        cooldown: 2,
        category: "chatbot",
    },
    execute: async function ({ api, event, args, reply }) {
        try {
            const ask = args.join(" ");
            if (!ask) {
                return reply(`Usage: ${global.config.prefix}ai [ ask ]`);
            }
            const response = await axios.get(
                `https://akhiro-rest-api.onrender.com/api/gpt4?q=${encodeURIComponent(ask)}`
            );
            const answer = response.data.content;
            reply(answer);
        } catch (error) {
            console.error(error);
            reply("An error occurred while processing your request.");
        }
    }
};