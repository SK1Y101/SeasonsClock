// Import my modules
import { battery } from "power";
import { charger } from "power";
import * as util from "../../common/utils";

export let batteryIndicator = function(text, icon) {

    // update onscreen elements
    this.draw = function(chrg, char) {
        // fetch the required values
        const char = battery.charging;
        const chrg = battery.chargeLevel;

        // show the battery charge percentage
        text.text = util.zeroPad(chrg+"%","    ");

        // determine the colour
        let col = (char ? "#ffaa33" : (chrg <= 16 ? "#ff4444" : (chrg <=30 ? "#ffff44" : "#44ff44")));
        text.style.fill=col;
        icon.style.fill=col;
    };

    // Initialise the battery indicator
    this.create = function() {
        // up
        battery.addEventListener("change", this.draw());
        charger.addEventListener("change", this.draw());

        // update on initialisation
        this.draw();
    };

    // remove the indicator
    this.destroy = function() {
        battery.removeEventListener("change", this.draw());
        charger.removeEventListener("change", this.draw());
    };
};