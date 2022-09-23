//Fetch the inbuilt modules
import { readFileSync, unlinkSync, writeFileSync } from "fs"

// Pad a value such that it has a defined length
export function zeroPad(val, def="00") {
  return (def + val.toString()).slice(-def.length);
};

// Get the widths of any number of elements
export function getWidth(args=[]) {
  let wid = 0;
  for (let arg of args) { wid += arg.getBBox().width; };
  return Math.min(3, Math.ceil(wid / 100));
};

// Change the z axis height
export function changeLayer(ele, layer) {
  try {
    try {
      ele.forEach(function(eles) {
        eles.layer = layer;
      });
    } catch(err) {
      ele.layer = layer;
    };
  } catch(err) {
    console.log(err + ": Couldn't assign layer '" + layer + "'")
  };
};

// animate an element
export function animateElement(ele, trigger) {
  try {
    try {
      ele.forEach(function(eles) {
        eles.animate(trigger);
      });
    } catch(err) {
      ele.animate(trigger);
    };
  } catch(err) {
    console.log(err + ": Couldn't trigger animation '" + trigger + "'")
  };
};

// Hide or show a set of gui elemetns
export function showElement(ele, val) {
  try {
    try {
      ele.forEach(function(eles) {
        eles.style.display = (val ? "inline" : "none");
      });
    } catch(err) {
      ele.style.display = (val ? "inline" : "none");
    };
  } catch(err) {
    console.log(err + ": Couldn't trigger animation '" + trigger + "'")
  };
};

export function updateColour(ele, colour) {
  try {
    ele.forEach(function(eles) {
      eles.style.fill = colour;
    });
  } catch(err) {
    ele.style.fill=colour;
  };
}

// set the text of an element
export function setText(ele, text) {
  try {
    ele.forEach(function(eles) {
      eles.style.textLength = text.length;
      eles.text = text;
    });
  } catch(err) {
    ele.style.textLength = text.length;
    ele.text = text;
  };
};

// Force a field to be an array
export function forceArray(arr) {
  if (typeof(arr) !== "object") {
    return [arr];
  }
  return arr;
};

// Save data to the watch
export function saveData(filename,data,overwriteFilename) {
  try {
    filename = (overwriteFilename ? "" : "_skiylian_") + filename;
    writeFileSync(filename, data, "cbor");
  } catch(err) {
    console.log(err + ": save "+filename);
  };
};

// Fetch data saved to the disk
export function loadData(filename,defaults,overwriteFilename) {
  try {
    filename = (overwriteFilename ? "" : "_skiylian_") + filename;
    defaults = readFileSync(filename, "cbor");
  } catch(err) {
    console.log(err + ": fetch "+filename);
  };
  return defaults;
};

// Remove data saved to the disk
export function removeData(fName,defName) {
  try {
    filename = (defName ? "" : "_skiylian_") + fName;
    unlinkSync(fName);
  } catch(err) {
    logerror(err,"remove "+fName);
  };
};

// fetch the date as a nicely formatted string
export function dateString(now, format) {
  let datestring = format;
  // arrays of things
  const longMonth = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const shortMonth = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"," Aug", "Sept", "Oct", "Nov", "Dec"];
  const longDay = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const shortDay = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
  // fetch used quantities
  const NDay = zeroPad(now.getDate());
  const SDay = shortDay[now.getDay()];
  const LDay = longDay[now.getDay()];
  const NMon = zeroPad(now.getMonth()+1);
  const SMon = shortMonth[now.getMonth()];
  const LMon = longMonth[now.getMonth()];
  // formatting
  return datestring.replace("dayNum", NDay).replace("dayShort", SDay).replace("dayLong", LDay).replace("monthNum", NMon).replace("monthShort", SMon).replace("monthLong", LMon);
};