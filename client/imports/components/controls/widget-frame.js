import React from "react";

import appUtils from "../../app-utils";

import FontIcon from "material-ui/FontIcon";

class WidgetFrame extends React.Component {
  _onClose() {
    if (this.props.onClose) {
      this.props.onClose(this);
    }
  }
  render() {
    let content;

    const styles = {
      root: {
        position: "fixed",
        top: this.props.top,
        right: this.props.right,
        width: this.props.width,
        height: this.props.height,
        backgroundColor: "rgba(255,255,255,0.85)",
        boxShadow: "2px 2px 2px 0px rgba(0,0,0,0.75)",
        zIndex: 1200        
      },
      title: {
        fontSize: "14px",
        padding: 2,
        height: appUtils.constants.ui.widgetTitleBarHeight,
        backgroundColor: this.context.muiTheme.palette.primary3Color
      },
      titleText: {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow:"ellipsis",
        display: "inline-block",
        width: this.props.width - 20                
      },
      closeIcon: {
        float: "right",
        fontSize: "16px",
        cursor: "pointer"
      }
    };

    if (typeof this.props.left !== "undefined") {
      styles.root.left = this.props.left;
    }

    content = (
      <div style={styles.root}>
        <div style={styles.title}>
          <FontIcon style={styles.closeIcon} className="material-icons" onTouchTap={(...args) => this._onClose(...args)}>close</FontIcon>
          <span style={styles.titleText}>{this.props.title}</span>
        </div>
        {React.cloneElement(React.Children.only(this.props.children), { width: this.props.width, height: this.props.height - appUtils.constants.ui.widgetTitleBarHeight })}
      </div>
    );

    return content;
  }
}

WidgetFrame.contextTypes = {
  muiTheme: React.PropTypes.object
};

export default WidgetFrame;

