// src/components/SourceCitation.tsx
// Collapsible source references

import type { Source } from '../types.js';

interface SourceCitationProps {
  sources: Source[];
}

/**
 * Source citation display
 */
export function SourceCitation({ sources }: SourceCitationProps) {
  return (
    <div className="astermind-sources">
      {sources.map((source, index) => (
        <div key={index} className="astermind-source">
          <div className="astermind-source__header">
            <span className="astermind-source__title">{source.title}</span>
            <span className="astermind-source__relevance">
              {Math.round(source.relevance * 100)}%
            </span>
          </div>
          <p className="astermind-source__snippet">{source.snippet}</p>
        </div>
      ))}
    </div>
  );
}
