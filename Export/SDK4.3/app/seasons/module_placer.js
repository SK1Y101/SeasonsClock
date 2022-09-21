// Import fitbit modules
import { me as device } from "device";

export let modulePlacer = function(doc) {
    const statsArea = doc.getElementById("statsArea");
    const w = device.screen.width;
    const h = device.screen.height;
    let bins = {"wid":[], "ele":[]};

    // move the text and icon to a location given module number
    this.translate = function(i, wid, txt, ico) {
        let x = i < wid ? w * (i + 1) / (wid + 1) : w*1.5;
        txt.x = x - 0.5*(ico.getBBox().width - txt.getBBox().width);
        ico.x = txt.x;
    };

    // reset the state of the bins
    this.reset = function() {
        bins = {"wid":[], "ele":[]};
    };

    // insert a new module into the bin
    this.addModule = function(ele) {
        this.translate(bins.wid.length, 2, ele["text"], ele["icon"]);
        if (!ele["modulename"]) { return; };
        let wid = ele["module"].getWidth();
        // for (let i=0; i<bins.wid.length; i++) {
        //     let thisWid = sumArray(bins.wid[i]);
        //     if (thisWid + wid <= 3) {
        //         bins.wid[i].push(wid);
        //         bins.ele[i].push(ele);
        //         return;
        //     };
        // };
        // bins.wid.push([wid]);
        // bins.ele.push([ele]);
        bins.wid.push(wid);
    };

    // re-arrange the modules so that they fit in the grid
    this.placeModules = function() {
        statsArea.y = 0.9*h;//*(10-bins.wid.length);
    };

    // // position modules based on the bin packing
    // let positionModules = function(moduleBins) {
    //     for (let i=0; i<moduleBins["wid"].length; i++) {
    //         let [x, y] = [0, h*0.1*(9-i)];
    //         statsArea.y = y;
    //         let theseMods = moduleBins["ele"][i];
    //         let theseWids = moduleBins["wid"][i];
    //         let maxWid = util.sumArray(theseWids);
    //         for (let j=0; i<theseMods.length; j++) {
    //             translate(x, maxWid, theseMods[j]["text"], theseMods[j]["icon"], y);
    //             x += theseWids[i];
    //         };
    //     };
    // };
};