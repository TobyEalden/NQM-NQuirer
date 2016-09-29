import connectionManager from "../connection-manager";
import TDXApi from "nqm-api-tdx/client-api";
import {Meteor} from "meteor/meteor";

function loadResourceData({resourceId, filter, options}, onData) {
  const config = {
    commandHost: Meteor.settings.public.commandHost,
    queryHost: Meteor.settings.public.queryHost,
    accessToken: connectionManager.authToken
  };
  const api = new TDXApi(config);
  api.getDatasetData(resourceId, filter, null, options, (err, response) => {
    if (err) console.log("Failed to get data: ", err);
    else onData(null, {geoData: response.data});
  });
}

export default loadResourceData;