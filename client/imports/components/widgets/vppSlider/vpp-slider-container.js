import {compose} from "react-komposer";
import loadVppData from "./vpp-slider-composer";
import VppSlider from "./vpp-slider-display";
import ProgressIndicator from "../../progress-indicator";

export default compose(loadVppData, ProgressIndicator)(VppSlider);