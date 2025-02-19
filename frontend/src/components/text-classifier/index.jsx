
import { Tooltip } from '@mui/material';
import React from 'react';

const getColor = (score, sentiment) => {
    if (score > 80) return 'green'
    if (score > 60) return 'yellow'
    return 'red'
}
function TextClassifier({ text, words, className, mode="anew" }) {
    const textArray = (text ?? '').split(' ');

    const getWordDetails = (word) => {
        return words.find(w => w.word === word);
    };

    return (
        <div style={{ wordWrap: 'break-word' }} className={className}>
            {textArray.map((word, index) => {
                const details = getWordDetails(word);
                const color = details ? getColor(details.score * 100, details?.sentiment) : 'black';
                return (
                    mode === 'anew' ? (
                        <Tooltip key={index} title={details ? `Score: ${details?.score}, Valence: ${details?.details?.valence}, Arousal: ${details?.details?.arousal}, Dominance: ${details?.details?.dominance}` : ''}>
                            <span style={{ color, margin: '0 2px' }}>{word}</span>
                        </Tooltip>
                    ) : (
                    <Tooltip key={index} title={details ? `Score: ${details?.score}, Mean: ${details?.details?.mean}, Std: ${details?.details?.std}, Sentiment: ${details?.sentiment}` : ''}>
                        <span style={{ color, margin: '0 2px' }}>{word}</span>
                    </Tooltip>
                    )
                );
            })}
        </div>
    );
}

export default TextClassifier;