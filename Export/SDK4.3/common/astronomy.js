// Define some standard Maths shorthands
function deg2rad(deg) { return deg * Math.PI / 180; };
function rad2deg(rad) { return rad * 180 / Math.PI; };
function sin(deg) { return Math.sin(deg2rad(deg)); };
function cos(deg) { return Math.cos(deg2rad(deg)); };
function tan(deg) { return Math.tan(deg2rad(deg)); };
function asin(num) { return rad2deg(Math.asin(num)); };
function acos(num) { return rad2deg(Math.acos(num)); };
function atan(num) { return rad2deg(Math.atan(num)); };

// Define some helper functions.
function J2000(now) {
    return Math.round((now.getTime() - new Date("01/01/2000 12:00").getTime()) / 86400000);
};
function J2Date(JDate) {
    return new Date((JDate - 2440587.5)*86400000);
};

// Determine whether the user is currently experiencing DST
function DST(now) {
    let jan = new Date(now.getFullYear(), 0, 1).getTimezoneOffset();
    let jul = new Date(now.getFullYear(), 6, 1).getTimezoneOffset();
    return Math.max(jan, jul) !== now.getTimezoneOffset();    
};

// approximate the time of sunrise, noon, and sunset, given current gps coordinates.
function sunRise(now, lat, lon, sunAng=-0.83) {
    const n = J2000(now);
    const J = n - lon/360;
    const M = (357.5291 + 0.98560028*J)%360;
    const C = 1.9148*sin(M) + 0.02*sin(2*M) + 0.0003*sin(3*M);
    const λ = (M+C+180+102.9371) % 360;
    const Jt = 2451545 + J + 0.0053*sin(M) - 0.0069*sin(2*λ);// + now.getTimezoneOffset();
    const dec = asin(sin(λ) * sin(23.44));
    const w = acos((sin(sunAng) - sin(lat) * sin(dec)) / (cos(lat) * cos(dec)));
    // Compute the rise and set times
    const JRise = Jt - w/360;
    const JSet = Jt + w/360;
    return [J2Date(JRise), J2Date(Jt), J2Date(JSet)];
};

// const [now, lat, lon] = [new Date(), 50.8768, -0.7867];
// const [SRise, SNoon, SSet] = sunRise(now, lat, lon);
// // Update header text
// console.log(SRise);
// // Update header text
// document.querySelector('#header').innerHTML = SRise;