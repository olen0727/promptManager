"use client";

import { createClient } from "@/lib/supabase/client";
import { extractVariables } from "@/lib/utils";
import { ImageIcon, Link, Loader2, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface PromptFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    content: string;
    description: string;
    tagIds: string[];
    newTags: string[];
    imageUrl?: string;
  }) => void;
  initialData?: {
    title: string;
    content: string;
    description: string;
    tagIds: string[];
    imageUrl?: string | null;
  };
  availableTags: Tag[];
  isLoading?: boolean;
}

export function PromptForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  availableTags,
  isLoading,
}: PromptFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [pendingTags, setPendingTags] = useState<Tag[]>([]);

  // Image upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadTab, setUploadTab] = useState<"upload" | "url">("upload");
  const [tagInput, setTagInput] = useState("");
  const [isTagInputFocused, setIsTagInputFocused] = useState(false);
  const [activeTagIndex, setActiveTagIndex] = useState(0);
  const [userNavigated, setUserNavigated] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset form when modal opens/closes
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
      setDescription(initialData.description);
      setSelectedTagIds(initialData.tagIds || []);
      setImageUrl(initialData.imageUrl || "");
    } else {
      setTitle("");
      setContent("");
      setDescription("");
      setSelectedTagIds([]);
      setImageUrl("");
    }
    setPendingTags([]);
    setTagInput("");
    setIsTagInputFocused(false);
    setActiveTagIndex(0);
  }, [initialData, isOpen]);

  const variables = extractVariables(content);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      content,
      description,
      tagIds: selectedTagIds,
      newTags: pendingTags.map(t => t.name),
      imageUrl: imageUrl || undefined,
    });
  };

  const uploadImage = async (file: File) => {
    try {
      setIsUploading(true);
      const supabase = createClient();

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      setImageUrl(publicUrl);
    } catch (error: any) {
      console.error('Upload error:', error);
      if (error.message?.includes("Bucket not found")) {
        toast.error("儲存桶尚未設定，請聯繫管理員建立 'images' bucket");
      } else {
        toast.error("圖片上傳失敗，請稍後再試");
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    if (e.clipboardData.files.length > 0) {
      const file = e.clipboardData.files[0];
      if (file && file.type.startsWith('image/')) {
        e.preventDefault();
        await uploadImage(file);
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadImage(file);
    }
  };

  const toggleTag = (tagId: string) => {
    // Check if it's a pending tag
    if (pendingTags.some(t => t.id === tagId)) {
      setPendingTags(prev => prev.filter(t => t.id !== tagId));
      return;
    }

    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const selectedTags = [
    ...availableTags.filter((tag) => selectedTagIds.includes(tag.id)),
    ...pendingTags
  ];
  const unselectedTags = availableTags.filter((tag) => !selectedTagIds.includes(tag.id));

  const filteredTags = tagInput.trim()
    ? unselectedTags.filter((tag) =>
      tag.name.toLowerCase().includes(tagInput.toLowerCase())
    )
    : unselectedTags.slice(0, 5);

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();

      // If user navigated to a specific tag, select it
      if (userNavigated && filteredTags.length > 0 && filteredTags[activeTagIndex]) {
        toggleTag(filteredTags[activeTagIndex].id);
        setTagInput("");
        setActiveTagIndex(0);
        setUserNavigated(false);
        return;
      }

      // Otherwise, attempt exact match or create
      const trimmedInput = tagInput.trim();
      if (!trimmedInput) return;

      const exactMatch = availableTags.find(
        (t) => t.name.toLowerCase() === trimmedInput.toLowerCase()
      );

      // Also check if already in pending tags to avoid duplicates
      const pendingMatch = pendingTags.find(
        (t) => t.name.toLowerCase() === trimmedInput.toLowerCase()
      );

      if (exactMatch) {
        if (!selectedTagIds.includes(exactMatch.id)) {
          toggleTag(exactMatch.id);
        }
      } else if (!pendingMatch) {
        // Create pending tag
        const newTag: Tag = {
          id: `pending-${Date.now()}`,
          name: trimmedInput,
          color: '#6366f1' // Default color for new tags
        };
        setPendingTags(prev => [...prev, newTag]);
      }
      setTagInput("");
      setActiveTagIndex(0);
      setUserNavigated(false);

    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setUserNavigated(true);
      setActiveTagIndex((prev) => (prev + 1) % filteredTags.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setUserNavigated(true);
      setActiveTagIndex((prev) => (prev - 1 + filteredTags.length) % filteredTags.length);
    } else if (e.key === "Backspace" && tagInput === "" && selectedTags.length > 0) {
      // Optional: Remove last tag on backspace
      const lastTag = selectedTags[selectedTags.length - 1];
      if (lastTag) toggleTag(lastTag.id);
    }
  };
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Scrim */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: backdrop click handler */}
      <div className="scrim absolute inset-0" onClick={onClose} />

      {/* Dialog */}
      <div className="dialog relative w-full max-w-2xl max-h-[85vh] scale-in flex flex-col">
        {/* Header */}
        <div
          className="flex items-center justify-between pb-4 border-b shrink-0"
          style={{ borderColor: "hsl(var(--md-outline-variant))" }}
        >
          <h2 className="text-headline-medium" style={{ color: "hsl(var(--md-on-surface))" }}>
            {initialData ? "编辑 Prompt" : "新建 Prompt"}
          </h2>
          <button type="button" onClick={onClose} className="icon-btn">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="py-4 space-y-5 overflow-y-auto flex-1">
            <div>
              <label
                htmlFor="title"
                className="block text-label-large mb-2"
                style={{ color: "hsl(var(--md-on-surface-variant))" }}
              >
                標題 <span style={{ color: "hsl(var(--md-error))" }}>*</span>
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="給您的 Prompt 起個名字"
                required
                className="input"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-label-large mb-2"
                style={{ color: "hsl(var(--md-on-surface-variant))" }}
              >
                描述
              </label>
              <input
                id="description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="簡單描述這個 Prompt 的用途"
                className="input"
              />
            </div>

            {/* Image Preview Field */}
            <div>
              <label
                className="block text-label-large mb-2"
                style={{ color: "hsl(var(--md-on-surface-variant))" }}
              >
                預覽圖片 (選填)
              </label>

              {!imageUrl ? (
                <div
                  className="rounded-2xl border border-dashed overflow-hidden"
                  style={{ borderColor: "hsl(var(--md-outline-variant))" }}
                  onPaste={handlePaste} // Support paste on container
                >
                  <div className="flex border-b" style={{ borderColor: "hsl(var(--md-outline-variant))" }}>
                    <button
                      type="button"
                      onClick={() => setUploadTab("upload")}
                      className={`flex-1 px-4 py-3 text-label-large transition-colors ${uploadTab === "upload"
                        ? "bg-[hsl(var(--md-secondary-container))] text-[hsl(var(--md-on-secondary-container))]"
                        : "hover:bg-[hsl(var(--md-surface-container-high))]"
                        }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Upload className="w-4 h-4" />
                        <span>上傳 / 貼上</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadTab("url")}
                      className={`flex-1 px-4 py-3 text-label-large transition-colors ${uploadTab === "url"
                        ? "bg-[hsl(var(--md-secondary-container))] text-[hsl(var(--md-on-secondary-container))]"
                        : "hover:bg-[hsl(var(--md-surface-container-high))]"
                        }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Link className="w-4 h-4" />
                        <span>圖片網址</span>
                      </div>
                    </button>
                  </div>

                  <div className="p-6">
                    {uploadTab === "upload" ? (
                      <div className="text-center space-y-4">
                        <div className="flex justify-center">
                          <input
                            type="file"
                            id="image-upload"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={isUploading}
                          />
                          <label
                            htmlFor="image-upload"
                            className={`cursor-pointer flex flex-col items-center gap-2 p-8 rounded-xl border border-dashed transition-all ${isUploading ? "opacity-50 cursor-not-allowed" : "hover:bg-[hsl(var(--md-surface-container-high))]"
                              }`}
                            style={{ borderColor: "hsl(var(--md-outline))" }}
                          >
                            {isUploading ? (
                              <Loader2 className="w-8 h-8 animate-spin text-[hsl(var(--md-primary))]" />
                            ) : (
                              <ImageIcon className="w-8 h-8 text-[hsl(var(--md-outline))]" />
                            )}
                            <div className="text-center">
                              <span className="text-label-large text-[hsl(var(--md-primary))]">點擊上傳</span>
                              <span className="text-label-medium text-[hsl(var(--md-on-surface-variant))]"> 或直接貼上圖片</span>
                            </div>
                          </label>
                        </div>
                      </div>
                    ) : (
                      <input
                        type="url"
                        placeholder="https://example.com/image.png"
                        className="input w-full"
                        onBlur={(e) => setImageUrl(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            setImageUrl(e.currentTarget.value);
                          }
                        }}
                      />
                    )}
                  </div>
                </div>
              ) : (
                <div className="relative group rounded-2xl overflow-hidden border" style={{ borderColor: "hsl(var(--md-outline-variant))" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-48 object-cover bg-[hsl(var(--md-surface-container-high))]"
                  />
                  <button
                    type="button"
                    onClick={() => setImageUrl("")}
                    className="absolute top-2 right-2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Tags */}
            <div>
              <span
                className="block text-label-large mb-2"
                style={{ color: "hsl(var(--md-on-surface-variant))" }}
              >
                標籤
              </span>
              <div className="relative">
                {/* Selected tags + Add button */}
                <div
                  className="flex flex-wrap items-center gap-2 p-3 rounded-2xl min-h-[48px]"
                  style={{
                    background: "hsl(var(--md-surface-container-highest))",
                    border: "1px solid hsl(var(--md-outline-variant))",
                  }}
                >
                  {selectedTags.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      className="chip"
                      style={{
                        backgroundColor: `${tag.color}20`,
                        color: tag.color,
                        borderColor: `${tag.color}40`,
                      }}
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: tag.color }}
                      />
                      {tag.name}
                      <X className="w-3 h-3 ml-0.5" />
                    </button>
                  ))}
                  {/* Input for adding tags */}
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => {
                      setTagInput(e.target.value);
                      setActiveTagIndex(0);
                      setUserNavigated(false);
                    }}
                    onFocus={() => setIsTagInputFocused(true)}
                    onBlur={() => {
                      // Delay hiding dropdown to allow click events to process
                      setTimeout(() => setIsTagInputFocused(false), 200);
                    }}
                    onKeyDown={handleTagInputKeyDown}
                    placeholder={selectedTags.length === 0 ? "搜尋或添加標籤..." : ""}
                    className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-body-medium h-8"
                    style={{ color: "hsl(var(--md-on-surface))" }}
                  />

                  {availableTags.length === 0 && selectedTags.length === 0 && (
                    <span
                      className="text-body-medium absolute right-3 top-3 pointer-events-none"
                      style={{ color: "hsl(var(--md-on-surface-variant))" }}
                    >
                      暫無可用標籤
                    </span>
                  )}
                </div>

                {/* Dropdown */}
                {isTagInputFocused && filteredTags.length > 0 && (
                  <div
                    className="absolute left-0 right-0 top-full mt-2 z-20 rounded-2xl shadow-lg p-2 scale-in"
                    style={{ background: "hsl(var(--md-surface-container))" }}
                  >
                    {filteredTags.map((tag, index) => (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => {
                          toggleTag(tag.id);
                          setTagInput("");
                          setActiveTagIndex(0);
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-label-large transition-colors ${index === activeTagIndex ? "state-layer-active" : "state-layer"
                          }`}
                        style={{
                          backgroundColor:
                            index === activeTagIndex
                              ? "hsl(var(--md-secondary-container))"
                              : "transparent",
                          color:
                            index === activeTagIndex
                              ? "hsl(var(--md-on-secondary-container))"
                              : "hsl(var(--md-on-surface))",
                        }}
                        onMouseEnter={() => setActiveTagIndex(index)}
                      >
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: tag.color }}
                        />
                        {tag.name}
                        {index === activeTagIndex && (
                          <span className="text-xs ml-auto opacity-50">Enter to select</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="content"
                className="block text-label-large mb-2"
                style={{ color: "hsl(var(--md-on-surface-variant))" }}
              >
                內容 <span style={{ color: "hsl(var(--md-error))" }}>*</span>
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="輸入您的 Prompt 內容，使用 {{變數名}} 定義變數"
                required
                rows={8}
                className="input font-mono text-body-medium resize-none"
              />
            </div>

            {variables.length > 0 && (
              <div
                className="p-3 rounded-2xl"
                style={{
                  background: "hsl(var(--md-surface-container-lowest))",
                  border: "1px solid hsl(var(--md-outline-variant))",
                }}
              >
                <p
                  className="text-label-medium mb-2"
                  style={{ color: "hsl(var(--md-on-surface-variant))" }}
                >
                  檢測到的變數
                </p>
                <div className="flex flex-wrap gap-2">
                  {variables.map((v) => (
                    <span key={v.key} className="tag">
                      {`{{${v.key}}`}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer - Fixed at bottom */}
          <div
            className="pt-4 border-t shrink-0"
            style={{ borderColor: "hsl(var(--md-outline-variant))" }}
          >
            <div className="flex gap-3">
              <button type="button" onClick={onClose} className="btn-outlined flex-1">
                取消
              </button>
              <button
                type="submit"
                disabled={isLoading || !title.trim() || !content.trim()}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    儲存中...
                  </span>
                ) : (
                  "儲存"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
