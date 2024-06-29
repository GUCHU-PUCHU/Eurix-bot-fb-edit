

let alreadyReacted = []

module.exports = {
  eurix: {
    name: "echoReaction",
    credits: "Eugene Aguilar",
    description: "Echoes back reactions in the chat.",
  },

  handleEvent: async ({ api, event }) => {
    try {
      if (
        global.config.autoreact === true &&
        event.senderID !== api.getCurrentUserID()
      ) {
        if (!alreadyReacted.includes(event.messageID)) {
          alreadyReacted.push(event.messageID);
          await api.setMessageReaction(
            event.reaction,
            event.messageID,
            (err) => {},
            true,
          );
        }
      }
    } catch (err) {
      console.error(err.message);
    }
  },
};
