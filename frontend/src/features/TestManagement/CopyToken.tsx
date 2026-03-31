import { IconCopy } from "@/components/icons";
import { useState } from "react";

const CopyToken: React.FC<{ token: string }> = ({ token }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const copy = (text: string) => {
      if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text);
      }
      const el = document.createElement("textarea");
      el.value = text;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.focus();
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      return Promise.resolve();
    };
    copy(token)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => window.prompt("Copy this token:", token));
  };

  const truncated = token?.length > 10 ? `${token.slice(0, 10)}…` : token;

  return (
    <div className="relative group/copy">
      <button
        onClick={handleCopy}
        title="Copy token"
        className={`cursor-pointer w-7 h-7 flex items-center justify-center rounded-[7px] border transition-all duration-150 ${
          copied
            ? "border-violet-200 bg-violet-50 text-violet-600"
            : "border-[#e2e5e9] bg-white text-gray-700 hover:bg-violet-50 hover:border-violet-200 hover:text-violet-600"
        }`}
      >
        {copied ? (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <IconCopy />
        )}
      </button>

      {/* Tooltip — shows truncated token on hover */}
      {!copied && (
        <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 opacity-0 group-hover/copy:opacity-100 transition-opacity duration-150">
          <div className="bg-gray-900 text-white text-[11px] font-mono px-2 py-1 rounded-md whitespace-nowrap shadow-lg">
            {truncated}
          </div>
          {/* Arrow */}
          <div className="w-2 h-2 bg-gray-900 rotate-45 mx-auto -mt-1 rounded-sm" />
        </div>
      )}
    </div>
  );
};

export default CopyToken;
