import { makeStyles } from "@material-ui/styles"

const useCommonStyles = makeStyles({
    albumArt: {
        height: 70,
        width: 70,
        borderRadius: 10,
        overflow: 'hidden',
        margin: 5,
    },

    playButton: {
        height: 40,
        width: 40,

        borderRadius: 20,

        '& svg': {
            height: '100%',
            width: '100%',
        }
    },

    skipButton: {
        height: 40,
        width: 40,

        borderRadius: 20,
    },

    disabledButton: {
        opacity: 0.4,
        cursor: 'pointer',
    },
})

export default useCommonStyles