import React from 'react';
import PlaybackStore from '../../model/store/playback/PlaybackStore';
import History from './History';
import Queue from './Queue';
import ColorStore from '../../model/store/color/ColorStore';
import { makeStyles } from '@material-ui/core';
import PlayerWrapper from './player/PlayerWrapper';

const useStyles = makeStyles({
    container: {
        position: 'relative',
        height: '100%',
        width: '100%'
    },
    
    trackList: {
        height: '100%',
        width: '100%'
    }
})

const PlaybackView = ({ playbackStore, colorStore }: { playbackStore: PlaybackStore, colorStore: ColorStore }) => {

    const styles = useStyles()

    return (
        <div className={styles.container}>
            <PlayerWrapper key="player" store={playbackStore} colorStore={colorStore} />
            <div className={styles.trackList}>
                <History key="history" store={playbackStore} colorStore={colorStore} />
                <Queue key="queue" store={playbackStore} colorStore={colorStore} />
            </div>
        </div>
    );
}

export default PlaybackView