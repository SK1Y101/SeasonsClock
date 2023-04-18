// Import my modules
import * as astro from "../../common/astronomy";
import * as util from "../../common/utils";

// Import fitbit modules
import { me as device } from "device";

const w = device.screen.width; const h = device.screen.height; const maxy = 0.7*h;

// some useful maths functions
function padHex(val) { return util.zeroPad(Math.round(val).toString(16)); };
function lerp(a,b,t=0) { return t<=0 ? a : t>=1 ? b : a*(1-t) + b*t; };
function lerpHex(a, b, t=0) {
    const [r1, g1, b1] = a.match(/\w\w/g).map(x => parseInt(x, 16));
    const [r2, g2, b2] = b.match(/\w\w/g).map(x => parseInt(x, 16));
    const r3 = lerp(r1, r2, t);
    const g3 = lerp(g1, g2, t);
    const b3 = lerp(b1, b2, t);
    return "#"+padHex(r3)+padHex(g3)+padHex(b3);
};

// A sky crossing object
let skyObject = function(doc, name, skycolour, horizoncolour, colouralt) {
    // name: The name of the object in the .gui file
    // skycolour: The colour of the object when high above the horizon
    // horizoncolour: The colour of the object at the horizon
    // colour alt: the normalised angle (x/90) on the sky at which the object is it's high altitude colour.
    //              ie: an angle of 0.1, or 9/90 means at 9 degrees above the horizon,
    //                  the object has it's day/night colour rather than rise/set
    // variable defintions
    this.colourAlt = 1 / colouralt;
    this.skyColour = skycolour;
    this.horizonColour = horizoncolour;
    // get elements
    this.obj = doc.getElementById(name);
    this.glow = doc.getElementById(name+"glow");
    // Update colour
    this.updateColour = function(y) {
        let col = lerpHex(this.horizonColour, this.skyColour, this.colourAlt*y);
        util.updateColour(this.obj, col);
        this.glow.gradient.colors.c1 = col;
    };
    // Update position
    this.updatePos = function(x, y) {
        // x and y are normalised fractions of the viewport
        this.obj.x = w*x;
        this.obj.y = maxy*(1-y);
        this.updateColour(y);
    };
};

// The module to export
export let Background = function(doc) {
    // moving objects
    const sunObj = new skyObject(doc, "sun", "#fff673", "#ff6352", 9/90);
    const moonObj = new skyObject(doc, "moon", "#d1d7d7", "#ff0000", 9/90);
    // bg objects
    const grassObj = doc.getElementById("grass");
    const skyObj = doc.getElementById("background");
    const starObj = doc.getElementById("star_fill");
    const starRot = doc.getElementById("star_rot");
    starObj.y = 0.6*maxy;
    // ground colour
    const dayGrass = "#008013";
    const sunsetGrass = "#3A6152";
    const nightGrass = "#0F3325";
    // sky colour
    const daySky = "#87ceeb";
    const sunsetSky = "#51a4d0";
    const nightSky = "#0b1026";
    // star colour
    const dayStar = daySky;
    const sunsetStar = sunsetSky;
    const nightStar = "#d1d7d7";

    // astro object properties
    this.solar_high_h = 0.5 // fraction of viewport
    this.solar_high_t = 0.5 // 0 = 0, 0.5 = 12:00, 1 = 24:00
    this.solar_low_h = -0.5
    this.solar_low_t = 0

    this.lunar_high_h = 0.5 // fraction of viewport
    this.lunar_high_t = 1 // 0 = 0, 0.5 = 12:00, 1 = 24:00
    this.lunar_low_h = -0.5
    this.lunar_low_t = 0.5

    // this.lunar_phase = (this.lunar_high_t-this.solar_high_t)%1  // 0 = new, 0.5 = full, 1 = new

    // function lerpn(a,t=0) {
    //     let n = a.length; let t1 = n*t; let i = Math.floor(t1); let d = t1-i;
    //     return t<=0 ? a[0] : t>=1 ? a[n-1] : lerp(a[i], a[i+1], d);
    // };
    // function lerpNHex(a,t=0) {
    //     let n = a.length; let t1 = n*t; let i = Math.floor(t1); let d = t1-i;
    //     return t<=0 ? a[0] : t>=1 ? a[n-1] : lerpHex(a[i], a[i+1], d);
    // };

    function bgCol(y) {
        // sunrise/set colour starts 9 degrees above horizon
        let sry = (90/9)*y;
        // sky colour at different times
        let skycol = daySky;
        let grasscol = dayGrass;
        let starcol = dayStar;
        if (y>0) {
            skycol = lerpHex(sunsetSky, daySky, sry);
            grasscol = lerpHex(sunsetGrass, dayGrass, sry);
            starcol = lerpHex(sunsetStar, dayStar, sry);
        }
        else {
            skycol = lerpHex(sunsetSky, nightSky, (-90/18)*y);
            grasscol = lerpHex(sunsetGrass, nightGrass, (-90/18)*y);
            starcol = lerpHex(sunsetStar, nightStar, (-90/18)*y);
        };
        util.updateColour(skyObj, skycol);
        util.updateColour(grassObj, grasscol);
        util.updateColour(starObj, starcol);
    };

    function xy(now, high_h=0.5, high_t=0.5, low_h=-0.5, low_t=1) {
        // how far through it's 'day' is this object
        let day_len = 2*(Math.max(high_t, low_t)-Math.min(high_t, low_t));
        let skyfrac = 2*((astro.dayFrac(now) + (high_t-0.5))%day_len - 0.25);// -.5 >= dayfrac >= 1.5
        return [skyfrac, 0.5*(Math.sin(Math.PI*skyfrac)+1)*(high_h-low_h)+low_h];
    };

    this.ontick = function(now) {
        // update the sun and moon positions
        const [sunx, suny] = xy(now, this.solar_high_h, this.solar_high_t, this.solar_low_h, this.solar_low_t);
        const [moonx, moony] = xy(now, this.lunar_high_h, this.lunar_high_t, this.lunar_low_h, this.lunar_low_t);
        sunObj.updatePos(sunx, suny);
        moonObj.updatePos(moonx, moony);
        // change the background colour
        bgCol(suny);
        // rotate the starfield
        starRot.groupTransform.rotate.angle = 360*astro.dayFrac(now);
    };
};