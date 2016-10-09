import React from "react";
import {composeWithTracker} from "react-komposer";

import appUtils from "../../app-utils";
import WidgetFrame from "./widget-frame";

import FontIcon from "material-ui/FontIcon";

const widgetSpacingY = 8;
const widgetSpacingX = 8;

class WidgetBar extends React.Component {
  constructor(props) {
    super(props);
  }
  _onTouchTap(child) {
    const path = FlowRouter.getQueryParam("w") ? FlowRouter.getQueryParam("w").split(".") : [];
    const wIdx = path.indexOf(child.props.widgetKey);
    if (wIdx >= 0) {
      // Removing a widget from display.
      path.splice(wIdx,1);
    } else {
      // The available height of a widget is the window height minus the title bar height and a bit of spacing at the top and bottom.  
      const availableHeight = window.innerHeight - appUtils.constants.ui.titleBarHeight - widgetSpacingY*2;

      const assignedHeight = Math.min(child.props.requestedHeight, availableHeight);

      // Adding a widget to display.
      path.push(child.props.widgetKey);

      // Check if there is space.
      if (this._widgetTop + assignedHeight > availableHeight && path.length > 1) {
        // The widget won't fit in the available space.
        // TODO - better algorithm to find the optimal widget to switch off.
        // For now, just remove the widget that has been displayed the longest.
        path.shift();
      }      
    }

    const qp = {};
    qp["w"] = path.join(".");
    FlowRouter.setQueryParams(qp);
  }
  _getWidgetIndex(child) {
    const path = FlowRouter.getQueryParam("w") ? FlowRouter.getQueryParam("w").split(".") : [];
    const wIdx = path.indexOf(child.props.widgetKey);
    return wIdx;
  }
  _calcWidgetLayout() {

  }
  render() {
    //
    // The widget 'tab' buttons on the right hand side are used to switch widgets on and off.
    // They are at fixed positions floating above everything else.
    // 
    // Top position of the first one. 
    const tabTopStart = 80;
    // The width of the icon button.
    const tabWidth = 30;
    // The height of the icon button.
    const tabHeight = 30;
    // Spacing around the buttons.
    const tabSpacing = 10;

    const styles = {
      widgetTab: {
        position: "fixed",
        zIndex: 200,
        width: tabWidth,
        height: tabHeight,
        right: 0,
        padding: "4px 0px 0px 4px",
        backgroundColor: this.context.muiTheme.palette.canvasColor,
        opacity: 0.8,
        boxShadow: "-2px 2px 2px 0px rgba(0,0,0,0.75)",
        cursor: "pointer"
      }
    };

    // Create the tab buttons, one for each widget passed as child.
    let content = React.Children.map(this.props.children, (child, idx) => {
      // Copy the default style, adjusting the top position.
      const style = _.extend({}, styles.widgetTab, { top: tabTopStart + idx*(tabHeight+tabSpacing) });
      // Set the font colour if this widget is currently visible.
      const fontStyle = {};      
      if (this._getWidgetIndex(child) >= 0) {
        fontStyle.color = this.context.muiTheme.palette.accent1Color;
      }
      return <div style={style} onTouchTap={this._onTouchTap.bind(this, child)}><FontIcon style={fontStyle} className="material-icons">{child.props.icon}</FontIcon></div>;
    });

    // The top of the first widget is just below the title bar.
    const widgetTopStart = appUtils.constants.ui.titleBarHeight + widgetSpacingY;

    // Calculate the width currently occupied by the side-bar, will be zero if it's not open or we're not in wide mode. 
    const dockedSideBarWidth = this.props.sideBarDocked && this.props.viewMode === "w" ? appUtils.constants.ui.dockedNavWidth : 0;

    // The available width of a widget is the window width minus the width of the tab buttons and a bit of space for the left side. 
    // It also depends on if the side bar is currently docked.   
    const availableWidth = window.innerWidth - dockedSideBarWidth - tabWidth - tabSpacing - widgetSpacingX;

    // The available height of a widget is the window height minus the title bar height and a bit of spacing at the top and bottom.  
    const availableHeight = window.innerHeight - appUtils.constants.ui.titleBarHeight - widgetSpacingY*2;

    // Create each visible widget.
    const widgets = [];    
    this._widgetTop = widgetTopStart;
    React.Children.forEach(this.props.children, (placeholder) => {
      const displayIdx = this._getWidgetIndex(placeholder);
      if (displayIdx >= 0) {
        // This widget is currently toggled 'on'.
        //
        // The actual widget should be the only child of the placeholder.
        const renderChild = React.Children.only(placeholder.props.children);

        // Determine the widget width - the layout is vertically-based so allow all the width available.
        const widgetWidth = Math.min(placeholder.props.requestedWidth, availableWidth);

        // Determine the widget height, based on what's available and the requested height.
        const widgetHeight = Math.min(placeholder.props.requestedHeight + appUtils.constants.ui.widgetTitleBarHeight, availableHeight);

        // Create a frame to hold the widget, adding the position properties.
        const widgetFrame = (
          <WidgetFrame  key={placeholder.props.widgetKey}
                        widgetKey={placeholder.props.widgetKey}
                        onClose={(...args) => this._onTouchTap(...args)} 
                        top={this._widgetTop} 
                        width={widgetWidth} 
                        height={widgetHeight} 
                        right={tabWidth + tabSpacing}
                        title={placeholder.props.title}>                        
            {renderChild}
          </WidgetFrame>                      
        );
        widgets.push(widgetFrame);

        // Offset the next widget position.
        this._widgetTop += widgetHeight + widgetSpacingY;
      }
    });

    return (
      <div>
        {content}
        {widgets}
      </div>
    );
  }
}

WidgetBar.contextTypes = {
  muiTheme: React.PropTypes.object
};

const loadWidgetConfig = (props, onData) => {
  const data = {
    viewMode: FlowRouter.getQueryParam(appUtils.constants.query.viewMode),
    sideBarDocked: FlowRouter.getQueryParam(appUtils.constants.query.dockedSideBarOpen) !== "0",
    path: FlowRouter.getQueryParam("w") ? FlowRouter.getQueryParam("w").split(".") : []
  };
  onData(null, data);
};

export default composeWithTracker(loadWidgetConfig,null)(WidgetBar);
