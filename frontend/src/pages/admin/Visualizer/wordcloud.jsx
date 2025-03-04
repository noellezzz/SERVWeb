import React, { useState, useEffect } from 'react';
import { TagCloud } from 'react-tagcloud';
import useResource from '@/hooks/useResource';
import resourceEndpoints from '@/states/api/resources';

// Function to assign word to a quadrant based on valence and arousal
const getQuadrant = (valence, arousal) => {
  // Normalize values to the 0-1 scale if they aren't already
  const normalizedValence = valence; // Already in 0-1 scale
  const normalizedArousal = arousal; // Already in 0-1 scale
  
  // High arousal, high valence = active pleasant (positive active)
  if (normalizedArousal >= 0.5 && normalizedValence >= 0.5) {
    return 'pleasant';
  }
  // High arousal, low valence = active unpleasant (negative active)
  else if (normalizedArousal >= 0.5 && normalizedValence < 0.5) {
    return 'active';
  }
  // Low arousal, high valence = subdued pleasant (positive passive)
  else if (normalizedArousal < 0.5 && normalizedValence >= 0.5) {
    return 'subdued';
  }
  // Low arousal, low valence = subdued unpleasant (negative passive)
  else {
    return 'unpleasant';
  }
};

// Improved position calculation to avoid overlap
const calculatePosition = (valence, arousal, quadrant, index, totalWords) => {
  // Center of the chart
  const center = 50;
  
  // Calculate base position
  let x, y;
  
  // Add jitter to spread words more evenly within quadrants
  const jitterRange = 10; // Reduced jitter range to avoid words going into wrong quadrants
  const jitterX = (Math.random() * jitterRange) - (jitterRange / 2);
  const jitterY = (Math.random() * jitterRange) - (jitterRange / 2);
  
  switch (quadrant) {
    case 'pleasant': // top right
      x = center + (valence * 40) + jitterX; // Reduced from 50 to 40 to keep away from edges
      y = center - (arousal * 40) + jitterY; // Reduced from 50 to 40 to keep away from edges
      break;
    case 'active': // top left
      x = center - ((1 - valence) * 40) + jitterX;
      y = center - (arousal * 40) + jitterY;
      break;
    case 'subdued': // bottom right
      x = center + (valence * 40) + jitterX;
      y = center + ((1 - arousal) * 40) + jitterY;
      break;
    case 'unpleasant': // bottom left
      x = center - ((1 - valence) * 40) + jitterX;
      y = center + ((1 - arousal) * 40) + jitterY;
      break;
    default:
      x = center + jitterX;
      y = center + jitterY;
  }
  
  // Ensure positions stay within bounds (5% - 95% to avoid edge collisions)
  x = Math.max(5, Math.min(95, x));
  y = Math.max(5, Math.min(95, y));
  
  return {
    x: `${x}%`,
    y: `${y}%`
  };
};

// Function to get color based on quadrant
const getColor = (quadrant) => {
  switch (quadrant) {
    case 'active':
      return '#f44336'; // Red for negative active
    case 'unpleasant':
      return '#9c27b0'; // Purple for negative passive
    case 'subdued':
      return '#4caf50'; // Green for positive passive
    case 'pleasant':
      return '#2196f3'; // Blue for positive active
    default:
      return '#9e9e9e'; // Grey for unknown
  }
};

// Function to extract words from feedback data
const getWords = (data) => {
  let wordMap = new Map();
  
  data.forEach(feedback => {
    const sentimentResults = feedback?.sentiment_results || [];
    sentimentResults.forEach(sentiment => {
      const words = sentiment?.words || [];
      words.forEach(word => {
        // Skip words with missing values
        if (!word.details?.valence || !word.details?.arousal || !word.details?.dominance) {
          return;
        }
        
        const wordKey = word.word.toLowerCase();
        
        // If word already exists in the map, update its count
        if (wordMap.has(wordKey)) {
          const existingWord = wordMap.get(wordKey);
          existingWord.count += 1;
          // Average the scores for repeated words
          existingWord.details.valence = (existingWord.details.valence + word.details.valence) / 2;
          existingWord.details.arousal = (existingWord.details.arousal + word.details.arousal) / 2;
          existingWord.details.dominance = (existingWord.details.dominance + word.details.dominance) / 2;
          existingWord.score = (existingWord.score + word.score) / 2;
        } else {
          // Add new word to the map
          wordMap.set(wordKey, {
            value: word.word,
            count: 1,
            details: { ...word.details },
            score: word.score
          });
        }
      });
    });
  });
  
  // Convert map to array
  let wordsArray = Array.from(wordMap.values());
  
  // Sort by count and limit to not overload the visualization
  wordsArray = wordsArray.sort((a, b) => b.count - a.count).slice(0, 30);
  
  // Now assign quadrants and positions with index to help with distribution
  return wordsArray.map((word, index) => {
    const quadrant = getQuadrant(word.details.valence, word.details.arousal);
    const position = calculatePosition(
      word.details.valence, 
      word.details.arousal, 
      quadrant, 
      index, 
      wordsArray.length
    );
    
    // Reduced rotation range to make words more readable
    const rotate = Math.floor(Math.random() * 30) - 15 + 'deg'; // Random rotation between -15 and 15 degrees
    
    return {
      ...word,
      quadrant,
      x: position.x,
      y: position.y,
      rotate
    };
  });
};

export default function VisualizeWordCloud({ search = '' }) {
  const { states = { resourceEndpoints } } = useResource('feedbacks');
  const [searchFeedbacks] = resourceEndpoints.useSearchFeedbacksMutation();
  const [wordData, setWordData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch data when search term changes from parent component
  useEffect(() => {
    if (search !== '') {
      setIsLoading(true);
      searchFeedbacks(search)
        .then(res => {
          const words = getWords(res.data);
          setWordData(words);
        })
        .catch(err => {
          console.error('Error fetching feedback data:', err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [search, searchFeedbacks]);
  
  // Custom renderer to apply position (x, y) and rotation with improved styling
  const customRenderer = (tag, size, color) => {
    // Scale size a bit to make differences more apparent but not too extreme
    const fontSize = Math.max(size * 0.8, 12);
    
    return (
      <span
        key={tag.value}
        style={{
          color: color,
          fontSize: `${fontSize}px`,
          fontWeight: 'bold',
          transform: `rotate(${tag.rotate})`, 
          position: 'absolute',
          left: tag.x,
          top: tag.y,
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          textShadow: '0px 0px 2px rgba(255,255,255,0.8)', // Add text shadow to make words stand out
          userSelect: 'none', // Prevent text selection
          zIndex: Math.floor(tag.count), // Higher count words have higher z-index
        }}
        className={`tag-${tag.quadrant}`}
        title={`${tag.value} (Score: ${tag.score.toFixed(2)}, Valence: ${tag.details.valence.toFixed(2)}, Arousal: ${tag.details.arousal.toFixed(2)})`}
      >
        {tag.value}
      </span>
    );
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-xl">
      <div className="relative h-96 border rounded-md bg-gray-50 overflow-hidden">
        {/* Quadrant Lines */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute h-full w-px bg-gray-300" />
          <div className="absolute w-full h-px bg-gray-300" />
        </div>

        {/* Quadrant Labels - Moved to corners with smaller font and slight transparency */}
        <div className="absolute text-gray-600 font-bold text-xs left-2 top-2 bg-white/80 p-1 rounded">Negative Active</div>
        <div className="absolute text-gray-600 font-bold text-xs right-2 top-2 bg-white/80 p-1 rounded">Positive Active</div>
        <div className="absolute text-gray-600 font-bold text-xs left-2 bottom-2 bg-white/80 p-1 rounded">Negative Passive</div>
        <div className="absolute text-gray-600 font-bold text-xs right-2 bottom-2 bg-white/80 p-1 rounded">Positive Passive</div>
        
        {/* Axis Labels - More subtle positioning */}
        <div className="absolute text-gray-500 text-xs left-1/2 top-1 -translate-x-1/2">High Arousal (Active)</div>
        <div className="absolute text-gray-500 text-xs left-1/2 bottom-1 -translate-x-1/2">Low Arousal (Passive)</div>
        <div className="absolute text-gray-500 text-xs top-1/2 left-1 -translate-y-1/2 transform -rotate-90">Low Valence (Negative)</div>
        <div className="absolute text-gray-500 text-xs top-1/2 right-1 -translate-y-1/2 transform rotate-90">High Valence (Positive)</div>
        
        {/* Legend - Moved to top-right, more compact and less obtrusive */}
        <div className="absolute top-12 right-3 bg-white/90 p-2 rounded shadow-sm border text-xs z-10">
          <div className="flex items-center mb-1">
            <span className="inline-block w-3 h-3 mr-1 bg-red-500"></span>
            <span>Negative Active</span>
          </div>
          <div className="flex items-center mb-1">
            <span className="inline-block w-3 h-3 mr-1 bg-purple-500"></span>
            <span>Negative Passive</span>
          </div>
          <div className="flex items-center mb-1">
            <span className="inline-block w-3 h-3 mr-1 bg-green-500"></span>
            <span>Positive Passive</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 mr-1 bg-blue-500"></span>
            <span>Positive Active</span>
          </div>
        </div>

        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-gray-500">Loading word cloud data...</p>
          </div>
        ) : wordData.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-gray-500">No data available. Please use the search box above to find feedback for visualization.</p>
          </div>
        ) : (
          <div className="relative w-full h-full">
            <TagCloud
              minSize={12}
              maxSize={30} // Reduced max size to prevent very large words
              tags={wordData.map(tag => ({
                ...tag,
                color: getColor(tag.quadrant),
              }))}
              className="absolute inset-0"
              renderer={customRenderer}
            />
          </div>
        )}
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p><strong>About this visualization:</strong> Words are positioned based on their emotional dimensions from the NRC-VAD lexicon. 
          The X-axis represents valence (negative to positive), and the Y-axis represents arousal (passive to active).</p>
        <p className="mt-2"><strong>Word size</strong> indicates frequency in feedback, and <strong>color</strong> indicates the emotional quadrant.</p>
      </div>
    </div>
  );
}