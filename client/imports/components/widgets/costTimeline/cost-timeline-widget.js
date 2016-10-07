import React from "react";
import {Meteor} from "meteor/meteor";

import CostTimelineContainer from "./cost-timeline-container";

class CostTimelineWidget extends React.Component {

  render() {

    const vppFilter = { 
      ONSCD: {
        "$eq": this.props.regionId
      },
      Line: {
        "$eq": 332
      }
    };

    let gender = [];
    if (this.props.male) gender.push("male");
    if (this.props.female) gender.push("female");
    
    const dataPipeline = '[{"$match":{"area_id":{"$in":#area_ids#},"gender":{"$in":' + JSON.stringify(gender) + '},"age_band":{"$in":' + JSON.stringify(this.props.age_bands) + '}}},{"$group":{"_id":"$year","persons":{"$sum":"$persons"}}}]';

    const geoPipeline = '[{"$match":{"parent_id":"' + this.props.regionId + '","child_type":"LSOA11CD"}},{"$group":{"_id":null,"id_array":{"$push":"$child_id"}}}]';
    
    return (
      <CostTimelineContainer wgtId={this.props.wgtId} vpp={this.props.vpp} popletDatasetId={this.props.popletDatasetId} vppFilter={vppFilter} geoPipeline={geoPipeline} dataPipeline={dataPipeline} vppId={Meteor.settings.public.vppDataId} />
    );
  }

}

CostTimelineWidget.propTypes = {
  age_bands: React.PropTypes.array.isRequired,
  male: React.PropTypes.bool.isRequired,
  female: React.PropTypes.bool.isRequired,
  regionId: React.PropTypes.string.isRequired,
  popletDatasetId: React.PropTypes.string.isRequired,
  wgtId: React.PropTypes.string.isRequired,
  vpp: React.PropTypes.number.isRequired
};

export default CostTimelineWidget;