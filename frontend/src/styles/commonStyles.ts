import { makeStyles } from "@material-ui/styles"

const useCommonStyles = makeStyles({
    albumArt: {
        height: 70,
        width: 70,
        borderRadius: 10,
        overflow: 'hidden',
        margin: 5,
    },

    button: {
        borderRadius: 20,
        height: 40,

        '& svg': {
            height: '100%',
            width: 'auto'
        }
    },

    buttonLarge: {
        borderRadius: 35,
        height: 70,

        '& svg': {
            height: '100%',
            width: 'auto'
        }
    },

    disabledButton: {
        opacity: 0.4,
        cursor: 'pointer',
    },
})

export default useCommonStyles