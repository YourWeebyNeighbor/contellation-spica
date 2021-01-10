import React, { createRef, useRef, useState } from 'react'
import PlayableTrack from '../../../model/store/playback/PlayableTrack'
import ColorStore from '../../../model/store/color/ColorStore'
import { observer } from 'mobx-react'
import { motion, AnimatePresence } from 'framer-motion'
import TrackListItem from './TrackListItem'
import { makeStyles } from '@material-ui/styles'

export type ItemSlideDirection = "up" | "down" | null

const useStyles = makeStyles({
    list: {
        height: '100%',
        width: '100%',
        overflowX: 'hidden',
        overflowY: 'scroll',
        position: 'relative',
        display: 'flex'
    },

    up: {
        flexDirection: 'column',
    },

    down: {
        flexDirection: 'column-reverse',
    },

    filler: {
        width: '100%',
        height: 130,
        flexShrink: 0,
        zIndex: -1,
        color: 'gray',
        textAlign: 'center',
        display: 'flex',
        padding: 10,
        boxSizing: 'border-box',
    }
})

const TrackList = observer(({ tracks, colorStore, direction, fillerText }:
    { tracks: PlayableTrack[], direction: ItemSlideDirection, colorStore: ColorStore, fillerText: String }) => {

    const styles = useStyles()

    const [container, setContainer] = useState<HTMLDivElement>()

    const isUp = (direction === "up")

    const [selectedItem, setSelectedItem] = useState<{ itemIndex: number, isSelected: boolean, isDragged: boolean, dropIndex: number | null }>();

    const moveTrack = (track: PlayableTrack, currentIndex: number, offset: number) => {
        const indexToInsertAt = Math.max(Math.min(0, currentIndex + offset), tracks.length)
        console.log(indexToInsertAt)
        setSelectedItem({ dropIndex: indexToInsertAt, isDragged: true, isSelected: false, itemIndex: currentIndex })
    }

    const tracksToRender = tracks.flatMap((track, index) => [
        (index == selectedItem?.dropIndex ? (
            <motion.div key="drop-hint" style={{ height: 80, width: "100%", backgroundColor: "gray" }} />
        ) : null),

        (
            <TrackListItem
                moveTrack={moveTrack}
                key={index}
                direction={direction}
                container={container!}
                colorStore={colorStore}
                index={index}
                track={track}
            />
        )
    ]).filter(item => item != null)

    return (
        <motion.div ref={(element) => setContainer(element!)} className={[styles.list, isUp ? styles.up : styles.down].join(" ")} layout="position">
            <div className={[styles.filler, direction == "up" ? styles.down : styles.up].join(" ")} key="filler" >{fillerText}</div>

            <AnimatePresence>
                {tracksToRender}
            </AnimatePresence>
        </motion.div>
    )
})


export default TrackList