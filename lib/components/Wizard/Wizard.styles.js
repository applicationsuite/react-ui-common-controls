export const wizardStyles = (theme) => ({
    wizardVertical: {
        height: '100%'
    },
    wizardLinks: {
        width: '20%',
        maxWidth: '20%',
        overflow: 'auto'
    },
    wizardContainer: {
        marginLeft: '0px !important',
        width: '80%',
        maxWidth: '80%',
        overflow: 'auto',
        height: '100%'
    },
    wizardDivider: {
        marginLeft: '0px !important',
        '& div': {
            width: 1,
            background: 'grey',
            height: 'calc(100vh)'
        }
    }
});
