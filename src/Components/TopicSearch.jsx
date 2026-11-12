import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import '../styles/topicSearch.css';
import { navbarCards } from '../utils/navbarData';
import { buildTopicIndex, searchTopics } from '../utils/topicSearch';

const RESULTS_ID = 'topic-search-results';

function isTypingTarget(element) {
  return element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element?.isContentEditable;
}

function TopicSearch() {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const topicIndex = useMemo(() => buildTopicIndex(navbarCards), []);
  const results = useMemo(() => searchTopics(topicIndex, query), [topicIndex, query]);
  const showResults = isOpen && query.trim() !== '';

  useEffect(() => {
    const focusOnSlash = (event) => {
      if (event.key !== '/' || isTypingTarget(event.target)) return;
      event.preventDefault();
      inputRef.current?.focus();
    };
    document.addEventListener('keydown', focusOnSlash);
    return () => document.removeEventListener('keydown', focusOnSlash);
  }, []);

  const openTopic = (topic) => {
    setQuery('');
    setIsOpen(false);
    navigate(topic.to);
  };

  const handleChange = (event) => {
    setQuery(event.target.value);
    setActiveIndex(0);
    setIsOpen(true);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      setQuery('');
      setIsOpen(false);
      inputRef.current?.blur();
      return;
    }
    if (results.length === 0) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % results.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => (index - 1 + results.length) % results.length);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      openTopic(results[activeIndex]);
    }
  };

  return (
    <div className="topic-search">
      <div className="topic-search-box">
        <FaSearch className="topic-search-icon" aria-hidden="true" />
        <input
          ref={inputRef}
          type="text"
          className="topic-search-input"
          placeholder="Search topics, e.g. closures, event loop, joins"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setIsOpen(false)}
          role="combobox"
          aria-label="Search topics"
          aria-expanded={showResults}
          aria-controls={RESULTS_ID}
          aria-activedescendant={showResults && results.length > 0 ? `topic-result-${activeIndex}` : undefined}
          autoComplete="off"
          spellCheck="false"
        />
        <kbd className="topic-search-hint" aria-hidden="true">/</kbd>
      </div>

      {showResults && (
        <ul id={RESULTS_ID} className="topic-search-results" role="listbox">
          {results.length === 0 && <li className="topic-search-empty">No topics match "{query.trim()}"</li>}
          {results.map((topic, index) => (
            <li
              key={`${topic.section}-${topic.to}`}
              id={`topic-result-${index}`}
              role="option"
              aria-selected={index === activeIndex}
              className={`topic-search-result${index === activeIndex ? ' is-active' : ''}`}
              onMouseDown={(event) => event.preventDefault()}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => openTopic(topic)}
            >
              <span className="topic-search-label">{topic.label}</span>
              <span className="topic-search-section">{topic.section}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TopicSearch;
