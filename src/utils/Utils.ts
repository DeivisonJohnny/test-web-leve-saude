import React from 'react';

export default class Utils {
  static highlightMatch(text: string, search: string): (string | JSX.Element)[] {
    if (!search) return [text];

    const regex = new RegExp(`(${search})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) =>
      part.toLowerCase() === search.toLowerCase()
        ? React.createElement('mark', { key: i, className: 'bg-yellow-200' }, part)
        : part
    );
  }
}
