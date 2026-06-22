"use client";

import React, { useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Download, Upload, FileSpreadsheet, AlertCircle, CheckCircle2 } from 'lucide-react';

export function CsvActions() {
  const pathname = usePathname();
  // Payload admin collections path is typically /admin/collections/[slug]
  const pathParts = pathname?.split('/') || [];
  const collectionIndex = pathParts.indexOf('collections');
  const collection = collectionIndex !== -1 ? pathParts[collectionIndex + 1] : null;

  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importReport, setImportReport] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  if (!collection) return null;

  const handleExport = () => {
    window.location.href = `/api/csv/${collection}/export`;
  };

  const handleTemplate = () => {
    window.location.href = `/api/csv/${collection}/template`;
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`/api/csv/${collection}/import?dryRun=true`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setImportReport(data);
      setIsModalOpen(true);
    } catch (error) {
      alert('Error procesando el archivo CSV.');
      console.error(error);
    } finally {
      setIsProcessing(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleConfirmImport = async () => {
    if (!selectedFile) return;
    
    setIsProcessing(true);
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const res = await fetch(`/api/csv/${collection}/import?dryRun=false`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      
      if (data.success) {
        alert('Importación completada con éxito.');
        window.location.reload(); // Recargar la tabla de Payload
      } else {
        alert('Hubo errores en la importación. Revisa la consola.');
        console.error(data);
      }
    } catch (error) {
      alert('Error crítico ejecutando la importación.');
      console.error(error);
    } finally {
      setIsProcessing(false);
      setIsModalOpen(false);
      setSelectedFile(null);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' }}>
      <button 
        onClick={handleTemplate}
        type="button"
        style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', background: 'transparent' }}
      >
        <FileSpreadsheet size={16} /> Plantilla
      </button>

      <button 
        onClick={handleExport}
        type="button"
        style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', background: 'transparent' }}
      >
        <Download size={16} /> Exportar
      </button>

      <button 
        onClick={triggerFileInput}
        type="button"
        disabled={isProcessing}
        style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 12px', border: '1px solid #063547', borderRadius: '4px', cursor: 'pointer', background: '#063547', color: 'white' }}
      >
        <Upload size={16} /> {isProcessing ? 'Procesando...' : 'Importar'}
      </button>

      <input 
        type="file" 
        accept=".csv" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        style={{ display: 'none' }} 
      />

      {isModalOpen && importReport && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '8px', width: '80%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ marginTop: 0, borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
              Validación de Importación CSV
            </h2>
            
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
              <div style={{ padding: '15px', background: '#f0f9ff', borderRadius: '8px', flex: 1 }}>
                <strong style={{ display: 'block', fontSize: '24px', color: '#0369a1' }}>{importReport.summary.total}</strong>
                <span>Filas Totales</span>
              </div>
              <div style={{ padding: '15px', background: '#ecfdf5', borderRadius: '8px', flex: 1 }}>
                <strong style={{ display: 'block', fontSize: '24px', color: '#059669' }}>{importReport.summary.new}</strong>
                <span>Nuevos (Se crearán)</span>
              </div>
              <div style={{ padding: '15px', background: '#fffbeb', borderRadius: '8px', flex: 1 }}>
                <strong style={{ display: 'block', fontSize: '24px', color: '#d97706' }}>{importReport.summary.updated}</strong>
                <span>Existentes (Se actualizarán)</span>
              </div>
              <div style={{ padding: '15px', background: '#fef2f2', borderRadius: '8px', flex: 1 }}>
                <strong style={{ display: 'block', fontSize: '24px', color: '#dc2626' }}>{importReport.summary.errors}</strong>
                <span>Errores (No se importarán)</span>
              </div>
            </div>

            {importReport.errors.length > 0 && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                <h4 style={{ color: '#dc2626', marginTop: 0, display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <AlertCircle size={16} /> Errores detectados
                </h4>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#dc2626', fontSize: '14px' }}>
                  {importReport.errors.slice(0, 10).map((err: any, i: number) => (
                    <li key={i}>Fila con datos conflictivos: {err.error}</li>
                  ))}
                  {importReport.errors.length > 10 && (
                    <li>...y {importReport.errors.length - 10} errores más.</li>
                  )}
                </ul>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{ padding: '10px 20px', background: 'transparent', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}
                disabled={isProcessing}
              >
                Cancelar
              </button>
              <button 
                onClick={handleConfirmImport}
                disabled={isProcessing || (importReport.summary.new === 0 && importReport.summary.updated === 0)}
                style={{ padding: '10px 20px', background: '#063547', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                <CheckCircle2 size={16} /> {isProcessing ? 'Guardando...' : 'Confirmar Importación'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
