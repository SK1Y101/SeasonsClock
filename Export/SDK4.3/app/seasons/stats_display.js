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
    const w = device.screen.width;

    // create the module placer object
    let moduleplacer = new modulePlacer(doc);

    // fetch module references
    let batInd = new batteryIndicator();
    let dateInd = new dateIndicator(settings);

    // fetch the module from the settings codes
    let fetchModule = function(key) {
        switch (key) {
            case "batCharge":
                return batInd;
            case "curDate":
                return dateInd;
        };
    };

    // move the text and icon to a location given module number
    let translate = function(i, num, txt, ico) {
        let x = i < num ? w * (i + 1) / (num + 1) : w*1.5;
        txt.x = x - 0.5*(ico.getBBox().width - txt.getBBox().width);
        ico.x = txt.x;
    };

    this.changeStats = function(statsList) {
        // fetch the number of stats to draw
        const num = Object.keys(statsList).length;
        // moduleplacer.reset();
        for (let i = 0; i <= elem.length; i++) {
            let newmodule = i < num ? statsList[i].value : "" ;
            let oldmodule = elem[i]["modulename"];
            if (oldmodule) {
                elem[i]["modulename"] = "";
                elem[i]["module"].stop();
                elem[i]["module"].text = null;
                elem[i]["module"].icon = null;
                elem[i]["module"] = null;
                elem[i]["text"].text = "";
                elem[i]["icon"].href = "";
            };
            if (newmodule) {
                elem[i]["modulename"] = newmodule;
                elem[i]["module"] = fetchModule(newmodule);
                elem[i]["module"].text = elem[i]["text"];
                elem[i]["module"].icon = elem[i]["icon"];
                elem[i]["module"].start();
            };
            // moduleplacer.addModule(elem[i]);
            moduleplacer.translate(i, num, elem[i]["text"], elem[i]["icon"]);
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
}