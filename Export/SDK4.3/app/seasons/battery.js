// Import my modules
import { battery } from "power";
import * as util from "../../common/utils";

export let batteryIndicator = function(text, icon) {

    // update onscreen elements
    this.draw = function(chrg, char) {
        // show the battery charge percentage
        text.text = util.zeroPad(chrg, "   ")+"%";
        // determine the colour
        let col = (char ? "#ffaa33" : (chrg <= 16 ? "#ff4444" : (chrg <=30 ? "#ffff44" : "#44ff44")));
        text.style.fill=col;
        icon.style.fill=col;
    };

    // update on change
    battery.onchange = (evt) => {
        const chrg = evt.chargeLevel;
        const char = evt.charging;
        this.draw(chrg, char);
    };

    // update on initialisation
    this.draw(battery.chargeLevel, battery.charging);
};