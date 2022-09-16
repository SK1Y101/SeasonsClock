import * as util from "../../common/utils";
import { batteryIndicator } from "./battery";
import { dateIndicator } from "./date";

export let statsDisaply = function(doc, settings) {
    // fetch elements
    const elem = [];
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

    // fetch module references
    let batInd = new batteryIndicator();
    let dateInd = new dateIndicator();

    // fetch the module from the settings codes
    let fetchModule = function(key) {
        switch (key) {
            case "batCharge":
                return batInd;
            case "curDate":
                return dateInd;
        };
    };

    this.changeStats = function(statsList) {
        // fetch the number of stats to draw
        const num = Object.keys(statsList).length;
        for (let i = 0; i <= elem.length; i++) {
            let newmodule = i < num ? statsList[i].value : "" ;
            let oldmodule = elem[i]["modulename"];
            let changed = newmodule!=oldmodule;
            if (oldmodule && changed) {
                elem[i]["modulename"] = "";
                elem[i]["module"].stop();
                elem[i]["module"].text = null;
                elem[i]["module"].icon = null;
                elem[i]["module"] = null;
            };
            if (newmodule && changed) {
                elem[i]["modulename"] = newmodule;
                elem[i]["module"] = fetchModule(newmodule);
                elem[i]["module"].text = elem[i]["text"];
                elem[i]["module"].icon = elem[i]["icon"];
                elem[i]["module"].start();
            };
            let pos = `${100 * (i+1) / (num+2)}%`;
            elem[i]["text"].x = pos;
            elem[i]["icon"].x = pos;
        };
    };

    this.ontick = function(now) {
        for (const ele of elem) {
            if (ele["modulename"] && ele["module"].ontick) {
                ele["module"].ontick(now);
            }
        };
    };
}