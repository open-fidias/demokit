var fs = require("fs");
var path = require("path");
var spawn = require("child_process").spawn;
var demokitDirectory = path.join(process.cwd(), "electron");
var installFlags = ["install", "--local", "--runtime=electron", "--target=1.6.11", "--disturl=https://atom.io/download/atom-shell", "--abi=53"];

spawn("yarn", installFlags,
{
    stdio:"inherit",
    cwd:demokitDirectory
})
.on('close', function (code)
{
    spawn("yarn", installFlags,
    {
        stdio:"inherit",
        cwd:path.join(demokitDirectory, "demokit")
    });
});
