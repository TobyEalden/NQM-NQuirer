import React from "react";

import Settings from 'material-ui/svg-icons/action/settings';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import {lightBlue500, grey300} from 'material-ui/styles/colors';

class ScenarioList extends React.Component {



  render() {
    const scenarios = _.map(this.props.data, (scenario, index) => {
      let colour = grey300;
      if (index === this.props.currentScenario) colour = lightBlue500;
      return (
         <ListItem
          key={scenario.scenario_name}
          id={index}
          onTouchTap={this.update}
          primaryText={scenario.scenario_name}
          rightIcon={<Settings color={colour}/>}
          />
      );
    });

    return (

      <List>
        <Subheader>Scenarios</Subheader>
        {scenarios}
      </List>

    );
  }

}

ScenarioList.propTypes = {
  data: React.PropTypes.array.isRequired,
  currentScenario: React.PropTypes.number.isRequired,
  update: React.PropTypes.func.isRequired
};

export default ScenarioList;