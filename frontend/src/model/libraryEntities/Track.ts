import Entity from "./Entity";

export default interface Track extends Entity {
    type: "track"
    releases: string[],
    artists: string[],
    tags: { [key: string]: string };
}