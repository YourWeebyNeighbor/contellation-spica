import React from 'react';
import Player from './player/Player';
import PlaybackStore from '../model/store/playback/PlaybackStore';
import History from './lists/History';
import Queue from './lists/Queue';
import "../styles/commonComponents.scss";
import ColorStore from '../model/store/color/ColorStore';
import Extractors from './Extractors';
import AudioSourceContainer from './AudioSource';
import MediaSessionController from './MediaSessionController';

export default function PlaybackView() {
    const playbackStore = new PlaybackStore();
    const colorStore = new ColorStore();

    playbackStore.loadQueue()

    return (
        <React.Fragment>
            {/* <History store={playbackStore} footer={filler} colorStore={colorStore} /> */}
            <Player store={playbackStore} colorStore={colorStore} />
            <Queue store={playbackStore} colorStore={colorStore} />
            <Extractors store={colorStore} />
            <AudioSourceContainer store={playbackStore} />
            <MediaSessionController store={playbackStore} />
        </React.Fragment>
    );
}