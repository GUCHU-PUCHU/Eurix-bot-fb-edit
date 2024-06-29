const fs = require('fs');
const path = require('path');
const axios = require('axios');

module.exports = {
eurix: {
  name: "remini",
  version: "1.0.0",
  permission: 0,
  credits: "Eugene Aguilar",
  description: "Enhance image using Remini API",
  usages: "[ reply a photo ]",
  cooldown: 7,
},

execute: async function ({ api, event, reply }) {
  const messageReply = event.messageReply;

  if (!messageReply || !messageReply.attachments || messageReply.attachments.length === 0 || messageReply.attachments[0].type !== "photo") {
    return reply("Please reply to a photo to use this command.");
  }

  const photoUrl = messageReply.attachments[0].url;

  try {
    const response = await axios.get(`https://eurixapi.onrender.com/remini?input=${encodeURIComponent(photoUrl)}`, { responseType: "arraybuffer"});
    const img = response.data;


    const photoPath = path.join(__dirname, 'cache', 'enhanced.jpg');

    fs.writeFileSync(photoPath, Buffer.from(img), 'binary');

    reply({ body: "✨ Enhance successfully", attachment: fs.createReadStream(photoPath) });
  } catch (error) {
    console.error("Error calling Remini API:", error);
    reply(`An error occurred while processing the image. Please try again later.\n${error}`);
  }
}
};