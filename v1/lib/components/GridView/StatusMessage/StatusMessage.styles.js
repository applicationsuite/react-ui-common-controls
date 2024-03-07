export const statusMessageStyles = (theme) => ({
    messageTypeInfo: {
        '&.ms-MessageBar--information': {
            background: '#F3F2F1'
        }
    },
    featureAlert: {
        '&.ms-MessageBar--success': {
            background: '#DFF6DD'
        },
        '&.ms-MessageBar--error': {
            background: '#FDE7E9'
        },
        '&.ms-MessageBar--blocked': {
            background: '#FDE7E9'
        },
        '&.ms-MessageBar--warning': {
            background: '#FFF4CE'
        }
    },
    statusMessages: {
        '& .ms-MessageBar': {
            marginTop: '5px',
            marginBottom: '5px'
        }
    }
});
