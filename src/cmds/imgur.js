const axios = require("axios");

module.exports = {
  eurix: {
    name: "imgur",
    version: "9",
    credits: "Eugene Aguilar",
    description: "Upload to imgur",
    usages: "imgur [ reply a photo ]",
    cooldown: 3,
    permission: 0,
  },

  execute: async function ({ api, event, reply }) {
    const attachments = event.messageReply.attachments;

    if (!attachments || !attachments.length) {
      reply(`Missing image`);
      return;
    }

    const imageLinks = attachments.map((attachment) => attachment.url);
    const imgurLinks = [];

    try {
      for (const image of imageLinks) {
        const response = await axios.get(
          `https://eurix-api.replit.app/imgur?link=${encodeURIComponent(image)}`,
        );
        const uploadedImages = response.data.uploaded.image;

        imgurLinks.push(uploadedImages);
      }
      reply(`Uploaded images\nLink:\n${imgurLinks.join("\n")}`);
    } catch (error) {
      console.log(error);
      reply(`${error}`);
    }
  },
};
