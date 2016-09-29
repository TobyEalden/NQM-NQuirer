import { compose } from "react-komposer";
import loadUserData from "../composers/load-user-data";
import ProgressIndicator from "../components/progress-indicator";
import VisualExplorer from "../components/visual-explorer";

export default compose(loadUserData, ProgressIndicator)(VisualExplorer);