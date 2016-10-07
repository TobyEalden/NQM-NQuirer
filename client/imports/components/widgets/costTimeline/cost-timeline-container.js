import {compose} from "react-komposer";
import loadVppData from "./cost-timeline-composer";
import Timeline from "./cost-timeline-display";
import ProgressIndicator from "../../progress-indicator";

export default compose(loadVppData, ProgressIndicator)(Timeline);