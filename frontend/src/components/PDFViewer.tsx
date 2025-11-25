import React from 'react';
import { X, Download } from 'lucide-react';

interface PDFViewerProps {
    fileUrl: string;
    fileName: string;
    onClose: () => void;
}

export function PDFViewer({ fileUrl, fileName, onClose }: PDFViewerProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-background w-full max-w-6xl h-[90vh] rounded-2xl flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <h3 className="text-lg font-semibold truncate">{fileName}</h3>
                    <div className="flex items-center space-x-2">
                        <a
                            href={fileUrl}
                            download
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            title="Download"
                        >
                            <Download className="w-5 h-5" />
                        </a>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* PDF Viewer */}
                <div className="flex-1 overflow-hidden">
                    <iframe
                        src={fileUrl}
                        className="w-full h-full"
                        title={fileName}
                    />
                </div>
            </div>
        </div>
    );
}
