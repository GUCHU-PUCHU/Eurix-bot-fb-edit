module.exports = {
  eurix: {
    name: "getlink",
    version: "9.0.1",
    credits: "Eugene Aguilar",
    description: "Get link from Facebook video, images, audio",
    permission: "user",
    cooldown: 0,
    usages: "getlink [reply ]",
  },
  execute: async function ({ reply, event }) {
    try {
      const messageReply = event.messageReply;

      if (!messageReply || !messageReply.attachments || messageReply.attachments.length === 0) {
        return reply(`${global.config.prefix}${this.eurix.name} [reply with video, photo, or audio]`);
      }

      const attachment = messageReply.attachments[0];
      if (attachment && attachment.url) {
        return reply(`Attachment URL: ${attachment.url}`);
      } else {
        return reply("No valid attachment found.");
      }
    } catch (error) {
      console.error(error);
      reply("An error occurred while processing the request.");
    }
  }
};