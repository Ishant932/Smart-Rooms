import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Image, Film, Loader2, ShieldAlert } from 'lucide-react';
import { uploadMedia } from '../api/client';

const POLICY = 'Upload room photos & videos only. No adult, sexual, or offensive content — violations may lead to account suspension.';

export default function MediaUpload({ images = [], videos = [], onChange, maxFiles = 10 }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const totalCount = images.length + videos.length;

  const handleFiles = async (fileList) => {
    const picked = Array.from(fileList || []);
    if (!picked.length) return;
    if (totalCount + picked.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    setError('');
    setUploading(true);
    const formData = new FormData();
    picked.forEach((f) => formData.append('files', f));

    try {
      const data = await uploadMedia(formData);
      const newImages = [...images];
      const newVideos = [...videos];
      (data.files || []).forEach((f) => {
        if (f.type === 'video') newVideos.push(f.url);
        else newImages.push(f.url);
      });
      onChange({ images: newImages, videos: newVideos });
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed. Check file type and size (max 25MB each).');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const removeImage = (idx) => {
    onChange({ images: images.filter((_, i) => i !== idx), videos });
  };

  const removeVideo = (idx) => {
    onChange({ images, videos: videos.filter((_, i) => i !== idx) });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-900 ring-1 ring-amber-100">
        <ShieldAlert size={16} className="mt-0.5 shrink-0" />
        <span>{POLICY}</span>
      </div>

      <motion.button
        type="button"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        disabled={uploading || totalCount >= maxFiles}
        onClick={() => inputRef.current?.click()}
        className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-brand-200 bg-brand-50/50 px-6 py-8 transition hover:border-brand-400 hover:bg-brand-50 disabled:opacity-50"
      >
        {uploading ? (
          <Loader2 className="animate-spin text-brand-500" size={36} />
        ) : (
          <Upload className="text-brand-500" size={36} />
        )}
        <p className="mt-2 text-sm font-semibold text-gray-800">
          {uploading ? 'Uploading…' : 'Upload photos & videos'}
        </p>
        <p className="mt-1 text-xs text-gray-500">JPG, PNG, WebP, GIF · MP4, WebM · up to {maxFiles} files</p>
      </motion.button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <AnimatePresence>
        {(images.length > 0 || videos.length > 0) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-2 gap-3 sm:grid-cols-3"
          >
            {images.map((url, i) => (
              <motion.div
                key={url}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="group relative aspect-square overflow-hidden rounded-xl ring-1 ring-gray-200"
              >
                <img src={url} alt="" className="h-full w-full object-cover" />
                <span className="absolute left-2 top-2 rounded bg-black/50 px-1.5 py-0.5 text-[10px] text-white">
                  <Image size={10} className="inline" /> Photo
                </span>
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white opacity-0 transition group-hover:opacity-100"
                >
                  <X size={14} />
                </button>
              </motion.div>
            ))}
            {videos.map((url, i) => (
              <motion.div
                key={url}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="group relative aspect-square overflow-hidden rounded-xl ring-1 ring-gray-200"
              >
                <video src={url} className="h-full w-full object-cover" muted playsInline />
                <span className="absolute left-2 top-2 rounded bg-black/50 px-1.5 py-0.5 text-[10px] text-white">
                  <Film size={10} className="inline" /> Video
                </span>
                <button
                  type="button"
                  onClick={() => removeVideo(i)}
                  className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white opacity-0 transition group-hover:opacity-100"
                >
                  <X size={14} />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
