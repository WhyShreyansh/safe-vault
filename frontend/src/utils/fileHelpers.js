/**
 * Map backend file object to frontend display format
 */
export const mapBackendFile = (f) => {
  const ext = (f.originalName || '').split('.').pop()?.toLowerCase();
  const mimeType = (f.mimeType || '').toLowerCase();
  let type = ext || 'document';
  if (mimeType.includes('pdf') || ext === 'pdf') type = 'pdf';
  else if (mimeType.includes('image') || ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) type = 'image';
  else if (mimeType.includes('video') || ['mp4', 'webm', 'mov'].includes(ext)) type = 'video';
  else if (mimeType.includes('audio') || ['mp3', 'wav', 'ogg'].includes(ext)) type = 'audio';
  else if (['zip', 'rar', '7z'].includes(ext)) type = 'archive';

  return {
    ...f,
    name: f.originalName || f.name,
    type,
    uploadDate: f.uploadDate ? new Date(f.uploadDate) : new Date(),
    starred: f.starred || false,
    encrypted: f.encrypted === true,
  };
};
