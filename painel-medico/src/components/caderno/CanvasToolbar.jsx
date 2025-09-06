import React from 'react';
import {
  Brush,
  Eraser,
  RotateCcw,
  Type,
  ArrowRight,
  FileText,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const CanvasToolbar = ({ 
  tool, 
  setTool,
  brushSize,
  setBrushSize,
  brushColor,
  setBrushColor,
  clearCanvas,
  onAttach,
  onExport
}) => {
  const { toast } = useToast();

  const toolButtons = [
    { name: 'brush', icon: Brush, tooltip: 'Pincel' },
    { name: 'eraser', icon: Eraser, tooltip: 'Borracha' },
    { name: 'text', icon: Type, tooltip: 'Texto (em breve)' },
    { name: 'arrow', icon: ArrowRight, tooltip: 'Seta (em breve)' },
  ];

  const handleToolClick = (toolName) => {
    if (['text', 'arrow'].includes(toolName)) {
        toast({ title: `🚧 Ferramenta de ${toolName} ainda não foi implementada! 🚀`});
        return;
    }
    setTool(toolName);
  }

  return (
    <div className="flex flex-row sm:flex-col justify-between sm:justify-start gap-4 p-4 bg-slate-800/50 rounded-lg">
      <div className="flex flex-row sm:flex-col gap-2">
          {toolButtons.map(({ name, icon: Icon, tooltip }) => (
            <Button
              key={name}
              variant={tool === name ? 'default' : 'outline'}
              size="icon"
              onClick={() => handleToolClick(name)}
              className={tool === name ? 'bg-blue-600' : 'border-slate-600'}
              title={tooltip}
            >
              <Icon className="w-5 h-5" />
            </Button>
          ))}
      </div>
      
      <div className="flex flex-col items-center gap-2">
        <label className="text-xs text-slate-400">Tamanho:</label>
        <input
          type="range"
          min="1"
          max="20"
          value={brushSize}
          onChange={(e) => setBrushSize(e.target.value)}
          className="w-16 sm:w-auto"
          style={{ 'WebkitAppearance': 'slider-vertical' }}
        />
        <span className="text-xs text-white">{brushSize}px</span>
      </div>
      
      <div className="flex flex-col items-center gap-2">
        <label className="text-xs text-slate-400">Cor:</label>
        <input
          type="color"
          value={brushColor}
          onChange={(e) => setBrushColor(e.target.value)}
          className="w-8 h-8 rounded border-none bg-transparent cursor-pointer"
        />
      </div>

      <div className="flex flex-row sm:flex-col sm:mt-auto gap-2">
        <Button variant="outline" size="icon" onClick={clearCanvas} className="border-slate-600" title="Limpar tudo">
          <RotateCcw className="w-5 h-5" />
        </Button>
        <Button onClick={onAttach} size="icon" className="bg-blue-600 hover:bg-blue-700" title="Anexar ao Documento">
          <FileText className="w-5 h-5" />
        </Button>
        <Button onClick={onExport} variant="outline" size="icon" className="border-slate-600" title="Exportar PNG">
          <Download className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default CanvasToolbar;