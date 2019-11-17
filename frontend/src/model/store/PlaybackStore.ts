import { observable, computed, action, autorun } from 'mobx'
import { getCollection } from '../../utils/SpicaRestClient';
import PlayableTrack from './PlayableTrack';
import TrackSummary from '../libraryEntities/TrackSummary';

export const HISTORY_SIZE = 100
export const LOADED_TRACKS_WINDOW = 3;

export default class PlaybackStore {
    @observable playbackState: "paused" | "playing" = "paused"

    @observable queue: PlayableTrack[] = []
    @observable history: PlayableTrack[] = []

    constructor() {
        autorun(() => {
            this.queue.slice(LOADED_TRACKS_WINDOW + 1, this.queue.length).filter(item => item.targetState === "loaded").forEach(item => item.unload());
            this.queue.slice(0, LOADED_TRACKS_WINDOW + 1).filter(item => item.targetState === "unloaded").forEach(item => item.load())
            this.queue.slice(1, this.queue.length).filter(item => item.isPlaying).forEach(item => item.stop());

            this.history.slice(LOADED_TRACKS_WINDOW + 1, this.queue.length).filter(item => item.targetState === "loaded").forEach(item => item.unload());
            this.history.slice(0, LOADED_TRACKS_WINDOW + 1).filter(item => item.targetState === "unloaded").forEach(item => item.load())
            this.history.filter(item => item.isPlaying).forEach(item => item.stop());
        })
    }

    @computed get isPlaying(): boolean {
        return this.playbackState === "playing"
    }

    @computed get currentTrack(): PlayableTrack | null {
        return this.queue.length > 0 ? (this.queue[0] as PlayableTrack) : null
    }

    @computed get hasCurrent(): boolean {
        return this.queue.length > 0
    }

    @computed get hasNext(): boolean {
        return this.queue.length > 1
    }

    @computed get hasPrevious(): boolean {
        return this.history.length > 0
    }

    @computed get historySize(): number {
        return this.history.length
    }

    @computed get queueSize(): number {
        return Math.max(this.queue.length - 1, 0)
    }

    @action play = () => {
        this.playbackState = "playing"

        if (this.queue.length > 0) {
            (this.queue[0] as PlayableTrack).play();
        }
    }

    @action pause = () => {
        this.playbackState = "paused"

        if (this.queue.length > 0) {
            (this.queue[0] as PlayableTrack).pause();
        }
    }

    @action skipNext = () => {
        (this.queue[0] as PlayableTrack).stop();

        if (this.hasNext) {
            const skipped = this.queue.shift()
            this.history.unshift(skipped as PlayableTrack)
        } else {
            this.playbackState = "paused"
        }

        while (this.history.length > HISTORY_SIZE) {
            (this.history.pop() as PlayableTrack).unload();
        }

        if (this.playbackState === "playing") {
            (this.queue[0] as PlayableTrack).play();
        }
    }

    @action skipPrevious = () => {
        (this.queue[0] as PlayableTrack).stop();

        if (this.hasPrevious) {
            const skipped = this.history.shift()
            this.queue.unshift(skipped as PlayableTrack)
        }

        if (this.playbackState === "playing") {
            (this.queue[0] as PlayableTrack).play();
        }
    }

    @action addToQueue = (entity: TrackSummary) => {
        this.queue.push(new PlayableTrack(entity, false, this.skipNext))
    }

    @action clearQueue = () => {
        this.queue.forEach(track => { track.unload(); })
        this.queue = []
        this.playbackState = "paused"
    }

    @action clearHistory = () => {
        this.history.forEach(track => { track.unload(); })
        this.history = []
    }

    @action loadQueue = () => {
        getCollection<TrackSummary>("track").then(data => {
            this.queue = data.map(item => new PlayableTrack(item, false, this.skipNext));
        }).catch(error => {
            console.log(`unable to itialize queue: ${error}`)
        })
    }
}