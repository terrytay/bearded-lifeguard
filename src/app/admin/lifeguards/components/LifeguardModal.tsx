import { useState, useEffect } from "react";
import { XMarkIcon, UserIcon, PhoneIcon } from "@heroicons/react/24/outline";

interface Lifeguard {
  id: string;
  name: string;
  contact_number: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface LifeguardModalProps {
  lifeguard: Lifeguard | null;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    contact_number: string;
    is_active: boolean;
  }) => void;
  overlayClassName?: string;
}

export default function LifeguardModal({
  lifeguard,
  onClose,
  onSubmit,
  overlayClassName = "z-50",
}: LifeguardModalProps) {
  const [name, setName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (lifeguard) {
      setName(lifeguard.name);
      setContactNumber(lifeguard.contact_number);
      setIsActive(lifeguard.is_active);
    } else {
      setName("");
      setContactNumber("");
      setIsActive(true);
    }
    setErrors({});
  }, [lifeguard]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!contactNumber.trim()) {
      newErrors.contact_number = "Contact number is required";
    } else {
      const phoneRegex = /^(\+65\s?)?\d{4}\s?\d{4}$/;
      const cleanNumber = contactNumber.replace(/\s/g, "");
      if (!phoneRegex.test(contactNumber) && !/^\d{8}$/.test(cleanNumber)) {
        newErrors.contact_number =
          "Use an 8-digit number or +65 XXXX XXXX format";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      let formattedNumber = contactNumber.trim();
      if (!formattedNumber.startsWith("+65")) {
        const cleanNumber = formattedNumber.replace(/\s/g, "");
        if (cleanNumber.length === 8) {
          formattedNumber = `+65 ${cleanNumber.slice(0, 4)} ${cleanNumber.slice(
            4
          )}`;
        }
      }
      onSubmit({
        name: name.trim(),
        contact_number: formattedNumber,
        is_active: isActive,
      });
    }
  };

  const inputClass = (hasError: boolean) =>
    `w-full pl-10 md:pl-11 pr-4 py-3 bg-black/20 border rounded-xl text-white placeholder-white/40 text-sm focus:ring-2 focus:ring-[#FF6633]/40 transition-all min-h-[48px] ${
      hasError
        ? "border-rose-400/50 focus:border-rose-400/50"
        : "border-white/15 focus:border-[#FF6633]/50"
    }`;

  return (
    <div
      className={`fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 font-mono ${overlayClassName}`}
    >
      <div className="bg-slate-900 border border-white/15 rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl console-in">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FF6633]/15 border border-[#FF6633]/30 flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-[#FF6633]" />
            </div>
            <h2 className="text-lg md:text-xl font-bold text-white">
              {lifeguard ? "Edit lifeguard" : "Add lifeguard"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-xl transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
            aria-label="Close"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.16em] text-white/45 mb-2">
              Full name
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass(!!errors.name)}
                placeholder="Lifeguard name"
              />
            </div>
            {errors.name && (
              <p className="text-rose-300 text-xs mt-1.5">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.16em] text-white/45 mb-2">
              Contact number
            </label>
            <div className="relative">
              <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <input
                type="tel"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className={inputClass(!!errors.contact_number)}
                placeholder="+65 9123 4567"
              />
            </div>
            {errors.contact_number && (
              <p className="text-rose-300 text-xs mt-1.5">
                {errors.contact_number}
              </p>
            )}
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.16em] text-white/45 mb-2">
              Status
            </label>
            <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-black/20 border border-white/10">
              <button
                type="button"
                onClick={() => setIsActive(true)}
                className={`py-2.5 rounded-lg text-sm font-medium transition-all min-h-[44px] ${
                  isActive
                    ? "bg-emerald-500/80 text-white"
                    : "text-white/55 hover:text-white"
                }`}
              >
                Active
              </button>
              <button
                type="button"
                onClick={() => setIsActive(false)}
                className={`py-2.5 rounded-lg text-sm font-medium transition-all min-h-[44px] ${
                  !isActive
                    ? "bg-rose-500/80 text-white"
                    : "text-white/55 hover:text-white"
                }`}
              >
                Inactive
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/15 rounded-xl transition-all font-semibold text-sm min-h-[48px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-[#FF6633] hover:bg-[#e55a2b] text-white rounded-xl transition-all font-semibold shadow-lg shadow-[#FF6633]/20 text-sm min-h-[48px]"
            >
              {lifeguard ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
