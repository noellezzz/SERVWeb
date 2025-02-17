
import React, { useState } from 'react';
import { TagCloud } from 'react-tagcloud';

const WordCloud = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [tagData, setTagData] = useState([]);

  const wordMap = {
    Waiting: [
      // Active quadrant
      { value: 'long line', count: 30, quadrant: 'active', x: '23%', y: '10%', rotate: '0deg' },
      { value: 'slow', count: 30, quadrant: 'active', x: '36%', y: '18%', rotate: '90deg' },
      { value: 'patience', count: 18, quadrant: 'active', x: '38%', y: '20%', rotate: '90deg' },
      { value: 'delayed', count: 26, quadrant: 'active', x: '21%', y: '23%', rotate: '0deg' },
      { value: 'queue', count: 27, quadrant: 'active', x: '15%', y: '20%', rotate: '90deg' },
      { value: 'rushing', count: 19, quadrant: 'active', x: '10%', y: '20%', rotate: '90deg' },
      { value: 'hustle', count: 19, quadrant: 'active', x: '2%', y: '10%', rotate: '0deg' },

      // Unpleasant quadrant
      { value: 'frustrated', count: 10, quadrant: 'unpleasant', x: '37%', y: '80%', rotate: '0deg' },
      { value: 'boring', count: 28, quadrant: 'unpleasant', x: '30%', y: '68%', rotate: '90deg' },
      { value: 'crowded', count: 20, quadrant: 'unpleasant', x: '10%', y: '60%', rotate: '0deg' },
      { value: 'time-consuming', count: 23, quadrant: 'unpleasant', x: '5%', y: '72%', rotate: '0deg' },
      { value: 'too hot', count: 26, quadrant: 'unpleasant', x: '5%', y: '80%', rotate: '0deg' },
      { value: 'disorganized', count: 20, quadrant: 'unpleasant', x: '25%', y: '69%', rotate: '90deg' },
      { value: 'exhausting', count: 20, quadrant: 'unpleasant', x: '23%', y: '69%', rotate: '90deg' },

      // Subdued quadrant
      { value: 'calm', count: 26, quadrant: 'subdued', x: '80%', y: '60%', rotate: '90deg' },
      { value: 'service', count: 20, quadrant: 'subdued', x: '65%', y: '70%', rotate: '0deg' },
      { value: 'waiting', count: 20, quadrant: 'subdued', x: '70%', y: '60%', rotate: '0deg' },
      { value: 'neutral', count: 20, quadrant: 'subdued', x: '67%', y: '80%', rotate: '0deg' },
      { value: 'chilling', count: 20, quadrant: 'subdued', x: '78%', y: '83%', rotate: '0deg' },
      { value: 'idle', count: 26, quadrant: 'subdued', x: '55%', y: '60%', rotate: '90deg' },
      { value: 'relaxed', count: 26, quadrant: 'subdued', x: '57%', y: '70%', rotate: '90deg' },

      // Pleasant quadrant
      { value: 'welcoming', count: 27, quadrant: 'pleasant', x: '55%', y: '2%', rotate: '0deg' },
      { value: 'quick', count: 26, quadrant: 'pleasant', x: '55%', y: '20%', rotate: '0deg' },
      { value: 'fair', count: 19, quadrant: 'pleasant', x: '68%', y: '32%', rotate: '0deg' },
      { value: 'comfy', count: 23, quadrant: 'pleasant', x: '58%', y: '32%', rotate: '0deg' },
      { value: 'efficient', count: 22, quadrant: 'pleasant', x: '80%', y: '20%', rotate: '90deg' },
      { value: 'smooth', count: 26, quadrant: 'pleasant', x: '83%', y: '20%', rotate: '90deg' },
      { value: 'helpful', count: 25, quadrant: 'pleasant', x: '70%', y: '20%', rotate: '0deg' },
      { value: 'nice staff', count: 20, quadrant: 'pleasant', x: '68%', y: '13%', rotate: '0deg' },
    ],
  };

  const handleSearch = () => {
    const keyword = searchKeyword.trim();
    if (keyword && wordMap[keyword]) {
      setTagData(wordMap[keyword]);
    } else {
      setTagData([]);
    }
  };

  // Function to assign colors based on quadrant
  const getColor = (quadrant) => {
    switch (quadrant) {
      case 'active':
        return 'blue';
      case 'unpleasant':
        return 'red';
      case 'subdued':
        return 'gray';
      case 'pleasant':
        return 'green';
      default:
        return 'black';
    }
  };

  // Custom renderer to apply position (x, y) and rotation
  const customRenderer = (tag, size, color) => {
    return (
      <span
        key={tag.value}
        style={{
          color: color,
          fontSize: `${size}px`,
          transform: `rotate(${tag.rotate})`, // Apply rotation
          position: 'absolute',
          left: tag.x,
          top: tag.y,
        }}
        className={`tag-${size}`}
      >
        {tag.value}
      </span>
    );
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-xl">
      <div className="mb-4 flex gap-2">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Search Keywords:</label>
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <button onClick={handleSearch} className="px-4 py-2 bg-blue-500 text-white rounded-md self-end">
          Search
        </button>
      </div>

      <div className="relative h-96 border rounded-md">
        {/* Quadrant Lines */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute h-full w-px bg-gray-300" />
          <div className="absolute w-full h-px bg-gray-300" />
        </div>

        {/* Quadrant Labels */}
        <div className="absolute text-gray-600 font-bold left-2 top-1/2 -translate-y-1/2">Unpleasant</div>
        <div className="absolute text-gray-600 font-bold right-2 top-1/2 -translate-y-1/2">Pleasant</div>
        <div className="absolute text-gray-600 font-bold top-2 left-1/2 -translate-x-1/2">Active</div>
        <div className="absolute text-gray-600 font-bold bottom-2 left-1/2 -translate-x-1/2">Subdued</div>

        {/* React Tag Cloud Component */}
        <TagCloud
          minSize={12}
          maxSize={35}
          tags={tagData.map((tag) => ({
            value: tag.value,
            count: tag.count,
            color: getColor(tag.quadrant),
            rotate: tag.rotate,  // Add rotation
            x: tag.x,            // Use custom x-position
            y: tag.y,            // Use custom y-position
          }))}
          className="absolute inset-0 flex items-center justify-center"
          renderer={customRenderer} // Use the custom renderer for positioning
        />
      </div>
    </div>
  );
};

export default WordCloud;
