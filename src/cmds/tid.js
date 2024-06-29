module.exports = {
eurix: {
 name: "tid",
 version: "9",
  credits: "Eugene Aguilar",
 description: "Get the thread ID from group chat",
 cooldown: 0,
 usages: "[command]",
 permission: 0,
},
execute: async function ({ event, reply}) {
try {
reply(`ThreadID: ${event.threadID}`);
} catch (error) {
reply(error.message);
}
}
};
