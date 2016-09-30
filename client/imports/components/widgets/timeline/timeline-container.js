import {compose} from "react-komposer";
import loadData from "../../../composers/load-aggregate";
import Timeline from "./timeline-display";
import ProgressIndicator from "../../progress-indicator";

export default compose(loadData, ProgressIndicator)(Timeline);