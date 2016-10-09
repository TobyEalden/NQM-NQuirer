import React from "react";
import {Meteor} from "meteor/meteor";
_ = lodash;

import appUtils from "../app-utils";
import SideBar from "./controls/side-bar";
import SideBarPanel from "./controls/side-bar-panel";
import AppMenu from "./controls/app-menu";
import WidgetBar from "./controls/widget-bar";
import WidgetPlaceholder from "./controls/widget-placeholder";

import YearSlider from "./controls/year-slider";
import AgeBandSelector from "./controls/age-band-selector";
import AgeBandDisplay from "./controls/age-band-display";
import Toggle from "material-ui/Toggle";
import Checkbox from "material-ui/Checkbox";
import Drawer from "material-ui/Drawer";
import RaisedButton from "material-ui/RaisedButton";
import transitions from "material-ui/styles/transitions";

import MapWidget from "./widgets/map/map-widget";
import PyramidWidget from "./widgets/pyramid/pyramid-widget";
import TimelineWidget from "./widgets/timeline/timeline-widget";
import DetailWidget from "./widgets/detail/detail-widget";

class VisualExplorer extends React.Component {
  constructor(props, context) {
    super(props, context);
    
    this.state = {
      delta: false,
      male: true,
      female: true,
      age_bands: ["All Ages"],
      year: new Date().getFullYear().toString(),
      lsoaId: this.props.userData.InitialLsoaId
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

  render() {
    const styles = {
      root: {
        position: "absolute",
        top: 50,
        bottom: 0,
        left: this.props.wideViewMode && this.props.dockedSideBarOpen ? appUtils.constants.ui.dockedNavWidth : 0,
        right: 0
      },
      optionsPanel: {
        paddingLeft: 8,
        paddingRight: 8
      }
    };

    const popletId = this.props.scenarioPoplet ? this.props.scenarioPoplet : this.props.userData.PopletDatasetId;

    return (
      <div style={styles.root}>
        <SideBar  active={this.props.activeSideBar || "menu"}
                  docked={this.props.dockedSideBarOpen} 
                  floatingOpen={this.props.floatingSideBarOpen} 
                  onFloatingOpen={this.props.onToggleNav}>            
            <SideBarPanel title="menu" value="menu" icon="apps">
              <AppMenu />
            </SideBarPanel>
            <SideBarPanel title="options" value="options" icon="check_box">
              <div style={styles.optionsPanel}>
                <YearSlider currentYear={parseInt(this.state.year, 10)} update={this.updateYear} />
                <Checkbox label="Population Deltas"checked={this.state.delta} onCheck={this.updateDelta} />
                <Checkbox label="Male" checked={this.state.male} onCheck={this.updateMale} disabled={this.state.female ? false : true} />
                <Checkbox label="Female" checked={this.state.female} onCheck={this.updateFemale} disabled={this.state.male ? false : true} />
                <AgeBandSelector update={this.addAgeBand} age_bands={Meteor.settings.public.age_bands.concat(["All Ages"])} />
                <AgeBandDisplay update={this.removeAgeBand} selected={this.state.age_bands} />
              </div>
            </SideBarPanel>
        </SideBar>
        <MapWidget  delta={this.state.delta} 
                    age_bands={this.state.age_bands} 
                    male={this.state.male} 
                    female={this.state.female} 
                    year={this.state.year} 
                    lsoaId={this.state.lsoaId} 
                    regionId={this.props.userData.RegionId} 
                    popletDatasetId={popletId} 
                    update={this.setLsoa} 
                    centre={this.props.userData.GeoCentre} 
                  />
        <WidgetBar>
          <WidgetPlaceholder icon="change_history" title="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor" widgetKey="pyramid" requestedWidth={300} requestedHeight={300}>
            <PyramidWidget  wgtId="py1" 
                            age_bands={this.state.age_bands} 
                            male={this.state.male} 
                            female={this.state.female} 
                            year={this.state.year} 
                            lsoaId={this.state.lsoaId} 
                            popletDatasetId={popletId}
                          />
          </WidgetPlaceholder>
          <WidgetPlaceholder icon="timeline" title="timeline" widgetKey="timeline" requestedWidth={300} requestedHeight={120}>
            <TimelineWidget wgtId="tl1" 
                            age_bands={this.state.age_bands} 
                            male={this.state.male} 
                            female={this.state.female} 
                            year={this.state.year} 
                            lsoaId={this.state.lsoaId} 
                            popletDatasetId={popletId} 
                          />
          </WidgetPlaceholder>
          <WidgetPlaceholder icon="description" title="details" widgetKey="details" requestedWidth={300} requestedHeight={60}>
            <DetailWidget lsoaId={this.state.lsoaId} />
          </WidgetPlaceholder>
        </WidgetBar>
      </div>
    );
  }

}

VisualExplorer.propTypes = {
  userData: React.PropTypes.object.isRequired, // This expects user data
  scenarioPoplet: React.PropTypes.string,
  onToggleNav: React.PropTypes.func.isRequired
};

export default VisualExplorer;