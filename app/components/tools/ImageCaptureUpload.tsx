"use client";

import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from "react";

export type ImageCaptureVariant = "full" | "compact" | "buttons-only";

export interface ImageCaptureUploadHandle {
  openCamera: () => void;
  openGallery: () => void;
}

export interface ImageCaptureUploadProps {
  onFiles: (files: FileList | File[]) => void;
  multiple?: boolean;
  cameraFacing?: "environment" | "user";
  accept?: string;
  title?: string;
  hint?: string;
  icon?: string;
  variant?: ImageCaptureVariant;
  disabled?: boolean;
  className?: string;
  dragDrop?: boolean;
  ariaLabel?: string;
  style?: React.CSSProperties;
}

const DEFAULT_ACCEPT = "image/*,.heic,.heif";

const ImageCaptureUpload = forwardRef<ImageCaptureUploadHandle, ImageCaptureUploadProps>(
  function ImageCaptureUpload(
    {
      onFiles,
      multiple = false,
      cameraFacing = "environment",
      accept = DEFAULT_ACCEPT,
      title,
      hint,
      icon,
      variant = "full",
      disabled = false,
      className = "",
      dragDrop = true,
      ariaLabel,
      style,
    },
    ref
  ) {
    const cameraRef = useRef<HTMLInputElement>(null);
    const galleryRef = useRef<HTMLInputElement>(null);
    const [isDragOver, setIsDragOver] = useState(false);

    useImperativeHandle(ref, () => ({
      openCamera: () => {
        if (!disabled) cameraRef.current?.click();
      },
      openGallery: () => {
        if (!disabled) galleryRef.current?.click();
      },
    }));

    const emit = useCallback(
      (files: FileList | File[]) => {
        const arr = files instanceof FileList ? Array.from(files) : files;
        if (!arr.length || disabled) return;
        onFiles(multiple ? arr : arr.slice(0, 1));
      },
      [disabled, multiple, onFiles]
    );

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const list = e.target.files;
      if (list?.length) emit(list);
      e.target.value = "";
    };

    const openCamera = (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      if (!disabled) cameraRef.current?.click();
    };

    const openGallery = (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      if (!disabled) galleryRef.current?.click();
    };

    const onDragOver = (e: React.DragEvent) => {
      if (!dragDrop || disabled) return;
      e.preventDefault();
      setIsDragOver(true);
    };

    const onDragLeave = (e: React.DragEvent) => {
      if (!dragDrop || disabled) return;
      e.preventDefault();
      setIsDragOver(false);
    };

    const onDrop = (e: React.DragEvent) => {
      if (!dragDrop || disabled) return;
      e.preventDefault();
      setIsDragOver(false);
      if (e.dataTransfer.files?.length) emit(e.dataTransfer.files);
    };

    const dragProps =
      dragDrop && !disabled
        ? { onDragOver, onDragLeave, onDrop }
        : {};

    const inputs = (
      <>
        <input
          ref={cameraRef}
          type="file"
          accept={accept}
          capture={cameraFacing}
          multiple={multiple}
          onChange={onInputChange}
          style={{ display: "none" }}
          aria-hidden="true"
          tabIndex={-1}
        />
        <input
          ref={galleryRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={onInputChange}
          style={{ display: "none" }}
          aria-hidden="true"
          tabIndex={-1}
        />
      </>
    );

    const buttons = (
      <div className="ez-capture-actions" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="btn-primary ez-capture-btn"
          onClick={openCamera}
          disabled={disabled}
          aria-label="Take photo with camera"
        >
          📷 Take Photo
        </button>
        <button
          type="button"
          className="btn-secondary ez-capture-btn"
          onClick={openGallery}
          disabled={disabled}
          aria-label={multiple ? "Choose images from gallery" : "Choose image from gallery"}
        >
          🖼️ Gallery
        </button>
      </div>
    );

    if (variant === "buttons-only") {
      return (
        <div className={`ez-capture-buttons-only ${className}`.trim()} style={style}>
          {inputs}
          {buttons}
        </div>
      );
    }

    if (variant === "compact") {
      return (
        <div
          className={`ez-capture-upload ez-capture-upload--compact${isDragOver ? " drag-over" : ""} ${className}`.trim()}
          style={style}
          {...dragProps}
        >
          {icon && <div className="ez-capture-icon">{icon}</div>}
          {title && <p className="ez-capture-title">{title}</p>}
          {hint && <p className="ez-capture-hint">{hint}</p>}
          {buttons}
          {inputs}
        </div>
      );
    }

    return (
      <div
        className={`ez-tool-workspace upload-zone ez-capture-upload${isDragOver ? " drag-over" : ""} ${className}`.trim()}
        role="group"
        aria-label={ariaLabel ?? "Upload image"}
        style={style}
        {...dragProps}
      >
        <div className="ez-capture-icon">{icon ?? "📸"}</div>
        <p className="ez-capture-title">{title ?? "Add your photo"}</p>
        <p className="ez-capture-hint">{hint ?? "JPG, PNG, WebP, HEIC · max 20 MB"}</p>
        <p className="ez-capture-desktop-hint">Or drag &amp; drop here</p>
        {buttons}
        {inputs}
      </div>
    );
  }
);

export default ImageCaptureUpload;
