export let modulePlacer = function() {
    const statsArea = doc.getElementById("statsArea");
    const w = device.screen.width;
    const h = device.screen.height;
    let bins = [];

    // move the text and icon to a location given module number
    this.translate = function(i, wid, txt, ico, y=0.9*h) {
        let x = i < wid ? w * (i + 1) / (wid + 1) : w*1.5;
        txt.x = x - 0.5*(ico.getBBox().width - txt.getBBox().width);
        ico.x = txt.x;
        txt.y = y;
        ico.y = y;
    };

    // insert a new module into the bin
    this.addModule = function(ele) {
        this.translate(bins.length, 2, ele["text"], ele["icon"]);
        bins.push(0);
    };

    // re-arrange the modules so that they fit in the grid
    this.placeModules = function() {
        statsArea.y = h*0.9;
    };

    // // Determine the position of a module element
    // let positionModule = function(ele, moduleBins) {
    //     let wid = ele["module"].getWidth();
    //     for (let i=0; i<moduleBins["wid"].length; i++) {
    //         // if it fits in the i'th bin
    //         if (util.sumArray(moduleBins["wid"][i]) + wid <= 3) {
    //             moduleBins["wid"][i].push(wid);
    //             moduleBins["ele"][i].push(ele);
    //             return moduleBins;
    //         };
    //     };
    //     // if it did not fit into any bin
    //     moduleBins["wid"].push([wid]);
    //     moduleBins["ele"].push([ele]);
    //     return moduleBins;
    // };

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