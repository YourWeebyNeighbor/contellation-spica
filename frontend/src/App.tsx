import React from 'react';
import PlaybackStore from './model/store/playback/PlaybackStore';
import ColorStore from './model/store/color/ColorStore';
import Navigation from './components/navigation/Navigation';
import Extractors from './components/Extractors';
import AudioController from './components/playback/AudioSource';
import MediaSessionController from './components/playback/MediaSessionController';
import MediaSessionKeeper from './components/playback/MediaSessionKeeper';

import './App.css';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core';

export default function App() {
  const playbackStore = new PlaybackStore();
  const colorStore = new ColorStore();

  playbackStore.loadQueue()

  const theme = createMuiTheme({
    palette: {
      type: 'dark',
      primary: {
        main: '#66d9ff'
      },
      secondary: {
        main: '#cdff66'
      }

    }
  })

  return (
    <React.Fragment>
      <MuiThemeProvider theme={theme}>
        <Navigation playbackStore={playbackStore} colorStore={colorStore} />
      </MuiThemeProvider>

      <Extractors store={colorStore} />
      <AudioController store={playbackStore} />
      <MediaSessionController store={playbackStore} />
      <MediaSessionKeeper store={playbackStore} />
    </React.Fragment>
  );
}