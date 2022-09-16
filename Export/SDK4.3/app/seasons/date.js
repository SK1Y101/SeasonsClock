// Import my modules
import * as util from "../../common/utils";
import clock from "clock";

export let dateIndicator = function() {
    this.text = null;
    this.icon = null;

    // update onscreen elements
    this.ontick = function(now) {
        if (this.text) {
            let day = now.getDate();
            let month = now.getMonth() + 1;
            util.setText(this.text, `${day}/${month}`);
        };
    };

    // start the indicator
    this.start = function() {
        this.ontick(new Date());
        this.icon.href = "icons/icon_time_front.png";
        util.updateColour(this.text, "gray");
        util.updateColour(this.icon, "gray");
    };

    // stop the indicator
    this.stop = function() {
    };
};