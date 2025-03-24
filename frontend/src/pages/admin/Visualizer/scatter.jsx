import React, { useEffect, useState } from 'react';
import SentimentScatterChart from '@/components/charts/sentiment-scatter';
import useResource from '@/hooks/useResource';
import resourceEndpoints from '../../../states/api/resources';
import { Alert, Box, Typography, CircularProgress } from '@mui/material';

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
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (search !== '') {
            setIsLoading(true);
            setError(null);
            
            searchFeedbacks(search)
                .then((res) => {
                    if (!res.data) {
                        throw new Error('No data received from API');
                    }
                    const _words = getWords(res.data);
                    setWords(_words || []);
                })
                .catch((err) => {
                    console.error('Error fetching data:', err);
                    setError(err.message || 'Failed to fetch data');
                    setWords([]);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [search]);

    // Safely create chart data
    const data = {
        datasets: (words || []).map((word) => ({
            label: word.word,
            data: [{
                x: word.details?.valence * 100 * (word.details?.valence < 0.3 ? -1 : 1),
                y: word.details?.arousal * 100 * (word.details?.valence < 0.3 ? -1 : 1),
            }],
            pointRadius: 10 * (word.score || 0.5),
            backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.8)`,
        }))
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '600px' }}>
                <CircularProgress size={40} />
                <Typography variant="body1" sx={{ ml: 2 }}>
                    Loading scatter plot data...
                </Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mb: 2 }}>
                Error loading data: {error}. Please try again.
            </Alert>
        );
    }

    if (!words || words.length === 0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '600px' }}>
                <Typography variant="body1" color="text.secondary">
                    No words found for scatter plot. Please try a different search term.
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ height: '600px' }}>
            <SentimentScatterChart data={data} title="Sentiment Analysis Visualizer" />
        </Box>
    );
}
