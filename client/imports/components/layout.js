import React from "react";
import {Meteor} from "meteor/meteor";

import connectionManager from "../connection-manager";
import Login from "./login";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import AppBar from "material-ui/AppBar";
import IconButton from "material-ui/IconButton";

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
          <div style={styles.layoutContent}>
            {content}
          </div>
        </div>
      </MuiThemeProvider>
    );    
  }
}

export default Layout;