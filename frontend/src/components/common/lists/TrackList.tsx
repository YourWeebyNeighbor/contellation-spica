import React from 'react'
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
        position: 'relative',

    },

    filler: {
        width: '100%',
        height: 130,
        zIndex: -1,
    }
})

const TrackList = observer(({ tracks, colorStore, direction }:
    { tracks: PlayableTrack[], direction: ItemSlideDirection, colorStore: ColorStore }) => {

    const styles = useStyles()

    return (
        <motion.div className={styles.list} layout>
            {direction === "up" ? (<div className={styles.filler} key="filler" />) : null}
            <AnimatePresence>
                {tracks.map(track => (
                    <motion.div
                        layout

                        key={track.uuid}
                        animate={{ opacity: 1, translateY: 0 }}
                        exit={{ opacity: 0, translateY: -20 }}
                        style={{ opacity: 0, translateY: -20 }}

                        transition={{
                            duration: 0.20,
                            ease: "easeInOut"
                        }}
                    >

                        <TrackListItem colorStore={colorStore} track={track} />
                    </motion.div>


                ))}
            </AnimatePresence>

            {direction === "down" ? (<div className={styles.filler} key="filler" />) : null}
        </motion.div>
    )
})


export default TrackList