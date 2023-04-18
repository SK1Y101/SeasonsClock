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
    this.charg = [];
    // this.times = util.loadData("battimes", []);
    // this.times = util.loadData("batcharg", []);
    this.discharge = false;
    this.dct = null;

    // width
    this.getWidth = function () { return this.discharge ? 1.5 : 1; };

    // Draw the discharge time
    this.drawdct = function (dct=null) {
        let [d, h, m] = ["--", "--", "--"];
        if (+dct) {
            d = util.zeroPad(dct.getDate() - 1);
            h = util.zeroPad(dct.getHours());
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
            if (char) {
                this.times = [];
                this.charg = [];
                util.removeData("battimes");
                util.removeData("batcharg");
            } else {
                // fetch the current time and add it to the array.
                const now = new Date(); this.times.push(+now);
                // keep only the last 5 data points
                if (this.times.length > 5) { this.times.shift(); this.charg.shift(); };
                util.saveData("battimes", this.times);
                util.saveData("batcharg", this.charg);
                // compute the time for which the battery will run out, offset if DST is a thing
                this.dct = new Date(util.linreg(this.times, this.charg) - 60*60*1000);// (util.DST(now) ? 60*60*1000 : 0););
            };
            this.drawdct(this.dct);
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
            const lt = this.times[this.times.length - 1];
            const df = now - lt;
            this.drawdct(new Date(Math.max(0, +this.dct - df)));
        };
    };
};