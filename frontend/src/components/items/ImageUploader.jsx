import { ImagePlus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function ImageUploader({ files, setFiles, max = 5 }) {
  const inputRef = useRef(null);
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => urls.forEach(URL.revokeObjectURL);
  }, [files]);

  const onChange = (event) => {
    const next = Array.from(event.target.files || []);
    setFiles((current) => [...current, ...next].slice(0, max));
    event.target.value = "";
  };

  return (
    <div className="upload-box">
      <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={onChange} />
      <div className="upload-head">
        <div>
          <div className="field-label">Photos</div>
          <div className="field-hint">Add up to {max} clear photos. At least one is required.</div>
        </div>
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => inputRef.current?.click()}>
          <ImagePlus size={16} /> Add photos
        </button>
      </div>
      {previews.length > 0 && (
        <div className="preview-grid">
          {previews.map((src, index) => (
            <div className="preview" key={src}>
              <img src={src} alt={`Preview ${index + 1}`} />
              <button type="button" className="preview-remove" onClick={() => setFiles(files.filter((_, i) => i !== index))}>
                <X size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}