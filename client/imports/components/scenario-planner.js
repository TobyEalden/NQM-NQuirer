import React from "react";
import {Meteor} from "meteor/meteor";
_ = lodash;

import TextField from "material-ui/TextField";
import Add from "material-ui/svg-icons/content/add";

import ScenarioList from "./widgets/scenarioList/scenario-list-container";
import BuildList from "./widgets/buildList/build-list-container";

class ScenarioPlanner extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      scenario: 0,
      scenarioName: "",
      buildName: "",
      resultPop: false,
      message: "",
      scenarioError: "",
      buildError: ""
    }

    this.changeScenario = this.changeScenario.bind(this);
    this.addScenario = this.addScenario.bind(this);
    this.scenarioName = this.scenarioName.bind(this);
    this.buildName = this.buildName.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.openBuild = this.openBuild.bind(this);

  }

  changeScenario(event) {
    let found = false;
    let elem = event.target.parentNode;
    while (!found) {
      if (elem.id != "") found = true;
      else elem = elem.parentNode;
    }
    this.setState({
      scenario: parseInt(elem.id, 10)
    });
  }

  addScenario() {
    if (this.state.scenarioError != "") {
      this.setState({
        resultPop: true,
        message: "Invalid Scenario Name"
      });
    }
    else {
      
    }

  }

  scenarioName(event) {
    let scenarioError = "";
    if (event.target.value.length < 6) scenarioError = "Please enter at least six characters";
    this.setState({
      scenarioName: event.target.value,
      scenarioError: scenarioError
    });
  }

  buildName(event) {
    let buildError = "";
    if (event.target.value.length < 6) buildError = "Please enter at least six characters";
    this.setState({
      buildName: event.target.value,
      buildError: buildError
    });
  }

  handleRequestClose() {
    this.setState({
      resultPop: false
    });
  };

  openBuild(event) {

  }

  render() {

    return (
      <div>
        <ScenarioList resourceId={this.props.userData.ScenariosDatasetId} filter={{}} options={{}} update={this.changeScenario} currentScenario={this.state.scenario} />
        <TextField hintText="New Scenario Name" value={this.state.scenarioName} errorText={this.state.scenarioError} onChange={this.scenarioName} />
        <Add onClick={this.addScenario}/>
        <TextField hintText="New Build Name" value={this.state.buildName} errorText={this.state.buildError} onChange={this.buildName} />

        <BuildList resourceId={this.props.userData.ScenariosDatasetId} filter={{}} options={{}} currentScenario={this.state.scenario} update={this.openBuild} />

        
      </div>
    );
  }
}

ScenarioPlanner.propTypes = {
  userData: React.PropTypes.object.isRequired // This expects user data
};

export default ScenarioPlanner;