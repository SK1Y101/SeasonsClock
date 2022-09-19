// Import my modules
import * as util from "../../common/utils";

export let dateIndicator = function(settings) {
    this.text = null;
    this.icon = null;

    // update onscreen elements
    this.ontick = function(now) {
        if (this.text) {
            const format = settings.getOrElse("dateFormat", "dayNum/monthNum");
            const dateText = util.dateString(now, format);
            util.setText(this.text, dateText);
        };
    };

    // start the indicator
    this.start = function() {
        this.icon.href = "icons/icon_time_front.png";
        util.updateColour(this.text, "gray");
        util.updateColour(this.icon, "gray");
        this.ontick(new Date());
    };

    // stop the indicator
    this.stop = function() {
    };
};