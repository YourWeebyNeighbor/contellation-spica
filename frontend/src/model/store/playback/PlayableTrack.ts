import Artist from "../../libraryEntities/Artist";
import Release from "../../libraryEntities/Release";
import Track from "../../libraryEntities/Track";
import { getSourceUrlFromEntity, getMetadata } from "../../../utils/SpicaRestClient";
import TrackSummary from "../../libraryEntities/TrackSummary";
import { observable } from "mobx";
import { Howl } from 'howler';
import { SourceType } from "../../libraryEntities/SourceType";

export type QueueSourceType = "queue" | "station" | "playlist"

export interface Thumbnail {
    url: string,
    size: number
}

export default class PlayableTrack {
    private track: Track | null = null;
    private howl: Howl | null = null;

    private onTrackEnd: () => void;

    private seekPosition: number | null = null;
    private howlId: number | null = null

    public name: string;
    public uuid: string;

    public thumbnails: Thumbnail[];
    public albumArtUrl: string;
    public audioUrl: string;
    public source: QueueSourceType;

    @observable public isPlaying: boolean = false;

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

    constructor(summary: TrackSummary, onTrackEnd: () => void, source: QueueSourceType = "queue") {

        this.onTrackEnd = onTrackEnd;

        this.name = summary.name;
        this.uuid = summary.uuid;
        this.source = source;
        this.audioUrl = getSourceUrlFromEntity(summary, "audio");
        this.albumArtUrl = getSourceUrlFromEntity(summary, "image");
        this.thumbnails = this.getThumbnails(summary, ["thumbnail64", "thumbnail128", "thumbnail256", "thumbnail512", "thumbnail1024"]);

        this.howl = new Howl({ html5: true, src: this.audioUrl, preload: true })
        this.howl.on("end", this.onTrackEnd)

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

    public play() {
        if (this.isPlaying) {
            return;
        }

        this.isPlaying = true;

        if (this.howl == null) {
            console.error("howl is null for uuid=" + this.uuid);
            return;
        }

        if (this.howlId != null && this.seekPosition != null) {
            this.howl.play(this.howlId);
            this.howl.seek(this.seekPosition, this.howlId);
        }
        else {
            this.howlId = this.howl.play();
            this.seekPosition = 0;
        }
    }

    public pause() {
        if (!this.isPlaying) {
            return;
        }

        this.isPlaying = false;

        if (this.howl == null) {
            console.log("howl is null for uuid=" + this.uuid);
            return;
        }

        if (this.howlId != null) {
            this.seekPosition = (this.howl.seek(undefined, this.howlId) as number)
            this.howl.pause(this.howlId);
        } else {
            this.howl.pause();
        }
    }

    public stop() {
        this.isPlaying = false;

        if (this.howl == null) {
            console.log("howl is null for uuid=" + this.uuid);
            return;
        }

        this.howl.stop();
        this.howlId = null;
        this.seekPosition = null;
    }

    public getDuration: () => null | number = () => {
        return this.howl == null ? null : this.howl.duration()
    }

    public getPosition: () => null | number = () => {
        try {
            const position = (this.howl == null || this.howlId == null) ? null : this.howl.seek(undefined, this.howlId)
            return position as number;
        } catch {
            return null;
        }
    }
}