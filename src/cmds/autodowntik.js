const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports = {
  eurix: {
    name: "autodowntik",
    credits: "Eugene Aguilar",
    description: "Tiktok downloader",
    permission: 0,
    usages: "..",
    category: "no prefix",
    cooldown: 0,
  },
  onChat: async function ({ api, event }) {
    if (global.config.autodowntik !== true) return;

    const link = event.body.startsWith("https://vt.tiktok.com/") || 
                 event.body.startsWith("https://www.tiktok.com/") || 
                 event.body.startsWith("7");

    if (!link) return;

    try {
      const response = await axios.get(`https://eugene-restapi.onrender.com/tikdl?link=${encodeURIComponent(event.body)}`);
      const data = response.data.data;

      const video = data.url;
      const username = data.username;
      const nickname = data.nickname;
      const title = data.title;
      const images = data.images;

      if (images) {
        const img = [];
        for (let i = 0; i < images.length; i++) {
          const imagePath = path.join(__dirname, "noprefix", `${i}.jpg`);
          const imgResponse = await axios.get(images[i], { responseType: "arraybuffer" });
          fs.writeFileSync(imagePath, Buffer.from(imgResponse.data));
          img.push(fs.createReadStream(imagePath));
        }
        await api.sendMessage({
          body: `Downloaded successfully\n\nUsername: @${username}\nNickname: ${nickname}\nTitle: ${title}`,
          attachment: img
        }, event.threadID, event.messageID);
      }

      const videoPath = path.join(__dirname, "noprefix", "tiktok.mp4");
      const videoResponse = await axios.get(video, { responseType: "arraybuffer" });
      fs.writeFileSync(videoPath, Buffer.from(videoResponse.data));

      await api.sendMessage({
        body: `Downloaded Successfully\n\nUsername: @${username}\nNickname: ${nickname}\nTitle: ${title}`,
        attachment: fs.createReadStream(videoPath)
      }, event.threadID, event.messageID);
    } catch (error) {
      api.setMessageReaction("⚠️", event.messageID, (err) => {}, true);
    }
  },
  execute: async function ({ api, event }) {
    // Define the logic to be executed here if necessary
  }
};
