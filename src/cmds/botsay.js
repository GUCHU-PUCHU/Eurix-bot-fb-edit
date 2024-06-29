module.exports = {
eurix: {
 name: "botsay",
 version: "9.0.2",
 credits: "Eugene Aguilar",
 description: "Make the bot say using [ commands ]",
 usages: "[commands]", 
 permission: "botadmins",
cooldown: 7,
},
execute: async function ({api, event, args }) {
try {
const say = args.join(" ");
if(!say) {
return api.sendMessage(`${global.config.prefix}botsay [ prompt ]`, event.threadID, event.messageID);
}

await api.sendMessage(say, event.threadID, event.messageID);
} catch (error) {
api.sendMessage(`${error.message}`, event.threadID, event.messageID);
}
}
};