import { me as device } from "device";
import { dateIndicator } from "./date";
import { batteryIndicator } from "./battery";

export let statsDisaply = function(doc, settings) {
    // fetch elements
    const elem = [];
    const elemNum = 1;
    let w = device.screen.width;
    let h = device.screen.height;
    do {
        elem.push({
            "module": null,
            "modulename": "",
            "text": doc.getElementById("stat"+elemNum),
            "icon": doc.getElementById("icon"+elemNum),
        });
        ++elemNum;
    } while (doc.getElementById("stat"+elemNum) != null);
    const statsArea = doc.getElementById("statsArea");

    // fetch module references
    let batInd = new batteryIndicator();
    let dateInd = new dateIndicator();

    // move the text and icon to a location given module number
    let translate = function(i, num, txt, ico) {
        let x = i < num ? w * (i + 1) / (num + 1) : w*1.5;
        let txtw = txt.getBBox().width;
        let icow = ico.width;
        let tw = txtw + icow;
        txt.x = x - 0.5*(tw - txtw);
        ico.x = x + (0.5*tw - icow);
    };

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
        statsArea.y = h * (num > 0 ? 0.9 : 1);
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
                elem[i]["text"].text = "";
                elem[i]["icon"].href = "";
            };
            if (newmodule && changed) {
                elem[i]["modulename"] = newmodule;
                elem[i]["module"] = fetchModule(newmodule);
                elem[i]["module"].text = elem[i]["text"];
                elem[i]["module"].icon = elem[i]["icon"];
                elem[i]["module"].start();
            };
            translate(i, num, elem[i]["text"], elem[i]["icon"]);
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