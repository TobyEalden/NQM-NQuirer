import React from "react";
_ = lodash;

import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";

class YearSelector extends React.Component {

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event, key, year) {
    this.props.update(year);
  }

  render() {

    const options = _.map(this.props.years, (year) => {
      return <MenuItem key={year} value={year} primaryText={year} />;
    });

    return(
      <SelectField className="year-selector" hintText="Select Year(s)" onChange={this.handleChange}>
        {options}
      </SelectField>
    );
  }

}

YearSelector.propTypes = {
  years: React.PropTypes.array.isRequired,
  update: React.PropTypes.func.isRequired
};

export default YearSelector;