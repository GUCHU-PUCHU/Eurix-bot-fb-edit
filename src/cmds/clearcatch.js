const fs = require('fs-extra');
const path = require('path');

module.exports = {
    eurix: {
        name: "clearc",
        description: "Clear the bot's cache",
        usages: "clearcache",
        version: "1.0.0",
        credits: "Eugene Aguilar",
        permission: "botadmin",
        cooldown: 0,
    },

    execute: async function({ api, event, reply }) {
        const { threadID, messageID } = event;

        try {
            const cacheDir = path.join(__dirname, "cache")
            await fs.emptyDir(cacheDir);

            reply("Cache cleared successfully!", threadID, messageID);
        } catch (error) {
            console.error(error);
            reply("Failed to clear the cache.", threadID, messageID);
        }
    }
};