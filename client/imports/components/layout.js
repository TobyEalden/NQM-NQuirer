import React from "react";
import {Meteor} from "meteor/meteor";

import connectionManager from "../connection-manager";
import Login from "./login";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import AppBar from "material-ui/AppBar";
import IconButton from "material-ui/IconButton";
import {List, ListItem} from "material-ui/List";
import Divider from "material-ui/Divider";
import Visualise from "material-ui/svg-icons/action/visibility";
import GP from "material-ui/svg-icons/maps/local-hospital";
import School from "material-ui/svg-icons/maps/local-library";
import ZoomOut from "material-ui/svg-icons/maps/zoom-out-map";
import TableIcon from "material-ui/svg-icons/action/view-list";
import Scenarios from "material-ui/svg-icons/social/group-add";

class Layout extends React.Component{
  constructor(props) {
    super(props);   

    // Bind event handlers to "this"
    this._onLogout = this._onLogout.bind(this);
    this._onUserPassword = this._onUserPassword.bind(this);
  }
  _onUserPassword(user, password) {
    // Pass share credentials on to the connection manager.
    connectionManager.authorise(user, password);
  }  
  _onLogout() {
    FlowRouter.go("logout");
  }

  visualise() {
    FlowRouter.go("root");
  }

  table() {
    FlowRouter.go("table");
  }

  render() {
    var styles = {
      appBar: {
        position: "fixed"
      },
      layoutContent: {
        padding: "68px 0px 0px 5px"
      }
    };
    var content;
    var logoutButton;

    // Render different content depending on whether authenticated or not.
    if (this.props.authenticated) {
      // Authenticated => render the layout content provided by the router.
      content = this.props.content();
      // Add a logout button to the toolbar.
      logoutButton = <IconButton onTouchTap={this._onLogout} iconClassName="material-icons" tooltip="logout">exit_to_app</IconButton>;
    } else {
      // Not authenticated => render the login component.
      content = <Login onEnter={this._onUserPassword} />;
    }

    return (
      <MuiThemeProvider>
        <div>
          <AppBar style={styles.appBar} title="NQuirer" showMenuIconButton={false} iconElementRight={logoutButton} />
          <div id="side-menu" style={styles.layoutContent}>
            <List>
              <ListItem key="explore" primaryText="Explore" 
                  initiallyOpen={true}
                  nestedItems={[<ListItem key="visual" primaryText="Visualise" onTouchTap={this.visualise} rightIcon={<Visualise />} />,<ListItem key="table" primaryText="Table View" onTouchTap={this.table} rightIcon={<TableIcon />} />]}/>
              <Divider />
                <ListItem key="regionView" onTouchTap={this.regionView} primaryText="Region View" rightIcon={<ZoomOut />} />
                <ListItem key="tableView" onTouchTap={this.tableView} primaryText="Table View" rightIcon={<TableIcon />} />
                <ListItem key="scenarioView" onTouchTap={this.scenarioView} primaryText="Scenario Planner" rightIcon={<Scenarios />} />
            </List>
          </div>
          <div style={styles.layoutContent}>
            {content}
          </div>
        </div>
      </MuiThemeProvider>
    );    
  }
}

export default Layout;