import React from 'react'
import PlayableTrack from '../../model/store/playback/PlayableTrack'
import "../../styles/trackList.scss"
import ColorStore from '../../model/store/color/ColorStore'
import { observer } from 'mobx-react'
import { Flipper } from 'react-flip-toolkit'
import AnimatedTrackListItem from './AnimatedTrackListItem'
import { FixedSizeList, ListChildComponentProps } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import { HandleEnterUpdateDeleteArgs } from 'react-flip-toolkit/lib/FlipToolkit/types'

export type ItemState = "normal" | "inserting" | "removing"

export type ItemSlideDirection = "up" | "down" | null

export interface WrappedListItem {
    state: ItemState
    track: PlayableTrack
}

const TrackList = observer(({ tracks, colorStore, direction }:
    { tracks: PlayableTrack[], direction: ItemSlideDirection, colorStore: ColorStore }) => {

    const rows = (props: ListChildComponentProps) => {

        if ((props.index < 2 && direction === "up")
            || (props.index > tracks.length + 3 && direction === "down")) return (
                <React.Fragment>
                    <div className="player-filler" />
                </React.Fragment>
            )

        return (<AnimatedTrackListItem
            style={props.style}
            track={tracks[props.index - 2]}
            colorStore={colorStore}
            direction={direction}

        />)
    }

    return (
        <Flipper
            className="track-list"
            flipKey={tracks.map(item => item.uuid).join()}
            handleEnterUpdateDelete={({ ...args }: HandleEnterUpdateDeleteArgs) => {
                args.hideEnteringElements()
                args.animateEnteringElements()
                args.animateExitingElements()
                args.animateFlippedElements()
            }}
        >
            <AutoSizer>
                {(size) =>
                    <FixedSizeList
                        itemSize={65}
                        itemCount={tracks.length + 2}
                        width={size.width}
                        height={size.height}>
                        {rows}
                    </FixedSizeList>}
            </AutoSizer>

        </Flipper>
    )
})


export default TrackList