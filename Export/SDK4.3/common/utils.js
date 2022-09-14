//Fetch the inbuilt modules
import { readFileSync, unlinkSync, writeFileSync } from "fs"

// Set some default values

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

export function updateColour(colour, ele) {
  try {
    ele.forEach(function(eles) {
      eles.style.fill = colour;
    });
  } catch(err) {
    ele.style.fill=colour;
  };
}

// Pad a value such that it has a defined length
export function zeroPad(val, def="00") {
  return (def + val.toString()).slice(-def.length);
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