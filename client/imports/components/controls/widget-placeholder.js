import React from "react";

const WidgetPlaceholder = () => { return null; };

WidgetPlaceholder.propTypes = {
  icon: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired,
  widgetKey: React.PropTypes.string.isRequired,
  requestedWidth: React.PropTypes.number.isRequired,
  requestedHeight: React.PropTypes.number.isRequired
};

export default WidgetPlaceholder;
