import { idbCon } from "./jsstore.service";
export class BaseService {
  get connection() {
    return idbCon;
  }
}
