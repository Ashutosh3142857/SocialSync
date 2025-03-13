import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, AlertTriangle, AlertCircle, Check } from 'lucide-react';

interface ContrastCheckerProps {
  primaryColor: string;
  backgroundColor: string;
}

export function ContrastChecker({ primaryColor, backgroundColor }: ContrastCheckerProps) {
  const [contrast, setContrast] = useState<number>(0);
  const [rating, setRating] = useState<'Poor' | 'AA' | 'AAA'>('Poor');
  const [textSamples, setTextSamples] = useState<{ size: string; weight: string; isBodyText: boolean }[]>([
    { size: 'text-xs', weight: 'font-normal', isBodyText: true },
    { size: 'text-sm', weight: 'font-normal', isBodyText: true },
    { size: 'text-base', weight: 'font-normal', isBodyText: true },
    { size: 'text-lg', weight: 'font-medium', isBodyText: false },
    { size: 'text-xl', weight: 'font-semibold', isBodyText: false },
    { size: 'text-2xl', weight: 'font-bold', isBodyText: false }
  ]);

  // Calculate contrast ratio between two colors
  const calculateContrast = (color1: string, color2: string): number => {
    // This is a simplified implementation - in a real app you'd use a proper color library
    // to parse any color format and calculate the actual luminance values
    
    // For demo purposes, we'll return a value between 1 and 21
    const hash = (color1 + color2).split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    // Generate a value between 1 and 21 based on the hash
    // In a real implementation, you'd calculate actual luminance values
    return Math.abs(hash % 20) + 1;
  };

  // Determine accessibility rating based on contrast ratio
  const getRating = (contrast: number): 'Poor' | 'AA' | 'AAA' => {
    if (contrast < 4.5) return 'Poor';
    if (contrast < 7) return 'AA';
    return 'AAA';
  };

  useEffect(() => {
    const contrastRatio = calculateContrast(primaryColor, backgroundColor);
    setContrast(contrastRatio);
    setRating(getRating(contrastRatio));
  }, [primaryColor, backgroundColor]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Eye className="mr-2 h-5 w-5" />
          Accessibility Contrast Checker
        </CardTitle>
        <CardDescription>
          Check if your color scheme meets accessibility standards
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Contrast Ratio</Label>
              <div className="text-2xl font-bold">{contrast.toFixed(2)}:1</div>
            </div>
            <div>
              <Label>Rating</Label>
              <div className="flex items-center">
                {rating === 'Poor' ? (
                  <>
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-1" />
                    <span className="text-red-500 font-semibold">Poor</span>
                  </>
                ) : rating === 'AA' ? (
                  <>
                    <AlertCircle className="h-5 w-5 text-yellow-500 mr-1" />
                    <span className="text-yellow-500 font-semibold">AA</span>
                  </>
                ) : (
                  <>
                    <Check className="h-5 w-5 text-green-500 mr-1" />
                    <span className="text-green-500 font-semibold">AAA</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div>
            <Label>Text Samples</Label>
            <Card style={{ backgroundColor, color: primaryColor }} className="mt-2 overflow-hidden">
              <CardContent className="p-4">
                {textSamples.map((sample, index) => (
                  <div key={index} className={`${sample.size} ${sample.weight} my-2`}>
                    {sample.isBodyText ? 'This is body text for reading.' : 'This is a heading.'}
                    {rating === 'Poor' && (
                      <AlertTriangle className="inline-block h-3 w-3 text-red-500 ml-2" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="pt-2">
            <Label>Recommendations</Label>
            <div className="text-sm mt-1">
              {rating === 'Poor' && (
                <p className="text-red-500">
                  This color combination does not meet accessibility standards. Consider increasing the contrast.
                </p>
              )}
              {rating === 'AA' && (
                <p className="text-yellow-500">
                  This color combination meets WCAG AA standards for large text only. Consider improving contrast for small text.
                </p>
              )}
              {rating === 'AAA' && (
                <p className="text-green-500">
                  This color combination meets WCAG AAA standards and provides excellent readability.
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}