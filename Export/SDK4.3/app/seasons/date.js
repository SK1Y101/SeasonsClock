// Import my modules
import * as util from "../../common/utils";

export let dateIndicator = function(settings) {
    this.text = null;
    this.icon = null;

    function dateText(now) {
        const format = settings.getOrElse("dateFormat", "dayNum/monthNum");
        return util.dateString(now, format);
    };

    this.getWidth = function() {
        this.ontick(new Date());
        return util.getWidth([this.text, this.icon]);
    };

    // update onscreen elements
    this.ontick = function(now) {
        if (this.text) {
            const datetext = dateText(now);
            util.setText(this.text, datetext);
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