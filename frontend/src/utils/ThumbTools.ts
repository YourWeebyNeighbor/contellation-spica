import { Thumbnail } from "../model/store/playback/PlayableTrack";

export function getSmallThumbUrl(thumbs: Thumbnail[]): string | null {
    const thumb = thumbs.find(thumb => thumb.size === 64)

    return thumb == null ? null : thumb.url
}