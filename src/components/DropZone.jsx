import { useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';

export default function DropZone({ postText, onTextChange, onImageChange, uploadedImageUrl }) {
  const inputRef = useRef(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.type === 'text/plain') {
      const text = await file.text();
      onTextChange(text);
    } else if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      onImageChange(url);
      onTextChange('[Screenshot uploaded — CTTO will analyze it]');
    }
  }, [onTextChange, onImageChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [], 'text/plain': ['.txt'] },
    multiple: false,
    noClick: true,
  });

  const handleUploadClick = () => {
    inputRef.current?.click();
  };

  const handleFileInputChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await onDrop([file]);
    e.target.value = '';
  };

  return (
    <div style={{ width: '100%' }}>
      <div
        {...getRootProps()}
        style={{
          border: isDragActive ? '2px dashed #ff2d55' : '2px solid #242424',
          borderRadius: '12px',
          padding: '14px 16px',
          background: isDragActive ? 'rgba(255,45,85,0.05)' : '#111',
          transition: 'border-color 0.15s, background 0.15s',
          position: 'relative',
        }}
      >
        <input {...getInputProps()} />

        {uploadedImageUrl && (
          <div style={{ marginBottom: '10px' }}>
            <img
              src={uploadedImageUrl}
              alt="Uploaded screenshot"
              style={{
                maxHeight: '100px',
                borderRadius: '8px',
                display: 'block',
                objectFit: 'contain',
              }}
            />
          </div>
        )}

        <textarea
          value={postText}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Drop a post here, paste it, or upload a screenshot... CTTO will do the rest."
          style={{
            width: '100%',
            minHeight: '130px',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#f0f0f0',
            fontSize: '14px',
            fontFamily: 'inherit',
            resize: 'vertical',
            lineHeight: 1.7,
            display: 'block',
          }}
        />

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '8px',
        }}>
          <button
            type="button"
            onClick={handleUploadClick}
            style={{
              background: 'transparent',
              border: '1px solid #333',
              color: '#888',
              padding: '5px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: '11px',
              letterSpacing: '0.5px',
            }}
          >
            Upload file
          </button>
          <span style={{ color: '#3a3a3a', fontSize: '11px' }}>
            {postText.length} chars
          </span>
        </div>

        {isDragActive && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255,45,85,0.07)',
            borderRadius: '10px',
            fontSize: '14px',
            color: '#ff2d55',
            fontWeight: 700,
            letterSpacing: '1px',
            pointerEvents: 'none',
          }}>
            Drop image or .txt file
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*,text/plain"
        style={{ display: 'none' }}
        onChange={handleFileInputChange}
      />
    </div>
  );
}
