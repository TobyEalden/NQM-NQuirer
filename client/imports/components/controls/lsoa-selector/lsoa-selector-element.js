import React from "react";
import { Meteor } from "meteor/meteor";

import LsoaSelectorContainer from "./lsoa-selector-container";

class LsoaSelectorElement extends React.Component {

  shouldComponentUpdate(nextProps) {
    if (nextProps.regionId === this.props.regionId) return false;
    else return true;
  }

  render() {

    const pipeline = '[{"$match":{"parent_id":"' + this.props.regionId + '","child_type":"LSOA11CD"}},{"$group":{"_id":null,"id_array":{"$push":"$child_id"}}}]';

    return (
      <LsoaSelectorContainer resourceId={Meteor.settings.public.regionToLsoaId} update={this.props.update} pipeline={pipeline} />
    );
  }
}

LsoaSelectorElement.propTypes = {
  update: React.PropTypes.func.isRequired,
  regionId: React.PropTypes.string.isRequired
};

export default LsoaSelectorElement;