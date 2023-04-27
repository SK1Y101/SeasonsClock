import * as util from "../../common/utils";
import { preferences } from "user-settings";

// export the clock as a callable
export let timeIndicator = function(doc, settings) {
    const digitalClock = doc.getElementById("digitalClock");

    this.drawTime = function(now) {
        let hours = now.getHours();
        let mins = now.getMinutes();
        const dayFrac = ((mins/60) + hours)/24;

        hours = util.zeroPad(preferences.clockDisplay === "12h" ? hours % 12 || 12 : hours);
        mins = util.zeroPad(mins);
        util.setText(digitalClock, `${hours}:${mins}`);
    };
};