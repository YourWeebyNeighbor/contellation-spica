import { SourceType } from "./SourceType";
import { EntityType } from "./EntityType";

export default interface Entity {
    uuid: string,
    type: EntityType,
    name: string,
    sources: { [key: string]: SourceType }
}