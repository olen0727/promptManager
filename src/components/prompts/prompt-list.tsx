"use client";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTRPC } from "@/server/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Compass, LayoutGrid, Palette, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PromptCard } from "./prompt-card";
import { PromptForm } from "./prompt-form";
import { PromptPreview } from "./prompt-preview";
import { PromptSkeletonGrid } from "./prompt-skeleton";

interface Tag {
  id: string;
  name: string;
  color: string;
}

const MACARON_COLORS = [
  "#FFB7B2", // Pastel Red
  "#FFDAC1", // Pastel Orange
  "#E2F0CB", // Pastel Green
  "#B5EAD7", // Pastel Mint
  "#C7CEEA", // Pastel Purple
  "#FF9AA2", // Light Red
  "#FFB6C1", // Light Pink (Demo)
  "#ADD8E6", // Light Blue (Demo)
  "#FFD1DC", // Pastel Pink
  "#E0F7FA", // Cyan 50
  "#F3E5F5", // Purple 50
  "#FFF9C4", // Yellow 100
  "#DCEDC8", // Light Green 100
  "#F8BBD0", // Pink 100
  "#D1C4E9", // Deep Purple 100
  "#BBDEFB", // Blue 100
];

const TagItem = ({
  tag,
  isSelected,
  onSelect,
  onUpdate,
  onDeleteRequest,
}: {
  tag: Tag;
  isSelected: boolean;
  onSelect: (id: string | null) => void;
  onUpdate: (id: string, color: string) => void;
  onDeleteRequest: (id: string) => void;
}) => {
  const [tempColor, setTempColor] = useState(tag.color);
  const [isOpen, setIsOpen] = useState(false);

  // Reset temp color when popover opens/closes or tag color changes externally
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setTempColor(tag.color);
    }
  };

  return (
    <div className="group relative flex items-center">
      <button
        type="button"
        onClick={() => onSelect(isSelected ? null : tag.id)}
        className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-full text-label-large transition-all duration-200 state-layer ${isSelected ? "chip-selected pr-20" : ""
          }`}
        style={{
          color: isSelected
            ? "hsl(var(--md-on-secondary-container))"
            : "hsl(var(--md-on-surface-variant))",
          backgroundColor: isSelected
            ? "hsl(var(--md-primary))"
            : "hsl(var(--md-surface-variant))",
        }}
      >
        <span
          className="w-2.5 h-2.5 rounded-full shrink-0 transition-colors duration-200"
          style={{ backgroundColor: isOpen ? tempColor : tag.color }}
        />
        <span className="truncate flex-1 text-left">{tag.name}</span>
        {isSelected && (
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "hsl(var(--md-primary))" }}
          />
        )}
      </button>

      {/* Tag Actions - Only visible when selected and hovered */}
      {isSelected && (
        <div className="absolute right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Popover open={isOpen} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                title="變更顏色"
                onClick={(e) => e.stopPropagation()}
              >
                <Palette className="w-3.5 h-3.5 text-current opacity-70" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2 space-y-3" align="start">
              <div className="grid grid-cols-4 gap-2">
                {MACARON_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-8 h-8 rounded-full border transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${tempColor === color ? "border-black/40 scale-110 ring-2 ring-offset-1 ring-black/10" : "border-black/5"
                      }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setTempColor(color)}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  onUpdate(tag.id, tempColor);
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
              >
                <Check className="w-3.5 h-3.5" />
                確認變更
              </button>
            </PopoverContent>
          </Popover>

          <button
            type="button"
            className="p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteRequest(tag.id);
            }}
            title="刪除標籤"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

export function PromptList() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<{
    id: string;
    title: string;
    content: string;
    description: string;
    tagIds: string[];
    imageUrl?: string | null;
  } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleteTagTarget, setDeleteTagTarget] = useState<string | null>(null);
  const [previewPrompt, setPreviewPrompt] = useState<{
    id: string;
    title: string;
    content: string;
    description: string | null;
  } | null>(null);

  // New tag creation state
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const [newTagName, setNewTagName] = useState("");

  const promptsQuery = useQuery(trpc.prompt.list.queryOptions({ search: search || undefined }));
  const tagsQuery = useQuery(trpc.tag.list.queryOptions());

  const createMutation = useMutation(
    trpc.prompt.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: trpc.prompt.list.queryKey() });
        setIsFormOpen(false);
        toast.success("Prompt 建立成功");
      },
      onError: (error) => {
        toast.error(`创建失败: ${error.message}`);
      },
    })
  );

  const updateMutation = useMutation(
    trpc.prompt.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: trpc.prompt.list.queryKey() });
        setEditingPrompt(null);
        toast.success("Prompt 更新成功");
      },
      onError: (error) => {
        toast.error(`更新失败: ${error.message}`);
      },
    })
  );

  const deleteMutation = useMutation(
    trpc.prompt.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: trpc.prompt.list.queryKey() });
        setDeleteTarget(null);
        toast.success("Prompt 已刪除");
      },
      onError: (error) => {
        toast.error(`删除失败: ${error.message}`);
      },
    })
  );

  const createTagMutation = useMutation(
    trpc.tag.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: trpc.tag.list.queryKey() });
        setIsCreatingTag(false);
        setNewTagName("");
        toast.success("標籤建立成功");
      },
      onError: (error) => {
        toast.error(`建立標籤失敗: ${error.message}`);
      },
    })
  );

  const updateTagMutation = useMutation(
    trpc.tag.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: trpc.tag.list.queryKey() });
        toast.success("標籤更新成功");
      },
      onError: (error) => {
        toast.error(`更新標籤失敗: ${error.message}`);
      },
    })
  );

  const deleteTagMutation = useMutation(
    trpc.tag.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: trpc.tag.list.queryKey() });
        setDeleteTagTarget(null);
        if (selectedTagId === deleteTagTarget) {
          setSelectedTagId(null);
        }
        toast.success("標籤已刪除");
      },
      onError: (error) => {
        toast.error(`刪除標籤失敗: ${error.message}`);
      },
    })
  );

  const handleCreate = async (data: {
    title: string;
    content: string;
    description: string;
    tagIds: string[];
    newTags?: string[];
    imageUrl?: string;
  }) => {
    let finalTagIds = [...data.tagIds];

    // Process new tags if any
    if (data.newTags && data.newTags.length > 0) {
      try {
        // Create tags sequentially to avoid potential race conditions if backend doesn't handle parallel inserts well
        // or just map promise.all
        const newTagsPromises = data.newTags.map(name => createTagMutation.mutateAsync({ name }));
        const createdTags = await Promise.all(newTagsPromises);
        const newTagIds = createdTags.map(t => t.id);
        finalTagIds = [...finalTagIds, ...newTagIds];
      } catch (error) {
        toast.error("部分新標籤建立失敗");
        // Proceed with available tags
      }
    }

    createMutation.mutate({
      title: data.title,
      content: data.content,
      description: data.description || undefined,
      tagIds: finalTagIds.length > 0 ? finalTagIds : undefined,
      imageUrl: data.imageUrl,
    });
  };

  const handleUpdate = async (data: {
    title: string;
    content: string;
    description: string;
    tagIds: string[];
    newTags?: string[];
    imageUrl?: string;
  }) => {
    if (!editingPrompt) return;

    let finalTagIds = [...data.tagIds];

    // Process new tags if any
    if (data.newTags && data.newTags.length > 0) {
      try {
        const newTagsPromises = data.newTags.map(name => createTagMutation.mutateAsync({ name }));
        const createdTags = await Promise.all(newTagsPromises);
        const newTagIds = createdTags.map(t => t.id);
        finalTagIds = [...finalTagIds, ...newTagIds];
      } catch (error) {
        toast.error("部分新標籤建立失敗");
      }
    }

    updateMutation.mutate({
      id: editingPrompt.id,
      title: data.title,
      content: data.content,
      description: data.description || undefined,
      tagIds: finalTagIds,
      imageUrl: data.imageUrl,
    });
  };

  const handleEdit = (id: string) => {
    const prompt = promptsQuery.data?.find((p) => p.id === id);
    if (prompt) {
      setEditingPrompt({
        id: prompt.id,
        title: prompt.title,
        content: prompt.content,
        description: prompt.description || "",
        tagIds: prompt.tags?.map((t: Tag) => t.id) || [],
        imageUrl: prompt.image_url,
      });
    }
  };

  const handleDelete = (id: string) => {
    setDeleteTarget(id);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteMutation.mutate({ id: deleteTarget });
    }
  };

  const confirmDeleteTag = () => {
    if (deleteTagTarget) {
      deleteTagMutation.mutate({ id: deleteTagTarget });
    }
  };

  const handlePreview = (id: string) => {
    const prompt = promptsQuery.data?.find((p) => p.id === id);
    if (prompt) {
      setPreviewPrompt({
        id: prompt.id,
        title: prompt.title,
        content: prompt.content,
        description: prompt.description,
      });
    }
  };

  const handleCreateTag = () => {
    if (newTagName.trim()) {
      createTagMutation.mutate({ name: newTagName.trim() });
    }
  };

  // Filter prompts
  const allPrompts = promptsQuery.data ?? [];
  const prompts = allPrompts.filter((prompt) => {
    if (selectedTagId && !prompt.tags?.some((t: Tag) => t.id === selectedTagId)) return false;
    return true;
  });

  const tags = tagsQuery.data ?? [];

  return (
    <div className="animate-fade-in">
      <div className="grid lg:grid-cols-[240px_1fr] gap-10 items-start">
        {/* Sidebar (Desktop) - MD3 Navigation Drawer */}
        <aside className="hidden lg:block space-y-8 sticky top-24">
          <div className="card p-4 space-y-4">
            <h3
              className="px-3 text-label-medium uppercase tracking-wider"
              style={{ color: "hsl(var(--md-on-surface-variant))" }}
            >
              Library
            </h3>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setSelectedTagId(null)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-full text-label-large transition-all duration-200 state-layer ${!selectedTagId ? "chip-selected" : ""
                  }`}
                style={{
                  color: !selectedTagId
                    ? "hsl(var(--md-on-secondary-container))"
                    : "hsl(var(--md-on-surface-variant))",
                }}
              >
                <Compass className="w-4 h-4" />
                全部 Prompts
              </button>
            </div>
          </div>

          <div className="card p-4 space-y-4">
            <div className="flex items-center justify-between px-3">
              <h3
                className="text-label-medium uppercase tracking-wider"
                style={{ color: "hsl(var(--md-on-surface-variant))" }}
              >
                Tags
              </h3>
              <button
                type="button"
                onClick={() => setIsCreatingTag(!isCreatingTag)}
                className="icon-btn w-8 h-8"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              {tags.map((tag: Tag) => (
                <TagItem
                  key={tag.id}
                  tag={tag}
                  isSelected={selectedTagId === tag.id}
                  onSelect={setSelectedTagId}
                  onUpdate={(id, color) => updateTagMutation.mutate({ id, color })}
                  onDeleteRequest={setDeleteTagTarget}
                />
              ))}

              {isCreatingTag && (
                <div className="px-3 pt-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleCreateTag();
                        if (e.key === "Escape") {
                          setIsCreatingTag(false);
                          setNewTagName("");
                        }
                      }}
                      placeholder="新標籤..."
                      // biome-ignore lint/a11y/noAutofocus: intentional UX
                      autoFocus
                      className="input-outlined text-label-large py-2"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Mobile Filter Header */}
        <div className="lg:hidden flex flex-col gap-4 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-headline-medium" style={{ color: "hsl(var(--md-on-surface))" }}>
              Prompts
            </h2>
            <button
              type="button"
              onClick={() => setIsFormOpen(true)}
              className="btn-primary flex items-center gap-2 px-4 py-2"
            >
              <Plus className="w-4 h-4" />
              新建
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6 no-scrollbar">
            <button
              type="button"
              onClick={() => setSelectedTagId(null)}
              className={`flex-none chip ${!selectedTagId ? "chip-selected" : ""}`}
            >
              全部
            </button>
            {tags.map((tag: Tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => setSelectedTagId(selectedTagId === tag.id ? null : tag.id)}
                className={`flex-none chip ${selectedTagId === tag.id ? "chip-selected" : ""}`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: tag.color }} />
                {tag.name}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col gap-6 min-w-0">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:max-w-md">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: "hsl(var(--md-on-surface-variant))" }}
              />
              {/* <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="搜尋 Prompt..."
                className="input-outlined w-full pl-11 h-12"
              /> */}
            </div>

            <button
              type="button"
              onClick={() => setIsFormOpen(true)}
              className="hidden lg:flex fab-extended"
            >
              <Plus className="w-5 h-5" />
              <span>新建 Prompt</span>
            </button>
          </div>

          {/* Grid */}
          {promptsQuery.isLoading ? (
            <PromptSkeletonGrid />
          ) : prompts.length === 0 ? (
            <div className="card flex flex-col items-center justify-center py-20 text-center">
              <div
                className="w-16 h-16 mb-4 rounded-2xl flex items-center justify-center"
                style={{ background: "hsl(var(--md-surface-container-high))" }}
              >
                <LayoutGrid
                  className="w-8 h-8"
                  style={{ color: "hsl(var(--md-on-surface-variant))" }}
                />
              </div>
              <h3 className="text-title-large mb-2" style={{ color: "hsl(var(--md-on-surface))" }}>
                {search ? "未找到相關結果" : "暫無 Prompt"}
              </h3>
              <p
                className="text-body-medium max-w-xs mb-6"
                style={{ color: "hsl(var(--md-on-surface-variant))" }}
              >
                {search ? "嘗試更換搜尋關鍵詞" : "建立一個新的 Prompt 開始您的創作之旅"}
              </p>
              {!search && (
                <button type="button" onClick={() => setIsFormOpen(true)} className="btn-primary">
                  建立 Prompt
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 stagger-children">
              {prompts.map((prompt) => (
                <PromptCard
                  key={prompt.id}
                  id={prompt.id}
                  title={prompt.title}
                  content={prompt.content}
                  description={prompt.description}
                  tags={prompt.tags}
                  createdAt={new Date(prompt.created_at)}
                  // @ts-ignore: image_url might be missing in type definition if not regenerated
                  imageUrl={prompt.image_url}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onPreview={handlePreview}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Form */}
      <PromptForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreate}
        availableTags={tags}
        isLoading={createMutation.isPending}
      />

      {/* Edit Form */}
      <PromptForm
        isOpen={!!editingPrompt}
        onClose={() => setEditingPrompt(null)}
        onSubmit={handleUpdate}
        initialData={editingPrompt ?? undefined}
        availableTags={tags}
        isLoading={updateMutation.isPending}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="刪除 Prompt"
        message="確定要刪除這個 Prompt 嗎？此操作無法撤銷。"
        confirmText="刪除"
        cancelText="取消"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Delete Tag Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTagTarget}
        title="刪除標籤"
        message="確定要刪除這個標籤嗎？這不會刪除任何 Prompt，但會移除該標籤的關聯。"
        confirmText="刪除"
        cancelText="取消"
        variant="danger"
        onConfirm={confirmDeleteTag}
        onCancel={() => setDeleteTagTarget(null)}
      />

      {/* Preview Modal */}
      <PromptPreview
        isOpen={!!previewPrompt}
        onClose={() => setPreviewPrompt(null)}
        title={previewPrompt?.title || ""}
        content={previewPrompt?.content || ""}
        description={previewPrompt?.description}
      />
    </div>
  );
}
