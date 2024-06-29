const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports = {
  eurix: {
    name: "tiktokdl",
    version: "9.0.2",
    credits: "Eugene Aguilar",
    description: "Tiktok downloader",
    permission: 0,
    usages: "tiktokdl [link]",
    cooldown: 10,
  },
  execute: async function ({ api, event, args, reply }) {
    try {
      const link = args.join(" ");
      if (!link) {
        return reply(`${global.config.prefix}${this.eurix.name} [ link ]`);
      }

      const response = await axios.get(`https://eurixapi.onrender.com/tikdl?link=${encodeURIComponent(link)}`);
      const data = response.data.data;

      if (!data) {
        return reply("Error: Invalid response from TikTok API");
      }

      const video = data.url;
      const username = data.username;
      const nickname = data.nickname;
      const title = data.title;
      const images = data.images;

      if (images) {
        const img = [];
        for (let i = 0; i < images.length; i++) {
          const imagePath = path.join(__dirname, "cache", `${i}.jpg`);
          const imgResponse = await axios.get(images[i], { responseType: "arraybuffer" });
          fs.writeFileSync(imagePath, Buffer.from(imgResponse.data));
          img.push(fs.createReadStream(imagePath));
        }
        await reply({
          body: `Downloaded successfully\n\nUsername: @${username}\nNickname: ${nickname}\nTitle: ${title}`,
          attachment: img
        });
      }

      const videoPath = path.join(__dirname, "cache", "tiktok.mp4");
      const videoResponse = await axios.get(video, { responseType: "arraybuffer" });
      fs.writeFileSync(videoPath, Buffer.from(videoResponse.data));

      await reply({
        body: `Downloaded Successfully\n\nUsername: @${username}\nNickname: ${nickname}\nTitle: ${title}`,
        attachment: fs.createReadStream(videoPath)
      });
    } catch (error) {
      reply(`${error.message}`);
      console.error(error);
    }
  }
};