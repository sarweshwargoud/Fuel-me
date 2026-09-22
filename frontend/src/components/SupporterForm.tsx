import { Eye, EyeOff } from 'lucide-react';

interface SupporterFormProps {
  name: string;
  message: string;
  isAnonymous: boolean;
  onNameChange: (value: string) => void;
  onMessageChange: (value: string) => void;
  onAnonymousChange: (value: boolean) => void;
}

const MAX_MESSAGE_LENGTH = 200;

export function SupporterForm({
  name,
  message,
  isAnonymous,
  onNameChange,
  onMessageChange,
  onAnonymousChange,
}: SupporterFormProps) {
  return (
    <div className="space-y-4">
      {/* Name input */}
      <div>
        <label htmlFor="supporter-name" className="block text-sm font-semibold text-text-primary mb-1.5">
          Name
        </label>
        <input
          id="supporter-name"
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Your name (optional)"
          maxLength={100}
          className="
            w-full px-4 py-3 rounded-xl border-2 border-warm-200 text-sm
            transition-all duration-200 bg-white
            placeholder:text-text-muted
            focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100
          "
        />
      </div>

      {/* Message textarea */}
      <div>
        <label htmlFor="supporter-message" className="block text-sm font-semibold text-text-primary mb-1.5">
          Message
        </label>
        <div className="relative">
          <textarea
            id="supporter-message"
            value={message}
            onChange={(e) => {
              if (e.target.value.length <= MAX_MESSAGE_LENGTH) {
                onMessageChange(e.target.value);
              }
            }}
            placeholder="Leave a message for me (optional)"
            rows={3}
            className="
              w-full px-4 py-3 rounded-xl border-2 border-warm-200 text-sm
              transition-all duration-200 bg-white resize-none
              placeholder:text-text-muted
              focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100
            "
          />
          <span className="absolute right-3 bottom-3 text-xs text-text-muted">
            {message.length}/{MAX_MESSAGE_LENGTH}
          </span>
        </div>
      </div>

      {/* Anonymous checkbox */}
      <label
        htmlFor="anonymous-toggle"
        className="flex items-center gap-3 cursor-pointer group"
      >
        <div className="relative">
          <input
            id="anonymous-toggle"
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => onAnonymousChange(e.target.checked)}
            className="sr-only peer"
          />
          <div className="
            w-10 h-6 rounded-full border-2 transition-all duration-200
            bg-warm-100 border-warm-300
            peer-checked:bg-primary-600 peer-checked:border-primary-600
          " />
          <div className="
            absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-all duration-200
            bg-white shadow-sm
            peer-checked:translate-x-4
          " />
        </div>
        <span className="flex items-center gap-2 text-sm text-text-secondary">
          {isAnonymous ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
          Show me as Anonymous
        </span>
      </label>
    </div>
  );
}
