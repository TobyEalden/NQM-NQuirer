import React from "react";
_ = lodash;

import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";

class AgeBandSelector extends React.Component {

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event, key, age_band) {
    this.props.update(age_band);
  }

  render() {

    const options = _.map(this.props.age_bands, (age_band) => {
      return <MenuItem key={age_band} value={age_band} primaryText={age_band} />;
    });

    return(
      <SelectField className="age-band-selector" hintText="Select Age Band(s)" onChange={this.handleChange}>
        {options}
      </SelectField>
    );
  }

}

AgeBandSelector.propTypes = {
  age_bands: React.PropTypes.array.isRequired,
  update: React.PropTypes.func.isRequired
};

export default AgeBandSelector;