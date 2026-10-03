"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "../Icon";

interface ChatInputBarProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onStop?: () => void;
  loading: boolean;
}

const MAX_HEIGHT_PX = 160;

export const ChatInputBar = ({
  value,
  onChange,
  onSend,
  onStop,
  loading,
}: ChatInputBarProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const baseValueRef = useRef("");
  const [isRecording, setIsRecording] = useState(false);
  // Starts false on both server and first client render so SSR/hydration
  // output matches; flipped after mount, once `window` is actually
  // available, so the mic button only ever appears client-side.
  const [speechSupported, setSpeechSupported] = useState(false);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT_PX)}px`;
  }, [value]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional post-mount feature check (see comment above), not state synced from props/state
    setSpeechSupported(
      !!(window.SpeechRecognition ?? window.webkitSpeechRecognition),
    );
    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  const stopRecording = () => {
    recognitionRef.current?.stop();
    setIsRecording(false);
  };

  // Used when a message is being sent while recording is active: abort
  // (not stop) so no trailing final-result event fires after the input
  // has already been cleared by onSend, which would otherwise repopulate
  // the textarea with stale speech text.
  const abortRecordingForSend = () => {
    if (!isRecording) return;
    recognitionRef.current?.abort();
    setIsRecording(false);
  };

  const startRecording = () => {
    const SpeechRecognitionCtor =
      window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) return;

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    baseValueRef.current = value;

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      const prefix = baseValueRef.current;
      const joiner = prefix && !prefix.endsWith(" ") ? " " : "";
      onChange(`${prefix}${joiner}${transcript}`);
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleSend = () => {
    abortRecordingForSend();
    onSend();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="sticky bottom-0 bg-gradient-to-t from-bg from-60% to-transparent px-4 pb-4 pt-2">
      <div className="mx-auto flex max-w-[680px] items-end gap-2 rounded-3xl border border-border bg-surface py-1.5 pl-4 pr-1.5 shadow-sm">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask your coach anything…"
          aria-label="Message"
          rows={1}
          className="min-h-9 flex-1 resize-none overflow-y-auto bg-transparent py-2 text-base leading-snug text-ink outline-none placeholder:text-ink-muted sm:text-[13.5px]"
        />
        {speechSupported && (
          <button
            type="button"
            onClick={toggleRecording}
            aria-label={isRecording ? "Stop voice input" : "Start voice input"}
            aria-pressed={isRecording}
            className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${
              isRecording
                ? "bg-danger/10 text-danger"
                : "text-ink-muted hover:bg-surface-2 hover:text-ink"
            }`}
          >
            <Icon
              name="mic"
              className={`h-4 w-4 ${isRecording ? "animate-pulse" : ""}`}
              aria-hidden="true"
            />
          </button>
        )}
        {loading ? (
          <button
            type="button"
            onClick={onStop}
            aria-label="Stop generating"
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-surface-2 text-ink hover:bg-border"
          >
            <Icon name="stop" className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSend}
            disabled={!value.trim()}
            aria-label="Send message"
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-accent text-accent-ink disabled:opacity-50"
          >
            <Icon name="send" className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
};
