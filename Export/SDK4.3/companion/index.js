//Import the inbuilt fitbit modules
import asap from "fitbit-asap/companion"
import { settingsStorage } from "settings";
import { geolocation } from "geolocation";
import {me as companion} from "companion";


// send the message if socket is open
function sendData(data) {
  asap.send(data);
};

// set the message format
let sendValue = function(key, val, type) {
  if (val) {
    sendData({
      key: key,
      value: JSON.parse(val),
      type: type
    });
  };
};

//Fetch any messages that come through
asap.onmessage = message => {
  if (!message.hasOwnProperty("type")) {
    console.log("Message without a type received: " + message.data);
  };
  if (message.type === "location") {
    console.log("location request recieved");
    geolocation.getCurrentPosition(locationSuccess, locationError, { timeout: 10 * 1000 });
  };
};

// Send settings if they have changed
settingsStorage.addEventListener("change", evt => {
  console.log(`Setting changed: ${evt.key} ${evt.newValue}`)
  if (evt.oldValue !== evt.newValue) {
    sendValue(evt.key, evt.newValue, "settings");
  };
});

// send location data if it has changed
if ( companion.permissions.granted("access_location") && companion.permissions.granted("run_background") ) {
  companion.monitorSignificantLocationChanges = true;
  companion.addEventListener("significantlocationchange", locationSuccess);
};
if (companion.launchReasons.locationChanged) {
  locationSuccess(companion.launchReasons.locationChanged.position);
}

// handle sending GPS data to the device
function locationSuccess(position) {
  sendposition("success", position.coords.latitude, position.coords.longitude, position.coords.altitude, position.coords.speed);
};
function locationError(error) {
  console.log("Error: " + error.code, "Message: " + error.message);
  sendposition("fail");
};
function sendposition(status, lat = null, lon = null, alt = null, spd = null) {
  // check if the values have changed since last
  console.log(`Sending position: lat ${lat}, lon ${lon}, alt ${alt}, spd ${spd}`);
  sendData({key: status, value: {latitude: lat, longitude: lon, altitude: alt, speed: spd}, type: "location"});
};