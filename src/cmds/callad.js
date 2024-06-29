module.exports = {
    eurix: {
        name: "callad",
        version: "1.0.0",
        description: "Call out the bot admin(s)",
        permission: 0,
        credits: "Eugene Aguilar",
        usages: "/callad <text>",
        cooldown: 5,
    },
    execute: async function ({ api, event, args }) {
        if (args.length < 1) {
            api.sendMessage(
                "Please provide some text to call out the admin(s).",
                event.threadID,
            );
            return;
        }

        const message = args.join(" ");
        const adminIDs = global.config.admins;

        if (adminIDs.length === 0) {
            api.sendMessage(
                "No admins configured for this bot.",
                event.threadID,
            );
            return;
        }

        const userInfo = await api.getUserInfo(event.senderID);
        const username = userInfo[event.senderID].name;

        let callOutMessage = `Message from ${username}\n${message}`;

        for (const adminID of adminIDs) {
            api.sendMessage(callOutMessage, adminID);
        }
    },
};