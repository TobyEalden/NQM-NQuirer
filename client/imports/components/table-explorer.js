import React from "react";
import {Meteor} from "meteor/meteor";
_ = lodash;

import appUtils from "../app-utils";
import SideBar from "./controls/side-bar";
import SideBarPanel from "./controls/side-bar-panel";
import AppMenu from "./controls/app-menu";

import Checkbox from "material-ui/Checkbox";
import Paper from "material-ui/Paper";

import LsoaDisplay from "./controls/lsoa-display";
import LsoaSelector from "./controls/lsoa-selector/lsoa-selector-element";
import YearDisplay from "./controls/year-display";
import YearSelector from "./controls/year-selector";
import AgeBandDisplay from "./controls/age-band-display";
import AgeBandSelector from "./controls/age-band-selector";
import TableWidget from "./widgets/table/table-widget";
import * as ColorManipulator from "material-ui/utils/colorManipulator";

class TableExplorer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      male: true,
      female: true,
      age_bands: ["All Ages"],
      years: [new Date().getFullYear().toString()],
      lsoaIds: [this.props.userData.InitialLsoaId],
      aggAge: true,
      aggGender: true,
      aggLsoas: false
    };

    this.addYear = this.addYear.bind(this);
    this.removeYear = this.removeYear.bind(this);
    this.updateMale = this.updateMale.bind(this);
    this.updateFemale = this.updateFemale.bind(this);
    this.addAgeBand = this.addAgeBand.bind(this);
    this.removeAgeBand = this.removeAgeBand.bind(this);
    this.addLsoa = this.addLsoa.bind(this);
    this.removeLsoa = this.removeLsoa.bind(this);
    this.updateAggregates = this.updateAggregates.bind(this);

  }

  addYear(year) {
    if (!_.includes(this.state.years, year)) {
      this.setState({
        years: this.state.years.concat(year)
      });
    }
  };
  
  removeYear(year) {
    this.setState({
      years: _.without(this.state.years, year)
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
    if (this.state.aggAge) {
      if (!_.includes(this.state.age_bands, age_band)) {
        if (age_band === "All Ages") this.setState({age_bands: ["All Ages"]});
        else {
          if (_.includes(this.state.age_bands, "All Ages")) this.setState({age_bands: [age_band]});
          else this.setState({age_bands: this.state.age_bands.concat(age_band)});
        }
      }
    }
    else {
      if (!_.includes(this.state.age_bands), age_band) {
        this.setState({
          age_bands: this.state.age_bands.concat(age_band)
        });
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

  addLsoa(lsoaId) {
    if (!_.includes(this.state.lsoaIds, lsoaId)) {
      this.setState({
        lsoaIds: this.state.lsoaIds.concat(lsoaId)
      });
    }
  }

  removeLsoa(lsoaId) {
    this.setState({
      lsoaIds: _.without(this.state.lsoaIds, lsoaId)
    });
  }

  updateAggregates(event, checked) {
    this.setState({
      [event.target.id]: checked
    });
  }

  render() {
    const styles = {
      root: {
        position: "absolute",
        top: 50,
        bottom: 0,
        left: this.props.wideViewMode && this.props.dockedSideBarOpen ? appUtils.constants.ui.dockedNavWidth : 0,
        right: 0,
        backgroundColor: ColorManipulator.darken(this.context.muiTheme.palette.canvasColor,0.1)
      },
      view: {
        padding: 4
      },
      tableControls: {
        minWidth: 260,
        maxWidth: 260,
        marginRight: 10,
        padding: 5,
        marginBottom: 10        
      },
      optionsPanel: {
        paddingLeft: 8,
        paddingRight: 8
      }
    };

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
                <AgeBandSelector update={this.addAgeBand} age_bands={Meteor.settings.public.age_bands.concat(["All Ages"])} />
                <AgeBandDisplay update={this.removeAgeBand} selected={this.state.age_bands} />
                <YearSelector update={this.addYear} years={Meteor.settings.public.years} />
                <YearDisplay update={this.removeYear} selected={this.state.years} />
                <LsoaSelector update={this.addLsoa} regionId={this.props.userData.RegionId} />
                <LsoaDisplay update={this.removeLsoa} selected={this.state.lsoaIds} />
                <Checkbox id="aggAge" label="Aggregate Age" checked={this.state.aggAge} onCheck={this.updateAggregates} />
                <Checkbox id="aggGender" label="Aggregate Gender" checked={this.state.aggGender} onCheck={this.updateAggregates} />
                <Checkbox id="aggLsoas" label="Aggregate LSOAs" checked={this.state.aggLsoas} onCheck={this.updateAggregates} />
              </div>
            </SideBarPanel>
        </SideBar>
        <div style={styles.view}>
          <TableWidget  male={this.state.male} 
                        female={this.state.female} 
                        age_bands={this.state.age_bands} 
                        lsoaIds={this.state.lsoaIds} 
                        years={this.state.years} 
                        popletDatasetId={this.props.userData.PopletDatasetId} 
                        aggAge={this.state.aggAge} 
                        aggGender={this.state.aggGender} 
                        aggLsoas={this.state.aggLsoas} 
                      />
        </div>
      </div>
    );
  }
}

TableExplorer.propTypes = {
  onToggleNav: React.PropTypes.func.isRequired,
  userData: React.PropTypes.object.isRequired // This expects user data
};

TableExplorer.contextTypes = {
  muiTheme: React.PropTypes.object  
};

export default TableExplorer;