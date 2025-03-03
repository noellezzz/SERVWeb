import ActionButtons from "@/components/actions";

export const getResultColumns = ({
    onView = () => { },
    onDelete = () => { },
    onDownload = () => { }
}={}) => [
    {
        field: 'id',
        headerName: 'ID',
    },

    {
        field: 'user',
        headerName: 'user',
        renderCell: (params) => {
            return (
                <div className="flex-1 flex items-center">
                    <span className="truncate">{params.value?.user?.username}</span>
                </div>
            );
        }
    },
    {
        field: 'content',
        headerName: 'content',
        flex: 1,
        renderCell: (params) => {
            return (
                <div className="flex-1 flex items-center">
                    <span className="truncate">{params.value}</span>
                </div>
            );
        }
    },
    // {
    //     field: 'positive_score',
    //     headerName: 'Positive',
    // },
    // {
    //     field: 'negative_score',
    //     headerName: 'Negative',
    // },
    // {
    //     field: 'score',
    //     headerName: 'Score',
    // },
    // {
    //     field: 'sentiment',
    //     headerName: 'Sentiment',
    //     flex: 1
    // },
    {
        field: 'actions',
        headerName: '',
        width: 150,
        sortable: false,
        renderCell: (params) => {
            return (<ActionButtons
                onView={() => onView(params.row)}
                onDelete={() => onDelete(params.row)}
            />);
        },
    },
];