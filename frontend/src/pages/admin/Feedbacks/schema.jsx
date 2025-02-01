import ActionButtons from "@/components/actions";

export const feedbackColumns = [
    { field: 'id', headerName: 'ID', flex: 1 },
    {
        field: 'content', headerName: 'Content', flex: 1,
        renderCell: (params) => {
            return (
                <div className="flex items-center">
                    <span className="truncate">{params.value}</span>
                </div>
            );
        }
    },
    { field: 'positivity', headerName: 'Avg Positivity', flex: 1 },
    { field: 'negativity', headerName: 'Avg Negativity', flex: 1 },
    { field: 'score', headerName: 'Avg. Score', flex: 1 },
    {
        field: 'sentiment', headerName: 'Overall Sentiment', flex: 1,
    },
    {
        field: 'actions', headerName: '',
        renderCell: (params) => {
            return (<ActionButtons />);
        },
    },
];

export const evaluationColumns = [
    { field: 'id', headerName: 'ID', flex: 1 },
    {
        field: 'content',
        headerName: 'Content',
        flex: 1,
        renderCell: (params) => {
            return (
                <div className="flex items-center">
                    <span className="truncate">{params.value}</span>
                </div>
            );
        }
    },
    { field: 'positivity', headerName: 'Positivity', flex: 1 },
    { field: 'negativity', headerName: 'Negativity', flex: 1 },
    { field: 'score', headerName: 'Score', flex: 1 },
    { field: 'sentiment', headerName: 'Sentiment', flex: 1 },
    {
        field: 'actions',
        headerName: '',
        renderCell: (params) => {
            return (<ActionButtons />);

        },
    }
];