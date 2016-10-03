import React from "react";

import BuildListDisplayContainer from "./build-list-display-container";

class BuildList extends React.Component {

  render() {
    let folder = "";
    if (this.props.data[this.props.currentScenario]) folder = this.props.data[this.props.currentScenario].scenario_folder;
    const filter = {
      "schemaDefinition.basedOn": "PlanningPoplet",
      "parents": {"$eq": folder}
    };

    return (
      <BuildListDisplayContainer filter={filter} options={{limit: 1000}} update={this.props.update} />
    );
  }

}

BuildList.propTypes = {
  data: React.PropTypes.array.isRequired,
  update: React.PropTypes.func.isRequired,
  currentScenario: React.PropTypes.number.isRequired
};

export default BuildList;