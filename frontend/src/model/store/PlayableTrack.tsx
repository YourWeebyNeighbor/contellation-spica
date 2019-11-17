import Artist from "../libraryEntities/Artist";
import Release from "../libraryEntities/Release";
import { ColorSet, getColorSetFromSwatchArray } from "../../utils/ColorTools";
import Track from "../libraryEntities/Track";
import { getSourceUrlFromEntity, getMetadata } from "../../utils/SpicaRestClient";
import AlbumArt from "../../components/player/displays/AlbumArt"
import React from "react"
import TrackSummary from "../libraryEntities/TrackSummary";
import { observable,  autorun } from "mobx";
import { Howl } from 'howler';

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

    @observable public targetState: "loaded" | "unloaded" = "unloaded"
    @observable public isPlaying: boolean = false;

    @observable public tags: { [key: string]: string } | null = null;
    @observable public thumbnail: JSX.Element | null = null;

    @observable public colorSet: ColorSet | null = null;

    @observable public artists: Artist[] | null = null;
    @observable public releases: Release[] | null = null;

    constructor(summary: TrackSummary, preload = false, onTrackEnd: () => void) {

        autorun(() => {
            if ((!this.isPlaying || this.targetState === "unloaded") && this.howl != null && this.howl.playing()) {
                console.error("howler was not stopped for uuid=" + this.uuid);
                this.howl.stop();
            }
        });

        this.onTrackEnd = onTrackEnd;

        this.name = summary.name;
        this.uuid = summary.uuid;
        this.audioUrl = getSourceUrlFromEntity(summary, "audio");
        this.albumArtUrl = getSourceUrlFromEntity(summary, "image");
        this.thumbnailUrl = getSourceUrlFromEntity(summary, "thumbnail");

        if (preload) {
            this.load();
        }
    };

    public play() {
        if (this.isPlaying) {
            return;
        }

        this.isPlaying = true;

        if (this.targetState !== "loaded") {
            console.log("called play() for an unloaded track uuid=" + this.uuid);
            return;
        }

        if (this.howl == null) {
            console.log("howl is null for uuid=" + this.uuid);
            return;
        }

        if (this.howlId != null && this.seekPosition != null) {
            this.howl.seek(this.seekPosition, this.howlId);
            this.howl.play();
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

        if (this.targetState !== "loaded") {
            console.log("called pause() for an unloaded track uuid=" + this.uuid);
        }

        if (this.howl == null) {
            console.log("howl is null for uuid=" + this.uuid);
            return;
        }

        if (this.howlId != null) {
            this.seekPosition = (this.howl.seek(undefined, this.howlId) as number)
        }

        this.howl.pause();
    }

    public stop() {
        this.isPlaying = false;

        if (this.targetState !== "loaded") {
            console.log("called stop() for an unloaded track uuid=" + this.uuid);
        }

        if (this.howl == null) {
            console.log("howl is null for uuid=" + this.uuid);
            return;
        }

        this.howl.stop();
        this.howlId = null;
        this.seekPosition = null;
    }

    public load() {
        console.log("called load for uuid=" + this.uuid)
        if (this.targetState === "loaded") {
            return;
        }

        this.targetState = "loaded";

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
    }

    public unload() {
        console.log("called unload for uuid=" + this.uuid)
        if (this.targetState === "unloaded") {
            return;
        }

        this.targetState = "unloaded";

        if (this.howl != null) {
            this.howl.stop()
            this.howl.off("end")
            this.howl.unload();
            this.howl = null;
        }

        this.thumbnail = null;
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