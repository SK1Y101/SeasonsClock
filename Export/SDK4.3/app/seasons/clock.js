import * as util from "../../common/utils";

export let timeIndicator = function(doc, settings) {
    const digitalClock = document.getElementById("digitalClock");

    this.drawTime = function(now) {
        let hours = now.getHours();
        let mins = now.getMinutes();

        hours = util.zeroPad(hours);
        mins = util.zeroPad(mins);
        digitalClock.text = `${hours}:${mins}`;
    }
}