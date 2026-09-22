import React, { useRef, useEffect } from "react";
import { X } from "lucide-react";
import gsap from "gsap";

const Modal = ({ isOpen, onClose, title, children, maxWidth = "max-w-xl" }) => {
  const backdropRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (backdropRef.current && contentRef.current) {
        gsap.fromTo(
          backdropRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.25, ease: "power2.out" }
        );
        gsap.fromTo(
          contentRef.current,
          { opacity: 0, scale: 0.92, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: "back.out(1.2)" }
        );
      }
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
      onClick={(e) => {
        if (e.target === backdropRef.current) onClose();
      }}
    >
      <div
        ref={contentRef}
        className={`w-full ${maxWidth} bg-[#0f172a] border border-purple-900/40 rounded-3xl shadow-2xl overflow-hidden my-8 relative z-10`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-purple-900/30 bg-slate-900/50">
          <h3 className="text-lg font-bold text-white font-['Outfit']">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
