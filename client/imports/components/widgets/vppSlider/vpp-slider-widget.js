import React from "react";
import {Meteor} from "meteor/meteor";

import VppSliderContainer from "./vpp-slider-container";

class VppSliderWidget extends React.Component {

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

    const dataPipeline = '[{"$match":{"area_id":{"$in":#area_ids#},"year":{"$eq":"'+ this.props.year + '"},"gender":{"$in":' + JSON.stringify(gender) + '},"age_band":{"$in":' + JSON.stringify(this.props.age_bands)+ '}}},{"$group":{"_id":null,"persons":{"$sum":"$persons"}}}]';
    
    const geoPipeline = '[{"$match":{"parent_id":"' + this.props.regionId + '","child_type":"LSOA11CD"}},{"$group":{"_id":null,"id_array":{"$push":"$child_id"}}}]';

    return (
      <VppSliderContainer vppId={Meteor.settings.public.vppDataId} popletDatasetId={this.props.popletDatasetId} vppFilter={vppFilter} geoPipeline={geoPipeline} dataPipeline={dataPipeline} update={this.props.update} vpp={this.props.vpp} />

    );
  }


}

VppSliderWidget.propTypes = {
  age_bands: React.PropTypes.array.isRequired,
  male: React.PropTypes.bool.isRequired,
  female: React.PropTypes.bool.isRequired,
  year: React.PropTypes.string.isRequired,
  regionId: React.PropTypes.string.isRequired,
  popletDatasetId: React.PropTypes.string.isRequired,
  update: React.PropTypes.func.isRequired,
  vpp: React.PropTypes.number.isRequired
};

export default VppSliderWidget;