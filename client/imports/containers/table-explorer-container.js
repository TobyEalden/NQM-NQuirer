import { compose } from "react-komposer";
import loadUserData from "../composers/load-user-data";
import ProgressIndicator from "../components/progress-indicator";
import TableExplorer from "../components/table-explorer";

export default compose(loadUserData, ProgressIndicator)(TableExplorer);