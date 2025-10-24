import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { journalAPI } from '../services/api';

export function DebugJournal() {
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testJournalAPI = async () => {
    setIsLoading(true);
    const logs: string[] = [];
    
    try {
      logs.push('🔍 Starting journal API debug...');
      
      // Check if user is logged in
      const token = localStorage.getItem('authToken');
      logs.push(`🔐 Auth token exists: ${!!token}`);
      if (token) {
        logs.push(`🔐 Token preview: ${token.substring(0, 20)}...`);
      }
      
      // Test GET journal entries
      logs.push('📋 Testing GET /api/journal...');
      try {
        const entries = await journalAPI.getJournalEntries();
        logs.push(`✅ GET successful - Found ${entries.length} entries`);
        if (entries.length > 0) {
          logs.push(`   First entry: "${entries[0].title}"`);
        }
      } catch (error: any) {
        logs.push(`❌ GET failed: ${error.message}`);
      }
      
      // Test POST journal entry
      logs.push('\n➕ Testing POST /api/journal...');
      try {
        const newEntry = {
          plotId: "33333333-3333-3333-3333-333333333333",
          date: new Date().toISOString().split('T')[0],
          type: "planting" as const,
          title: "Debug Test Entry",
          content: "This is a test entry created via debug tool",
          photos: [],
          audioNote: ""
        };
        
        const result = await journalAPI.createJournalEntry(newEntry);
        logs.push(`✅ POST successful - Entry ID: ${result.id}`);
        logs.push(`   Title: "${result.title}"`);
      } catch (error: any) {
        logs.push(`❌ POST failed: ${error.message}`);
      }
      
    } catch (error: any) {
      logs.push(`💥 Unexpected error: ${error.message}`);
    } finally {
      setIsLoading(false);
      setDebugInfo(logs.join('\n'));
    }
  };

  const clearDebug = () => {
    setDebugInfo('');
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Journal API Debug Tool</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <Button onClick={testJournalAPI} disabled={isLoading}>
            {isLoading ? 'Testing...' : 'Test Journal API'}
          </Button>
          <Button variant="outline" onClick={clearDebug}>
            Clear
          </Button>
        </div>
        
        {debugInfo && (
          <div className="bg-gray-100 p-4 rounded-lg">
            <pre className="text-sm whitespace-pre-wrap">{debugInfo}</pre>
          </div>
        )}
        
        <div className="text-sm text-gray-600">
          <p><strong>Expected Flow:</strong></p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Check if user is logged in (auth token exists)</li>
            <li>Test GET /api/journal to retrieve entries</li>
            <li>Test POST /api/journal to create new entry</li>
            <li>Verify entry is created successfully</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
