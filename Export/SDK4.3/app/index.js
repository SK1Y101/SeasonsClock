// Inbuilts
import clock from "clock";
import document from "document";
import { display } from "display";
import { peerSocket } from "messaging";
import { preferences } from "user-settings";

// My modules
import * as util from "../common/utils";
import { Settings } from "../common/settings";
import { timeIndicator } from "./seasons/clock";
import { statsDisaply } from "./seasons/stats_display";
import { Background } from "./seasons/background";

// set default values fpr things
let DefSet = function() {
    var defaults = {
      // Customisation defaults
      TimeFormat: [0],
    };
    return defaults;
  };

// fetch a reference to the modules
let settings = new Settings("settings.cbor", DefSet);
let background = new Background(document);
let timeInd = new timeIndicator(document, settings);
let statsDisp = new statsDisaply(document, settings);

// Define the clock granularity.
clock.granularity = "minutes";

let tickUpdate = function(evt) {
  let now = evt.date;
  // but only if the display is on
  if (display.on) {
    timeInd.drawTime(now);
    statsDisp.ontick(now);
    background.ontick(now);
  };
};

// Update on a clock tick
clock.ontick = (evt) => {
  tickUpdate(evt);
};
display.onchange = (evt) => {
  tickUpdate(new Date());
};

// Define a function to apply our settings
let applySettings = function() {
  if (! settings) {
    return;
  };
  try {
    // Set Display modules
    settings.isPresent("shownStats", statsDisp.changeStats);
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

    settings.saveSettings();

    applySettings();
  };
});
