import React from 'react';
import { TagCloud } from 'react-tagcloud';

const TagCloudComponent = ({ tags, searchKeyword, onSearch }) => {
  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchKeyword);
    }
  };

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

  const customRenderer = (tag, size, color) => {
    return (
      <span
        key={tag.value}
        style={{
          color: color,
          fontSize: `${size}px`,
          transform: `rotate(${tag.rotate})`,
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
            onChange={(e) => onSearch(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <button onClick={handleSearch} className="px-4 py-2 bg-blue-500 text-white rounded-md self-end">
          Search
        </button>
      </div>

      <div className="relative h-96 border rounded-md">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute h-full w-px bg-gray-300" />
          <div className="absolute w-full h-px bg-gray-300" />
        </div>

        <div className="absolute text-gray-600 font-bold left-2 top-1/2 -translate-y-1/2">Unpleasant</div>
        <div className="absolute text-gray-600 font-bold right-2 top-1/2 -translate-y-1/2">Pleasant</div>
        <div className="absolute text-gray-600 font-bold top-2 left-1/2 -translate-x-1/2">Active</div>
        <div className="absolute text-gray-600 font-bold bottom-2 left-1/2 -translate-x-1/2">Subdued</div>

        <TagCloud
          minSize={12}
          maxSize={35}
          tags={tags.map((tag) => ({
            value: tag.value,
            count: tag.count,
            color: getColor(tag.quadrant),
            rotate: tag.rotate,
            x: tag.x,
            y: tag.y,
          }))}
          className="absolute inset-0 flex items-center justify-center"
          renderer={customRenderer}
        />
      </div>
    </div>
  );
};

export default TagCloudComponent;
