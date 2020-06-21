import React from 'react';
import Player from './player/Player';
import PlaybackStore from '../../model/store/playback/PlaybackStore';
import History from './History';
import Queue from './Queue';
import ColorStore from '../../model/store/color/ColorStore';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
    container: {
        position: 'relative',
        height: '100%',
        width: '100%'
    }
})

export default function PlaybackView({ playbackStore, colorStore }: { playbackStore: PlaybackStore, colorStore: ColorStore }) {

    const styles = useStyles()

    return (
        <div className={styles.container}>
            {/* <History store={playbackStore} footer={filler} colorStore={colorStore} /> */}
            <Player store={playbackStore} colorStore={colorStore} />
            <Queue store={playbackStore} colorStore={colorStore} />
        </div>
    );
}