//Import the inbuilt fitbit modules
import { me } from "companion";
import { peerSocket } from "messaging";
import { settingsStorage } from "settings";

//set the message format
let sendValue = function(key, val, type) {
  if (val) {
    sendData({
      key: key,
      value: JSON.parse(val),
      type: type
    });
  };
};

//send the message if socket is open
function sendData(data) {
  if (peerSocket.readyState === peerSocket.OPEN) {
    peerSocket.send(data);
  } else {
    console.log("Connection is not open");
  };
};

//Send settings if they have changed
settingsStorage.addEventListener("change", evt => {
  if (evt.oldValue !== evt.newValue) {
    sendValue(evt.key, evt.newValue, "settings");
  };
});
