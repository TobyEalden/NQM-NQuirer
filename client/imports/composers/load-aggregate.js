import connectionManager from "../connection-manager";
import TDXApi from "nqm-api-tdx/client-api";
import {Meteor} from "meteor/meteor";

function loadAggregate({resourceId, pipeline}, onData) {
  const config = {
    commandHost: Meteor.settings.public.commandHost,
    queryHost: Meteor.settings.public.queryHost,
    accessToken: connectionManager.authToken
  };
  const api = new TDXApi(config);

  api.getAggregateData(resourceId, pipeline, {limit: 5000}, (err, response) => {
    onData(null, {data: response.data});
  });
 
}

export default loadAggregate;