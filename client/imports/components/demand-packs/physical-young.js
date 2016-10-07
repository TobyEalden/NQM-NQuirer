import React from "react";
import {Meteor} from "meteor/meteor";
_ = lodash;

import YearSlider from "../controls/year-slider";
import AgeBandSelector from "../controls/age-band-selector";
import AgeBandDisplay from "../controls/age-band-display";
import Checkbox from "material-ui/Checkbox";
import Drawer from "material-ui/Drawer";
import RaisedButton from "material-ui/RaisedButton";
import Paper from "material-ui/Paper";

import MapWidget from "../widgets/physicalSupportMap/physical-map-widget";
import VppSlider from "../widgets/vppSlider/vpp-slider-widget";
import PyramidWidget from "../widgets/pyramid/pyramid-widget";
import TimelineWidget from "../widgets/costTimeline/cost-timeline-widget";

class PhysicalYoung extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      delta: false,
      male: true,
      female: true,
      age_bands: ["All Ages"],
      year: (new Date().getFullYear() - 1).toString(),
      lsoaId: this.props.userData.InitialLsoaId,
      showControls: false,
      vpp: 1
    };

    this.updateYear = this.updateYear.bind(this);
    this.updateMale = this.updateMale.bind(this);
    this.updateFemale = this.updateFemale.bind(this);
    this.addAgeBand = this.addAgeBand.bind(this);
    this.removeAgeBand = this.removeAgeBand.bind(this);
    this.setLsoa = this.setLsoa.bind(this);
    this.toggleControls = this.toggleControls.bind(this);
    this.updateVpp = this.updateVpp.bind(this);
  }

  updateYear(year) {
    this.setState({
      year: year
    });
  };
  


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
    if (!_.includes(this.state.age_bands, age_band)) {
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

  toggleControls() {
    this.setState({
      showControls: !this.state.showControls
    });
  }

  updateVpp(vpp) {
    this.setState({
      vpp: vpp
    });
  }

  render() {
    
    return (
      <div className="demand-pack">

        <Drawer className="visual-controls" open={this.state.showControls}>
          
          <Checkbox label="Male" checked={this.state.male} onCheck={this.updateMale} disabled={this.state.female ? false : true} />
          <Checkbox label="Female" checked={this.state.female} onCheck={this.updateFemale} disabled={this.state.male ? false : true} />
          <AgeBandSelector update={this.addAgeBand} age_bands={Meteor.settings.public.age_bands.concat(["All Ages"])} />
          <AgeBandDisplay update={this.removeAgeBand} selected={this.state.age_bands} />
        </Drawer>


        <MapWidget age_bands={this.state.age_bands} male={this.state.male} female={this.state.female} year={this.state.year} lsoaId={this.state.lsoaId} regionId={this.props.userData.RegionId} popletDatasetId={this.props.userData.PopletDatasetId} update={this.setLsoa} centre={this.props.userData.GeoCentre} vpp={this.state.vpp}/>
        <div id="widgets">
          <VppSlider vpp={this.state.vpp} update={this.updateVpp} regionId={this.props.userData.RegionId} age_bands={this.state.age_bands} male={this.state.male} female={this.state.female} year={this.state.year} popletDatasetId={this.props.userData.PopletDatasetId}/>
          
          <Paper className="year-slider-standalone">
            <YearSlider currentYear={parseInt(this.state.year, 10)} update={this.updateYear} />
          </Paper>
          <PyramidWidget wgtId="py1" age_bands={this.state.age_bands} male={this.state.male} female={this.state.female} year={this.state.year} lsoaId={this.state.lsoaId} popletDatasetId={this.props.userData.PopletDatasetId} />

          <TimelineWidget wgtId="ctmln1" age_bands={this.state.age_bands} male={this.state.male} female={this.state.female} popletDatasetId={this.props.userData.PopletDatasetId} regionId={this.props.userData.RegionId} vpp={this.state.vpp} />
          
          <div id="control-toggle">
            <RaisedButton label="Toggle Controls" onTouchTap={this.toggleControls} />
          </div>
        </div>
      </div>
    );
  }

}

PhysicalYoung.propTypes = {
  userData: React.PropTypes.object.isRequired
};

export default PhysicalYoung;