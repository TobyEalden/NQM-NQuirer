import { compose, composeAll } from "react-komposer";
import loadUserData from "../composers/load-user-data";
import loadData from "../composers/load-resource-data-api";
import ProgressIndicator from "../components/progress-indicator";
import BuildEditor from "../components/build-editor";

export default composeAll(compose(loadUserData, ProgressIndicator), compose(loadData, ProgressIndicator))(BuildEditor);