import React from 'react'
import { observer } from 'mobx-react'
import { makeStyles } from '@material-ui/styles'
import PlaybackStore from '../../../model/store/playback/PlaybackStore'
import ColorStore from '../../../model/store/color/ColorStore'
import TrackList from '../../common/lists/TrackList'

const useStyles = makeStyles({
    history: {
        height: '100%',
        width: '100%'
    }
})

const History = observer(({ store, colorStore, enableUpdates }: { enableUpdates: boolean, store: PlaybackStore, colorStore: ColorStore }) => {
    const styles = useStyles()

    return (
        <div className={styles.history}>
            <TrackList enableUpdates={enableUpdates} direction="down" tracks={store.history} colorStore={colorStore} />
        </div>
    )
})

export default History