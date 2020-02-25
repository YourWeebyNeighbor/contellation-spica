import { observable, computed, action } from 'mobx'
import { getCollection } from '../../../utils/SpicaRestClient';
import PlayableTrack from './PlayableTrack';
import TrackSummary from '../../libraryEntities/TrackSummary';

export const HISTORY_SIZE = 100
export const LOADED_TRACKS_WINDOW = 3;

export default class PlaybackStore {
    @observable playbackState: "paused" | "playing" = "paused"

    @observable queue: PlayableTrack[] = []
    @observable current: PlayableTrack | null = null
    @observable history: PlayableTrack[] = []

    @computed get isPlaying(): boolean {
        return this.playbackState === "playing"
    }

    @computed get currentTrack(): PlayableTrack | null {
        return this.current
    }

    @computed get hasCurrent(): boolean {
        return this.current != null
    }

    @computed get hasNext(): boolean {
        return this.queue.length > 0
    }

    @computed get hasPrevious(): boolean {
        return this.history.length > 0
    }

    @computed get historySize(): number {
        return this.history.length
    }

    @computed get queueSize(): number {
        return this.queue.length
    }

    @action play = () => {
        if (!this.current) {
            return
        }

        this.playbackState = "playing"
        this.current.play()
    }

    @action pause = () => {
        if (!this.current) {
            return
        }

        this.playbackState = "paused"
        this.current.pause()
    }

    @action skipNext = () => {
        if (!this.current) {
            return
        }

        this.current.stop()

        if (this.hasNext) {
            this.history.unshift(this.current)
            this.current = this.queue.shift() as PlayableTrack
        } else {
            this.playbackState = "paused"
        }

        if (this.playbackState === "playing") {
            this.current.play();
        }
    }

    @action skipPrevious = () => {
        if (!this.current) {
            return
        }

        this.current.stop()

        if (this.hasPrevious) {
            this.queue.unshift(this.current)
            this.current = this.history.shift() as PlayableTrack
        } else {
            this.playbackState = "paused"
        }

        if (this.playbackState === "playing") {
            this.current.play();
        }
    }

    @action addToQueue = (entity: TrackSummary) => {
        const newTrack = new PlayableTrack(entity, this.skipNext);

        if (!this.current) {
            this.current = newTrack
        } else {
            this.queue.push(newTrack)
        }
    }

    @action clearQueue = () => {
        this.queue = []
        this.playbackState = "paused"
    }

    @action clearHistory = () => {
        this.history = []
    }

    @action loadQueue = () => {
        getCollection<TrackSummary>("track").then(data => {
            data.forEach(item => this.addToQueue(item));
        }).catch(error => {
            console.error(`unable to itialize queue: ${error}`, error)
        })
    }
}