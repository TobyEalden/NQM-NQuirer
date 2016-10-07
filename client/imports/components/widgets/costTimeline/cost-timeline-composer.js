import connectionManager from "../../../connection-manager";
import TDXApi from "nqm-api-tdx/client-api";
import {Meteor} from "meteor/meteor";

_ = lodash;

function loadVppData({popletDatasetId, dataPipeline, geoPipeline, vppFilter, vppId}, onData) {
  const config = {
    commandHost: Meteor.settings.public.commandHost,
    queryHost: Meteor.settings.public.queryHost,
    accessToken: connectionManager.authToken
  };
  const api = new TDXApi(config);

  api.getAggregateData(Meteor.settings.public.regionToLsoaId, geoPipeline, {limit: 5000}, (err, response) => {
    if (err) console.log("Failed to map region to lsoas: ", err);
    else {
      const lsoaArray = response.data[0].id_array;

      dataPipeline = dataPipeline.replace("#area_ids#", JSON.stringify(lsoaArray));
      api.getAggregateData(popletDatasetId, dataPipeline, {limit: 5000}, (err, response) => {
        if(err) console.log("Failed to get poplet data: ", err);
        else {
          const years = response.data;
          api.getDatasetData(vppId, vppFilter, null, {limit:1}, (err, response) => {
            if (err) console.log("Failed to get vpp data");
            else {
              
              onData(null, {years: years, data: response.data});
            }
          });   
        }
      });

    }
  });

}

export default loadVppData;