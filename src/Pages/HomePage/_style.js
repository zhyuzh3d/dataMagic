const styles = theme => ({
    card: {
        padding: 12,
        margin: 8,
    },
    cardTitle: {
        fontSize: 12,
        color: '#444',
    },
    tf: {
        width: '100%',
        margin: '12px 0',
    },
    valueRow: {
        width: '100%',
        display: 'flex',
        fontSize: 14,
        margin: '8px 0',
    },
    rowLabel: {
        color: '#AAA',
        flexGrow: 'initial',
        marginRight: 12,
        minWidth: 48
    },
    rowContent: {
        flexGrow: 1,
        color: '#000',
        fontSize: 14,
        maxHeight: 120,
        overflowY: 'scroll'
    },
    button: {
        marginRight: 12
    },
    note: {
        fontSize: 12,
        width: '100%',
        color: '#666',

    }
})
export default styles
