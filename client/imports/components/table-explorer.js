import React from "react";
import {Meteor} from "meteor/meteor";
_ = lodash;

class TableExplorer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      male: true,
      female: true,
      age_bands: ["All Ages"],
      years: [new Date().getFullYear().toString()],
      lsoaIds: ["E01022561"]
    };

    this.addYear = this.addYear.bind(this);
    this.removeYear = this.removeYear.bind(this);
    this.updateMale = this.updateMale.bind(this);
    this.updateFemale = this.updateFemale.bind(this);
    this.addAgeBand = this.addAgeBand.bind(this);
    this.removeAgeBand = this.removeAgeBand.bind(this);
    this.addLsoa = this.addLsoa.bind(this);
    this.removeLsoa = this.removeLsoa.bind(this);

  }

  addYear(year) {
    if (!_.includes(this.state.years), year) {
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

  addLsoa(lsoaId) {
    if (!_.includes(this.state.lsoaIds), lsoaId) {
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

  render() {
    return (

    );
  }
}


TableExplorer.propTypes = {
  userData: React.PropTypes.object.isRequired // This expects user data
};

export default TableExplorer;