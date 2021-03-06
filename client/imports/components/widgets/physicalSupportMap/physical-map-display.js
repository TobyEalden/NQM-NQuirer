import React from "react";
import {Meteor} from "meteor/meteor";

import { delta } from "./functions/physical-heat-maps";
import { mapKey } from "./functions/physical-map-key";
import { Map, Marker, Popup, TileLayer, GeoJson } from "react-leaflet";

class MapDisplay extends React.Component {

  constructor(props) {
    super(props);

    this.setLsoa = this.setLsoa.bind(this);
    this.style = this.style.bind(this);

    this.state = mapKey(props.data, props.geojson, props.vpp);
  }

  setLsoa(e) {
    this.props.update(e.target.feature.properties.LSOA11CD);
  }

  style(feature) {
    return delta(feature, this.props, this.state.deltaKey);
  }

  onEachFeature(feature, layer) {
    layer.on({
      click: this.setLsoa
    });
  }

  // Required due to strange behaviour in Komposer causing multiple renders per prop update
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.data === this.props.data) return false;
    else return true;   
  }
  componentWillReceiveProps(nextProps) {
    this.setState(mapKey(nextProps.data, nextProps.geojson, nextProps.vpp));
  }

  render() {

    const url = "https://api.tiles.mapbox.com/v4/" + Meteor.settings.public.mapUsername + "/{z}/{x}/{y}.png?access_token=" + Meteor.settings.public.mapPassword;
    return (

      <Map center={this.props.centre} zoom={10} minZoom={10}>
        <TileLayer
          url={url}
          attribution='Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>'
        />
        <GeoJson
          data={this.props.geojson}
          style={this.style}
          onEachFeature={this.onEachFeature.bind(this)}
        />
      </Map>

    )
  }
}

MapDisplay.propTypes = {
  geojson: React.PropTypes.array.isRequired,
  data: React.PropTypes.array.isRequired,
  lsoaId: React.PropTypes.string.isRequired,
  update: React.PropTypes.func.isRequired,
  centre: React.PropTypes.array.isRequired,
  vpp: React.PropTypes.number.isRequired
};

export default MapDisplay;