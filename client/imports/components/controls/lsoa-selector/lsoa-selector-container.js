import {compose} from "react-komposer";
import loadData from "../../../composers/load-aggregate";
import LsoaSelector from "./lsoa-selector";
import ProgressIndicator from "../../progress-indicator";

export default compose(loadData, ProgressIndicator)(LsoaSelector);