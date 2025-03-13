import ActionButtons from "@/components/actions";

export const feedbackColumns = [
    // {
    //     field: 'id',
    //     headerName: 'ID',
    //     width: 70,
    // },

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

        field: 'created',
        headerName: 'Date',
        renderCell: (params) => {
            const formattedDate = new Date(params.value).toLocaleDateString('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric',
            });
            return (
                <div className="flex items-center">
                    <span>{formattedDate}</span>
                </div>
            );
        }
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
