import React from "react";
_ = lodash;

import Paper from "material-ui/Paper";

class CostTimelineDisplay extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      width: 260,
      height: 225,
      margin: {
        top: 10,
        right: 40,
        bottom: 20,
        left: 25,
      }
    };
    this.draw = this.draw.bind(this);
  }

  translation(x,y) {
    return 'translate(' + x + ',' + y + ')';
  }

  draw(props) {
    const timeline = [];
    props.years.sort(function(a,b) {
     return a._id - b._id;
    }); 

    const fixed = props.data[0].value - props.vpp * props.years[0].persons;
    _.each(props.years, (year) => {
      const marginal = props.vpp * year.persons;
      timeline.push({year: year._id, cost: Math.round((marginal + fixed)/100000)/10});
    });
    console.log(timeline);
    let svg = d3.select("#timeline" + this.props.wgtId);
    

    let xScale = d3.scale.linear()
      .domain(d3.extent(timeline, function(d) {return d.year}))
      .range([0, this.state.width]);

    let yScale = d3.scale.linear()
      .domain([0, d3.max(timeline, function(d) {return d.cost}) * 1.1])
      .range([this.state.height, 0]);

    let xAxis = d3.svg.axis()
      .scale(xScale)
      .orient("bottom")
      .ticks(7)
      .tickFormat(d3.format("d"));
    
    let yAxis = d3.svg.axis()
      .scale(yScale)
      .orient("left")
      .ticks(6, ",f");
    
    let line = d3.svg.line()
      .x(function(d) { return xScale(d.year); })
      .y(function(d) { return yScale(d.cost); });


    svg.select("#x-axis" + props.wgtId)
      .transition()
      .call(xAxis);

    svg.select("#y-axis" + props.wgtId)
      .transition()
      .call(yAxis);

    svg.select("#line" + props.wgtId)
      .datum(timeline)
      .transition()
      .duration(500).ease("sin-in-out")
      .attr("class", "line")
      .attr("d", line)
      .attr('transform', this.translation(this.state.margin.left, 0));
  }

  componentDidMount() {
    let svg = d3.select("#timeline" + this.props.wgtId)
      .attr('width', this.state.margin.left + this.state.width + this.state.margin.right)
      .attr('height', this.state.margin.top + this.state.height + this.state.margin.bottom)
      .append('g')
      .attr('transform', this.translation(this.state.margin.left, this.state.margin.top));
    svg.append("g")
      .attr('id', 'y-axis' + this.props.wgtId)
      .attr("class", "axis")
      .attr('transform', this.translation(this.state.margin.left, 0));
    svg.append('g')
      .attr('id', 'x-axis' + this.props.wgtId)
      .attr("class", "axis")
      .attr('transform', this.translation(this.state.margin.left, this.state.height));
    svg.append("path")
      .attr("id", "line" + this.props.wgtId);

    this.draw(this.props);

  }
  
  componentWillReceiveProps(nextProps) {
   if (nextProps != this.props) 
   console.log("Receiving props twice here");
   this.draw(nextProps);
  }

  render() {

    return (
      <Paper className="timeline-widget">
        <svg id={"timeline" + this.props.wgtId}></svg>
      </Paper>

    );
  }

}

CostTimelineDisplay.propTypes = {
  data: React.PropTypes.array.isRequired,
  years: React.PropTypes.array.isRequired,
  vpp: React.PropTypes.number.isRequired,
  wgtId: React.PropTypes.string.isRequired
};

export default CostTimelineDisplay;