import React from 'react';
import PlaybackStore from './model/store/playback/PlaybackStore';
import ColorStore from './model/store/color/ColorStore';
import Navigation from './components/navigation/Navigation';
import Extractors from './components/services/ColorExtractorService';
import HtmlAudioService from './components/services/HtmlAudioService';
import MediaSessionService from './components/services/MediaSessionService';

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
      <HtmlAudioService store={playbackStore} />
      <MediaSessionService store={playbackStore} />
    </React.Fragment>
  );
}