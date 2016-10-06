import connectionManager from "../connection-manager";
import TDXApi from "nqm-api-tdx/client-api";
import {Meteor} from "meteor/meteor";

function loadUserData({}, onData) {
  const config = {
    commandHost: Meteor.settings.public.commandHost,
    queryHost: Meteor.settings.public.queryHost,
    accessToken: connectionManager.authToken
  };
  const api = new TDXApi(config);

  api.getDatasets({"parents": {"$in":[Meteor.settings.public.appFolderId]}, "schemaDefinition.basedOn": "Nquireruserinfo"}, null, null, (err, response) => {
    if (err) console.log("Could not find user in database ", err);
    else {
      api.getDatasetData(response[0].id, null, null, null, (err, response) => {
        if (err) console.log("Failed to get data: ", err);
        else onData(null, {userData: response.data[0]});
      });
    }
  });

}

export default loadUserData;