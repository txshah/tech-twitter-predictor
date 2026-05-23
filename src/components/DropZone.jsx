import { useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { T } from '../lib/theme.js';

export default function DropZone({ postText, onTextChange, onImageChange, uploadedImageUrl, charCountLabel }) {
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

  const handleUploadClick = () => inputRef.current?.click();

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
          background: isDragActive ? 'rgba(232,255,71,0.04)' : T.bg2,
          border: isDragActive ? `2px solid ${T.accent}` : `1px solid ${T.border}`,
          borderRadius: '16px',
          position: 'relative',
          transition: 'border-color 0.15s, background 0.15s',
          overflow: 'hidden',
        }}
      >
        <input {...getInputProps()} />

        {uploadedImageUrl && (
          <div style={{ padding: '16px 16px 0' }}>
            <img
              src={uploadedImageUrl}
              alt="Uploaded screenshot"
              style={{
                maxHeight: '100px',
                borderRadius: '8px',
                display: 'block',
                objectFit: 'contain',
                border: `1px solid ${T.border}`,
              }}
            />
          </div>
        )}

        <textarea
          className="ctto-textarea"
          value={postText}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder={"paste their post here. we'll tell you if it slaps or if they're cooked.\n(screenshots work too — we can read the cringe)"}
          style={{
            width: '100%',
            minHeight: '130px',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: T.textPrimary,
            fontSize: '14px',
            fontFamily: T.body,
            resize: 'vertical',
            lineHeight: 1.7,
            display: 'block',
            padding: '16px',
          }}
        />

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 14px 10px',
          borderTop: `1px solid ${T.border}`,
          background: T.bg3,
        }}>
          <button
            type="button"
            onClick={handleUploadClick}
            style={{
              background: 'transparent',
              border: `1px solid ${T.border}`,
              color: T.textMuted,
              padding: '4px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontFamily: T.body,
              fontSize: '11px',
              letterSpacing: '0.02em',
              transition: 'border-color 0.15s, color 0.15s',
            }}
          >
            📎 attach evidence
          </button>
          <span style={{ fontFamily: T.mono, color: T.textMuted, fontSize: '11px' }}>
            {charCountLabel ?? postText.length}
          </span>
        </div>

        {isDragActive && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(232,255,71,0.06)',
            fontFamily: T.body,
            fontSize: '14px',
            fontWeight: 600,
            color: T.accent,
            letterSpacing: '0.05em',
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
