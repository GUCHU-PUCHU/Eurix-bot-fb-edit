module.exports = {
    eurix: {
        name: "threadname",
        credits: "Eugene Aguilar",
        description: "Change the name of the thread",
    },
   handleEvent: async function ({api, event }) {
        const threadID = event.threadID;
        try {
            if (
                event.type === "event" &&
                event.logMessageType === "log:thread-name"
            ) {
                const newName = event.logMessageData.name;
                api.sendMessage(
                    `[ GROUP UPDATE ]\n❯ ${newName ? `Updated Group Name to: ${newName}` : "Cleared the Group Name"}.`,
                    threadID,
                );
            }
        } catch (error) {
            console.error(
                `Error sending message for thread name change: ${error.message}`,
            );
        }
    },
};
