// Import fitbit modules
import { me as device } from "device";

// Import my modules
import { dateIndicator } from "./date";
import * as util from "../../common/utils";
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
    let dateInd = new dateIndicator(settings);

    // move the text and icon to a location given module number
    let translate = function(i, num, txt, ico) {
        let x = i < num ? w * (i + 1) / (num + 1) : w*1.5;
        txt.x = x - 0.5 * (ico.width - textWidth(txt));
        ico.x = txt.x;
    };
    
    // Determine the entire width of a module element
    let moduleWidth = function(txt, ico) { return textWidth(txt) + ico.width; };
    // compute the sum of an array
    function sumArray(arr) { let sum=0; for (let e of arr) { sum+=e; }; return sum; };

    // Determine the position of a module element
    // let positionModules = function() {
        // bins = [[], []];
        // // for each element
        // for (let ele of elem) {
        //     // skip if nothing
        //     if (!ele["modulename"]) { continue; };
        //     // determine the width of this module
        //     const m = moduleWidth(ele["text"], ele["icon"]);
        //     const wid = Math.min(3, Math.ceil(m / 100));
        //     let placed = false;
        //     // itterate through all the bins
        //     for (let j=0; j<bins[0].length-1; j++) {
        //         let thisWid = sumArray(bins[0][i]);
        //         // if it fits herer
        //         if (thisWid + wid <= 3) {
        //             bins[1][j].push(ele);
        //             bins[0][j].push(wid);
        //             placed = true;
        //             break;
        //         };
        //     };
        //     // if it didn't fit
        //     if (!placed) {
        //         bins[0].push([wid]);
        //         bins[1].push([ele]);
        //     };
        // };
        // // place each module at it's location
        // let rows = bins[0].length;
        // statsArea.y = h * 0.1 * (9-rows);
        // for (let i=0; i<rows-1; i++) {
        //     // the width of this bin
        //     let thisWid = sumArray(bins[0][i]);
        //     let thisEle = bins[1][i]
        //     // for each element in the bin
        //     for (let j=0; j<bins[1][i].length-1; j++) {
        //         translate(j, thisWid, thisEle[j]["text"], thisEle[j]["icon"], h * 0.1 * (9-i));
        //     };
        // };
    // };

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
        for (let ele of elem) {
            if (ele["modulename"] && ele["module"].ontick) {
                ele["module"].ontick(now)
            };
        };
    };

    this.positionModules = function() {
        statsArea.y = h * (num > 0 ? 0.9 : 1);
    };
}