import { useState } from 'react';
import FileUploader from '@/components/FileUploader';
import LanguageDetection from '@/components/LanguageDetection';
import DocumentViewer from '@/components/DocumentViewer';
import ExtractedContent from '@/components/ExtractedContent';

export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  preview?: string;
  file: File;
}

export interface DetectedLanguage {
  language: string;
  confidence: number;
}

export interface ExtractedData {
  markdown: string;
  json: any;
}

const Index = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
  const [detectedLanguages, setDetectedLanguages] = useState<DetectedLanguage[]>([]);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [overlayToggles, setOverlayToggles] = useState({
    text: false,
    tables: false,
    images: false,
    headings: false,
  });

  const handleFilesUpload = (files: UploadedFile[]) => {
    setUploadedFiles(prev => [...prev, ...files]);
    
    // Simulate language detection
    const mockLanguages: DetectedLanguage[] = [
      { language: 'English', confidence: 95.2 },
      { language: 'Spanish', confidence: 3.1 },
      { language: 'French', confidence: 1.7 },
    ];
    setDetectedLanguages(mockLanguages);

    // Simulate extracted data
    const mockExtracted: ExtractedData = {
      markdown: `# Document Title\n\nThis is a sample extracted document with **bold text** and *italic text*.\n\n## Section 1\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit.\n\n- Item 1\n- Item 2\n- Item 3`,
      json: {
        title: "Document Title",
        sections: [
          {
            type: "heading",
            level: 1,
            text: "Document Title"
          },
          {
            type: "paragraph",
            text: "This is a sample extracted document with bold text and italic text."
          },
          {
            type: "heading",
            level: 2,
            text: "Section 1"
          },
          {
            type: "list",
            items: ["Item 1", "Item 2", "Item 3"]
          }
        ]
      }
    };
    setExtractedData(mockExtracted);
  };

  const handleFileSelect = (file: UploadedFile) => {
    setSelectedFile(file);
  };

  const handleOverlayToggle = (overlay: keyof typeof overlayToggles) => {
    setOverlayToggles(prev => ({
      ...prev,
      [overlay]: !prev[overlay]
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col lg:flex-row h-screen">
        {/* Left Sidebar */}
        <div className="w-full lg:w-80 bg-card border-r border-border p-6 overflow-y-auto">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Document Processor</h1>
              <p className="text-muted-foreground text-sm">Upload and analyze your documents</p>
            </div>
            
            <FileUploader 
              onFilesUpload={handleFilesUpload}
              uploadedFiles={uploadedFiles}
              onFileSelect={handleFileSelect}
            />
            
            <LanguageDetection languages={detectedLanguages} />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Document Viewer */}
          <div className="flex-1 p-6">
            <DocumentViewer 
              selectedFile={selectedFile}
              overlayToggles={overlayToggles}
              onOverlayToggle={handleOverlayToggle}
            />
          </div>

          {/* Bottom Section - Extracted Content */}
          <div className="h-80 border-t border-border">
            <ExtractedContent extractedData={extractedData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;