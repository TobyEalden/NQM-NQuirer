import React from "react";
import {Meteor} from "meteor/meteor";
import connectionManager from "../connection-manager";
import TDXApi from "nqm-api-tdx/client-api";
_ = lodash;

import {Tabs, Tab} from "material-ui/Tabs";
import PopIcon from "material-ui/svg-icons/action/supervisor-account";
import LSOAIcon from "material-ui/svg-icons/action/language";
import DistIcon from "material-ui/svg-icons/av/equalizer";
import Snackbar from "material-ui/Snackbar";
import Paper from "material-ui/Paper";
import RaisedButton from "material-ui/RaisedButton";
import Save from "material-ui/svg-icons/content/save";
import { red800 } from 'material-ui/styles/colors';

import MapWidget from "./widgets/map/map-widget";
import LSOATableWidget from "./widgets/lsoaTable/lsoa-table-widget";
import PopulationTableWidget from "./widgets/populationTable/population-table-widget";
import DistributionTableWidget from "./widgets/distributionTable/distribution-table-widget";

import unpackPoplets from "./functions/unpack-poplets";
import packPoplets from "./functions/pack-poplets";
import { redistribute, redistributePyramid } from "./functions/ratio-calculator";

class BuildEditor extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      lsoaId: this.props.userData.InitialLsoaId,
      recipe: unpackPoplets(props.data),
      saved: true,
      open: false,
      message: ""
    }

    this.setLsoa = this.setLsoa.bind(this);
    this.setLsoaRatio = this.setLsoaRatio.bind(this);
    this.removeLsoa = this.removeLsoa.bind(this);
    this.lockLsoa = this.lockLsoa.bind(this);

    this.setPopRatio = this.setPopRatio.bind(this);
    this.removePop = this.removePop.bind(this);
    this.addPop = this.addPop.bind(this);

    this.setAgeRatio = this.setAgeRatio.bind(this);
    this.lockAge = this.lockAge.bind(this);

    this.save = this.save.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
  }

  setLsoa(lsoaId) {
    if(!_.find(this.state.recipe.lsoaData, (lsoa) => {
      if (lsoa.area_id === lsoaId) return true;
      else return false;
    })) {
      let recipe = _.clone(this.state.recipe);
      recipe.lsoaData.push({area_id: lsoaId, ratio: 0, locked: false});
      recipe.lsoaData = redistribute(recipe.lsoaData);
      this.setState({
        lsoaId: lsoaId,
        recipe: recipe,
        saved: false
      });
    };
    
  }

  setLsoaRatio(lsoaId, ratio) {
    let recipe = _.clone(this.state.recipe);
    let lsoa = _.find(recipe.lsoaData, (lsoa) => {
      if (lsoa.area_id === lsoaId) return true;
      else return false;
    });
    lsoa.ratio = ratio;
    recipe.lsoaData = redistribute(recipe.lsoaData);
    this.setState({
      recipe: recipe,
      saved: false
    });
  }
  
  removeLsoa(lsoaId) {
    let recipe = _.clone(this.state.recipe);
    _.remove(this.state.recipe.lsoaData, (lsoa) => {
      if (lsoa.area_id === lsoaId) return true;
      else return false;
    });
    recipe.lsoaData = redistribute(recipe.lsoaData);
    this.setState({
      recipe: recipe,
      saved: false
    });
  }

  lockLsoa(lsoaId) {
    let recipe = _.clone(this.state.recipe);
    let lsoa = _.find(recipe.lsoaData, (lsoa) => {
      if (lsoa.area_id === lsoaId) return true;
      else return false;
    });
    lsoa.locked = !lsoa.locked;
    recipe.lsoaData = redistribute(recipe.lsoaData);
    this.setState({
      recipe: recipe,
      saved: false
    });
  }

  setPopRatio(popId, population) {
    let recipe = _.clone(this.state.recipe);
    let pop = _.find(recipe.populations, (p) => {
      if (p.year === popId.toString()) return true;
      else return false;
    });
    pop.population = population;
    this.setState({
      recipe: recipe,
      saved: false
    });
  }

  removePop(popId) {
    let recipe = _.clone(this.state.recipe);
    _.remove(this.state.recipe.populations, (p) => {
      if (p.year === popId.toString()) return true;
      else return false;
    });
    this.setState({
      recipe: recipe,
      saved: false
    });
  }

  addPop(popId, population) {
    let recipe = _.clone(this.state.recipe);
    recipe.populations.push({year: popId.toString(), population: population});
    this.setState({
      recipe: recipe,
      saved: false
    });
  }

  setAgeRatio(male, ageBand, ratio) {
    let recipe = _.clone(this.state.recipe);
    let band = _.find(recipe.age_bands, (b) => {
      if (b.range === ageBand) return true;
      else return false;
    });
    if (male) band.male = ratio;
    else band.female = ratio;
    recipe.age_bands = redistributePyramid(recipe.age_bands);
    this.setState({
      recipe: recipe,
      saved: false
    });
  }

  lockAge(male, ageBand) {
    let recipe = _.clone(this.state.recipe);
    let band = _.find(recipe.age_bands, (b) => {
      if (b.range === ageBand) return true;
      else return false;
    });
    if (male) band.lockedMale = !band.lockedMale;
    else band.lockedFemale = !band.lockedFemale;
    recipe.age_bands = redistributePyramid(recipe.age_bands);
    this.setState({
      recipe: recipe,
      saved: false
    });

  }

  save() {
    const config = {
      commandHost: Meteor.settings.public.commandHost,
      queryHost: Meteor.settings.public.queryHost,
      accessToken: connectionManager.authToken
    };
    const api = new TDXApi(config);
    api.truncateDataset(this.props.resourceId, (err, response) => {
      if (err) {
        console.log("Failed to erase data: ", err);
        this.setState({
          open: true,
          message: "Failed to save build"
        });
      }
      else {
        api.addDatasetData(this.props.resourceId, packPoplets(this.state.recipe.lsoaData, this.state.recipe.populations, this.state.recipe.age_bands), (err, response) => {
          if (err) {
            console.log("Failed to write data: ", err);
            this.setState({
              open: true,
              message: "Failed to save build"
            });
          }
          else {
            console.log("wrote to dataset");
            this.setState({
              open: true,
              message: "Build saved",
              saved: true
            });
          }
        });
      }
    });  
  }

  handleRequestClose() {
    this.setState({
      open: false
    });
  };

  render() {

    let saveColour = "";
    if (!this.state.saved) saveColour = red800;

    return (
      <div id="build-editor">

        <MapWidget delta={false} age_bands={["All Ages"]} male={true} female={false} year={new Date().getFullYear().toString()} lsoaId={this.state.lsoaId} regionId={this.props.userData.RegionId} popletDatasetId={this.props.userData.PopletDatasetId} update={this.setLsoa} centre={this.props.userData.GeoCentre} />
        <Paper id="build-controls" zDepth={2}>
          <Tabs className="tab-container">
            <Tab icon={<LSOAIcon />} label="LSOAs" >
              <LSOATableWidget data={this.state.recipe.lsoaData} update={this.setLsoaRatio} remove={this.removeLsoa} toggleLock={this.lockLsoa} />
            </Tab>
            <Tab icon={<PopIcon />} label="Population" >
              <PopulationTableWidget data={this.state.recipe.populations} update={this.setPopRatio} remove={this.removePop} add={this.addPop} />
            </Tab>
            <Tab icon={<DistIcon />} label="Age Distribution" >
              <DistributionTableWidget data={this.state.recipe.age_bands} update={this.setAgeRatio} toggleLock={this.lockAge} />
            </Tab>
          </Tabs>
        </Paper>
        <div id="save-build">
          <RaisedButton label="Save Changes" backgroundColor={saveColour} labelPosition="before" icon={<Save />} onTouchTap={this.save} />
        </div>
        <Snackbar
          open={this.state.open}
          message={this.state.message}
          autoHideDuration={4000}
          onRequestClose={this.handleRequestClose}
        />
      </div>
    );
  }


}

BuildEditor.propTypes = {
  userData: React.PropTypes.object.isRequired, // This expects user data
  data: React.PropTypes.array.isRequired,
  resourceId: React.PropTypes.string.isRequired
};

export default BuildEditor;