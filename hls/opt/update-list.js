// jshint esversion:6, node:true, unused:true, undef:true

const path = require("path");
const fs = require("fs");

const YADISK = "/opt/yadisk/cafe-content";
const LIST_PATH = path.join(__dirname, "list.sh");
const TIMEBASE_PATH = path.join(__dirname, "timebase.txt");
const CONCAT_DURATION = 35 * 60 * 60;

main();

function main() {
    fs.writeFileSync(LIST_PATH, "");
    log("Blank " + LIST_PATH);

    const list = [ ];
    const episodes = toEpisodes(require(path.join(YADISK, "tracks.json")));
    const totalDuration = calcTotalDuration(episodes);

    const timebase = chooseTimebase();
    log("Chosen timebase: " + timebase);

    shuffle(episodes);

    let episodeIndex = 0;
    let collectedDuration = 0;
    let seek = timebase % totalDuration;

    while(true) {
        const episode = episodes[episodeIndex];
        const date = episode[0];

        for(let chapterNumber = 1; chapterNumber < episode.length; chapterNumber++) {
            let chapterDuration = episode[chapterNumber];

            if(seek > 0 && seek >= chapterDuration) {
                seek -= chapterDuration;
                continue;
            }

            const mpegPath = path.join(YADISK, "tracks", date.substr(0, 4), date, chapterNumber + ".mp3");
            if(!fs.existsSync(mpegPath)) {
                log("Skip non-existing " + mpegPath);
                continue;
            }

            const cuePath = path.join(YADISK, "cue", date.replace(/-/g, "/"), chapterNumber + ".json");
            if(fs.existsSync(cuePath)) {
                list.push(`start_cue_worker "${cuePath}" ${seek}`);
            } else {
                log("Missing cue: " + cuePath);
            }

            log(`${mpegPath} @ ${seek} of ${chapterDuration}`);
            list.push(`send_mpeg "${mpegPath}" ${seek}`);

            collectedDuration += chapterDuration - seek;
            if(collectedDuration > CONCAT_DURATION) {
                log("Collected duration: " + collectedDuration);

                const nextTimebase = timebase + collectedDuration;
                fs.writeFileSync(TIMEBASE_PATH, nextTimebase);
                log("Written next timebase: " + nextTimebase);

                fs.writeFileSync(LIST_PATH, list.join("\n"));
                log("Written " + LIST_PATH);

                return;
            }

            seek = 0;
        }

        episodeIndex = (1 + episodeIndex) % episodes.length;
    }
}

function log(message) {
    process.stderr.write("[update-list] " + message + "\n");
}

function chooseTimebase() {
    const defaultTimebase = Math.round(Date.now() / 1000) + (10 * 3);
    log("Default timebase: " + defaultTimebase);

    const savedTimebase = Number(fs.existsSync(TIMEBASE_PATH) ? fs.readFileSync(TIMEBASE_PATH, "utf-8") : 0);
    log("Saved timebase: " + savedTimebase);

    if(!savedTimebase) {
        log("Using default");
        return defaultTimebase;
    }

    const diff = defaultTimebase - savedTimebase;
    log("Diff: " + diff);

    if(Math.abs(diff) > 1234) {
        // TODO
    }

    return savedTimebase;
}

function toEpisodes(trackList) {
    let result = [ ];
    for(const tuple of trackList)
        result = result.concat(tuple[1]);
    return result;
}

function calcTotalDuration(episodes) {
    let result = 0;
    for(const episode of episodes) {
        for(const chapterDuration of episode.slice(1))
            result += chapterDuration;
    }
    return result;
}

// website/src/track-list.ts
function shuffle(data) {
    // Fisher-Yates shuffle based on Fibonacci sequence
    // Order changes monthly

    const now = new Date();
    let k1 = now.getMonth() + 1;
    let k2 = now.getFullYear();
    let i = data.length;
    let tmp1;
    let tmp2;

    while(i-- > 1) {
        tmp1 = data[i];
        tmp2 = k2 % i;
        data[i] = data[tmp2];
        data[tmp2] = tmp1;

        tmp1 = k2;
        k2 = (k1 + k2) % 0xabcdef;
        k1 = tmp1;
    }
}
