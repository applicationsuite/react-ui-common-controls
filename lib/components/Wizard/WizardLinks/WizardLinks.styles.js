export const wizardLinksStyles = (theme) => ({
    mainClass: {
        '& button': {
            border: 'none',
            background: 'none',
            display: 'flex',
            cursor: 'pointer',
            paddingTop: 5,
            paddingBottom: 5,
            '& i': {
                marginRight: '6px',
                color: '#999999',
                zIndex: 2
            },
            '& i.completed': {
                color: 'green'
            },
            '& i.active': {
                color: '#0078d4'
            },
            '& i.started': {
                color: 'blue'
            },
            '& i.blocked': {
                color: '#999999'
            },
            '& i.error': {
                color: 'red'
            }
        }
    },
    connectorDashedHorizental: {
        borderTop: '1px dashed #999999',
        width: '14px',
        marginTop: '0px'
    },
    connectorSolidHorizental: {
        borderTop: `1px solid #0078d4`,
        width: '14px',
        marginTop: '0px'
    },
    connectorCompletedHorizental: {
        borderTop: `1px solid green`,
        width: '14px',
        marginTop: '16px'
    },
    clickableSection: {
        cursor: 'pointer'
    },
    stepClass: {
        marginTop: '10px',
        minHeight: '30px',
        padding: '5px',
        position: 'relative',
        borderLeft: '4px solid transparent',
        cursor: 'pointer',
        '&:hover': {
            background: '#0078d4'
        },
        margin: '0px 0px 5px 0px'
    },
    stepClassActive: {
        marginTop: '10px',
        minHeight: '30px',
        padding: '5px',
        position: 'relative',
        borderLeft: `4px solid #0078d4`,
        background: 'grey',
        cursor: 'pointer',
        margin: '0px 0px 5px 0px'
    },
    stepClassActiveHorizontal: {
        marginTop: '10px',
        minHeight: '30px',
        padding: '5px',
        position: 'relative',
        borderBottom: `4px solid #0078d4`,
        background: 'grey',
        cursor: 'pointer',
        margin: '0px 0px 5px 0px'
    },
    collapseLink: {
        padding: '0px',
        paddingTop: '4px'
    },
    connectorDashed: {
        borderLeft: '1px dashed #999999',
        position: 'absolute',
        marginLeft: '11.5px',
        top: '18px',
        height: 'calc(100% - 2px)',
        zIndex: 1
    },
    connectorSolid: {
        borderLeft: `1px solid #0078d4`,
        position: 'absolute',
        marginLeft: '11.5px',
        top: '18px',
        height: 'calc(100% - 2px)',
        zIndex: 1
    },
    connectorCompleted: {
        borderLeft: `1px solid #0078d4`,
        position: 'absolute',
        marginLeft: '11.5px',
        top: '18px',
        height: 'calc(100% - 2px)',
        zIndex: 1
    },
    accordionHeader: {
        marginBottom: '10px',
        marginTop: '10px',
        '& button': {
            paddingBottom: '5px !important'
        },
        '& br': {
            display: 'none'
        }
    },
    activeStep: {
        fontWeight: 400,
        whiteSpace: 'nowrap'
    },
    stepText: {
        whiteSpace: 'nowrap'
    },
    stepDetailsClass: {
        display: 'flex'
    },
    stepDetails: {
        marginLeft: '23px',
        marginBottom: '5px'
    },
    horizontalSeparator: {
        padding: '5px',
        paddingTop: '20px'
    }
});
