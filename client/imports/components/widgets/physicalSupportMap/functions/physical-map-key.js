import {Meteor} from "meteor/meteor";

_ = lodash;

function mapKey(data, geoData, vpp) {

  let sortedDeltas = [];

  for (let i = 0; i < data.length; i++) {
    let area = _.find(geoData, (lsoa) => {
      if (lsoa.properties.LSOA11CD === data[i]._id) return true;
      else return false;
    }).properties.area;

    sortedDeltas.push((data[i].year2 - data[i].year1) * vpp);
  }

  sortedDeltas.sort();

  let hop = Math.floor(sortedDeltas.length/Meteor.settings.public.heatMapKey.length);
  let deltaKey = [];
  for (let i = hop; i < sortedDeltas.length; i += hop) deltaKey.push(sortedDeltas[i]);
  

  return {
    deltaKey: deltaKey,
    maxDelta: sortedDeltas[sortedDeltas.length - 1],
    minDelta: sortedDeltas[0]
  };
}

export { mapKey };