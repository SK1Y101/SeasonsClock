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
    statsDisp.ontick(now);
}

// display.addEventListener("change", () => {
//     if (display.on) {
//       // start sensors
//     } else {
//     };
// });

// Define a function to apply our settings
let applySettings = function() {
  if (! settings) {
    return;
  };
  try {
    // Set element colours
    settings.isPresent("shownStats", statsDisp.changeStats);
    // Show that settings have been loaded
    console.log("Settings applied");
    // Save the settings that have been applied
    settings.saveSettings();
  } catch (err) {
    console.log("Couldn't apply settings");
  };
}
applySettings();

//Fetch any messages that come through
peerSocket.addEventListener("message", function(evt) {
  if (!evt.data.hasOwnProperty("type")) {
    console.log("Message without a type received: " + evt.data)
  };
  if (evt.data.type === "settings") {
    let newSet = {};
    newSet[evt.data.key] = evt.data.value;

    console.log("Setting changed: "+evt.data.key+evt.data.value);

    settings.replaceSettings(newSet);
    applySettings();
  };
});
