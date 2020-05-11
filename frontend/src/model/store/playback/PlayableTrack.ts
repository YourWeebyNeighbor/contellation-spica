import Artist from "../../libraryEntities/Artist";
import Release from "../../libraryEntities/Release";
import Track from "../../libraryEntities/Track";
import { getSourceUrlFromEntity, getMetadata } from "../../../utils/SpicaRestClient";
import TrackSummary from "../../libraryEntities/TrackSummary";
import { observable } from "mobx";
import { SourceType } from "../../libraryEntities/SourceType";

export type QueueSourceType = "queue" | "station" | "playlist"

export interface Thumbnail {
    url: string,
    size: number
}

export default class PlayableTrack {
    private track: Track | null = null;

    public name: string;
    public uuid: string;

    public thumbnails: Thumbnail[];
    public albumArtUrl: string;
    public audioUrl: string;
    public source: QueueSourceType;

    @observable public tags: { [key: string]: string } | null = null;

    @observable public artists: Artist[] | null = null;
    @observable public releases: Release[] | null = null;

    private getThumbnail(url: string, type: SourceType): Thumbnail {
        return {
            size: Number.parseInt(type.replace("thumbnail", "")),
            url: url
        }
    }

    private getThumbnails(summary: TrackSummary, types: SourceType[]): Thumbnail[] {
        return (types.map(type => {
            try {
                return this.getThumbnail(getSourceUrlFromEntity(summary, type), type)
            }
            catch {
                return null
            }
        }).filter(item => item != null)) as Thumbnail[]
    }

    constructor(summary: TrackSummary, source: QueueSourceType = "queue") {

        this.name = summary.name;
        this.uuid = summary.uuid;
        this.source = source;
        this.audioUrl = getSourceUrlFromEntity(summary, "audio");
        this.albumArtUrl = getSourceUrlFromEntity(summary, "image");
        this.thumbnails = this.getThumbnails(summary, ["thumbnail64", "thumbnail128", "thumbnail256", "thumbnail512", "thumbnail1024"]);

        if (this.track == null || this.artists == null || this.releases == null) {
            getMetadata<Track>(this.uuid, "track").then(data => {
                this.track = data;

                this.artists = [];
                data.artists.forEach(uuid => getMetadata<Artist>(uuid, "artist").then(artist => { this.artists!.push(artist) }))

                this.releases = [];
                data.releases.forEach(uuid => getMetadata<Release>(uuid, "release").then(release => { this.releases!.push(release) }))
            })
        }
    };
}