module.exports = {
  eurix: {
    name: "contact",
    description: "Share Contact",
    usages: "[id/reply/mention]",
    permission: 0,
    credits: "Eugene Aguilar"
  },
    execute: async function ({ api, event }) {
    const { messageReply, senderID, threadID, mentions } = event;
    if (senderID == api.getCurrentUserID()) return;
    try {
      const userID = Object.keys(mentions).length > 0 ? Object.keys(mentions)[0] : messageReply ? messageReply.senderID : senderID;
      api.shareContact("", userID, threadID);
    } catch (e) {
      api.sendMessage(e.message, threadID, event.messageID);
    }
  }
}