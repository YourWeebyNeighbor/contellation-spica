import React from 'react';
import { observer } from 'mobx-react';
import PlaybackStore from '../model/store/playback/PlaybackStore';

const AudioSourceContainer = observer(({ store }: { store: PlaybackStore }) => {

    return (
        <div className="audio-container">
            {store.current ? (
                <audio src={store.current.audioUrl} preload="auto" autoPlay={store.playbackState === "playing"}
                    onWaiting={() => {
                        store.isWaiting = true
                    }}

                    onStalled={() => {
                        store.isWaiting = true
                    }}

                    onCanPlay={() => {
                        store.isWaiting = false
                    }}

                    onCanPlayThrough={() => {
                        store.isWaiting = false
                    }}

                    onEnded={() => {
                        store.skipNext()
                    }}

                    onLoadStart={(event) => {
                        store.isWaiting = true

                        const audioElement = event.currentTarget

                        store.playHandler = () => {
                            audioElement.play()
                        }

                        store.pauseHandler = () => {
                            audioElement.pause()
                        }

                        store.currentTrackDuration = audioElement.duration

                        audioElement.ontimeupdate = () => {
                            store.currentTrackPosition = audioElement.currentTime || null
                        }

                        audioElement.ondurationchange = () => {
                            store.currentTrackDuration = audioElement.duration || null
                        }

                    }}
                />
            ) : null
            }

        </div>
    )
})

export default AudioSourceContainer