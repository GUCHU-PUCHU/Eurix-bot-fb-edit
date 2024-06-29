const { spawn } = require("child_process");
const { readFileSync } = require("fs-extra");
const http = require("http");
const axios = require("axios");
const semver = require("semver");

function logger(message, tag) {
    console.log(tag + ": " + message);
}

if (!global.countRestart) {
    global.countRestart = 0;
}

function startBot(message) {
    if (message) {
        logger(message, "[ Starting ]");
    }

    const child = spawn("node", ["--trace-warnings", "--async-stack-traces", "Eugene.js"], {
        cwd: __dirname,
        stdio: "inherit",
        shell: true
    });

    child.on("close", (codeExit) => {
        if (codeExit !== 0 && global.countRestart < 10) {
            startBot("Starting up...");
            global.countRestart++;
        } else {
            return;
        }
    });

    child.on("error", function(error) {
        logger("An error occurred: " + JSON.stringify(error), "[ Starting ]");
    });
}

startBot();