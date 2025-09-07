// src/pages/JournalPage/JournalPage.tsx
import React, { useState } from 'react';
import { Plus, Calendar, Camera, FileText } from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  imageUrl?: string;
  plantName?: string;
}

const JournalPage: React.FC = () => {
  const [entries] = useState<JournalEntry[]>([
    {
      id: '1',
      date: '2024-01-15',
      title: 'Tomato plant flowering',
      content: 'My tomato plant has started flowering! The first yellow flowers appeared today. I\'m excited to see the fruits develop.',
      plantName: 'Tomato de tropic',
      imageUrl: 'https://images.unsplash.com/photo-1592841200221-21e1c0d36fb7?w=200&h=200&fit=crop&crop=center'
    },
    {
      id: '2',
      date: '2024-01-12',
      title: 'Peace Lily repotting',
      content: 'Repotted the peace lily today. It was getting root bound in its old pot. Used a slightly larger pot with fresh potting mix.',
      plantName: 'Peace Lily'
    }
  ]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-5 py-4 flex items-center justify-between border-b border-gray-100">
        <h1 className="text-xl font-semibold text-primary-800">Plant Journal</h1>
        <Button variant="primary" size="sm" className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Entry
        </Button>
      </div>

      {/* Main Content */}
      <div className="p-5">
        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Button variant="outline" size="sm" className="flex flex-col items-center gap-2 py-4">
            <FileText className="w-5 h-5" />
            <span className="text-xs">Text Entry</span>
          </Button>
          <Button variant="outline" size="sm" className="flex flex-col items-center gap-2 py-4">
            <Camera className="w-5 h-5" />
            <span className="text-xs">Photo Entry</span>
          </Button>
          <Button variant="outline" size="sm" className="flex flex-col items-center gap-2 py-4">
            <Calendar className="w-5 h-5" />
            <span className="text-xs">Quick Note</span>
          </Button>
        </div>

        {/* Journal Entries */}
        <div className="space-y-4">
          {entries.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Start your plant journal</h2>
              <p className="text-gray-600 mb-6">Document your plant care journey with photos and notes</p>
              <Button variant="primary" className="flex items-center gap-2 mx-auto">
                <Plus className="w-5 h-5" />
                Create First Entry
              </Button>
            </div>
          ) : (
            entries.map((entry) => (
              <div key={entry.id} className="card">
                <div className="flex gap-4">
                  {entry.imageUrl && (
                    <img 
                      src={entry.imageUrl} 
                      alt={entry.title}
                      className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-gray-500">{formatDate(entry.date)}</span>
                      {entry.plantName && (
                        <>
                          <span className="text-gray-300">•</span>
                          <span className="text-sm text-green-600 font-medium">{entry.plantName}</span>
                        </>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">{entry.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-3">{entry.content}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default JournalPage;
