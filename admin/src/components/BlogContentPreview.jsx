import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const BlogContentPreview = ({ content, title }) => {
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);

  if (!content) return null;

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-gray-700">Content Preview</h4>
        <button
          type="button"
          onClick={() => setIsPreviewVisible(!isPreviewVisible)}
          className="flex items-center gap-1 px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          {isPreviewVisible ? (
            <>
              <EyeOff size={14} />
              Hide Preview
            </>
          ) : (
            <>
              <Eye size={14} />
              Show Preview
            </>
          )}
        </button>
      </div>

      {isPreviewVisible && (
        <div className="border border-gray-200 rounded-md p-4 bg-white max-h-96 overflow-y-auto">
          {title && (
            <h1 className="text-2xl font-bold mb-4 text-gray-900">{title}</h1>
          )}
          <div
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
            style={{
              // Basic prose styles
              lineHeight: '1.7',
              color: '#374151'
            }}
          />
          
          <style jsx>{`
            .prose h1 {
              font-size: 2em;
              font-weight: bold;
              margin: 0.67em 0;
              color: #111827;
            }
            .prose h2 {
              font-size: 1.5em;
              font-weight: bold;
              margin: 0.75em 0;
              color: #111827;
            }
            .prose h3 {
              font-size: 1.17em;
              font-weight: bold;
              margin: 0.83em 0;
              color: #111827;
            }
            .prose h4 {
              font-size: 1em;
              font-weight: bold;
              margin: 1.12em 0;
              color: #111827;
            }
            .prose h5 {
              font-size: 0.83em;
              font-weight: bold;
              margin: 1.5em 0;
              color: #111827;
            }
            .prose h6 {
              font-size: 0.75em;
              font-weight: bold;
              margin: 1.67em 0;
              color: #111827;
            }
            .prose p {
              margin: 1em 0;
            }
            .prose blockquote {
              margin: 1em 0;
              padding-left: 1em;
              border-left: 4px solid #e5e7eb;
              color: #6b7280;
              font-style: italic;
            }
            .prose ul, .prose ol {
              margin: 1em 0;
              padding-left: 2em;
            }
            .prose li {
              margin: 0.5em 0;
            }
            .prose a {
              color: #3b82f6;
              text-decoration: underline;
            }
            .prose a:hover {
              color: #1d4ed8;
            }
            .prose strong, .prose b {
              font-weight: bold;
            }
            .prose em, .prose i {
              font-style: italic;
            }
            .prose u {
              text-decoration: underline;
            }
            .prose code {
              background-color: #f3f4f6;
              padding: 0.2em 0.4em;
              border-radius: 0.25rem;
              font-size: 0.875em;
            }
            .prose pre {
              background-color: #f3f4f6;
              padding: 1em;
              border-radius: 0.5rem;
              overflow-x: auto;
              margin: 1em 0;
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default BlogContentPreview;