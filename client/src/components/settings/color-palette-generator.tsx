import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette, Copy, Check, RefreshCw } from 'lucide-react';

export function ColorPaletteGenerator() {
  const [baseColor, setBaseColor] = useState('#6366f1');
  const [shades, setShades] = useState<string[]>([]);
  const [complementary, setComplementary] = useState<string[]>([]);
  const [analogous, setAnalogous] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  // Generate color shades (lighter and darker versions)
  const generateShades = (color: string): string[] => {
    // This is a simplified implementation - in a real app, you'd use a color library
    // to properly generate tints and shades with accurate HSL transformations
    
    // For demo purposes, we'll create mock shades
    // In a real implementation, you'd adjust lightness values
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result 
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
          }
        : { r: 0, g: 0, b: 0 };
    };
    
    const rgbToHex = (r: number, g: number, b: number) => {
      return '#' + [r, g, b]
        .map(x => {
          const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16);
          return hex.length === 1 ? '0' + hex : hex;
        })
        .join('');
    };
    
    const rgb = hexToRgb(color);
    const shades = [];
    
    // Generate 9 shades (50-900)
    for (let i = 0; i < 9; i++) {
      const factor = i * 0.1 + 0.1; // 0.1 to 0.9
      // Adjust lightness - this is a simplified approach
      const adjustedR = rgb.r + (255 - rgb.r) * factor;
      const adjustedG = rgb.g + (255 - rgb.g) * factor;
      const adjustedB = rgb.b + (255 - rgb.b) * factor;
      
      shades.push(rgbToHex(adjustedR, adjustedG, adjustedB));
    }
    
    return shades.reverse(); // Darkest to lightest
  };

  // Generate complementary colors (opposite on the color wheel)
  const generateComplementary = (color: string): string[] => {
    // Simplified implementation - in a real app, use a color library for accurate HSL conversions
    // For demo purposes, we'll create a mock complementary color
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result 
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
          }
        : { r: 0, g: 0, b: 0 };
    };
    
    const rgbToHex = (r: number, g: number, b: number) => {
      return '#' + [r, g, b]
        .map(x => {
          const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16);
          return hex.length === 1 ? '0' + hex : hex;
        })
        .join('');
    };
    
    const rgb = hexToRgb(color);
    // Complementary color is the inverse
    const compR = 255 - rgb.r;
    const compG = 255 - rgb.g;
    const compB = 255 - rgb.b;
    
    const complementary = rgbToHex(compR, compG, compB);
    
    // Generate a few variations
    return [
      complementary,
      rgbToHex(compR - 20, compG - 20, compB - 20),
      rgbToHex(compR + 20, compG + 20, compB + 20),
    ];
  };

  // Generate analogous colors (adjacent on the color wheel)
  const generateAnalogous = (color: string): string[] => {
    // Simplified implementation - in a real app, use a color library for accurate HSL conversions
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result 
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
          }
        : { r: 0, g: 0, b: 0 };
    };
    
    const rgbToHex = (r: number, g: number, b: number) => {
      return '#' + [r, g, b]
        .map(x => {
          const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16);
          return hex.length === 1 ? '0' + hex : hex;
        })
        .join('');
    };
    
    const rgb = hexToRgb(color);
    
    // For demo purposes, we'll create mock analogous colors
    // In a real implementation, you'd properly adjust the hue in HSL color space
    return [
      rgbToHex((rgb.r + 30) % 255, (rgb.g + 15) % 255, rgb.b),
      color,
      rgbToHex(rgb.r, (rgb.g + 15) % 255, (rgb.b + 30) % 255),
    ];
  };

  // Generate all colors when the base color changes
  useEffect(() => {
    setShades(generateShades(baseColor));
    setComplementary(generateComplementary(baseColor));
    setAnalogous(generateAnalogous(baseColor));
  }, [baseColor]);

  // Copy color to clipboard
  const copyToClipboard = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopied(color);
    setTimeout(() => setCopied(null), 2000);
  };

  // Generate a random color
  const generateRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    setBaseColor(color);
  };

  const ColorSwatch = ({ color, label }: { color: string; label?: string }) => (
    <div className="flex flex-col items-center">
      <div
        className="w-12 h-12 rounded cursor-pointer relative"
        style={{ backgroundColor: color }}
        onClick={() => copyToClipboard(color)}
      >
        {copied === color && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded">
            <Check className="text-white h-6 w-6" />
          </div>
        )}
      </div>
      {label && <span className="text-xs mt-1">{label}</span>}
      <span className="text-xs mt-1">{color}</span>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Palette className="mr-2 h-5 w-5" />
          Color Palette Generator
        </CardTitle>
        <CardDescription>
          Create custom color palettes for your theme
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-end space-x-2">
            <div className="flex-1">
              <Label htmlFor="base-color">Base Color</Label>
              <div className="flex mt-1">
                <Input
                  id="base-color"
                  type="text"
                  value={baseColor}
                  onChange={(e) => setBaseColor(e.target.value)}
                  className="rounded-r-none"
                />
                <div 
                  className="w-10 border border-l-0 rounded-r-md flex items-center justify-center cursor-pointer"
                  style={{ backgroundColor: baseColor }}
                  onClick={() => document.getElementById('color-picker')?.click()}
                >
                  <input
                    id="color-picker"
                    type="color"
                    value={baseColor}
                    onChange={(e) => setBaseColor(e.target.value)}
                    className="sr-only"
                  />
                </div>
              </div>
            </div>
            <Button variant="outline" onClick={generateRandomColor} className="flex items-center">
              <RefreshCw className="h-4 w-4 mr-2" />
              Random
            </Button>
          </div>

          <Tabs defaultValue="shades">
            <TabsList className="w-full">
              <TabsTrigger value="shades" className="flex-1">Shades</TabsTrigger>
              <TabsTrigger value="complementary" className="flex-1">Complementary</TabsTrigger>
              <TabsTrigger value="analogous" className="flex-1">Analogous</TabsTrigger>
            </TabsList>
            
            <TabsContent value="shades" className="pt-4">
              <div className="flex flex-wrap gap-4 justify-center">
                {shades.map((color, index) => (
                  <ColorSwatch key={index} color={color} label={`${(index + 1) * 100}`} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="complementary" className="pt-4">
              <div className="flex flex-wrap gap-4 justify-center">
                {complementary.map((color, index) => (
                  <ColorSwatch key={index} color={color} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="analogous" className="pt-4">
              <div className="flex flex-wrap gap-4 justify-center">
                {analogous.map((color, index) => (
                  <ColorSwatch key={index} color={color} />
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between pt-2">
            <div className="text-sm text-gray-500">
              Click on any color to copy its hex code
            </div>
            <Button variant="outline" size="sm" className="flex items-center">
              <Copy className="h-4 w-4 mr-2" />
              Copy Palette
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}