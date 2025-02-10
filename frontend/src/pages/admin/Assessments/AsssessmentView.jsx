import { useParams } from 'react-router-dom'
import { Tooltip } from '@mui/material';

import SplashScreen from '@/components/splash-screen';
import useResource from '@/hooks/useResource';

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SentimentScatterChart from '@/components/charts/sentiment-scatter';
import faker from 'faker';

const getColor = (score, sentiment) => {
    if (score > 80) return 'green'
    if (score > 60) return 'yellow'
    return 'red'
}

function WordsScatterChart({ title, words=[], mode="" }){
    const data = {
        datasets: [
            {
            label: mode,
            data: Array.from({ length: 100 }, () => ({
                x: faker.datatype.number({ min: Math.random() * 100, max: Math.random() * 50 }),
                y: faker.datatype.number({ min: Math.random() * 100, max: Math.random() * 100 - 50 }),
            })),
            backgroundColor: 'rgba(255, 99, 132, 0.8)',
            },
        ],
    };
    return (
        <SentimentScatterChart
          data={data}
          title="Sentiment ANalysis Visualizer"
        />
    );
}

function TextClassifier({ text, words, className }) {
    const textArray = text.split(' ');

    const getWordDetails = (word) => {
        return words.find(w => w.word === word);
    };

    return (
        <div style={{ wordWrap: 'break-word' }} className={className}>
            {textArray.map((word, index) => {
                const details = getWordDetails(word);
                const color = details ? getColor(details.score * 100, details?.sentiment) : 'black';
                return (
                    <Tooltip key={index} title={details ? `Score: ${details?.score}, Mean: ${details?.details?.mean}, Std: ${details?.details?.std}, Sentiment: ${details?.sentiment}` : ''}>
                        <span style={{ color, margin: '0 2px' }}>{word}</span>
                    </Tooltip>
                );
            })}
        </div>
    );
}

export default function AsssessmentView() {
    const id = useParams().assessmentId

    const {
        actions: {
            fetchData,
        },
        states: {
            current,
            loading,
        }
    } = useResource('results');
    const {
        actions: {
            fetchData: fetchFeedback,
        },
        states: {
            current: feedback,
        }
    } = useResource('feedbacks');
    const {
        actions: {
            fetchData: fetchQuestion,
        },
        states: {
            current: question,
        }
    } = useResource('tests');


    useEffect(() => {
        fetchData({ id })
    }, [])
    useEffect(() => {
        if (current?.feedback) {
            fetchFeedback({
                id: current.feedback
            })
        }
        if (current?.sentiment_test) {
            fetchQuestion({
                id: current.sentiment_test
            })
        }
    }, [current])

    if (loading) return <SplashScreen />

    return current && (
        <div className='p-8'>
            <h1 className='font-extrabold text-2xl'>Assessment Result</h1>
            <p className='text-gray-400 italic'>ID: {id}</p>
            <hr />
            <div className="flex gap-2 items-center my-4 font-bold text-lg">
                <span className='uppercase'>{current?.mode}</span>
                <span>Sentiment Analysis</span>
            </div>
            <div className="flex flex-col my-4">
                <h3 className='font-bold text-gray-600 text-lg'>Question</h3>
                <p>{question?.question_text_en}</p>
                <p className='italic'>{question?.question_text_tl}</p>
            </div>
            <hr />
            <div className="flex flex-col my-4">
                <h3 className='font-bold text-gray-600 text-lg'>Feedback</h3>
                <TextClassifier text={feedback?.content } words={current?.words} />
                <span className="italic text-gray-500">
                    Translated:
                </span>
                <TextClassifier text={current?.details?.translated_text } words={current?.words}  className='italic'/>
            </div>
            <hr />
            <div className="flex flex-col my-4">
                <h3 className='font-bold text-gray-600 text-lg'>Results</h3>
                <p>Sentiment: <span className={`uppercase font-bold ${
                    current?.sentiment === 'positive' ? 'text-green-500' : 'text-red-500'	
                }`}> {current?.sentiment} </span></p>
                <p>Mode: <span className='uppercase'> {current?.mode} </span></p>
                <p>Score: {current?.score}</p>
                <p className='font-bold'>Polarity Scores</p>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <p>Positive: {current?.details?.polarity.pos}</p>
                        <p>Negative: {current?.details?.polarity.neg}</p>
                    </div>
                    <div>
                        <p>Neutral: {current?.details?.polarity.neu}</p>
                        <p className='font-bold'>Compound: {current?.details?.polarity.compound}</p>
                    </div>
                </div>
                <hr />
                <p className='font-bold'>Prediction Result</p>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <p>Sentiment: {current?.details?.prediction.label}</p>
                        <p>Score: {current?.details?.prediction.score}</p>
                    </div>
                </div>
                <hr />
                <WordsScatterChart />
                

            </div>
        </div>
    )
}
