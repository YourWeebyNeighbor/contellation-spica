import React, { CSSProperties } from 'react'
import PlayableTrack from '../../model/store/playback/PlayableTrack'
import ColorStore from '../../model/store/color/ColorStore'
import { Flipped, spring } from 'react-flip-toolkit'
import TrackListItem from './TrackListItem'
import { ItemSlideDirection } from './TrackList'

const AnimatedTrackListItem = React.memo(({ track, colorStore, direction, style }: { track: PlayableTrack, colorStore: ColorStore, direction: ItemSlideDirection, style: CSSProperties }) => {

    return (
        <Flipped
            flipId={track.uuid}
            key={track.uuid}

            onExit={(element, index, removeElement) => {
                spring({
                    onUpdate: val => {
                        const value = val as number

                        element.style.transform = `translate(0, ${direction === "up" ? "-" : ""}${value * 100}%)`
                        element.style.opacity = `${value < 0.5 ? 1 : (1 - ((value - 0.5) * 2))}`
                    },
                    onComplete: removeElement
                });
            }}
            
            onAppear={(element) => {
                spring({
                    onUpdate: val => {
                        const value = val as number

                        element.style.transform = `translate(0, ${direction === "up" ? "-" : ""}${(1 - value) * 100}%)`
                        element.style.opacity = `${value > 0.5 ? 1 : value * 2}`
                        
                    }
                })
            }}
        >
            <div style={style}>
                <TrackListItem track={track} colorStore={colorStore} />
            </div>
        </Flipped>
    )
})

export default AnimatedTrackListItem;