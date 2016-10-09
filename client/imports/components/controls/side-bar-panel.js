import React from "react";

const SideBarPanel = ({children}) => { return children; };

SideBarPanel.propTypes = {
  value: React.PropTypes.string.isRequired,
  icon: React.PropTypes.string.isRequired
};

export default SideBarPanel;