module.exports = {
eurix: {
  name: "time",
  version: "1.0.0",
  permission: 0,
  credits: "Secret",
  description: "( 𝙀𝙭𝙖𝙘𝙩 𝙩𝙞𝙢𝙚 & 𝙙𝙖𝙩𝙚 )",
  usages: "( Exact time )",
  cooldown: 0,
  category: "system",
},
execute: async function ({api, event }) {

  const moment = require("moment-timezone");
  const supremo = moment.tz('Asia/Manila').format('h:mm A');
  const draven = moment.tz('Asia/Manila').format('D/MM/YYYY');
  const eugene = moment.tz('Asia/Manila').format('dddd');
  


  return api.sendMessage(`〘───── •『 𝙏𝙞𝙢𝙚 』• ─────〙\n𝙏𝙝𝙚 𝙥𝙧𝙚𝙨𝙚𝙣𝙩 𝙩𝙞𝙢𝙚 : ${supremo} \n𝘿𝙖𝙮 : ${draven} (${eugene})\n〘───── •『 𝙏𝙞𝙢𝙚 』• ─────`, event.threadID, event.messageID);
}
};