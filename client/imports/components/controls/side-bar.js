import React from "react";
import {Meteor} from "meteor/meteor";

import appUtils from "../../app-utils";
import VerticalButtonPanel from "./vertical-button-panel";

import Drawer from "material-ui/Drawer";

class SideBar extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  _onFloatingChange(open) {
    if (this.props.onFloatingOpen) {
      this.props.onFloatingOpen(open);
    }
  }
  _onViewActive(value) {
    console.log("switching to " + value);

    const qp = {};
    qp[appUtils.constants.query.sideBarView] =  value;
    FlowRouter.setQueryParams(qp);
  }
  render() {
    const navWidth = this.props.floatingNavOpen ? appUtils.constants.ui.floatingNavWidth : appUtils.constants.ui.dockedNavWidth;
    var styles = {
      dockedNav: {
        position: "fixed",
        left: appUtils.constants.ui.verticalButtonPanelWidth,
        top: appUtils.constants.ui.titleBarHeight,
        bottom: 0,
        width: navWidth - appUtils.constants.ui.verticalButtonPanelWidth,
        overflowX: "hidden",
        backgroundColor: this.context.muiTheme.palette.canvasColor,
        boxShadow: "2px 0px 2px -1px rgba(0,0,0,0.3)",
        zIndex: 1099,
        padding: "0px 0px 0px 0px"
      },
      drawer: {
        position:"absolute"
      },
      floatingNav: {
        position: "fixed",
        left: appUtils.constants.ui.verticalButtonPanelWidth,
        top: 0,
        bottom: 0,
        width: navWidth - appUtils.constants.ui.verticalButtonPanelWidth,
        overflowX: "hidden",
        backgroundColor: this.context.muiTheme.palette.canvasColor,
        padding: "0px 0px 0px 0px"
      }
    };

    const paneButtons = React.Children.map(this.props.children, (child) => {
      return { value: child.props.value, icon: child.props.icon, title: child.props.title };
    });

    const activeView = this.props.active;
    const activeViewComponent = React.Children.count(this.props.children) === 1 ? React.Children.only(this.props.children) : _.find(this.props.children, (c) => { return c.props.value === activeView; });
    
    const getSideBar = (containerStyle, docked) => {
      return <div>
        <VerticalButtonPanel items={paneButtons} active={this.props.active} docked={docked} onTouchTap={(...args) => this._onViewActive(...args)} />
        <div style={containerStyle}>
          {activeViewComponent}
        </div>
      </div>;
    };

    var content;
    if (FlowRouter.getQueryParam(appUtils.constants.query.viewMode) === "w") {
      // Wide page => use docked navigation rather than floating.
      if (this.props.docked) {
        // Docked navigation is open.
        content = (
          <div>
            {getSideBar(styles.dockedNav, true)}
          </div>
        );
      } 
    } else {
      // Not on a wide page => render floating navigation.
      content = (
        <Drawer 
          style={styles.drawer}
          width={navWidth} 
          docked={false} 
          open={this.props.floatingOpen} 
          onRequestChange={this._onFloatingChange.bind(this)}          
        >
          {getSideBar(styles.floatingNav, false)}
        </Drawer>
      );
    }    
    
    return content || false;
  }
}

SideBar.propTypes = {
  docked: React.PropTypes.bool,
  floatingOpen: React.PropTypes.bool,
  onFloatingOpen: React.PropTypes.func
};

SideBar.contextTypes = {
  muiTheme: React.PropTypes.object,
};

export default SideBar;