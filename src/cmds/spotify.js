const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  eurix: {
    name: "spotify",
    version: "1.1.1",
    permission: 0,
    credits: "Kim Joseph && remod by Eugene Aguilar",
    description: "Play Music With Spotify",
    cooldown: 5,
    usages: "[search]",
  },

  execute: async function ({ reply, args }) {
    try {
      const query = args.join(" ");
      if (!query) {
        return reply(`${global.config.prefix} ${this.eurix.name} ${this.eurix.usages}`);
      }

      let response = await axios.get(`https://private-api-01af7d237cd1.herokuapp.com/music/spotify?search=${encodeURIComponent(query)}`);

      for (let i = 0; i < response.data.length; i++) {
        const { name, download, image } = response.data[i];
        const mp3Path = path.join(__dirname, "cache", `spotify_${i}.mp3`);
        const imgPath = path.join(__dirname, "cache", `Spotify_${i}.jpg`);

        const mp3 = await axios.get(download, { responseType: "arraybuffer" });
        const img = await axios.get(image, { responseType: "arraybuffer" });

        fs.writeFileSync(mp3Path, Buffer.from(mp3.data));
        fs.writeFileSync(imgPath, Buffer.from(img.data));

        reply({ body: `Music Title: ${name}`, attachment: fs.createReadStream(mp3Path) });
        reply({ body: `Album cover for ${name}`, attachment: fs.createReadStream(imgPath) });
      }
    } catch (error) {
      console.error(error.message);
      reply(error.message);
    }
  }
};