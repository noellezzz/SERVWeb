import { useParams } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { TagCloud } from 'react-tagcloud';
import { useReactToPrint } from "react-to-print";


import { Box, Typography, Divider, Paper, Button, Grid, Card, CardContent } from '@mui/material';
import SplashScreen from '@/components/splash-screen';
import useResource from '@/hooks/useResource';
import SentimentScatterChart from '@/components/charts/sentiment-scatter';
import TextClassifier from '@/components/text-classifier';
import AssessmentResult from './AssessmentResult';
import { PrinterIcon } from 'lucide-react';

const getColor = (score, sentiment) => {
    if (score > 80) return 'green'
    if (score > 60) return 'yellow'
    return 'red'
}
function WordsScatterChart({ words = [], mode = 'anew' }) {
    words = words.filter((word, i) => words.findIndex(w => w.word === word.word) === i);
    const data = {
        datasets: words.map((word) => ({
            label: word.word,
            data: [{
                x: word.details.valence * 100,
                y: word.details.arousal * 100,
            }],
            pointRadius: 10 * word.score,
            backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.8)`,
        }))
    };
    
    return <SentimentScatterChart data={data} title="Sentiment Analysis Visualizer" />;
}

export default function AssessmentView() {
    const { assessmentId: id } = useParams();
    const { actions: { fetchData }, states: { current, loading } } = useResource('results');
    const { actions: { fetchData: fetchFeedback }, states: { current: feedback } } = useResource('feedbacks');
    const { actions: { fetchData: fetchQuestion }, states: { current: question } } = useResource('tests');
    const contentRef = useRef(null);
    const reactToPrintFn = useReactToPrint({ contentRef });

    useEffect(() => { fetchData({ id }); }, []);
    
    useEffect(() => {
        if (current?.feedback) fetchFeedback({ id: current.feedback });
        if (current?.sentiment_test) fetchQuestion({ id: current.sentiment_test });
    }, [current]);

    if (loading) return <SplashScreen />;

    return current && (
        <>
        <Box className="flex justify-end px-8 p-4">
            <Button onClick={() => reactToPrintFn()} variant="contained" color="primary">
                <PrinterIcon />
            </Button>
        </Box>
        <Box px={4} ref={contentRef} className="print:p-8">
            <Grid container spacing={3}>
                <Grid item xs={12} md={7}>
                    <Paper elevation={3} sx={{ p: 3, height: '100%' }} className='print:border-0 border-l-4 border-blue-500'>
                        <Typography variant="h4" fontWeight="bold">Assessment Result</Typography>
                        <Typography variant="subtitle2" color="text.secondary">ID: {id}</Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h6" fontWeight="bold" className='uppercase'>{current?.mode} Sentiment Analysis</Typography>
                        <Box my={2}>
                            <Typography variant="h6" color="text.secondary">Question</Typography>
                            <Typography>{question?.question_text_en}</Typography>
                            <Typography variant="body2" fontStyle="italic" color="text.secondary">{question?.question_text_tl}</Typography>
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        <Box my={2}>
                            <Typography variant="h6" color="text.secondary">Feedback</Typography>
                            <TextClassifier text={feedback?.content} words={current?.words} />
                            <Typography variant="body2" fontStyle="italic" color="text.secondary">Translated:</Typography>
                            <TextClassifier text={current?.details?.translated_text} words={current?.words} />
                        </Box>
                    </Paper>
                </Grid>
                
                <Grid item xs={12} md={5}>
                    <AssessmentResult current={current} />
                </Grid>

                    
                
                <Grid item xs={12} md={7} className="print:break-before-page" mb={5}>
                    <Card elevation={3} sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h4" fontWeight="bold">Words Scatter Chart</Typography>
                            <WordsScatterChart words={current?.words} mode={current?.mode} />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={5} mb={5}>
                    <Card elevation={3} sx={{ height: '100%' }}>
                        <CardContent className="relative h-full">
                            <Typography variant="h4" fontWeight="bold" >Tags</Typography>
                            <TagCloud
                                minSize={12}
                                maxSize={55}
                                tags={current?.words?.filter((word, i) => current?.words.findIndex(w => w.word === word.word) === i).map((word) => ({
                                    value: word.word,
                                    count: word.score * 100,
                                    color: getColor(word.score * 100, word?.sentiment),
                                    rotate: Math.random() > 0.5 ? 90 : 0,
                                    x: word.details.valence * 100,
                                    y: word.details.arousal * 100,
                                }))}
                            />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
        </>
    );
}
