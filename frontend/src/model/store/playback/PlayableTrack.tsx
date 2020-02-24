import Artist from "../../libraryEntities/Artist";
import Release from "../../libraryEntities/Release";
import { ColorSet, getColorSetFromSwatchArray } from "../../../utils/ColorTools";
import Track from "../../libraryEntities/Track";
import { getSourceUrlFromEntity, getMetadata } from "../../../utils/SpicaRestClient";
import AlbumArt from "../../../components/player/displays/AlbumArt"
import React from "react"
import TrackSummary from "../../libraryEntities/TrackSummary";
import { observable, autorun } from "mobx";
import { Howl } from 'howler';

export type QueueSourceType = "queue" | "station" | "playlist"

export default class PlayableTrack {
    private track: Track | null = null;
    private howl: Howl | null = null;

    private onTrackEnd: () => void;

    private seekPosition: number | null = null;
    private howlId: number | null = null

    public name: string;
    public uuid: string;

    public thumbnailUrl: string;
    public albumArtUrl: string;
    public audioUrl: string;
    public source: QueueSourceType;

    @observable public isPlaying: boolean = false;

    @observable public tags: { [key: string]: string } | null = null;
    @observable public thumbnail: JSX.Element | null = null;

    @observable public colorSet: ColorSet | null = null;

    @observable public artists: Artist[] | null = null;
    @observable public releases: Release[] | null = null;

    constructor(summary: TrackSummary, onTrackEnd: () => void, source: QueueSourceType = "queue") {

        this.onTrackEnd = onTrackEnd;

        this.name = summary.name;
        this.uuid = summary.uuid;
        this.source = source;
        this.audioUrl = getSourceUrlFromEntity(summary, "audio");
        this.albumArtUrl = getSourceUrlFromEntity(summary, "image");
        this.thumbnailUrl = getSourceUrlFromEntity(summary, "thumbnail");

        this.howl = new Howl({ html5: true, src: this.audioUrl, preload: true })
        this.howl.on("end", this.onTrackEnd)

        if (this.colorSet == null) {
            this.thumbnail = (
                <AlbumArt path={this.thumbnailUrl} colorsCallBack={(colors: number[][]) => {
                    this.colorSet = getColorSetFromSwatchArray(colors);
                }} />
            );
        } else {
            this.thumbnail = (<img alt="" src={this.thumbnailUrl} />);
        }

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