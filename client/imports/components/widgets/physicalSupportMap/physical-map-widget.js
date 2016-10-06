import React from "react";

import MapContainer from "./physical-map-container";

class MapWidget extends React.Component {
  
  render() {
    let gender = [];
    if (this.props.male) gender.push("male");
    if (this.props.female) gender.push("female");
    const years = [new Date().getFullYear().toString(), this.props.year];

    const dataPipeline = '[{"$match":{"area_id":{"$in":#area_ids#},"year":{"$in":'+JSON.stringify(years) + '},"gender":{"$in":' + JSON.stringify(gender) + '},"age_band":{"$in":' + JSON.stringify(this.props.age_bands)+ '}}},{"$group":{"_id":"$area_id","year1":{"$sum":{"$cond":[{"$eq":["$year","' + years[0] + '"]},"$persons",0]}},"year2":{"$sum":{"$cond":[{"$eq":["$year","' + years[1] + '"]},"$persons",0]}}}}]';

    const geoPipeline = '[{"$match":{"parent_id":"' + this.props.regionId + '","child_type":"LSOA11CD"}},{"$group":{"_id":null,"id_array":{"$push":"$child_id"}}}]';

    return (
      <MapContainer popletDatasetId={this.props.popletDatasetId} dataPipeline={dataPipeline} geoPipeline={geoPipeline} lsoaId={this.props.lsoaId} update={this.props.update} centre={this.props.centre} vpp={this.props.vpp}/>
    );
  }


}

MapWidget.propTypes = {
  age_bands: React.PropTypes.array.isRequired,
  male: React.PropTypes.bool.isRequired,
  female: React.PropTypes.bool.isRequired,
  year: React.PropTypes.string.isRequired,
  lsoaId: React.PropTypes.string.isRequired,
  regionId: React.PropTypes.string.isRequired,
  popletDatasetId: React.PropTypes.string.isRequired,
  update: React.PropTypes.func.isRequired,
  centre: React.PropTypes.array.isRequired,
  vpp: React.PropTypes.number.isRequired
};

export default MapWidget;