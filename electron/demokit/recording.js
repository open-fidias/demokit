const path = require("path");
const scene = require("./scene");
const moment = require("moment");
const ffmpeg = require('fluent-ffmpeg');
const expandTilde = require("expand-tilde");
const { convert, Scene, Global } = require("./coordinate-space");
const { delay } = require("bluebird");
const recordClickRegions = require("./click-regions/record");
const { BrowserWindow } = require('electron')

const isWin = /^win/.test(process.platform);
const isMac = /^darwin/.test(process.platform);
const isLin = /^linux/.test(process.platform);

module.exports.start = async function({
    context,
    filePath = "out",
    framerate = 60,
    contentRect,
    space = Scene,
    clickRegions = false,
    quitAfterFinish = true
}) {
    let input = 'video=screen-capture-recorder';
    let inputScreen = 'x11grab';
    if (isWin) {
        inputScreen = 'dshow';
    }
    if (isMac) {
        input = 'video=0';
        inputScreen = 'avfoundation';
    }
    if (isLin) {
        input = ':0.0';
    }

    const options = {};

    let videoCodec = options.videoCodec || "libx264";
    let videoBitrate = options.videoBitrate || "1000k";
    let audioBitrate = options.audioBitrate || "96k";
    let format = options.format || "mp4";

    const expanded = expandTilde(filePath) + "-" + moment().format("YYYY-MM-DD[-at-]HH.mm.ss");
    const resolved = path.resolve(process.cwd(), expanded + `.${format}`);

    let file = resolved;

    await delay(1000);

    const sceneBounds = contentRect || {
        origin: {
            x: 0,
            y: 0
        },
        size: await scene.getSize()
    };
    const {
        origin: {
            x,
            y
        },
        size: {
            width,
            height
        }
    } = await convert({rect: sceneBounds, from: Scene, to: Global});

    context.movie = ffmpeg()
        .input(`${input}+${x}.${y}`)
        .inputOptions([
            `-s ${width}x${height}`,
            `-f ${inputScreen}`
        ])
        .format(format)
        .save(file)
        .on('end', function() {
            console.log('Screen Capture Completed.');
        })
        .on('error', function(e) {
            console.log('Screen Capture Completed.');
            // console.error(e);
        });

    console.log("Starting Screen Capture");
    console.log("Screen Capture Output: ", file);

    if (clickRegions) {
        context.size = {
            width,
            height
        };
        context.clickRegions = {
            stop: recordClickRegions(expanded + ".click-regions.js", { width, height })
        };
    }
    context.quitAfterFinish = quitAfterFinish

    await delay(1000);
};

module.exports.stop = async function({context}) {
    if (context.movie) {
        await delay(500);
        context.movie.kill('SIGINT');
    }

    if (context.clickRegions) {
        await context.clickRegions.stop();
    }

    if (context.quitAfterFinish) {
        await delay(1000);
        var window = BrowserWindow.getFocusedWindow();
        window.close();
    }
};
