const fs = require('fs');
const axios = require('axios');
const path = require('path');

module.exports = {
eurix: {
  name: "setavt",
  version: "1.0.0",
  permission: "botadmin",
  credits: "Eugene Aguilar",
  description: "Set bot's avatar",
  usages: "[reply/url/image]",
  cooldown: 5,
},

execute: async function ({ api, event, args, reply }) {
  try {
    const attachment = event.messageReply && event.messageReply.attachments && event.messageReply.attachments[0];
    const url = attachment ? attachment.url : args[0];

    if (!url) {
      return reply("Please provide a valid image URL or reply to an image.");
    }

    const avatarPath = path.join(__dirname, "cache", "avatar.png");

    const response = await axios.get(url, { responseType: 'arraybuffer' });
    fs.writeFileSync(avatarPath, Buffer.from(response.data, 'binary'));

    await api.changeAvatar(fs.createReadStream(avatarPath));
    fs.unlinkSync(avatarPath); 
    return reply("Bot's avatar has been updated successfully!");
  } catch (error) {
    console.error("Error changing avatar:", error);
    return reply("An error occurred while changing the avatar.");
  }
}
};