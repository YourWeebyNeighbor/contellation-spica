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
        flexDirection: 'column'
    },

    down: {
        flexDirection: 'column-reverse'
    },

    filler: {
        width: '100%',
        height: 130,
        flexShrink: 0,
        zIndex: -1,
    }
})

const TrackList = observer(({ tracks, colorStore, direction, enableUpdates }:
    { tracks: PlayableTrack[], direction: ItemSlideDirection, colorStore: ColorStore, enableUpdates: boolean }) => {

    const styles = useStyles()

    const [container, setContainer] = useState<HTMLDivElement>()

    const isUp = (direction === "up")

    return (
        <motion.div ref={(element) => setContainer(element!)} className={[styles.list, isUp ? styles.up : styles.down].join(" ")} positionTransition>
            <div className={styles.filler} key="filler" />
            <AnimatePresence>
                {tracks.map(track => (
                    <motion.div
                        positionTransition

                        key={track.uuid}
                        animate={{ opacity: 1, translateY: 0 }}
                        exit={{ opacity: 0, translateY: isUp ? -20 : 20 }}
                        style={{ opacity: 0, translateY: isUp ? -20 : 20 }}

                        transition={{
                            duration: 0.20,
                            ease: "easeInOut"
                        }}
                    >

                        <TrackListItem container={container!} enableUpdates={enableUpdates} colorStore={colorStore} track={track} />
                    </motion.div>


                ))}
            </AnimatePresence>
        </motion.div>
    )
})


export default TrackList