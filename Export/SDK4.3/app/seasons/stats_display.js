import * as util from "../../common/utils";
import { batteryIndicator } from "./battery";

export let statsDisaply = function(doc, settings) {
    // Determine the number of stats displays requested
    // Determine Which modules are requested
    // Load those modules
    // Pass the elements to each module
    // Change the display to show those modules

    const elems = [];

    const modules = [];

    for (let i=1; i<2; i++) {
        elems.push({
            "module": {},
            "text": doc.getElementById("stat"+i),
            "icon": doc.getElementById("icon"+i),
        });
    };

    let fetchModule = function(key) {
        switch (key) {
            case "batCharge":
                return batteryIndicator;
        }
    };

    this.changeStats = function(statsList) {
        // fetch the number of stats to draw
        const num = Object.keys(statsList).length;
        for (elem in elems) {
            if (elem["module"]) {
                // remove the old module
                elem["module"].destroy();
                delete elem["module"];
            };
            if (i <= num) {
                // and add the new one
                newmodule = fetchModule(statsList[i].value);
                elem["module"] = new statModule(elem["text"], elem["icon"]);
            } else {
                elem["text"].text = "";
            };
        };
    };
}