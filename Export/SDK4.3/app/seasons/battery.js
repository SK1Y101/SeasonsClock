// Import my modules
import { battery } from "power";
import { charger } from "power";
import * as util from "../../common/utils";

export let batteryIndicator = function() {
    this.text = null;
    this.icon = null;

    // update onscreen elements
    this.draw = function() {
        // fetch the required values
        const char = battery.charging;
        const chrg = battery.chargeLevel;

        // show the battery charge percentage
        this.text.text = util.zeroPad(chrg,"   ")+"%";

        // determine the colour
        let col = (char ? "#ffaa33" : (chrg <= 16 ? "#ff4444" : (chrg <=30 ? "#ffff44" : "#44ff44")));
        this.text.style.fill=col;
        this.icon.style.fill=col;
    };

    // start the indicator
    this.start = function() {
        battery.addEventListener("change", () => { this.draw(); });
        charger.addEventListener("change", () => { this.draw(); });
        this.icon.href = "icons/icon_power_front.png";
        this.draw();
    };

    // stop the indicator
    this.stop = function() {
        battery.removeEventListener("change", () => { this.draw(); });
        charger.removeEventListener("change", () => { this.draw(); });
        this.text.text = "";
        this.icon.href = "";
    };
};