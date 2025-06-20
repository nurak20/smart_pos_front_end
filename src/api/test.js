import axios from "axios";
import { hostName } from "./host";
const URL = `http://localhost:8085/public/api/employee`
export const getDate = () => axios.get(URL);