// Import my modules
import * as astro from "../../common/astronomy";
import * as util from "../../common/utils";

// Import fitbit modules
import { me as device } from "device";

const w = device.screen.width; const h = device.screen.height; const maxy = 0.65*h; const maxw = 0.5*w

// some useful maths functions
function padHex(val) { return util.zeroPad(Math.round(val).toString(16)); };
function lerp(a,b,t=0) { return t<=0 ? a : t>=1 ? b : a*(1-t) + b*t; };
function lerpHex(a, b, t=0) {
    if (t<=0) { return a; }
    else if (t >= 1) { return b; }
    else {
        const [r1, g1, b1] = a.match(/\w\w/g).map(x => parseInt(x, 16));
        const [r2, g2, b2] = b.match(/\w\w/g).map(x => parseInt(x, 16));
        const r3 = lerp(r1, r2, t);
        const g3 = lerp(g1, g2, t);
        const b3 = lerp(b1, b2, t);
        return "#"+padHex(r3)+padHex(g3)+padHex(b3);
    };
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
    // positional elements
    this.obj = doc.getElementById(name);
    this.glow = doc.getElementById(name+"glow");
    this.rot = doc.getElementById(name+"rot");
    this.shadow = doc.getElementById(name+"shadow");
    // Update colour
    this.updateColour = function(y, sun_y=null) {
        // if this object is the moon, don't use the horizon colour if the sun is in the sky
        let colour_y = (sun_y == null || sun_y < 0.1 ? this.colourAlt*y : 1);
        let col = lerpHex(this.horizonColour, this.skyColour, colour_y);
        util.updateColour(this.obj, col);
        this.glow.gradient.colors.c1 = col;
        this.glow.style.opacity = (sun_y == null ? 1 : Math.max(0, (-90/9)*sun_y));
    };
    // update phases if given
    this.updatePhase = function(phase, frac) {
        this.shadow.href = "icons/moon_phase/moon_shade_"+Math.round(phase*56)%56+".png";
        this.rot.groupTransform.rotate.angle = 360*frac;
    };
    this.updatePos = function(x, y, sun_y=null) {
        this.obj.x = w*x;
        this.obj.y = maxy - maxw*y;
        // derive sky position
        this.updateColour(y, sun_y);
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
    // star opacity
    const dayStar = 0;
    const sunsetStar = 0.2;
    const nightStar = 0.8;

    // user position
    this.latitude = 51.5;
    this.longitude = -0.6

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
        let staropac = dayStar;
        if (y>0) {
            skycol = lerpHex(sunsetSky, daySky, sry);
            grasscol = lerpHex(sunsetGrass, dayGrass, sry);
            staropac = lerp(dayStar, sunsetStar, sry);
        }
        // lerp between sunrise/set colour and night colour for the 18 degrees below the horizon.
        else {
            skycol = lerpHex(sunsetSky, nightSky, (-90/18)*y);
            grasscol = lerpHex(sunsetGrass, nightGrass, (-90/18)*y);
            staropac = lerp(sunsetStar, nightStar, (-90/18)*y);
        };
        util.updateColour(skyObj, skycol);
        util.updateColour(grassObj, grasscol);
        util.updateOpacity(starObj, staropac);
    };

    this.ontick = function(now) {
        let dayfrac = astro.dayFrac(now);
        let astrofrac = astro.astroYearFrac(now);
        let tilt = 23.5*Math.sin(Math.PI*2*astrofrac);
        // compute the position of the sun
        let solar_high = 1 - Math.abs(this.latitude - tilt)/90;
        let solar_low = Math.abs(this.latitude + tilt)/90 - 1;
        let solar_rad = 0.5*(solar_high-solar_low);
        let solar_cen = 0.5*(solar_high+solar_low);
        let sunx = dayfrac; let suny = solar_cen - solar_rad*Math.cos(2*Math.PI*sunx);
        // compute the position of the moon
        let lunar_phase = astro.lunarPhase(now);
        let lunar_inc = astro.lunarInc(now)/90;
        let moonx = (dayfrac - lunar_phase)%1;
        let moony = solar_cen + lunar_inc - solar_rad*Math.cos(2*Math.PI*moonx);
        // change the background colour
        bgCol(suny);
        // update the positions of the sun and moon
        sunObj.updatePos(sunx, suny);
        moonObj.updatePos(moonx, moony, suny);
        // rotate the starfield and moon
        starRot.groupTransform.rotate.angle = 360*(dayfrac + astrofrac);
        moonObj.updatePhase(lunar_phase, moonx);
    };
};