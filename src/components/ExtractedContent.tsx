import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, FileText, Code, MessageSquare } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import ReactJson from 'react-json-view';
import type { ExtractedData } from '@/pages/Index';

interface ExtractedContentProps {
  extractedData: ExtractedData | null;
}

const ExtractedContent: React.FC<ExtractedContentProps> = ({ extractedData }) => {
  const [activeTab, setActiveTab] = useState('markdown');

  const handleDownload = (type: 'json' | 'markdown' | 'all') => {
    if (!extractedData) return;

    switch (type) {
      case 'json':
        downloadFile(JSON.stringify(extractedData.json, null, 2), 'extracted-data.json', 'application/json');
        break;
      case 'markdown':
        downloadFile(extractedData.markdown, 'extracted-content.md', 'text/markdown');
        break;
      case 'all':
        // Create a zip-like structure (simplified for demo)
        const allContent = `=== MARKDOWN ===\n${extractedData.markdown}\n\n=== JSON ===\n${JSON.stringify(extractedData.json, null, 2)}`;
        downloadFile(allContent, 'all-extracted-content.txt', 'text/plain');
        break;
    }
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateNaturalLanguage = (json: any): string => {
    if (!json) return 'No data available to describe.';
    
    let description = `This document contains ${json.sections?.length || 0} sections. `;
    
    if (json.title) {
      description += `The main title is "${json.title}". `;
    }
    
    const sections = json.sections || [];
    const headings = sections.filter((s: any) => s.type === 'heading');
    const paragraphs = sections.filter((s: any) => s.type === 'paragraph');
    const lists = sections.filter((s: any) => s.type === 'list');
    
    if (headings.length > 0) {
      description += `It includes ${headings.length} heading${headings.length > 1 ? 's' : ''} for structure. `;
    }
    
    if (paragraphs.length > 0) {
      description += `There ${paragraphs.length === 1 ? 'is' : 'are'} ${paragraphs.length} paragraph${paragraphs.length > 1 ? 's' : ''} of content. `;
    }
    
    if (lists.length > 0) {
      const totalItems = lists.reduce((sum: number, list: any) => sum + (list.items?.length || 0), 0);
      description += `The document contains ${lists.length} list${lists.length > 1 ? 's' : ''} with a total of ${totalItems} items.`;
    }
    
    return description;
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Extracted Content</CardTitle>
          
          {/* Download Buttons */}
          {extractedData && (
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                onClick={() => handleDownload('json')}
                className="btn-secondary text-xs"
              >
                <Code className="w-3 h-3 mr-1" />
                JSON
              </Button>
              <Button 
                size="sm" 
                onClick={() => handleDownload('markdown')}
                className="btn-secondary text-xs"
              >
                <FileText className="w-3 h-3 mr-1" />
                Markdown
              </Button>
              <Button 
                size="sm" 
                onClick={() => handleDownload('all')}
                className="btn-primary text-xs"
              >
                <Download className="w-3 h-3 mr-1" />
                All Formats
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden">
        {!extractedData ? (
          <div className="h-full flex items-center justify-center text-center text-muted-foreground">
            <div>
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No extracted content available</p>
              <p className="text-xs mt-1">Upload and process documents to see extracted content here</p>
            </div>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid grid-cols-3 w-fit">
              <TabsTrigger value="markdown" className="text-xs">
                <FileText className="w-3 h-3 mr-1" />
                Markdown
              </TabsTrigger>
              <TabsTrigger value="json" className="text-xs">
                <Code className="w-3 h-3 mr-1" />
                JSON
              </TabsTrigger>
              <TabsTrigger value="natural" className="text-xs">
                <MessageSquare className="w-3 h-3 mr-1" />
                Natural Language
              </TabsTrigger>
            </TabsList>
            
            <div className="flex-1 mt-4 overflow-hidden">
              <TabsContent value="markdown" className="h-full mt-0">
                <div className="h-full overflow-y-auto bg-muted p-4 rounded-lg">
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <ReactMarkdown>
                      {extractedData.markdown}
                    </ReactMarkdown>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="json" className="h-full mt-0">
                <div className="h-full overflow-y-auto bg-muted p-4 rounded-lg">
                  <ReactJson 
                    src={extractedData.json}
                    theme="rjv-default"
                    displayDataTypes={false}
                    displayObjectSize={false}
                    enableClipboard={false}
                    collapsed={1}
                    style={{
                      backgroundColor: 'transparent',
                      fontSize: '12px',
                    }}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="natural" className="h-full mt-0">
                <div className="h-full overflow-y-auto bg-muted p-4 rounded-lg">
                  <div className="prose prose-sm max-w-none">
                    <h4 className="text-sm font-semibold mb-3">Document Summary</h4>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {generateNaturalLanguage(extractedData.json)}
                    </p>
                    
                    {extractedData.json.sections && (
                      <div className="mt-4">
                        <h5 className="text-xs font-semibold mb-2 text-foreground">Content Structure:</h5>
                        <ul className="text-xs space-y-1">
                          {extractedData.json.sections.map((section: any, index: number) => (
                            <li key={index} className="text-muted-foreground">
                              <span className="font-medium capitalize">{section.type}</span>
                              {section.level && ` (Level ${section.level})`}
                              {section.text && `: "${section.text.substring(0, 50)}${section.text.length > 50 ? '...' : ''}"`}
                              {section.items && ` with ${section.items.length} items`}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default ExtractedContent;