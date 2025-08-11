import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Image as ImageIcon, Table, Type, Eye, EyeOff } from 'lucide-react';
import type { UploadedFile } from '@/pages/Index';

type OverlayToggles = {
  text: boolean;
  tables: boolean;
  images: boolean;
  headings: boolean;
};

interface DocumentViewerProps {
  selectedFile: UploadedFile | null;
  overlayToggles: OverlayToggles;
  onOverlayToggle: (overlay: keyof OverlayToggles) => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ 
  selectedFile, 
  overlayToggles, 
  onOverlayToggle 
}) => {
  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <ImageIcon className="w-8 h-8" />;
    if (type === 'application/pdf') return <FileText className="w-8 h-8 text-red-500" />;
    return <FileText className="w-8 h-8 text-blue-500" />;
  };

  const overlayButtons = [
    { key: 'text' as const, icon: Type, label: 'Text', color: 'bg-blue-500' },
    { key: 'tables' as const, icon: Table, label: 'Tables', color: 'bg-green-500' },
    { key: 'images' as const, icon: ImageIcon, label: 'Images', color: 'bg-purple-500' },
    { key: 'headings' as const, icon: Type, label: 'Headings', color: 'bg-orange-500' },
  ];

  return (
    <Card className="card-elevated h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Document Viewer</CardTitle>
          
          {/* Overlay Toggle Toolbar */}
          <div className="flex items-center gap-2">
            {overlayButtons.map(({ key, icon: Icon, label, color }) => (
              <Button
                key={key}
                size="sm"
                variant={overlayToggles[key] ? "default" : "outline"}
                onClick={() => onOverlayToggle(key)}
                className={`${overlayToggles[key] ? 'btn-primary' : 'btn-secondary'} text-xs`}
              >
                <Icon className="w-3 h-3 mr-1" />
                {label}
                {overlayToggles[key] ? 
                  <Eye className="w-3 h-3 ml-1" /> : 
                  <EyeOff className="w-3 h-3 ml-1" />
                }
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex items-center justify-center">
        {!selectedFile ? (
          <div className="text-center text-muted-foreground">
            <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No document selected</p>
            <p className="text-sm">Select a file from the sidebar to preview it here</p>
          </div>
        ) : (
          <div className="w-full h-full relative">
            {selectedFile.type.startsWith('image/') ? (
              <div className="relative h-full">
                <img 
                  src={selectedFile.preview} 
                  alt={selectedFile.name}
                  className="max-w-full max-h-full object-contain mx-auto"
                />
                
                {/* Overlay Elements */}
                {overlayToggles.text && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-20 left-10 w-32 h-8 border-2 border-blue-500 bg-blue-500/10 rounded"></div>
                    <div className="absolute top-40 left-10 w-48 h-6 border-2 border-blue-500 bg-blue-500/10 rounded"></div>
                  </div>
                )}
                
                {overlayToggles.tables && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute bottom-40 right-10 w-40 h-24 border-2 border-green-500 bg-green-500/10 rounded"></div>
                  </div>
                )}
                
                {overlayToggles.images && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-60 left-20 w-24 h-16 border-2 border-purple-500 bg-purple-500/10 rounded"></div>
                  </div>
                )}
                
                {overlayToggles.headings && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-10 left-10 w-40 h-10 border-2 border-orange-500 bg-orange-500/10 rounded"></div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center bg-muted rounded-lg">
                {getFileIcon(selectedFile.type)}
                <h3 className="text-lg font-medium mt-4 mb-2">{selectedFile.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <p className="text-xs text-muted-foreground text-center px-4">
                  {selectedFile.type === 'application/pdf' 
                    ? 'PDF preview requires backend processing' 
                    : 'Document preview requires backend processing'
                  }
                </p>
                
                {/* Overlay indicators for non-image files */}
                {Object.entries(overlayToggles).some(([_, active]) => active) && (
                  <div className="mt-6 flex gap-2 flex-wrap justify-center">
                    {overlayButtons.map(({ key, label, color }) => 
                      overlayToggles[key] && (
                        <span 
                          key={key}
                          className={`px-2 py-1 text-xs rounded text-white ${color}`}
                        >
                          {label} overlay active
                        </span>
                      )
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentViewer;