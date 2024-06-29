const axios = require("axios");
const path = require("path");
const fs = require("fs");

module.exports = {
  eurix: {
    name: "pastebin",
    version: "1.0.0",
    credits: "Eugene Aguilar",
    description: "Upload text to pastebin",
    usages: "[ code ]",
    cooldown: 10,
    permission: "botadmin",
    category: "system",
  },
  execute: async function ({ reply, event, args }) {
    try {
      const code = event.messageReply?.body || args.join(" ");
      if (!code) {
        return reply("Please provide code to upload to pastebin");
      }

      if (args[0] === "upload") {
        const cmdsDir = process.cwd() + "/src/cmds";
        const cmd = path.join(cmdsDir, `${args[1]}.js`); 
        const text = fs.readFileSync(cmd, "utf-8");

        const response = await axios.get(`https://eugene-restapi.onrender.com/pastebin?code=${encodeURIComponent(text)}`);
        const { url } = response.data;

        return await reply(`Pastebin link: ${url}`);
      } else {
        const response = await axios.get(`https://eugene-restapi.onrender.com/pastebin?code=${encodeURIComponent(code)}`);
        const { url } = response.data;

        return await reply(`Pastebin link: ${url}`);
      }
    } catch (error) {
      console.error(error);
      await reply(error.message);
    }
  }
};
