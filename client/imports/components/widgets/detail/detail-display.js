import React from "react";

import {Card, CardText} from "material-ui/Card";

class DetailDisplay extends React.Component {

  render() {
    const styles = {
      root: {
        width: this.props.width,
        height: this.props.height,
        padding: 4,
        fontSize: "0.9em"        
      }
    };
    const area = this.props.data[0].properties;
    return (
      <div style={styles.root}>
        {area.LSOA11NM + " | " + area.LSOA11CD}
        <br />
        Area: {Math.floor(area.area/1000000)} km<sup>2</sup>
      </div>
    );
  }
}

DetailDisplay.propTypes = {
  data: React.PropTypes.array.isRequired
};

export default DetailDisplay;