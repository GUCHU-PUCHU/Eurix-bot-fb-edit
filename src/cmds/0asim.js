const axios = require("axios");
let isEnabled = false;

module.exports = {
    eurix: {
        name: "sim",
        version: "4.3.7",
        permission: 0,
        credits: "Eugene Aguilar",
        description: "Talk with SimSimi",
        usages: "<ask> on/off",
        cooldown: 2,
        category: "AI"
    },

    execute: async function ({ api, event, args }) {
        try {
            if (args[0] === "off") {
                isEnabled = false;
                return api.sendMessage("SimSimi is now turned off.", event.threadID, event.messageID);
            } else if (args[0] === "on") {
                isEnabled = true;
                return api.sendMessage("SimSimi is now turned on.", event.threadID, event.messageID);
            } else {
                const ask = args.join(" ");
                if (!ask) {
                    return api.sendMessage(
                        `Wrong format\nUse: ${global.config.prefix}sim <on/off>\nOr ${global.config.prefix}sim <ask>`,
                        event.threadID,
                        event.messageID
                    );
                }
                const response = await axios.get(
                    `https://eugene-restapi.onrender.com/sim?ask=${encodeURIComponent(ask)}`
                );
                const result = response.data.respond;
                api.sendMessage(result, event.threadID, event.messageID);
            }
        } catch (error) {
            api.sendMessage(`Error: ${error}`, event.threadID);
            console.log(error);
        }
    },

    onChat: async function ({ api, event }) {
        try {
            if (!isEnabled) return;

            const message = event.body;
            const response = await axios.get(
                `https://eugene-restapi.onrender.com/sim?ask=${encodeURIComponent(message)}`
            );
            const result = response.data.respond;
            api.sendMessage(result, event.threadID, event.messageID);
        } catch (error) {
            api.sendMessage(`Error: ${error}`, event.threadID);
            console.log(error);
        }
    },
};
