const login = require("./FCA-Eugene/index");
const config = require("./config.json");
const fs = require("fs");
const path = require("path");
const express = require("express");
const axios = require("axios");
const crypto = require("crypto");
const chalk = require("chalk");
const cron = require("node-cron");
const moment = require("moment-timezone");
const { handleCommand } = require("./EugeneHandle/handleCommand");
const figlet = require("figlet");

global.config = config;


const commands = new Map();
const events = new Map();


const commandsPath = path.join(__dirname, "src", "cmds");
const userFilePath = path.join(__dirname, "Eugenedatabase", "user.json");
const threadFilePath = path.join(__dirname, "Eugenedatabase", "thread.json");

global.client = {
    threads: new Map(),
    users: new Map(),
    commands: commands,
    events: events,
};

if (!fs.existsSync(userFilePath)) {
    fs.writeFileSync(userFilePath, JSON.stringify({}, null, 2));
}
if (!fs.existsSync(threadFilePath)) {
    fs.writeFileSync(threadFilePath, JSON.stringify({}, null, 2));
}

global.client.users = new Map(
    Object.entries(JSON.parse(fs.readFileSync(userFilePath))),
);
global.client.threads = new Map(
    Object.entries(JSON.parse(fs.readFileSync(threadFilePath))),
);

const saveData = () => {
    fs.writeFileSync(
        userFilePath,
        JSON.stringify(Object.fromEntries(global.client.users), null, 2),
    );
    fs.writeFileSync(
        threadFilePath,
        JSON.stringify(Object.fromEntries(global.client.threads), null, 2),
    );
};

fs.readdirSync(commandsPath).forEach((file) => {
    if (file.endsWith(".js")) {
        try {
            const command = require(path.join(commandsPath, file));

            const eurix = command.eurix;

            if (
                !eurix.name ||
                !command.execute
            ) {
                console.error(`Invalid command file: ${file}`);
                return;
            }

            commands.set(eurix.name, command);
            global.commands = commands;
        } catch (error) {
            console.error(
                `Error loading command file: ${file} ${error.message}`,
            );
        }
    }
});


const eventsPath = path.join(__dirname, "src", "events");
fs.readdirSync(eventsPath).forEach((file) => {
    if (file.endsWith(".js")) {
        try {
            const event = require(path.join(eventsPath, file));
            const eurix = event.eurix;

            if (
                !eurix.name ||
                !eurix.description ||
                !eurix.credits ||
                !event.handleEvent
            ) {
                console.error(`Invalid event file: ${file}`);
                return;
            }

            events.set(eurix.name, event);
            global.events = events;
        } catch (error) {
            console.error(`Error loading event file: ${file}`, error);
        }
    }
});

const app = express();

app.use(express.json());

app.get("/info", (req, res) => {
    const info = {
        title: "Simple Messenger Bot",
        author: "Eugene Aguilar",
        contact: "https://www.facebook.com/eugene.aguilar.05",
        commands: Array.from(commands.keys()),
        totalCommands: commands.size,
        totalUsers: global.client.users.size,
        totalThreads: global.client.threads.size,
        botOwner: global.config.owner,
        botname: global.config.botname,
        admins: global.config.admins,
        totalevents: global.client.events.size,
    };
    res.json(info);
});

app.get("/uptime", async function (req, res) {
    try {
        return res.sendFile(path.join(__dirname, "files", "uptime.html"));
    } catch (error) {
        console.log(error.message);
        res.json({ error: error.message });
    }
});

app.get("/upt", async function (req, res) {
    try {
        const uptimeMilliseconds = process.uptime() * 1000;
        const uptimeDuration = moment.duration(uptimeMilliseconds);
        const uptime = [
            `${uptimeDuration.days()} days`,
            `${uptimeDuration.hours()} hours`,
            `${uptimeDuration.minutes()} minutes`,
            `${uptimeDuration.seconds()} seconds`,
        ].join(", ");
        return res.json({ uptime: `Bot is running on ${uptime} ` });
    } catch (error) {
        console.log(error.message);
        res.json({ error: error.message });
    }
});

app.get("/", async function (req, res) {
    try {
        return res.sendFile(path.join(__dirname, "files", "index.html"));
    } catch (error) {
        console.log(error.message);
        res.json({ error: error.message });
    }
});



app.listen(global.config.PORT, () => {
    console.log(chalk.hex('#00FF00')(
        `[${global.config.botname}] Server is running on port ${global.config.PORT} - Bot Owner: ${global.config.owner}`
    ));
});



const time = moment.tz("Asia/Manila").format("HH:mm:ss");



figlet("Pogi", (err, data) => {
    if (err) {
        console.error("Error generating figlet:", err);
        return;
    }
    console.log(chalk.blue(data));
    console.log(chalk.blue(`[${time}] [ ${global.config.log} ] » Bot Information`));
    console.log(chalk.blue(`[${time}] [ ${global.config.log} ] » Name: ${global.config.botname}`));
    console.log(chalk.blue(`[${time}] [ ${global.config.log} ] » Owner: ${global.config.owner}`));
    console.log(chalk.blue(`[${time}] [ ${global.config.log} ] » Total Commands: ${global.client.commands.size}`));
    console.log(chalk.blue(`[${time}] [ ${global.config.log} ] » Total Events: ${global.client.events.size}`));
    console.log(chalk.blue(`[${time}] [ ${global.config.log} ] » Total Users: ${global.client.users.size}`));
    console.log(chalk.blue(`[${time}] [ ${global.config.log} ] » Total Threads: ${global.client.threads.size}`));
});


for (const [name, command] of commands) {
        console.log(chalk.hex('#FFA500')(`[${time}] [ ${global.config.log} ] » Loaded command: ${name}`));
}



let appstate;

try {
    const data = fs.readFileSync(path.join(__dirname, "eurixstate.json"), "utf-8");
    appstate = JSON.parse(data);
} catch (error) {
    console.error("Error reading or parsing eurixstate.json:", error);
}

    

 login({appState: appstate }, (err, api) => {
        if (err) {
            console.log(err.message);
            return;
        }

        api.setOptions(global.config.opt);

        api.listenMqtt(async (err, event) => {
            if (err) {
                console.error("Listening error: ", err);
                return;
            }

            
            let tid = event.threadID,
                mid = event.messageID;

            if (event.type === "message" || event.type === "message_reply") {
                handleCommand(api, event);

                if (!global.client.users.has(event.senderID)) {
                    const userInfo = await api.getUserInfo(event.senderID);

                    global.client.users.set(event.senderID, userInfo); // Set user info in the map
                    saveData(); // Assuming this function saves the updated data
                    console.log(
                        chalk.bold.green(
                            `New user added to database: ${event.senderID}`
                        )
                    );
                }

                if (!global.client.threads.has(event.threadID)) {
                    const threadInfo = await api.getThreadInfo(event.threadID);

                    global.client.threads.set(event.threadID, threadInfo); // Set thread info in the map
                    saveData(); // Assuming this function saves the updated data
console.log(chalk.bold.green(`New thread added to database: ${event.threadID}`))
                }

                return; 
            }


            for (let eventHandler of events.values()) {
                eventHandler.handleEvent({ api, event });
            }
        });

     const time = moment().format("HH:mm:ss");
     api.sendMessage(`Bot has been activated at ${time}`, global.config.admins[0]);

        if (global.config.autobio !== "true") {
            cron.schedule(
                "0 * * * *",
                async () => {
                    const time = moment.tz("Asia/Manila").format("h:mm A dddd");
                    api.changeBio(
                        `Prefix: ${global.config.prefix}\n${global.config.autobiostatus}\n\n🟢 Active: ${time}`,
                    );
                },
                {
                    scheduled: true,
                    timezone: "Asia/Manila",
                },
            );

            cron.schedule(
                "0 8 * * *",
                async () => {
                    const threadList = await api.getThreadList(20, null, [
                        "INBOX",
                    ]);
                    threadList.forEach((thread) => {
                        api.sendMessage(
                            "Good Morning everyone!",
                            thread.threadID,
                        );
                    });
                },
                {
                    scheduled: true,
                    timezone: "Asia/Manila",
                },
            );

            cron.schedule(
                "0 13 * * *",
                async () => {
                    const threadList = await api.getThreadList(20, null, [
                        "INBOX",
                    ]);
                    threadList.forEach((thread) => {
                        api.sendMessage(
                            "Good afternoon! 🌤️ How's your day going?",
                            thread.threadID,
                        );
                    });
                },
                {
                    scheduled: true,
                    timezone: "Asia/Manila",
                },
            );

            cron.schedule(
                "0 18 * * *",
                async () => {
                    const threadList = await api.getThreadList(20, null, [
                        "INBOX",
                    ]);
                    threadList.forEach((thread) => {
                        api.sendMessage(
                            "Good evening! 🌙 Remember to relax and unwind!",
                            thread.threadID,
                        );
                    });
                },
                {
                    scheduled: true,
                    timezone: "Asia/Manila",
                },
            );

            cron.schedule(
                "0 7 * * *",
                async () => {
                    const threadList = await api.getThreadList(20, null, [
                        "INBOX",
                    ]);
                    threadList.forEach((thread) => {
                        api.sendMessage(
                            "Good morning Don't forget your breakfast! 🥞🍳",
                            thread.threadID,
                        );
                    });
                },
                {
                    scheduled: true,
                    timezone: "Asia/Manila",
                },
            );

            cron.schedule(
                "0 9 25 12 *",
                async () => {
                    const threadList = await api.getThreadList(20, null, [
                        "INBOX",
                    ]);
                    threadList.forEach((thread) => {
                        api.sendMessage(
                            "Merry Christmas! 🎄🎅 Wishing you joy and happiness!",
                            thread.threadID,
                        );
                    });
                },
                {
                    scheduled: true,
                    timezone: "Asia/Manila",
                },
            );

            cron.schedule(
                "0 0 1 1 *",
                async () => {
                    const threadList = await api.getThreadList(20, null, [
                        "INBOX",
                    ]);
                    threadList.forEach((thread) => {
                        api.sendMessage(
                            "Happy New Year! 🎉🥳 May this year bring you prosperity and success!",
                            thread.threadID,
                        );
                    });
                },
                {
                    scheduled: true,
                    timezone: "Asia/Manila",
                },
            );

            cron.schedule(
                "0 0 31 10 *",
                async () => {
                    const threadList = await api.getThreadList(20, null, [
                        "INBOX",
                    ]);
                    threadList.forEach((thread) => {
                        api.sendMessage(
                            "Happy Halloween! 🎃👻 Trick or treat?",
                            thread.threadID,
                        );
                    });
                },
                {
                    scheduled: true,
                    timezone: "Asia/Manila",
                },
            );

            cron.schedule(
                "0 0 * * 0",
                async () => {
                    const threadList = await api.getThreadList(20, null, [
                        "INBOX",
                    ]);
                    threadList.forEach((thread) => {
                        api.sendMessage(
                            "Happy Easter! 🐰🥚 Have a blessed day!",
                            thread.threadID,
                        );
                    });
                },
                {
                    scheduled: true,
                    timezone: "Asia/Manila",
                },
            );

            cron.schedule(
                "0 0 30 11 *",
                async () => {
                    const threadList = await api.getThreadList(20, null, [
                        "INBOX",
                    ]);
                    threadList.forEach((thread) => {
                        api.sendMessage(
                            "Happy Bonifacio Day! 🇵🇭 Remembering the heroism of Gat Andres Bonifacio!",
                            thread.threadID,
                        );
                    });
                },
                {
                    scheduled: true,
                    timezone: "Asia/Manila",
                },
            );

            cron.schedule(
                "0 0 14 2 *",
                async () => {
                    const threadList = await api.getThreadList(20, null, [
                        "INBOX",
                    ]);
                    threadList.forEach((thread) => {
                        api.sendMessage(
                            "Happy Valentine's Day! ❤️🌹 Wishing you love and happiness!",
                            thread.threadID,
                        );
                    });
                },
                {
                    scheduled: true,
                    timezone: "Asia/Manila",
                },
            );
        }
    },
);

function reply(api, msg, threadID, messageID) {
    api.sendMessage(msg, threadID, messageID);
}
