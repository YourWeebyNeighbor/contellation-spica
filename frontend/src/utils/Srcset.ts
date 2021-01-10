import { Thumbnail } from "../model/store/playback/PlayableTrack";

export default function toSrcSet(thumbnails: Thumbnail[]): string {
    return thumbnails.map(it => `${it.url} ${it.size}w`).join(",")
}