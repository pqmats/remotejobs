
import React, { useCallback, useState } from 'react';
import { Upload, X, FileText, CheckCircle, AlertCircle, Loader2, Image as ImageIcon } from 'lucide-react';

interface FileUploadProps {
  label: string;
  accept: string; // e.g. "image/*" or ".pdf"
  maxSizeMB: number;
  onFileSelect: (file: File) => void;
  currentFileUrl?: string;
  onRemove?: () => void;
  variant?: 'avatar' | 'document';
  isLoading?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ 
  label, 
  accept, 
  maxSizeMB, 
  onFileSelect, 
  currentFileUrl, 
  onRemove,
  variant = 'document',
  isLoading = false
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentFileUrl || null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const validateFile = (file: File) => {
    // Validate Type
    const acceptedTypes = accept.split(',').map(t => t.trim());
    const fileType = file.type;
    const fileName = file.name.toLowerCase();
    
    // Simple validation logic (can be expanded)
    const isValidType = acceptedTypes.some(type => {
        if (type.endsWith('/*')) return fileType.startsWith(type.replace('/*', ''));
        if (type.startsWith('.')) return fileName.endsWith(type);
        return fileType === type;
    });

    if (!isValidType) {
        return `Tipo de arquivo inválido. Permitido: ${accept}`;
    }

    // Validate Size
    if (file.size > maxSizeMB * 1024 * 1024) {
        return `Arquivo muito grande. Máximo: ${maxSizeMB}MB`;
    }

    return null;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const validationError = validateFile(file);
      
      if (validationError) {
          setError(validationError);
      } else {
          handleValidFile(file);
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setError(null);
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const validationError = validateFile(file);
        
        if (validationError) {
            setError(validationError);
        } else {
            handleValidFile(file);
        }
    }
  };

  const handleValidFile = (file: File) => {
    if (variant === 'avatar') {
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
    }
    onFileSelect(file);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    if (onRemove) onRemove();
  };

  // Avatar Variant UI
  if (variant === 'avatar') {
      return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative group cursor-pointer">
                <div 
                    className={`w-32 h-32 rounded-full border-4 overflow-hidden bg-onyx-900 flex items-center justify-center transition-all ${dragActive ? 'border-onyx-accent scale-105' : 'border-onyx-700'}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById(`file-upload-${label}`)?.click()}
                >
                    {isLoading ? (
                         <Loader2 className="w-8 h-8 text-onyx-accent animate-spin" />
                    ) : preview ? (
                        <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                        <ImageIcon className="w-10 h-10 text-onyx-muted" />
                    )}
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-full">
                         <Upload className="w-6 h-6 text-white" />
                    </div>
                </div>

                {preview && !isLoading && (
                    <button 
                        onClick={handleRemove}
                        className="absolute top-0 right-0 p-1.5 bg-red-500 rounded-full text-white shadow-lg hover:bg-red-600 transition-colors"
                        title="Remover foto"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>
            
            <div className="text-center">
                <p className="text-sm font-medium text-white">{label}</p>
                <p className="text-xs text-onyx-muted mt-1">JPG, PNG ou WEBP • Máx {maxSizeMB}MB</p>
                {error && <p className="text-xs text-red-400 mt-2 flex items-center justify-center gap-1"><AlertCircle className="w-3 h-3"/> {error}</p>}
            </div>

            <input 
                id={`file-upload-${label}`}
                type="file" 
                className="hidden" 
                accept={accept}
                onChange={handleChange}
            />
        </div>
      )
  }

  // Document Variant UI
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-onyx-muted mb-2">{label}</label>
      
      {!preview && !currentFileUrl ? (
          // Upload State
          <div 
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer bg-onyx-900/50 ${
                dragActive ? 'border-onyx-accent bg-onyx-accent/5' : 'border-onyx-700 hover:border-onyx-500 hover:bg-onyx-800'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById(`file-upload-${label}`)?.click()}
          >
             {isLoading ? (
                <div className="flex flex-col items-center">
                    <Loader2 className="w-8 h-8 text-onyx-accent animate-spin mb-3" />
                    <p className="text-white font-medium">Enviando arquivo...</p>
                </div>
             ) : (
                <>
                    <Upload className="w-8 h-8 text-onyx-muted mx-auto mb-3" />
                    <p className="text-white font-medium text-sm">Arraste e solte ou clique para selecionar</p>
                    <p className="text-xs text-onyx-muted mt-2">PDF (Máx {maxSizeMB}MB)</p>
                </>
             )}
          </div>
      ) : (
          // File Selected/Uploaded State
          <div className="bg-onyx-800 border border-onyx-700 rounded-xl p-4 flex items-center justify-between group">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center text-red-500">
                    <FileText className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-sm font-bold text-white max-w-[200px] truncate">
                        {/* We don't verify real name in mock url, assume 'Currículo.pdf' if not provided */}
                        Currículo.pdf
                    </p>
                    <p className="text-xs text-green-400 flex items-center gap-1 mt-0.5">
                        <CheckCircle className="w-3 h-3" /> Pronto para uso
                    </p>
                </div>
             </div>
             <button 
                onClick={handleRemove}
                className="p-2 text-onyx-muted hover:text-red-400 hover:bg-onyx-700 rounded transition-colors"
                title="Remover arquivo"
             >
                 <X className="w-5 h-5" />
             </button>
          </div>
      )}

      {error && (
        <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {error}
        </p>
      )}

      <input 
        id={`file-upload-${label}`}
        type="file" 
        className="hidden" 
        accept={accept}
        onChange={handleChange}
      />
    </div>
  );
};
