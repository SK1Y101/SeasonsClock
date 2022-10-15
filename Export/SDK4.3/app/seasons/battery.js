// Import my modules
import { battery } from "power";
import { charger } from "power";
import * as util from "../../common/utils";

export let batteryIndicator = function () {
    // elements
    this.text = null;
    this.icon = null;

    // mode switch
    this.times = [];
    this.avtimes = null;
    this.discharge = false;
    this.dct = null;

    // width
    this.getWidth = function () { return this.discharge ? 2 : 1; };

    // Draw the discharge time
    this.drawdct = function (dct=null) {
        let [d, h, m] = ["--", "--", "--"];
        if (+dct) {
            d = util.zeroPad(dct.getDate() - 1);
            h = util.zeroPad(dct.getHours() - 1);
            m = util.zeroPad(dct.getMinutes());
        };
        util.setText(this.text, d + ":" + h + ":" + m);
    };

    // update onscreen elements
    this.draw = function () {
        // fetch the required values
        const char = battery.charging;
        const chrg = battery.chargeLevel;

        if (this.discharge) {
            let dct = null;
            if (char) {
                this.times = [];
            } else {
                // fetch the current time and add it to the array.
                const now = new Date(); this.times.push(+now);
                // Compute the moving average.
                if (this.times.length > 5) { this.avtimes += (1 / this.times.length) * (now - this.times.shift()); }
                // Compute the standard average.
                else { this.avtimes = 0; for (let i of this.times) { this.avtimes += i; }; this.avtimes /= this.times.length; };
                // Compute the timed average per unit charge.
                const diff = 2 * (+now - this.avtimes) / (this.times.length - 1);
                // and compute the time for which the battery will run out.
                dct = new Date(this.times.length > 1 ? diff * chrg : 0);
                this.dct = +dct ? dct : null;
            };
            this.drawdct(dct);
        } else {
            util.setText(this.text, util.zeroPad(chrg, "   ") + "%");
        };

        // determine the colour
        let col = (char ? "#ffaa33" : (chrg <= 16 ? "#ff4444" : (chrg <= 30 ? "#ffff44" : "#44ff44")));
        util.updateColour(this.text, col);
        util.updateColour(this.icon, col);
    };

    // start the indicator
    this.start = function () {
        battery.addEventListener("change", () => { this.draw(); });
        charger.addEventListener("change", () => { this.draw(); });
        this.icon.href = "icons/icon_power_front.png";
        this.draw();
    };

    // stop the indicator
    this.stop = function () {
        battery.removeEventListener("change", () => { this.draw(); });
        charger.removeEventListener("change", () => { this.draw(); });
    };

    // update onscreen elements
    this.ontick = function (now) {
        if (this.dct) {
            const nw = new Date();
            const lt = this.times[this.times.length - 1];
            const df = nw - lt;
            this.drawdct(new Date(Math.max(0, +this.dct - df)));
        };
    };
};