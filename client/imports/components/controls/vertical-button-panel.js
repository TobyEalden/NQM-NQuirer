import React from "react";

import appUtils from "../../app-utils";

import IconButton from "material-ui/IconButton";

const ButtonContainer = ({active, children, activeColor}) => {
  return <div style={{backgroundColor: (active ? activeColor : "transparent" )}}>{children}</div>;
};

class VerticalButtonPanel extends React.Component {
  _onTouchTap(value) {
    if (this.props.onTouchTap) {
      this.props.onTouchTap(value);
    }
  }
  render() {
    const styles = {
      root: {
        position: "fixed",
        top: this.props.docked ? 50 : 0,
        bottom: 0,
        left: 0,
        width: appUtils.constants.ui.verticalButtonPanelWidth,
        backgroundColor: this.context.muiTheme.palette.primary1Color,
        boxShadow: "5px 0px 5px -3px rgba(0,0,0,0.3)",
        zIndex: 1100,  // To match AppBar        
      },
      iconStyle: {
        color: this.context.muiTheme.palette.accent2Color,
      }
    };

    const buttons = _.map(this.props.items, (item) => {
      return (
        <ButtonContainer key={item.value} active={this.props.active === item.value} activeColor={this.context.muiTheme.palette.accent1Color}>
          <IconButton iconStyle={styles.iconStyle}
                      onTouchTap={this._onTouchTap.bind(this, item.value)} 
                      tooltip={item.title}
                      tooltipPosition="bottom-right" 
                      iconClassName="material-icons">{item.icon}</IconButton>
        </ButtonContainer>        
      );
    });

    const content = (
      <div style={styles.root}>
        {buttons}
      </div>
    );    

    return content;
  }
}

VerticalButtonPanel.propTypes = {
  items: React.PropTypes.array,
  onTouchTap: React.PropTypes.func,
  active: React.PropTypes.string,
  docked: React.PropTypes.bool
};

VerticalButtonPanel.contextTypes = {
  muiTheme: React.PropTypes.object,
};

export default VerticalButtonPanel;