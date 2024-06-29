const fs = require('fs');
const axios = require('axios');
const path = require('path');

module.exports = {
  eurix: {
    name: "removebg",
    version: "9.0.5",
    permission: 0,
    credits: "Eugene Aguilar",
    description: "Remove background from an image",
    usages: "removebg [reply a photo]",
    cooldown: 5,
    category: "utility",
  },

  execute: async function ({ api, event, reply }) {
    try {
      let photo;
      if (event.messageReply && event.messageReply.attachments.length > 0) {
        photo = event.messageReply.attachments[0].url;
      } else {
        return reply("⚠️ | Please reply to an image to remove the background");
      }

      reply("⏳ | Removing the background image, please wait...");

      const response = await axios.get(`https://eugene-restapi.onrender.com/removebg?input=${encodeURIComponent(photo)}`, { responseType: 'arraybuffer' });
      const image = response.data;

      const imagePath = path.join(__dirname, "cache", "removebg.png");

      fs.writeFileSync(imagePath, Buffer.from(image), 'binary');

      await reply({ body: "✅ | Successfully removed the background", attachment: fs.createReadStream(imagePath) });
    } catch (error) {
      reply(`⚠️ | Error occurred while removing the background\n${error}`);
    }
  }
};
