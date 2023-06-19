// Inbuilts
import clock from "clock";
import document from "document";
import { display } from "display";
import asap from "fitbit-asap/app";
import { peerSocket } from "messaging";
import { preferences } from "user-settings";

// My modules
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

let now = null;
let lasttime = null;
let tickUpdate = function() {
  // but only if the display is on
  if (display.on && lasttime!=now) {
    lasttime = now;
    timeInd.drawTime(now);
    statsDisp.ontick(now);
    background.ontick(now);
  };
  // force update the module alignment if the date has just changed
  if (!(now.getHours() || now.getMinutes())) {
    statsDisp.onNewDay(now);
  };
};

// Update on a clock tick
clock.ontick = (evt) => {
  now = evt.date;
  now.setSeconds(0, 0);
  tickUpdate();
};
display.onchange = (evt) => {
  statsDisp.ondisplay(display.on);
  if (display.on) {
    tickUpdate();
  };
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
    console.log("Couldn't apply settings: "+err);
  };
}
applySettings();

//Fetch any messages that come through
asap.onmessage = message => {
  if (!message.hasOwnProperty("type")) {
    console.log("Message without a type received: " + message.type);
  };
  if (message.type === "settings") {
    let newSet = {};
    newSet[message.key] = message.value;

    console.log("Setting changed: "+message.key+message.value);

    settings.replaceSettings(newSet);

    settings.saveSettings();

    applySettings();
  };
  if (message.type === "location") {
    let position = message.value; let state = (message.key === "success");
    background.onlocation(position, state);
    statsDisp.onlocation(position, state);
  };
};
