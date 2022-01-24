export const filterLabelStyles = (theme) => ({
    filterLabel: {
        fontSize: 16,
        paddingBottom: '16px',
        fontWeight: '630'
    },
    accordionHeader: {
        '& h2': {
            fontSize: 14,
            cursor: 'pointer'
        },
        '& button': {
            minWidth: '20px !important',
            ':focus': {
                border: 'none !important'
            }
        }
    }
});
