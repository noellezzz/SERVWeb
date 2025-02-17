import { Card, CardContent, CardHeader } from "@mui/material";
import { Badge } from "@mui/material";

const AssessmentResult = ({ current }) => {
    return (
        <Card className="w-full shadow-lg h-full">
            <CardHeader>
                <h1 className="text-xl text-gray-700">Sentiment Analysis Results</h1>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <p className="font-semibold">Sentiment:</p>
                        <Badge
                            className={
                                current?.sentiment === "positive"
                                    ? "bg-green-500 text-white"
                                    : "bg-red-500 text-white"
                            }
                        >
                            {current?.sentiment.toUpperCase()}
                        </Badge>
                    </div>
                    <div className="flex justify-between">
                        <p className="font-semibold">Mode:</p>
                        <p className="uppercase">{current?.mode}</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="font-semibold">Score:</p>
                        <p>{current?.score?.toFixed(4) * 100 + '%'}</p>
                    </div>
                    <div className="border-t pt-4">
                        <p className="font-semibold">Polarity Scores</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p>Positive: <span className="font-medium">{current?.details?.polarity.pos}</span></p>
                                <p>Negative: <span className="font-medium">{current?.details?.polarity.neg}</span></p>
                            </div>
                            <div>
                                <p>Neutral: <span className="font-medium">{current?.details?.polarity.neu}</span></p>
                                <p className="font-bold">Compound: {current?.details?.polarity.compound}</p>
                            </div>
                        </div>
                    </div>
                    <div className="border-t pt-4">
                        <p className="font-semibold">Prediction Result</p>
                        <div className="flex justify-between">
                            <p>Sentiment:</p>
                            <p className="font-medium">{current?.details?.prediction.label}</p>
                        </div>
                        <div className="flex justify-between">
                            <p>Score:</p>
                            <p className="font-medium">{current?.details?.prediction.score?.toFixed(4) * 100 + '%'}</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};


export default AssessmentResult;