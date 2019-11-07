const {spawn,exec} = require("child_process");
const path = require("path");
const fs = require("fs");
const isGitInstalled = require(path.join(__dirname,"src/DetectGit.js"));
const GitHandler = require(path.join(__dirname,"src/GitHandler.js"));
