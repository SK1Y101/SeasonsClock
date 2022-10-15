// Import my modules
import * as astro from "../../common/astronomy";
import * as util from "../../common/utils";

// Import fitbit modules
import { me as device } from "device";

export let Background = function(doc) {
    this.midday = 0.5;
    this.midnight = -0.499;
    const sunObj = doc.getElementById("sun");
    const sunGlow = doc.getElementById("sunglow");
    const moonObj = doc.getElementById("moon");
    const moonGlow = doc.getElementById("moonglow");
    const grassObj = doc.getElementById("grass");
    const skyObj = doc.getElementById("background");
    const w = device.screen.width;
    const h = device.screen.height;
    const maxy = 0.7*h;

    // sun colour
    const daySun = "#fff673";
    const riseSun = "#ff6352";
    // moon colour
    const nightMoon = "#d1d7d7";
    const riseMoon = "#ff0000";
    // ground colour
    const dayGrass = "#008013";
    const sunsetGrass = "#3A6152";
    const nightGrass = "#0F3325";
    // sky colour
    const daySky = "#87ceeb";
    const sunsetSky = "#51a4d0";
    const nightSky = "#0b1026";

    function padHex(val) { return util.zeroPad(Math.round(val).toString(16)); };
    function lerp(a,b,t=0) { return t<=0 ? a : t>=1 ? b : a*(1-t) + b*t; };
    function lerpn(a,t=0) {
        let n = a.length; let t1 = n*t; let i = Math.floor(t1); let d = t1-i;
        return t<=0 ? a[0] : t>=1 ? a[n-1] : lerp(a[i], a[i+1], d);
    };

    function lerpHex(a, b, t=0) {
        const [r1, g1, b1] = a.match(/\w\w/g).map(x => parseInt(x, 16));
        const [r2, g2, b2] = b.match(/\w\w/g).map(x => parseInt(x, 16));
        const r3 = lerp(r1, r2, t);
        const g3 = lerp(g1, g2, t);
        const b3 = lerp(b1, b2, t);
        return "#"+padHex(r3)+padHex(g3)+padHex(b3);
    };
    function lerpNHex(a,t=0) {
        let n = a.length; let t1 = n*t; let i = Math.floor(t1); let d = t1-i;
        return t<=0 ? a[0] : t>=1 ? a[n-1] : lerpHex(a[i], a[i+1], d);
    };

    function sunSkyCol(y) {
        // sunrise/set colour starts 9 degrees above horizon
        let sry = (90/9)*y;
        let suncol = lerpHex(riseSun, daySun, sry);
        // sky colour at different times
        let skycol = daySky;
        let grasscol = dayGrass;
        if (y>0) {
            skycol = lerpHex(sunsetSky, daySky, sry);
            grasscol = lerpHex(sunsetGrass, dayGrass, sry);
        }
        else {
            skycol = lerpHex(sunsetSky, nightSky, (-90/18)*y);
            grasscol = lerpHex(sunsetGrass, nightGrass, (-90/18)*y);
        };
        util.updateColour(skyObj, skycol);
        util.updateColour(sunObj, suncol);
        util.updateColour(grassObj, grasscol);
        sunGlow.gradient.colors.c1 = suncol;
    };
    function moonCol(y) {
        let mooncol = lerpHex(riseMoon, nightMoon, (90/9)*(y));
        util.updateColour(moonObj, mooncol);
        moonGlow.gradient.colors.c1 = "mooncol";
    };

    this.ontick = function(now) {
        let n = this.midday;
        let m = this.midnight;
        let dayfrac = 2*(astro.dayFrac(now)-0.25); // -.5 >= dayfrac >= 1.5
        let y = 0.5*(Math.sin(Math.PI*dayfrac)+1)*(n-m)+m;
        sunObj.x = w*dayfrac;
        sunObj.y = maxy*(1-y);
        moonObj.x = w*((dayfrac+1.5)%2-.5);
        moonObj.y = maxy*(1+y);
        sunSkyCol(y);
        moonCol(-y);
    };
};