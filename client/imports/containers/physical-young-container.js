import { compose } from "react-komposer";
import loadUserData from "../composers/load-user-data";
import ProgressIndicator from "../components/progress-indicator";
import PhysicalYoung from "../components/demand-packs/physical-young";

export default compose(loadUserData, ProgressIndicator)(PhysicalYoung);