
export const resultColumns = [
    {
        field: 'id',
        headerName: 'ID',
        flex: 1
    },
    {
        field: 'user_id',
        headerName: 'User',
        flex: 1
    },
    {
        field: 'positive_score',
        headerName: 'Positive',
    },
    {
        field: 'negative_score',
        headerName: 'Negative',
    },
    {
        field: 'score',
        headerName: 'Score',
    },
    {
        field: 'sentiment',
        headerName: 'Sentiment',
        flex: 1
    },
    {
        field: 'actions',
        headerName: '',
        width: 150,
        sortable: false,
        renderCell: (params) => {
            return (<ActionButtons />);
        },
    },
];