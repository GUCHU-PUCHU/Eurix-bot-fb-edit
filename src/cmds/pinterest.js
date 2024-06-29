module.exports = {
  eurix: {
    name: "pinterest",
    version: "1.0.0",
    permission: 0,
    credits: "Eugene Aguilar",
    description: "Image search",
    usages: "[Text]",
    cooldown: 20,
  },
  execute: async function({ api, event, args, reply }) {
    try {
      const axios = require("axios");
      const fs = require("fs-extra");
      const keySearch = args.join(" ");
      if (!keySearch.includes("-")) return reply('Please enter in the format, example: pinterest Naruto - 10 (it depends on you how many images you want to appear in the result)');
      const keySearchs = keySearch.substr(0, keySearch.indexOf('-')).trim();
      const numberSearch = parseInt(keySearch.split("-").pop().trim()) || 6;
      const res = await axios.get(`https://eugene-restapi.onrender.com/pinterest?search=${encodeURIComponent(keySearchs)}&count=${encodeURIComponent(numberSearch)}`);
      const data = res.data.data;
      var num = 0;
      var imgData = [];
      for (var i = 0; i < numberSearch; i++) {
        let path = __dirname + `/cache/${num += 1}.jpg`;
        let getDown = (await axios.get(`${data[i]}`, { responseType: 'arraybuffer' })).data;
        fs.writeFileSync(path, Buffer.from(getDown, 'binary'));
        imgData.push(fs.createReadStream(path));
      }
      reply({
        attachment: imgData,
        body: numberSearch + ' Search results for keyword: ' + keySearchs
      });
    } catch (error) {
      reply(error.message);
    }
  }
};
