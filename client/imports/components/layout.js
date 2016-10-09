import React from "react";
import {Meteor} from "meteor/meteor";

import appUtils from "../app-utils";
import connectionManager from "../connection-manager";
import Login from "./login";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import AppBar from "material-ui/AppBar";
import IconButton from "material-ui/IconButton";

class Layout extends React.Component{
  constructor(props) {
    super(props);   

    this.state = {
      mediumMQL: null,  // Medium media query listener
      wideMQL: null,    // Wide media query listener
    };

    // Bind event handlers to "this"
    this._onLogout = this._onLogout.bind(this);
    this._onUserPassword = this._onUserPassword.bind(this);
    this._onMediaQueryChanged = this._onMediaQueryChanged.bind(this);
  }
  componentWillMount() {  
    // Listen to window media size changes.
    var mediumMQL = window.matchMedia("(min-width: " + appUtils.constants.ui.mediumModeBreakPoint + "px)");
    mediumMQL.addListener(this._onMediaQueryChanged);
    var wideMQL = window.matchMedia("(min-width: " + appUtils.constants.ui.wideModeBreakPoint + "px");
    wideMQL.addListener(this._onMediaQueryChanged);

    this.setState({mediumMQL: mediumMQL, wideMQL: wideMQL});
    
    // Initialise media query handler.
    this._handleMediaChanged(mediumMQL, wideMQL);    
  }
  componentWillUnmount() {
    this.state.mediumMQL.removeListener(this._onMediaQueryChanged);
    this.state.wideMQL.removeListener(this._onMediaQueryChanged);
  }
  componentWillReceiveProps() {
    this._handleMediaChanged(this.state.mediumMQL, this.state.wideMQL);
  }
  _onMediaQueryChanged() {
    this._handleMediaChanged(this.state.mediumMQL, this.state.wideMQL);
  }
  _handleMediaChanged(mediumMQL, wideMQL) {
    if (!mediumMQL.matches) {
      console.log("entering narrow mode");
    } else if (mediumMQL.matches && !wideMQL.matches) {
      console.log("entering medium mode");
    } else if (wideMQL.matches) {
      console.log("entering wide mode");
    } else {
      console.log("!!!UNKNOWN SCREEN MODE!!!");
    }

    const qp = {};
    qp[appUtils.constants.query.viewMode] = !mediumMQL.matches ? "n" : (wideMQL.matches ? "w" : "m"); 
    FlowRouter.setQueryParams(qp);
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
        position: "fixed",
        top: 0,
        paddingLeft: 16
      },
      appBarIcon: {
        marginTop: "0px"
      },
      appBarTitle: {
        height: appUtils.constants.ui.titleBarHeight,
        lineHeight: appUtils.constants.ui.titleBarHeight + "px"
      },
      page: {
        height: "100%"
      },
      layoutContent: {
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
        <div style={styles.page}>
          <AppBar style={styles.appBar} 
                  title="NQuirer" 
                  iconStyleLeft={styles.appBarIcon}
                  iconStyleRight={styles.appBarIcon} 
                  titleStyle={styles.appBarTitle} 
                  showMenuIconButton={this.props.authenticated} 
                  iconElementRight={logoutButton} 
                  onLeftIconButtonTouchTap={this.props.onToggleNav}
                  zDepth={2} 
                />
          <div style={styles.layoutContent}>
            {content}
          </div>
        </div>
      </MuiThemeProvider>
    );    
  }
}

export default Layout;