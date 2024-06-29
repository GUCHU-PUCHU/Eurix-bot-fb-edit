const moment = require('moment');

module.exports = {
eurix: {
    name: "upt",
    credits: "Eugene Aguilar",
    version: "1.0.0",
    description: "Shows how long the bot has been running.",
    usages: "uptime",
    permission: 0,
    cooldown: 0,
    category: "system",
},
    execute: async function ({ api, event, args }) {
        try {
            const uptimeMilliseconds = process.uptime() * 1000;
            const uptimeDuration = moment.duration(uptimeMilliseconds);
            const uptime = [
                `${uptimeDuration.days()} days`,
                `${uptimeDuration.hours()} hours`,
                `${uptimeDuration.minutes()} minutes`,
                `${uptimeDuration.seconds()} seconds`
            ].join(", ");

            api.sendMessage(`${global.config.botname} is running on ${uptime}`, event.threadID, event.messageID);
        } catch (error) {
            console.error(error);
            api.sendMessage("There was an error fetching the bot's uptime.", event.threadID, event.messageID);
        }
    }
};