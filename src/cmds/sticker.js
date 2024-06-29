module.exports = {
eurix: {
  name: "sticker",
  version: "1.0.0",
  permission: 0,
  credits: "Eugene Aguilar",
  description: "Get Sticker uid Messenger",
  cooldown: 5,
  usages: "[ message reply ]",
},

execute: async function ({ reply, event, args }) {
  if (event.type == "message_reply") {
   if (event.messageReply.attachments[0].type == "sticker") {
    return reply({
      body: `ID: ${event.messageReply.attachments[0].ID}\nCaption: ${event.messageReply.attachments[0].description}`
    });
   }
   else return reply("Only reply sticker");
  }
  else if (args[0]) {
   return reply({body:`here is the sticker`, sticker: args[0]});
  }
  else return reply("Only reply sticker");
}
};