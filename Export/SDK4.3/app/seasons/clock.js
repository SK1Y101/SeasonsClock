import * as util from "../../common/utils";

export let timeIndicator = function(doc, settings) {
    const bg = doc.getElementById("background");
    const digitalClock = doc.getElementById("digitalClock");

    this.drawTime = function(now) {
        let hours = now.getHours();
        let mins = now.getMinutes();

        hours = util.zeroPad(hours);
        mins = util.zeroPad(mins);
        digitalClock.text = `${hours}:${mins}`;

        let h = Math.abs(12-now.getHours());
        if (h < 8) {
            util.updateColour("skyblue", bg);
        } else if (h > 10) {
            util.updateColour("black", bg);
        } else if (h > 9) {
            til.updateColour("#131862", bg);
        } else {
            util.updateColour("#546bab", bg);
        }
    }
}