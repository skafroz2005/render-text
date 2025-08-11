import React, { useState, useRef } from 'react';
import { Upload, X, FileText, Image as ImageIcon, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { UploadedFile } from '@/pages/Index';

interface FileUploaderProps {
  onFilesUpload: (files: UploadedFile[]) => void;
  uploadedFiles: UploadedFile[];
  onFileSelect: (file: UploadedFile) => void;
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

const FileUploader: React.FC<FileUploaderProps> = ({ onFilesUpload, uploadedFiles, onFileSelect }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError(`File type ${file.type} is not supported. Please upload JPG, PNG, JPEG, PDF, or DOCX files.`);
      return false;
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('File size exceeds 10MB limit.');
      return false;
    }
    return true;
  };

  const processFiles = (files: FileList) => {
    setError(null);
    const validFiles: UploadedFile[] = [];

    Array.from(files).forEach(file => {
      if (validateFile(file)) {
        const uploadedFile: UploadedFile = {
          id: Date.now() + Math.random().toString(36),
          name: file.name,
          type: file.type,
          size: file.size,
          file
        };

        // Create preview for images
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            uploadedFile.preview = e.target?.result as string;
          };
          reader.readAsDataURL(file);
        }

        validFiles.push(uploadedFile);
      }
    });

    if (validFiles.length > 0) {
      onFilesUpload(validFiles);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    processFiles(e.dataTransfer.files);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  const removeFile = (fileId: string) => {
    // This would need to be implemented in the parent component
    console.log('Remove file:', fileId);
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <ImageIcon className="w-4 h-4" />;
    if (type === 'application/pdf') return <FileText className="w-4 h-4 text-red-500" />;
    if (type.includes('word')) return <File className="w-4 h-4 text-blue-500" />;
    return <File className="w-4 h-4" />;
  };

  return (
    <Card className="card-elevated">
      <CardHeader>
        <CardTitle className="text-lg">Upload Documents</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Zone */}
        <div
          className={`upload-zone p-8 text-center cursor-pointer ${
            isDragOver ? 'border-primary bg-primary-light' : ''
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground mb-2">
            Drag and drop files here or click to browse
          </p>
          <p className="text-xs text-muted-foreground">
            Supports JPG, PNG, JPEG, PDF, DOCX (max 10MB)
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.pdf,.docx"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <Button 
          onClick={() => fileInputRef.current?.click()}
          className="btn-primary w-full"
        >
          Choose Files
        </Button>

        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Uploaded Files</h4>
            {uploadedFiles.map(file => (
              <div
                key={file.id}
                className="flex items-center gap-3 p-3 bg-muted rounded-md hover:bg-muted/80 transition-colors cursor-pointer"
                onClick={() => onFileSelect(file)}
              >
                {file.preview ? (
                  <img 
                    src={file.preview} 
                    alt={file.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                ) : (
                  <div className="w-10 h-10 bg-secondary rounded flex items-center justify-center">
                    {getFileIcon(file.type)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(file.id);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileUploader;