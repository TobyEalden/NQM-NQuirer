import { compose } from "react-komposer";
import mapComposer from "./physical-map-composer";
import ProgressIndicator from "../../progress-indicator";
import MapDisplay from "./physical-map-display";

export default compose(mapComposer, ProgressIndicator)(MapDisplay);