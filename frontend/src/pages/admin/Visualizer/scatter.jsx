import React, { useEffect, useState } from 'react';
import SentimentScatterChart from '@/components/charts/sentiment-scatter';
import useResource from '@/hooks/useResource';
import resourceEndpoints from '../../../states/api/resources';

const getColor = (score, sentiment) => {
    if (score > 80) return 'green';
    if (score > 60) return 'yellow';
    return 'red';
};

// get all words from feedback Data
/**
 * data = [
 * {
 *  sentiment_results: {
 *     words: []
 * },
 * ...
 * 
 * ]
 * 
 */
const getWords = (data) => {
    console.log(data);

    let words = [];
    data.forEach((feedback) => {
        const sentiments = feedback?.sentiment_results || [];
        sentiments.forEach((sentiment) => {
            let _words = sentiment?.words
            words = [...words, ..._words];
        });
    });
    return words;


}

export default function VisualizeScatter({ search = '' }) {
    const { states = { resourceEndpoints } } = useResource('feedbacks');
    const [searchFeedbacks] = resourceEndpoints.useSearchFeedbacksMutation();
    const [words, setWords] = useState([]);

    useEffect(() => {
        if (search !== '') {
            searchFeedbacks(search).then((res) => {
                const _words = getWords(res.data);
                setWords(_words);
            });
        }
    }, [search]);

    const data = {
        datasets: words.map((word) => ({
            label: word.word,
            data: [{
                x: word.details.valence * 100 * (word.details.valence < 0.3 ? -1 : 1),
                y: word.details.arousal * 100 * (word.details.valence < 0.3 ? -1 : 1),
            }],
            pointRadius: 10 * word.score,
            backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.8)`,
        }))
    };

    return (
        <>
            <SentimentScatterChart data={data} title="Sentiment Analysis Visualizer" />
        </>
    );
}
