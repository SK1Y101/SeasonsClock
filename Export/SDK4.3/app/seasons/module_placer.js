// Import fitbit modules
import { me as device } from "device";

export let modulePlacer = function(doc) {
    const statsArea = doc.getElementById("statsArea");
    const w = device.screen.width;
    const h = device.screen.height;
    let bins = {"wid":[], "ele":[]};

    // sum all of the values in an array
    let sumArray = function(arr) {
        if (typeof(floatVar) == 'number') { return arr; };
        let sum = 0;
        if (Array.isArray(arr)) { for (let e of arr) { sum += e; }; };
        return sum;
    };

    // move the text and icon to a location given module number
    this.translate = function(i, wid, txt, ico, y=0.9*h) {
        let x = i < wid ? w * (2*i + 1) / Math.max(2, 2*wid) : w * 1.5 ;
        // 1 width: [1/2],
        // 2 width: [1/4, 3/4];
        // 3 width: [1/6, 3/6, 5/6];
        txt.x = x - 0.5*(ico.getBBox().width - txt.getBBox().width);
        ico.x = txt.x;
        // ensure the icon and text are actually at the same y level
        ydif = ico.y - txt.y;
        txt.y = y + ydif;
        ico.y = y;
    };

    // reset the state of the bins
    this.reset = function() {
        bins = {"wid":[], "ele":[]};
    };

    // insert a new module into the bin
    this.addModule = function(ele) {
        let wid = ele["module"].getWidth();
        let i = 0;
        for (let bwid of bins.wid) {
            if (sumArray(bwid) + wid <= 3) {
                bins.wid[i].push(wid);
                bins.ele[i].push(ele);
                return;
            };
            i++;
        };
        bins.wid.push([0, wid]);
        bins.ele.push([0, ele]);
    };

    // re-arrange the modules so that they fit in the grid
    this.placeModules = function() {
        statsArea.y = h*(1-0.1*bins.wid.length);
        // for each row
        let i = 0;
        for (let wid of bins.wid) {
            let maxwid = sumArray(wid);
            let y = h*(0.9-0.1*i);
            let j = 0;
            for (let ele of bins.ele[i]) {
                this.translate(wid[j++], maxwid, ele["text"], ele["icon"], y);
            };
            i++;
        };
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