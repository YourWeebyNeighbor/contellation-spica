import React, { useState } from 'react';
import { observer } from 'mobx-react';
import PlaybackStore from '../../model/store/playback/PlaybackStore';

interface ContainerProps {
    playbackState: "paused" | "playing"
    currentUrl: string,
    nextUrl: string,
    onWaiting: () => void
    onStalled: () => void
    onCanPlay: () => void
    onCanPlayThrough: () => void
    onEnded: () => void
    onLoadStart: (event: React.SyntheticEvent<HTMLAudioElement, Event>) => void
}

let audioRef = React.createRef<HTMLAudioElement>()

const Container = (props: ContainerProps) => {
    const [isFullyloaded, setFullyLoaded] = useState(false)

    return (
        <div className="audio-container">
            <audio key="current-track" ref={audioRef} src={props.currentUrl} preload="auto" autoPlay={props.playbackState === "playing"}

                onWaiting={props.onWaiting}
                onStalled={props.onStalled}
                onCanPlay={props.onCanPlay}
                onCanPlayThrough={() => {
                    setFullyLoaded(true)
                    props.onCanPlayThrough()
                }}
                onEnded={props.onEnded}
                onLoadStart={props.onLoadStart}
            />
            {isFullyloaded
                ? (<audio key={`buffer-${props.nextUrl}`} src={props.nextUrl} preload="auto" autoPlay={false} />)
                : null}


        </div>
    )
}

const HtmlAudioService = observer(({ store }: { store: PlaybackStore }) => {

    const props: ContainerProps = {

        playbackState: store.playbackState,

        currentUrl: store.current?.audioUrl || "",

        nextUrl: store.hasNext ? store.queue[0].audioUrl : "",

        onWaiting: () => {
            store.isWaiting = true
        },

        onStalled: () => {
            store.isWaiting = true
        },

        onCanPlay: () => {
            store.isWaiting = false
        },

        onCanPlayThrough: () => {
            store.isWaiting = false
        },

        onEnded: () => {
            store.skipNext()
        },

        onLoadStart: (event) => {
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

        }
    }

    return (
        <Container {...props} />
    )
})

export default HtmlAudioService