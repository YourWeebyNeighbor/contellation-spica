import React from 'react';
import PlaybackStore from '../../model/store/playback/PlaybackStore';
import ColorStore from '../../model/store/color/ColorStore';
import { makeStyles } from '@material-ui/core';
import PlayerWrapper from './player/PlayerWrapper';
import { observer } from 'mobx-react';

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

const PlaybackView = observer(({ playbackStore, colorStore }: { playbackStore: PlaybackStore, colorStore: ColorStore }) => {

    const styles = useStyles()

    return (
        <div className={styles.container}>
            <PlayerWrapper key="wrapper" store={playbackStore} colorStore={colorStore} />
        </div>
    );
})

export default PlaybackView