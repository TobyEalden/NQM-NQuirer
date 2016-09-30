import React from "react";

import Settings from 'material-ui/svg-icons/action/settings';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';

class BuildListDisplay extends React.Component {

  render() {
    const builds = _.map(this.props.data, (build, index) => {
      return (
        <ListItem
        key={build.id}
        id={build.id}
        onTouchTap={this.update}
        primaryText={build.name}
        />
      );
    });

    return (

      <List>
        <Subheader>Builds</Subheader>
        {builds}
      </List>

    );
  }

}

BuildListDisplay.propTypes = {
  data: React.PropTypes.array.isRequired,
  update: React.PropTypes.func.isRequired
};

export default BuildListDisplay;