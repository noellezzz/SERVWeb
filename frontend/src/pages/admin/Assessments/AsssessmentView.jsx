import { useParams } from 'react-router-dom'
import { Tooltip } from '@mui/material';

import SplashScreen from '@/components/splash-screen';
import useResource from '@/hooks/useResource';

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const getColor = (score) => {
    if (score > 80) return 'green'
    if (score > 60) return 'yellow'
    return 'red'
}

function TextClassifier({ text, words }) {
    const textArray = text.split(' ');

    const getWordDetails = (word) => {
        return words.find(w => w.word === word);
    };

    return (
        <div style={{ wordWrap: 'break-word' }}>
            {textArray.map((word, index) => {
                const details = getWordDetails(word);
                const color = details ? getColor(details.score * 100) : 'black';
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
                <TextClassifier text={feedback?.content + ' annoying'} words={current?.words} />
            </div>
            <div className="flex flex-col my-4">
                <h3 className='font-bold text-gray-600 text-lg'>Results</h3>
                <p>Sentiment: <span className={`uppercase font-bold ${
                    current?.sentiment === 'positive' ? 'text-green-500' : 'text-red-500'	
                }`}> {current?.sentiment} </span></p>
                <p>Mode: <span className='uppercase'> {current?.mode} </span></p>
                <p>Score: {current?.score}</p>
            </div>
        </div>
    )
}
