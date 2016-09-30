import { compose } from "react-komposer";
import loadUserData from "../composers/load-user-data";
import ProgressIndicator from "../components/progress-indicator";
import ScenarioPlanner from "../components/scenario-planner";

export default compose(loadUserData, ProgressIndicator)(ScenarioPlanner);