import React, { useState } from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import PlaylistPlayIcon from '@material-ui/icons/PlaylistPlayRounded';
import LibraryMusicIcon from '@material-ui/icons/LibraryMusicRounded';
import SearchIcon from '@material-ui/icons/SearchRounded';
import SearchView from '../search/SearchView';
import ExploreView from '../explore/ExploreView';
import PlaybackView from '../playback/PlaybackView';
import PlaybackStore from '../../model/store/playback/PlaybackStore';
import ColorStore from '../../model/store/color/ColorStore';

const useStyles = makeStyles({
    rootVertical: {
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column'
    },
    rootHorizontal: {
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'row'
    },

    contentWrapper: {
        flexGrow: 1,
        display: 'flex',
        overflow: 'hidden'
    },

    bottomBar: {
        width: '100%'
    },
    sideBar: {
        width: '55px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },

    sideAction: {
        minWidth: '55px'
    }
});

type States = "search" | "play" | "browse"

export default function Navigation({ playbackStore, colorStore }: { playbackStore: PlaybackStore, colorStore: ColorStore }) {
    const [navState, setNavState] = useState<States>("play")

    const isLandscape = useMediaQuery('(orientation: landscape)')

    const styles = useStyles()

    const content = () => {
        if (navState === "search") return (
            <SearchView key="search" />
        )
        if (navState === "browse") return (
            <ExploreView key="browse" />
        )
        if (navState === "play") return (
            <PlaybackView key="play" playbackStore={playbackStore} colorStore={colorStore} />
        )
    }

    return isLandscape
        ? (
            <div className={styles.rootHorizontal}>
                <BottomNavigation value={navState} className={styles.sideBar}
                    onChange={(event: React.ChangeEvent<{}>, newValue: States) => {
                        setNavState(newValue);
                    }}
                >
                    <BottomNavigationAction className={styles.sideAction} label="Browse" value="browse" icon={<LibraryMusicIcon />} />
                    <BottomNavigationAction className={styles.sideAction} label="Search" value="search" icon={<SearchIcon />} />
                    <BottomNavigationAction className={styles.sideAction} label="Play" value="play" icon={<PlaylistPlayIcon />} />
                </BottomNavigation>
                <div className={styles.contentWrapper}>
                    {content()}
                </div>
            </div>
        )
        : (
            <div className={styles.rootVertical}>
                <div className={styles.contentWrapper}>
                    {content()}
                </div>
                <BottomNavigation value={navState} className={styles.bottomBar}
                    onChange={(event: React.ChangeEvent<{}>, newValue: States) => {
                        setNavState(newValue);
                    }}
                >
                    <BottomNavigationAction label="Browse" value="browse" icon={<LibraryMusicIcon />} />
                    <BottomNavigationAction label="Search" value="search" icon={<SearchIcon />} />
                    <BottomNavigationAction label="Play" value="play" icon={<PlaylistPlayIcon />} />
                </BottomNavigation>
            </div>
        )
}