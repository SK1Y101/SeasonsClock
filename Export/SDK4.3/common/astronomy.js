// Define some standard Maths shorthands
export function deg2rad(deg) { return deg * Math.PI / 180; };
export function rad2deg(rad) { return rad * 180 / Math.PI; };
export function sin(deg) { return Math.sin(deg2rad(deg)); };
export function cos(deg) { return Math.cos(deg2rad(deg)); };
export function tan(deg) { return Math.tan(deg2rad(deg)); };
export function asin(num) { return rad2deg(Math.asin(num)); };
export function acos(num) { return rad2deg(Math.acos(num)); };
export function atan(num) { return rad2deg(Math.atan(num)); };

// Define some helper functions.
function J2000(now) {
    return Math.round((now.getTime() - new Date("01/01/2000 12:00").getTime()) / 86400000);
};
function J2Date(JDate) {
    return new Date((JDate - 2440587.5)*86400000);
};
export function dayFrac(date) {
    return (date - new Date(date.valueOf()).setUTCHours(0,0,0,0))/86400000;
};
export function leapYear(date) {
    return (new Date(this_year,0,0) - new Date(date.getFullYear()-1,0,0)) == 366;
};
export function daysThisYear(date) {
    return new Date(this_year,0,0) - new Date(date.getFullYear()-1,0,0);
};
export function yearFrac(date) {
    return (date - new Date(date.getFullYear(),0,0))/daysThisYear(date);
};
export function astroYearFrac(date) {
    const equinox = leapYear(date) ? 80/366 : 79/365;
    return (yearFrac(date)-equinox)%1;
};
//aproximate the motion of the moon
export function lunarPhase(date) {
    // provides the phase of the moon, 0->1 (new->new)
    let synodic = 29.530589 * 86400000;
    let newmoon = new Date(2023,3,20,5,12);
    let phase = Math.abs((date.getTime() - newmoon.getTime()) / synodic);
    return phase - Math.floor(phase);
};
export function lunarInc(date) {
    // provides the effective inclination of the moon, 0->5.15->0->-5.15->0
    let sidereal = 27.321661 * 86400000;
    // http://www.astropixels.com/ephemeris/moon/moonnodes2001.html
    let moonnode = new Date(2023,3,20,11,32);
    let inc = Math.abs((date.getTime() - moonnode.getTime()) / sidereal);
    return Math.sin(2*Math.PI*inc) * 5.15;
};

// Determine whether the user is currently experiencing DST
function DST(now) {
    let jan = new Date(now.getFullYear(), 0, 1).getTimezoneOffset();
    let jul = new Date(now.getFullYear(), 6, 1).getTimezoneOffset();
    return Math.max(jan, jul) !== now.getTimezoneOffset();    
};

// approximate the time of sunrise, noon, and sunset, given current gps coordinates.
export function sunPos(now, lat=0, lon=0) {
    // https://en.wikipedia.org/wiki/Sunrise_equation
    // Compute the declination of the sun, and the solar noon time.
    const n = J2000(now);
    const J = n - lon/360;
    const M = (357.5291 + 0.98560028*J)%360;
    const C = 1.9148*sin(M) + 0.02*sin(2*M) + 0.0003*sin(3*M);
    const λ = (M+C+180+102.9371) % 360;
    const Jt = 2451545 + J + 0.0053*sin(M) - 0.0069*sin(2*λ);// + now.getTimezoneOffset();
    const Jth = 24 * dayFrac(J2Date(Jt));
    const dec = asin(sin(λ) * sin(23.44));
    // Reused values
    const sinLatDec = sin(lat) * sin(dec);
    const cosLatDec = cos(lat) * cos(dec);
    // Compute the hour angle of different points of time.
    // const astroW = acos((sin(-18) - sinLatDec) / cosLatDec);
    // const nauticalW = acos((sin(-12) - sinLatDec) / cosLatDec);
    // const civilW = acos((sin(-6) - sinLatDec) / cosLatDec);
    // const sunriseW = acos((sin(-0.83) - sinLatDec) / cosLatDec);
    // compute the altitude of the sun at midday/midnight.
    // const a_noon = asin(sinLatDec + cosLatDec*cos(15*(Jth-12)));
    // const a_midnight = asin(sinLatDec + cosLatDec*cos(15*Jth));
    // compute the times for each event and return
    return {
        "noon":         J2Date(Jt),
        // "sunrise":      J2Date(Jt - sunriseW/360),
        // "sunset":       J2Date(Jt + sunriseW/360),
        // "civilrise":    J2Date(Jt - civilW/360),
        // "civilset":     J2Date(Jt + civilW/360),
        // "nauticalrise": J2Date(Jt - nauticalW/360),
        // "nauticalset":  J2Date(Jt + nauticalW/360),
        // "astrorise":    J2Date(Jt - astroW/360),
        // "astroset":     J2Date(Jt + astroW/360),
        "sinLatDec":    sinLatDec,
        "cosLatDec":    cosLatDec,
    };
};