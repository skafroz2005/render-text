import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe } from 'lucide-react';
import type { DetectedLanguage } from '@/pages/Index';

interface LanguageDetectionProps {
  languages: DetectedLanguage[];
}

const LanguageDetection: React.FC<LanguageDetectionProps> = ({ languages }) => {
  return (
    <Card className="card-elevated">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Globe className="w-5 h-5" />
          Language Detection
        </CardTitle>
      </CardHeader>
      <CardContent>
        {languages.length === 0 ? (
          <p className="text-sm text-muted-foreground">Upload documents to detect languages</p>
        ) : (
          <div className="space-y-3">
            {languages.map((lang, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="secondary" 
                    className="language-badge"
                  >
                    {lang.language}
                  </Badge>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-foreground">
                    {lang.confidence.toFixed(1)}%
                  </span>
                  <div className="w-16 h-2 bg-muted rounded-full mt-1">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{ width: `${lang.confidence}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LanguageDetection;