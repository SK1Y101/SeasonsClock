// Import my modules
import * as util from "../../common/utils";
import { me as device } from "device";
import { geolocation } from "geolocation";

const w = device.screen.width; 

export let positionIndicator = function () {
    // elements
    this.text = null;
    this.icon = null;
    this.velocity = false;

    // width
    this.getWidth = function () { return this.velocity ? 1.5 : 3; };

    // gps watching
    this.watchID = null;

    // update onscreen elements
    this.draw = function (position = null, state = null) {
        let old_width = this.icon.getBBox().width + this.text.getBBox().width;
        let shownText = (this.velocity ? "---.---m/s" : "--.----°N ---.----°E");
        if (state) {
            if (this.velocity) {
                // update the speed component
                shownText = (position.speed ?? 0).toFixed(3) + "m/s";
            } else {
                // update the position component
                let lat = Math.abs(position.latitude).toFixed(4) + "°" + (position.latitude>=0 ? "N" : "S");
                let lon = Math.abs(position.longitude).toFixed(4) + "°" + (position.longitude>=0 ? "E" : "W");
                shownText = lat + " " + lon;
            }
        };
        util.setSaledText(this.text, shownText, (this.velocity ? w*0.5 : w), 30);
        // determine the colour
        let col = (state === null ? "gray" : (state ? "#44ff44" : "#ff4444"));
        util.updateColour(this.text, col);
        util.updateColour(this.icon, col);
        // update the x position to account for new widths
        let new_width = this.icon.getBBox().width + this.text.getBBox().width;
        if (old_width != new_width) {
            this.text.x += 0.5*(new_width - old_width);
            this.icon.x = this.text.x;
        };
    };

    // start the indicator
    this.start = function () {
        this.textWidth = w - this.icon.getBBox().width;
        this.icon.href = "icons/icon_gps_front.png";
        this.draw();
        // start the position listener if we don't have one started already
        if (!this.watchId) {
            this.watchId = geolocation.watchPosition(
                (evt) => { this.draw(evt.coords, true); },
                () => { this.draw(null, false); },
                { timeout: 10 * 1000 }
            );
        };
    };

    // stop the indicator
    this.stop = function () {
        this.text.style.fontSize = 30;
        if (this.watchID) {
            geolocation.clearWatch(this.watchID);
        }
    };
};