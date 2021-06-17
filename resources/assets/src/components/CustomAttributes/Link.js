import React from 'react';

export default React.memo(({ label, link, name }) => {
  return (
    <div className="readonly-wrapper">
      <label className="readonly-label">{label}</label>
      <span className="readonly-value">
        <a href={link} target="_blank" rel="noopener noreferrer">
          {name}
        </a>
      </span>
    </div>
  );
});
