const path = require('path');
const fs = require('fs');
const axios = require('axios');

module.exports = {
eurix : {
  name: "tikinfo",
  version: "9.0.7",
  permission: 0,
  credits: "Eugene Aguilar",
  description: "Get information about a Tiktok user",
  usages: "[username]",
  cooldowns: 5,
},
execute: async function ({reply, event, args}) {
  try {
    const username = args.join(" ");
    if (!username) {
      return reply("Please enter a Tiktok username.");
    }

    const response = await axios.get(`https://eurixapi.onrender.com/tikstalk?username=${encodeURIComponent(username)}`);
    const id = response.data.id;
    const nickname = response.data.nickname;
    const user = response.data.username;
    const avatar = response.data.avatarLarger;
    const follower = response.data.followerCount;
    const following = response.data.followingCount;
    const heart = response.data.heartCount;
    const sig = response.data.signature;

    const tite = path.join(__dirname, `/cache/${id}.png`);

    const getAvatar = await axios.get(avatar, { responseType: 'arraybuffer' });

    fs.writeFileSync(tite, Buffer.from(getAvatar.data, 'utf-8'));

    reply({
      body: `Tiktok Information\n\nUsername: ${user}\nNickname: ${nickname}\nFollowers: ${follower}\nFollowing: ${following}\nHearts: ${heart}\nSignature: ${sig}\nID: ${id}`,
      attachment: fs.createReadStream(tite)});
  } catch (error) {
    reply(`An error occurred while fetching the Tiktok information.\n${error.message}`);
    console.log(error);
  }
}
}; 