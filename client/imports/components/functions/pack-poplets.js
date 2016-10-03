_ = lodash;

function packPoplets(lsoaData, populations, age_bands) {
  let poplets = [];
  _.each(populations, (population) => {
    _.each(lsoaData, (lsoa) => {
      let totalMale = 0;
      let totalFemale = 0;
      _.each(age_bands, (band) => {
        let male = population.population * lsoa.ratio  * band.male;
        totalMale += male;
        poplets.push ({
          area_name: lsoa.name,
          area_id: lsoa.area_id,
          age_band: band.range,
          gender: "male",
          year: String(population.year),
          persons: male,
          popId: "",
          popId_description: ""
        });
        let female = population.population * lsoa.ratio * band.female;
        totalFemale += female;
        poplets.push({
          area_name: lsoa.name,
          area_id: lsoa.area_id,
          age_band: band.range,
          gender: "female",
          year: String(population.year),
          persons: female,
          popId: "",
          popId_description: ""
        }); 
      });
      poplets.push({
        area_name: lsoa.name,
        area_id: lsoa.area_id,
        age_band: "All Ages",
        gender: "female",
        year: String(population.year),
        persons: totalFemale,
        popId: "",
        popId_description: ""
      });   
      poplets.push({
        area_name: lsoa.name,
        area_id: lsoa.area_id,
        age_band: "All Ages",
        gender: "male",
        year: String(population.year),
        persons: totalMale,
        popId: "",
        popId_description: ""
      }); 
    });
  });
  return poplets;
}

export default packPoplets;