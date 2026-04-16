'use client';

import { useState, useRef, useCallback, type KeyboardEvent, type ChangeEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import * as Tooltip from '@radix-ui/react-tooltip';
import * as Dialog from '@radix-ui/react-dialog';
import {
  ArrowUp,
  Paperclip,
  Square,
  X,
  StopCircle,
  Mic,
  Globe,
  BrainCog,
  FolderCode,
} from 'lucide-react';

/* ─── Types ──────────────────────────────────────────────────────────────────── */

export interface PromptInputBoxProps {
  onSend: (message: string, attachments: AttachedFile[]) => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
}

interface AttachedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  file: File;
}

type Mode = 'web' | 'deep' | 'project';

/* ─── Helpers ────────────────────────────────────────────────────────────────── */

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/* ─── Sub-components ─────────────────────────────────────────────────────────── */

function IconBtn({
  label,
  onClick,
  active,
  children,
}: {
  label: string;
  onClick?: () => void;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Tooltip.Provider delayDuration={400}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button
            type="button"
            onClick={onClick}
            aria-label={label}
            className={[
              'flex items-center justify-center w-8 h-8 rounded-lg transition-colors',
              active
                ? 'bg-violet-600/20 text-violet-400 hover:bg-violet-600/30'
                : 'text-zinc-500 hover:bg-zinc-700/60 hover:text-zinc-300',
            ].join(' ')}
          >
            {children}
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="top"
            sideOffset={6}
            className="px-2 py-1 text-xs rounded-md bg-zinc-800 text-zinc-200 border border-zinc-700 shadow-lg select-none z-50"
          >
            {label}
            <Tooltip.Arrow className="fill-zinc-800" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

function AttachmentChip({
  file,
  onRemove,
}: {
  file: AttachedFile;
  onRemove: (id: string) => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.15 }}
      className="flex items-center gap-1.5 pl-2.5 pr-1 py-1 rounded-lg bg-zinc-700/70 border border-zinc-600/50 text-xs text-zinc-300 max-w-[180px]"
    >
      <span className="truncate flex-1">{file.name}</span>
      <span className="text-zinc-500 shrink-0">{formatBytes(file.size)}</span>
      <button
        type="button"
        aria-label={`Remove ${file.name}`}
        onClick={() => onRemove(file.id)}
        className="shrink-0 p-0.5 rounded hover:bg-zinc-600 text-zinc-500 hover:text-zinc-200 transition-colors"
      >
        <X className="w-3 h-3" />
      </button>
    </motion.div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────────── */

export function PromptInputBox({
  onSend,
  isLoading = false,
  placeholder = 'Ask anything…',
  className,
}: PromptInputBoxProps) {
  const [value, setValue] = useState('');
  const [attachments, setAttachments] = useState<AttachedFile[]>([]);
  const [mode, setMode] = useState<Mode | null>(null);
  const [recording, setRecording] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasContent = value.trim().length > 0 || attachments.length > 0;

  /* Auto-resize textarea */
  const handleChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 240)}px`;
  }, []);

  /* Send */
  const handleSend = useCallback(() => {
    if (!hasContent || isLoading) return;
    onSend(value.trim(), attachments);
    setValue('');
    setAttachments([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [hasContent, isLoading, onSend, value, attachments]);

  /* Stop (while loading) */
  const handleStop = useCallback(() => {
    // Caller controls isLoading; signal stop by sending empty sentinel
    onSend('__STOP__', []);
  }, [onSend]);

  /* Keyboard: Enter sends, Shift+Enter newline */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  /* File attachment */
  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    const next: AttachedFile[] = Array.from(files).map((f) => ({
      id: `${f.name}-${f.lastModified}-${Math.random()}`,
      name: f.name,
      size: f.size,
      type: f.type,
      file: f,
    }));
    setAttachments((prev) => [...prev, ...next]);
  }, []);

  const handleFileInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files);
      e.target.value = '';
    },
    [handleFiles],
  );

  const removeAttachment = useCallback((id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  }, []);

  /* Drag-and-drop */
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles],
  );

  /* Mode toggle */
  const toggleMode = useCallback((m: Mode) => {
    setMode((prev) => (prev === m ? null : m));
  }, []);

  /* Mic toggle (UI only — integrate Web Speech API as needed) */
  const toggleRecording = useCallback(() => {
    setRecording((prev) => !prev);
  }, []);

  const modeConfig: Record<Mode, { icon: React.ReactNode; label: string }> = {
    web: { icon: <Globe className="w-4 h-4" />, label: 'Web search' },
    deep: { icon: <BrainCog className="w-4 h-4" />, label: 'Deep research' },
    project: { icon: <FolderCode className="w-4 h-4" />, label: 'Project context' },
  };

  return (
    <div
      className={['w-full', className].filter(Boolean).join(' ')}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      {/* Mode pills */}
      <AnimatePresence>
        {mode && (
          <motion.div
            key="mode-pill"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-1.5 mb-2 px-1"
          >
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-600/15 border border-violet-500/25 text-violet-400 text-xs font-medium">
              {modeConfig[mode].icon}
              {modeConfig[mode].label}
              <button
                type="button"
                aria-label="Disable mode"
                onClick={() => setMode(null)}
                className="ml-0.5 hover:text-violet-200 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main box */}
      <div
        style={{ backgroundColor: '#1F2023' }}
        className="relative rounded-2xl border border-zinc-700/60 shadow-xl shadow-black/30 transition-colors focus-within:border-zinc-600"
      >
        {/* Attachment chips */}
        <AnimatePresence>
          {attachments.length > 0 && (
            <motion.div
              key="attachments"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.15 }}
              className="flex flex-wrap gap-2 px-4 pt-3"
            >
              {attachments.map((f) => (
                <AttachmentChip key={f.id} file={f} onRemove={removeAttachment} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          disabled={isLoading}
          className="w-full resize-none bg-transparent px-4 pt-4 pb-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none disabled:opacity-60 leading-relaxed"
          style={{ minHeight: '52px', maxHeight: '240px' }}
        />

        {/* Bottom toolbar */}
        <div className="flex items-center justify-between gap-2 px-3 pb-3">
          {/* Left tools */}
          <div className="flex items-center gap-0.5">
            {/* Attach */}
            <IconBtn label="Attach file" onClick={() => fileInputRef.current?.click()}>
              <Paperclip className="w-4 h-4" />
            </IconBtn>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              aria-hidden="true"
              className="hidden"
              onChange={handleFileInputChange}
            />

            {/* Mic */}
            <IconBtn label={recording ? 'Stop recording' : 'Voice input'} onClick={toggleRecording} active={recording}>
              {recording ? <StopCircle className="w-4 h-4 text-red-400" /> : <Mic className="w-4 h-4" />}
            </IconBtn>

            <div className="w-px h-4 bg-zinc-700/70 mx-1" />

            {/* Mode toggles */}
            {(Object.keys(modeConfig) as Mode[]).map((m) => (
              <IconBtn
                key={m}
                label={modeConfig[m].label}
                onClick={() => toggleMode(m)}
                active={mode === m}
              >
                {modeConfig[m].icon}
              </IconBtn>
            ))}

            {/* Upload dialog trigger */}
            <Dialog.Root open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
              <Dialog.Trigger asChild>
                <span>
                  <IconBtn label="Browse files">
                    <Square className="w-4 h-4" />
                  </IconBtn>
                </span>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
                <Dialog.Content
                  style={{ backgroundColor: '#1F2023' }}
                  className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md rounded-2xl border border-zinc-700 p-6 shadow-2xl shadow-black/50 outline-none"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Dialog.Title className="text-white font-semibold text-base">
                      Upload files
                    </Dialog.Title>
                    <Dialog.Close asChild>
                      <button
                        type="button"
                        aria-label="Close"
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-700/60 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </Dialog.Close>
                  </div>

                  {/* Drop zone inside dialog */}
                  <label
                    htmlFor="dialog-file-input"
                    className="flex flex-col items-center justify-center gap-3 w-full h-36 rounded-xl border-2 border-dashed border-zinc-700 hover:border-zinc-500 cursor-pointer transition-colors"
                    onDrop={(e) => {
                      e.preventDefault();
                      handleFiles(e.dataTransfer.files);
                      setUploadDialogOpen(false);
                    }}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <Paperclip className="w-6 h-6 text-zinc-500" />
                    <span className="text-sm text-zinc-500">
                      Drop files here or{' '}
                      <span className="text-violet-400 underline underline-offset-2">browse</span>
                    </span>
                    <input
                      id="dialog-file-input"
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        handleFileInputChange(e);
                        setUploadDialogOpen(false);
                      }}
                    />
                  </label>

                  <p className="mt-3 text-xs text-zinc-600 text-center">
                    Any file type accepted
                  </p>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>

          {/* Right: send / stop button */}
          <motion.button
            type="button"
            onClick={isLoading ? handleStop : handleSend}
            aria-label={isLoading ? 'Stop generation' : 'Send message'}
            disabled={!isLoading && !hasContent}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className={[
              'flex items-center justify-center w-8 h-8 rounded-xl transition-colors',
              isLoading
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                : hasContent
                ? 'bg-violet-600 text-white hover:bg-violet-500 shadow-lg shadow-violet-900/30'
                : 'bg-zinc-700/50 text-zinc-600 cursor-not-allowed',
            ].join(' ')}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isLoading ? (
                <motion.span
                  key="stop"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.12 }}
                >
                  <StopCircle className="w-4 h-4" />
                </motion.span>
              ) : (
                <motion.span
                  key="send"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.12 }}
                >
                  <ArrowUp className="w-4 h-4" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Hint */}
      <p className="mt-2 px-1 text-[11px] text-zinc-600 select-none">
        Press <kbd className="px-1 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-500 font-mono text-[10px]">Enter</kbd> to send,{' '}
        <kbd className="px-1 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-500 font-mono text-[10px]">Shift+Enter</kbd> for newline
      </p>
    </div>
  );
}
