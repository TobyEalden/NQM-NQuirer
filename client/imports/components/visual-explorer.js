import React from "react";
import {Meteor} from "meteor/meteor";
_ = lodash;

import YearSlider from "./controls/year-slider";
import AgeBandSelector from "./controls/age-band-selector";
import AgeBandDisplay from "./controls/age-band-display";
import Toggle from "material-ui/Toggle";
import Checkbox from "material-ui/Checkbox";

import MapWidget from "./widgets/map/map-widget";


class VisualExplorer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      delta: false,
      male: true,
      female: true,
      age_bands: ["All Ages"],
      year: new Date().getFullYear().toString(),
      lsoaId: props.userData.RegionId
    };

    this.updateYear = this.updateYear.bind(this);
    this.updateDelta = this.updateDelta.bind(this);
    this.updateMale = this.updateMale.bind(this);
    this.updateFemale = this.updateFemale.bind(this);
    this.addAgeBand = this.addAgeBand.bind(this);
    this.removeAgeBand = this.removeAgeBand.bind(this);
    this.setLsoa = this.setLsoa.bind(this);

  }

  updateYear(year) {
    this.setState({
      year: year
    });
  };
  
  updateDelta() {
    this.setState({
      delta: !this.state.delta
    });
  }

  updateMale(event, checked) {
    this.setState({
      male: checked
    });
  }

  updateFemale(event, checked) {
    this.setState({
      female: checked
    });
  }

  addAgeBand(age_band) {
    if (!_.includes(this.state.age_bands), age_band) {
      if (age_band === "All Ages") this.setState({age_bands: ["All Ages"]});
      else {
        if (_.includes(this.state.age_bands, "All Ages")) this.setState({age_bands: [age_band]});
        else this.setState({age_bands: this.state.age_bands.concat(age_band)});
      }
    }
  }

  removeAgeBand(age_band) {
    if (this.state.age_bands.length > 1) { // You cannot remove all age bands
      this.setState({
        age_bands: _.without(this.state.age_bands, age_band)
      });
    }   
  }

  setLsoa(lsoaId) {
    this.setState({
      lsoaId: lsoaId
    });
  }

  render() {

    return (
      <div id="visual-explorer">
        <YearSlider currentYear={parseInt(this.state.year, 10)} update={this.updateYear} />
        <Toggle toggled={this.state.delta} onToggle={this.updateDelta} label="Population Deltas" className="delta-toggle" />
        <Checkbox label="Male" checked={this.state.male} onCheck={this.updateMale} disabled={this.state.female ? false : true} />
        <Checkbox label="Female" checked={this.state.female} onCheck={this.updateFemale} disabled={this.state.male ? false : true} />
        <AgeBandSelector update={this.addAgeBand} age_bands={Meteor.settings.public.age_bands.concat(["All Ages"])} />
        <AgeBandDisplay update={this.removeAgeBand} selected={this.state.age_bands} />
        <MapWidget delta={this.state.delta} age_bands={this.state.age_bands} male={this.state.male} female={this.state.female} year={this.state.year} lsoaId={this.state.lsoaId} regionId={this.props.userData.RegionId} popletDatasetId={this.props.userData.PopletDatasetId} update={this.setLsoa} />
      </div>
    );
  }

}

VisualExplorer.propTypes = {
  userData: React.PropTypes.object.isRequired // This expects user data
};

export default VisualExplorer;