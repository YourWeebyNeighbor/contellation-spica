import Entity from "./Entity";

export default interface Release extends Entity {
    type: "release",
    tracks: string[]
}