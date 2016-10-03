import React from "react";
import {Meteor} from "meteor/meteor";
import connectionManager from "../connection-manager";
import TDXApi from "nqm-api-tdx/client-api";
_ = lodash;

import TextField from "material-ui/TextField";
import IconButton from 'material-ui/IconButton';
import Add from "material-ui/svg-icons/content/add";
import Snackbar from 'material-ui/Snackbar';

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
      scenarioError: "Please enter at least six characters",
      buildError: "Please enter at least six characters"
    }

    this.changeScenario = this.changeScenario.bind(this);
    this.addScenario = this.addScenario.bind(this);
    this.scenarioName = this.scenarioName.bind(this);
    this.buildName = this.buildName.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.openBuild = this.openBuild.bind(this);
    this.addBuild = this.addBuild.bind(this);

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
      const config = {
        commandHost: Meteor.settings.public.commandHost,
        queryHost: Meteor.settings.public.queryHost,
        accessToken: connectionManager.authToken
      };
      const api = new TDXApi(config);

      api.createDataset({name: this.state.scenarioName, parentId: this.props.userData.ScenariosFolder, basedOnSchema: "resourceGroup"}, (err, response) => {
        if (err) {
          this.setState({
            resultPop: true,
            message: "Failed to create scenario: " + err
          });
        }
        else {
          const data = {
            scenario_name: this.state.scenarioName,
            scenario_folder: response.response.id,
            parent_area_code: this.props.userData.RegionId,
            base_population_datasetId: this.props.userData.PopletDatasetId 
          };
          api.addDatasetData(this.props.userData.ScenariosDatasetId, data, (err, response) => {
            if (err) {
              this.setState({
                resultPop: true,
                message: "Failed to create scenario: " + err
              });
            }
            else {
              this.setState({
                resultPop: true,
                message: "Created Scenario"
              });
            }
          });
        }
      });
      
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

  addBuild() {
    if (this.state.buildError != "") {
      this.setState({
        resultPop: true,
        message: "Invalid Build Name"
      });
    }
    else {
       const config = {
        commandHost: Meteor.settings.public.commandHost,
        queryHost: Meteor.settings.public.queryHost,
        accessToken: connectionManager.authToken
      };
      const api = new TDXApi(config);
      api.getDatasetData(this.props.userData.ScenariosDatasetId, null, null, null, (err, response) => {
        if (err) {
          this.setState({
            resultPop: true,
            message: "Failed to create build: " + err
          });
        }
        else {
          console.log(response);
          api.createDataset({ name: this.state.buildName, parentId: response.data[this.state.scenario].scenario_folder, basedOnSchema: "PlanningPoplet"}, (err,id) => {
            if (err) {
              this.setState({
                resultPop: true,
                message: "Failed to create build: " + err
              });
            }
            else {
              this.setState({
                resultPop: true,
                message: "Created Build"
              });
            }
          });
        }
      });
      
    }
  }

  render() {

    return (
      <div>
        <ScenarioList resourceId={this.props.userData.ScenariosDatasetId} filter={{}} options={{}} update={this.changeScenario} currentScenario={this.state.scenario} />
        <TextField hintText="New Scenario Name" value={this.state.scenarioName} errorText={this.state.scenarioError} onChange={this.scenarioName} />
        
        <IconButton onClick={this.addScenario}>
          <Add />
        </IconButton>
        <BuildList resourceId={this.props.userData.ScenariosDatasetId} filter={{}} options={{}} currentScenario={this.state.scenario} update={this.openBuild} />
        <TextField hintText="New Build Name" value={this.state.buildName} errorText={this.state.buildError} onChange={this.buildName} />
        <IconButton onClick={this.addBuild}>
          <Add />
        </IconButton>
        <Snackbar
          open={this.state.resultPop}
          message={this.state.message}
          autoHideDuration={4000}
          onRequestClose={this.handleRequestClose}
        />
        

        
      </div>
    );
  }
}

ScenarioPlanner.propTypes = {
  userData: React.PropTypes.object.isRequired // This expects user data
};

export default ScenarioPlanner;