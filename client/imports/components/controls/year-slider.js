import React from "react";
import Slider from "material-ui/Slider";

class YearSlider extends React.Component {

  constructor(props) {
    super(props);
    this.handleSlider = _.debounce(this.handleSlider.bind(this), 1000);
  }
  
  handleSlider(event, value) {
    this.props.update(value.toString());
  }

  render() {
    const styles = {
      slider: {
      },
      p: {
        marginTop: "-50px"
      }
    };
    return (
      <div className="year-slider">
        <Slider
          min={2015}
          max={2021}
          step={1}
          value={this.props.currentYear}
          onChange={this.handleSlider}
          style={styles.slider}
        />
        <p style={styles.p}>
          {this.props.currentYear}
        </p>

      </div>
    );
  }

}

YearSlider.propTypes = {
  update: React.PropTypes.func.isRequired,
  currentYear: React.PropTypes.number.isRequired,
}
export default YearSlider;
