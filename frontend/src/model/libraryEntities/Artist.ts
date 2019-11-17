import Metadata from "./Metadata";

export default interface Artist extends Metadata {
    type: "artist",
    tracks: string[]

}