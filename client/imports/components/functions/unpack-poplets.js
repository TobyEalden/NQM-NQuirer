import { Meteor } from "meteor/meteor";

_ = lodash;

function unpackPoplets(poplets) {
  if (poplets.length != 0) {
    let years = {};
    let lsoas = {};
    _.each(poplets, (poplet) => {
      let y = parseInt(poplet.year,10);
      if (poplet.age_band === "All Ages") {
        if (years[y]) years[y] += poplet.persons;
        else years[y] = poplet.persons;
        if (lsoas[poplet.area_id]) lsoas[poplet.area_id].population += poplet.persons;
        else {
          lsoas[poplet.area_id] = {};
          lsoas[poplet.area_id].population = poplet.persons;
          lsoas[poplet.area_id].name = poplet.area_name;
        }
      }
    });

    const populations = _.map(years, (population, year) => {
      return {year: year, population: Math.round(population)};
    });
    const totalPop = _.sumBy(populations, (year) => {
      return year.population;
    });
    const lsoaData = _.map(lsoas, (data, id) => {
      return {area_id: id, ratio: data.population/totalPop, name: data.name, locked: true};
    });
    let bands = _.filter(poplets, (poplet) => {
      if (poplet.area_id === lsoaData[0].area_id && poplet.year === populations[0].year) return true;
      else return false;
    });
    const all_ages = _.remove(bands, (band) => {
      if (band.age_band === "All Ages") return true;
      else return false;
    });
    bands = _.groupBy(bands, (band) => {
      return band.age_band;
    });
    let total = all_ages[0].persons + all_ages[1].persons;
    const age_bands = _.map(bands, (data, band) => {
      let male, female;
      if (data[0].gender === "male") {
        male = data[0].persons;
        female = data[1].persons;
      }
      else {
        male = data[1].persons;
        female = data[0].persons;
      }
      return {range: band, male: male/total, female: female/total, lockedMale: true, lockedFemale: true};
    });
    const state = {
      lsoaData: lsoaData,
      populations: populations,
      age_bands: age_bands,
      open: false,
      message: ""
    };

    return state;
  }
  else return {
    lsoaData: [],
    populations: [{year: new Date().getFullYear().toString(), population: 0}],
    age_bands: _.map(Meteor.settings.public.age_bands, (band) => {
      return { range: band, female: 1/(2*Meteor.settings.public.age_bands.length), male: 1/(2*Meteor.settings.public.age_bands.length), lockedMale: false, lockedFemale: false };
    }),
    open: false,
    message: ""
  };
}

export default unpackPoplets;