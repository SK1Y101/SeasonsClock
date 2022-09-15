import * as util from "../../common/utils";
import { batteryIndicator } from "./battery";

export let statsDisaply = function(doc, settings) {
    // Determine the number of stats displays requested
    // Determine Which modules are requested
    // Load those modules
    // Pass the elements to each module
    // Change the display to show those modules

    const text1 = doc.getElementById("stat1");
    const icon1 = doc.getElementById("icon1");

    let batInd = new batteryIndicator(text1, icon1);
}