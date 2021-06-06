// jshint esversion:6, node:true, unused:true, undef:true

const fs = require("fs");

const OUT_PATH = "cue-worker.sh";
fs.writeFileSync(OUT_PATH, "");

const cueData = require(process.argv[2]);
const seek = Number(process.argv[3]) | 0;

for(const section of cueData) {
    const timeComponents = section[0].split(":");
    section[0] = 60 * Number(timeComponents[0]) + Number(timeComponents[1]);
}

let startIndex = cueData.length - 1;
while(startIndex >= 0) {
    if(seek >= cueData[startIndex][0])
        break;
    startIndex--;
}

const INITIAL_DELAY = 10 * 3 + 5;

const lines = [ "sleep " + INITIAL_DELAY, "" ];
let prevSectionTime;

for(let i = startIndex; i < cueData.length; i++) {
    const section = cueData[i];
    const sectionTime = i === startIndex ? seek : section[0];

    if(i > startIndex)
        lines.push("", "sleep " + (sectionTime - prevSectionTime));

    const escapedSlice = JSON.stringify(section.slice(1)).replace(/'/g, "'\\''");
    lines.push(`echo '${escapedSlice}' > hls/current-cue.json`);

    prevSectionTime = sectionTime;
}

fs.writeFileSync(OUT_PATH, lines.join("\n"));
