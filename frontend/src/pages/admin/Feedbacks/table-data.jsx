import ActionButtons from "@/components/actions";

export const feedbackColumns = [
    {
        field: 'id',
        headerName: 'ID',
        width: 70,
    },
    {
        field: 'content',
        headerName: 'Content',
        flex: 1,
        renderCell: (params) => {
            return (
                <div className="flex-1 flex items-center">
                    <span className="truncate">{params.value}</span>
                </div>
            );
        }
    },
    {
        field: 'positivity',
        headerName: 'Avg Positivity',
    },
    {
        field: 'negativity',
        headerName: 'Avg Negativity',
    },
    {
        field: 'score',
        headerName: 'Avg. Score',
    },
    {

        field: 'sentiment',
        headerName: 'Overall Sentiment',
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

export const evaluationColumns = [
    {
        field: 'id',
        headerName: 'ID',
    },
    {

        field: 'content',
        headerName: 'Content',
        flex: 1,
        renderCell: (params) => {
            return (
                <div className="
                flex items-center">
                    <span className="truncate">{params.value}</span>
                </div>
            );
        }
    },
    {
        field: 'positivity',
        headerName: 'Positivity',
    },
    {
        field: 'negativity',
        headerName: 'Negativity',
    },
    {
        field: 'score',
        headerName: 'Score',
    },
    {
        field: 'sentiment',
        headerName: 'Sentiment',
    },
    {

        field: 'actions',
        headerName: '',
        width: 150,
        sortable: false,
        renderCell: (params) => {
            return (<ActionButtons />);

        },
    }
];