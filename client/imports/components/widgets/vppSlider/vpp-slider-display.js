import React from "react";

import Paper from "material-ui/Paper"
import Slider from "material-ui/Slider";

class VppSlider extends React.Component {

  constructor(props) {
    super(props);
    this.handleSlider = _.debounce(this.handleSlider.bind(this), 1000);
  }

  handleSlider(event, value) {
    this.props.update(value);
  }

  render() {
    const data = this.props.data[0];
    const persons = this.props.persons[0].persons;
    const styles = {
      slider: {
        position: "relative",
        height: 100,
        marginLeft: 20
      }
    }
    const marginalCost = persons * this.props.vpp;
    const fixedCost = data.value - marginalCost;
    
    return (
      <Paper className="vpp-slider">
        <div id="vpp-info">
          <p>Marginal Cost: £{Math.round(marginalCost/100000)/10} millions
           Fixed Cost: £{Math.round(fixedCost/100000)/10} millions
            Total Cost: £{Math.round(data.value/100000)/10} millions</p>
        </div>
        <div id="vpp-control">
          <p >
            £{data.value_pp}
          </p>
          <Slider
            min={0}
            max={data.value/persons}
            step={0.01}
            value={this.props.vpp}
            onChange={this.handleSlider}
            style={styles.slider}
            axis="y"
          />
          <p>
            £{this.props.vpp}
          </p>
        </div>

      </Paper>
    );
  }

}

VppSlider.propTypes = {
  vpp: React.PropTypes.number.isRequired,
  data: React.PropTypes.array.isRequired,
  persons: React.PropTypes.array.isRequired,
  update: React.PropTypes.func.isRequired
};

export default VppSlider;