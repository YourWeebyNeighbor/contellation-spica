import React, { useState } from 'react';
import { ColorSet, getCssHsvColorString } from '../../../utils/ColorTools'
import PlaybackStore from '../../../model/store/playback/PlaybackStore';
import { observer } from 'mobx-react';
import { getSmallThumbUrl } from '../../../utils/ThumbTools';
import { AnimateSharedLayout, motion, useSpring, useTransform } from 'framer-motion';
import { makeStyles } from '@material-ui/styles';
import CompactPlayer from './CompactPlayer';
import ColorStore from '../../../model/store/color/ColorStore';
import FullScreenPlayer from './FullScreenPlayer';
import PlayerAlbumArt from './displays/PlayerAlbumArt';
import Queue from './Queue';
import History from './History';
import { Height } from '@material-ui/icons';

export const DEFAULT_COLORS: ColorSet = {
    background: {
        hue: 0,
        saturation: 0,
        value: 20
    },
    text: {
        hue: 0,
        saturation: 0,
        value: 80
    },
    accent: {
        hue: 0,
        saturation: 0,
        value: 80
    }
}

const useStyles = makeStyles({
    outer: {
        position: 'absolute',
        zIndex: 3,

        overflow: 'hidden',

        height: '100%',
        width: '100%',

        boxShadow: 'rgba(0, 0, 0, 0.2) 0px 3px 3px -2px, rgba(0, 0, 0, 0.14) 0px 3px 4px 0px, rgba(0, 0, 0, 0.12) 0px 1px 8px 0px;',

        backdropFilter: 'blur(20px) contrast(80%)',
        backgroundBlendMode: 'exclusion',
        backgroundImage: `url(data:image/png;base64,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)`,
        backgroundRepeat: 'repeat',
        backgroundSize: 24,

        borderRadius: 15
    },

    inner: {
        position: 'absolute',
        width: '100%',
        height: '100%',

        display: 'flex',
        flexDirection: 'column',
    },

    placeholder: {

    },

    playerWrapperSnapZone: {
        height: 'calc(100% + 260px)',
        width: '100%',
        position: 'absolute',
        boxSizing: 'border-box'
    },

    playerBounds: {
        height: '100%',
        width: '100%'
    },

    top: {
        bottom: 'calc(100% - 130px)'
    },

    center: {
        top: '-130px'
    },

    bottom: {
        top: 'calc(100% - 130px)'
    },

    trackListWrapper: {
        position: 'absolute',
        height: '300%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column'
    },

    trackList: {
        width: '100%',
        overflow: 'hidden',
        flexGrow: 1,
        flexBasis: 0
    },

    backgroundAlbumArt: {
        width: '100%',
        overflow: 'hidden',
        flexGrow: 1,
        flexBasis: 0,
        objectFit: 'cover',
        display: 'flex'
    }
})

const offsetThreshold = 500
const velocityThreshold = 500

const PlayerWrapper = observer(({ store, colorStore }: { store: PlaybackStore, colorStore: ColorStore }) => {

    const [position, setPosition] = useState<"center" | "top" | "bottom">("center")
    const [playerViewHeight, setPlayerViewHeight] = useState<number>(0)
    const styles = useStyles()

    const track = store.currentTrack;

    if (track == null) {
        return (<div className={styles.placeholder} />)
    }

    const thumbUrl = getSmallThumbUrl(track.thumbnails)

    colorStore.extractColor(thumbUrl)

    const colors = thumbUrl != null ? colorStore.cachedColorSets.get(thumbUrl) || DEFAULT_COLORS : DEFAULT_COLORS;
    const backgroundColor = getCssHsvColorString(colors.background, 0.6)

    const player = (
        <motion.div
            layoutId="player-outer"
            key="outer"
            drag="y"
            className={styles.outer}

            style={{
                backgroundColor: backgroundColor,
            }}

            dragMomentum={true}
            dragConstraints={{ bottom: 0, top: 0 }}
            transition={{ type: "spring", bounce: 0 }}

            dragElastic={0.7}

            onDragEnd={(event, info) => {
                const velocity = info.velocity.y
                const offset = info.delta.y

                const isScrollingDown = velocity > velocityThreshold || offset > offsetThreshold
                const isScrollingUp = velocity < (-velocityThreshold) || offsetThreshold < (-offsetThreshold)

                if ((position === "bottom" && isScrollingUp) || (position === "top" && isScrollingDown)) {
                    setPosition("center")
                } else if (position == "center" && isScrollingDown) {
                    setPosition("bottom")
                } else if (position == "center" && isScrollingUp) {
                    setPosition("top")
                }
            }}
        >
            <motion.div
                key="inner"
                className={styles.inner}
            >
                <motion.div>
                    <CompactPlayer isMoving={false} invert={true} store={store} colorStore={colorStore} />
                </motion.div>

                <motion.div style={{ flexGrow: 1, minHeight: 0 }}>
                    <FullScreenPlayer isMoving={false} store={store} colorStore={colorStore} />
                </motion.div>

                <motion.div>
                    <CompactPlayer isMoving={false} invert={false} store={store} colorStore={colorStore} />
                </motion.div>

            </motion.div>
        </motion.div >
    )

    return (
        <React.Fragment>
            <div key="player-bounds" className={styles.playerBounds} ref={(ref) => setPlayerViewHeight(ref?.getBoundingClientRect().height || 0)}>
                <AnimateSharedLayout>
                    <div key="player-bounds-top" className={styles.playerWrapperSnapZone + " " + styles.top} >
                        {position === "top" ? player : null}
                    </div>

                    <div key="player-bounds-center" className={styles.playerWrapperSnapZone + " " + styles.center} >
                        {position === "center" ? player : null}
                    </div>

                    <div key="player-bounds-bottom" className={styles.playerWrapperSnapZone + " " + styles.bottom} >
                        {position === "bottom" ? player : null}
                    </div>
                </AnimateSharedLayout>
            </div>

            <motion.div
                key="trackList"
                className={styles.trackListWrapper}

                variants={{
                    bottom: {
                        top: 0
                    },

                    top: {
                        top: -(playerViewHeight * 2)
                    },

                    center: {
                        top: -playerViewHeight
                    }

                }}

                animate={position || "center"}

                transition={{ type: "spring", bounce: 0 }}

                >
                <div className={styles.trackList}>
                    <History store={store} colorStore={colorStore} />
                </div>
                <div className={styles.backgroundAlbumArt}>
                    <PlayerAlbumArt thumbnails={track?.thumbnails || []} />
                </div>
                <div className={styles.trackList}>
                    <Queue store={store} colorStore={colorStore} />
                </div>
            </motion.div>

        </React.Fragment>
    )
})

export default PlayerWrapper