'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  [key: string]: any;
}

export const TagInput = React.forwardRef<HTMLInputElement, TagInputProps>(
  ({ value = [], onChange, ...props }, ref) => {
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && inputValue.trim()) {
        e.preventDefault();
        const newTag = inputValue.trim();
        if (!value.includes(newTag)) {
          onChange([...value, newTag]);
        }
        setInputValue('');
      } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
        onChange(value.slice(0, -1));
      }
    };

    const removeTag = (tagToRemove: string) => {
      onChange(value.filter((tag) => tag !== tagToRemove));
    };

    return (
      <div>
        <div className="flex flex-wrap gap-2 rounded-md border border-input p-2 bg-background">
          {value.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
              <button
                type="button"
                className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onClick={() => removeTag(tag)}
              >
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </button>
            </Badge>
          ))}
          <input
            {...props}
            ref={ref}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            className="flex-1 bg-transparent p-0 border-0 shadow-none outline-none focus:ring-0 text-sm"
            placeholder={value.length === 0 ? "Add tags..." : ""}
          />
        </div>
      </div>
    );
  }
);

TagInput.displayName = 'TagInput';
