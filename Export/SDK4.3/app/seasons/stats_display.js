// Import fitbit modules
import { me as device } from "device";

// Import my modules
import { dateIndicator } from "./date";
import * as util from "../../common/utils";
import { batteryIndicator } from "./battery";
import { modulePlacer } from "./module_placer";

export let statsDisaply = function(doc, settings) {
    // fetch elements
    let elem = [];
    const elemNum = 1;
    do {
        elem.push({
            "module": null,
            "modulename": "",
            "text": doc.getElementById("stat"+elemNum),
            "icon": doc.getElementById("icon"+elemNum),
        });
        ++elemNum;
    } while (doc.getElementById("stat"+elemNum) != null);

    // create the module placer object
    let moduleplacer = new modulePlacer(doc);

    // fetch module references
    let batInd = new batteryIndicator();
    let batInd2 = new batteryIndicator();
    let dateInd = new dateIndicator(settings);
    batInd2.discharge = true;

    // fetch the module from the settings codes
    let fetchModule = function(key) {
        switch (key) {
            case "batCharge":
                return batInd;
            case "batDisCharge":
                return batInd2;
            case "curDate":
                return dateInd;
        };
    };
    
    // force-update the module placement
    this.onNewDay = function(now) { moduleplacer.placeModules(); };

    this.changeStats = function(statsList) {
        // fetch the number of stats to draw
        const num = Object.keys(statsList).length;
        moduleplacer.reset();
        for (let ele of elem) {
            let i = elem.indexOf(ele);
            let newmodule = i < num ? statsList[i].value : "" ;
            if (ele["modulename"]) {
                ele["module"].stop();
                ele["module"].text = null;
                ele["module"].icon = null;
                ele["modulename"] = "";
                ele["module"] = null;
                ele["text"].text = "";
                ele["icon"].href = "";
            };
            if (newmodule) {
                ele["modulename"] = newmodule;
                ele["module"] = fetchModule(newmodule);
                ele["module"].text = ele["text"];
                ele["module"].icon = ele["icon"];
                ele["module"].start();
                moduleplacer.addModule(ele);
            };
            // moduleplacer.translate(i, num, elem[i]["text"], elem[i]["icon"]);
        };
        moduleplacer.placeModules();
    };

    this.ontick = function(now) {
        for (let ele of elem) {
            if (ele["modulename"] && ele["module"].ontick) {
                ele["module"].ontick(now)
            };
        };
    };
};