import React from "react";

import {List, ListItem} from "material-ui/List";
import Divider from "material-ui/Divider";

import Visualise from "material-ui/svg-icons/action/visibility";
import School from "material-ui/svg-icons/maps/local-library";
import TableIcon from "material-ui/svg-icons/action/view-list";
import Scenarios from "material-ui/svg-icons/social/group-add";
import PhysicalSupportYoung from "material-ui/svg-icons/action/favorite-border";

class AppMenu extends React.Component {
  visualise() {
    FlowRouter.go("root");
  }
  physicalYoung() {
    FlowRouter.go("physicalYoung");
  }
  table() {
    FlowRouter.go("table");
  }
  plan() {
    FlowRouter.go("planner");
  }
  render() {
    const styles = {
    };
    const content = (
      <List>
        <ListItem key="visual" primaryText="Visualise" onTouchTap={this.visualise} rightIcon={<Visualise />} />
        <ListItem key="table" primaryText="Table View" onTouchTap={this.table} rightIcon={<TableIcon />} />
        <Divider />
        <ListItem key="scenarioView" onTouchTap={this.plan} primaryText="Scenario Planner" rightIcon={<Scenarios />} />
        <Divider />
        <ListItem key="demand" 
                  primaryText="Data Packs" 
                  initiallyOpen={true}
                  nestedItems={[
                    <ListItem key="physicalYoung" primaryText="Physical Support 18-64" onTouchTap={this.physicalYoung} rightIcon={<PhysicalSupportYoung />} />
                  ]}/>
      </List>        
    );

    return content;
  }
}

export default AppMenu;