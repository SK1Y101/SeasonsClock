// Inbuilts
import clock from "clock";
import document from "document";
import { peerSocket } from "messaging";
import { preferences } from "user-settings";

// My modules
import * as util from "../common/utils";
import { Settings } from "../common/settings";
import { timeIndicator } from "./seasons/clock";
import { statsDisaply } from "./seasons/stats_display";

// set default values fpr things
let DefSet = function() {
    var defaults = {
    };
    return defaults;
  };

// fetch a reference to the modules
let settings = new Settings("settings.cbor", DefSet);
let timeInd = new timeIndicator(document, settings);
let statsDisp = new statsDisaply(document, settings);

// Define the clock granularity.
clock.granularity = "minutes";

// Update on a clock tick
clock.ontick = (evt) => {
    let now = evt.date;
    timeInd.drawTime(now);
    // statsDisp.onTick(now);
}

// display.addEventListener("change", () => {
//     if (display.on) {
//       // start sensors
//     } else {
//     };
// });