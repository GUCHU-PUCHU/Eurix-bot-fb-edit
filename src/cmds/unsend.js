module.exports = {
    eurix: {
        name: "unsend",
        description: "Unsend a message by replying to it",
        credits: "Eugene Aguilar",
        usages: "unsend",
        version: "1.0.0",
        permission: "botadmin",
        cooldown: 0,
    },

    execute: async function({ api, event, reply }) {
        const { messageID, type, messageReply } = event;

        if (type !== "message_reply") {
            return reply("Please reply to a message you want to unsend.", messageID);
        }

        const { messageID: replyMessageID } = messageReply;

        try {
            await api.unsendMessage(replyMessageID);
        } catch (error) {
            console.error(error);
            reply("Failed to unsend the message.", messageID);
        }
    }
};