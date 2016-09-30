import React from "react";
_ = lodash;

import AutoComplete from "material-ui/AutoComplete";
import MenuItem from "material-ui/MenuItem";

class LsoaSelector extends React.Component {

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(lsoa) {
    this.props.update(lsoa);
  }

  render() {

    return(
      <AutoComplete className="lsoa-selector" hintText="Type code to select Lsoa(s)" onNewRequest={this.handleChange} filter={AutoComplete.caseInsensitiveFilter} dataSource={this.props.data[0].id_array} />
    );
  }

}

LsoaSelector.propTypes = {
  data: React.PropTypes.array.isRequired,
  update: React.PropTypes.func.isRequired
};

export default LsoaSelector;