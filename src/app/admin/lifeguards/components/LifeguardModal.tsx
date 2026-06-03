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
    `w-full pl-10 md:pl-11 pr-4 py-3 bg-white border rounded-xl text-ink placeholder-ink-soft/60 text-sm focus:ring-2 focus:ring-signal/30 transition-all min-h-[48px] ${
      hasError
        ? "border-signal/50 focus:border-signal/60"
        : "border-ink/20 focus:border-signal"
    }`;

  return (
    <div
      className={`fixed inset-0 bg-ink/40 backdrop-blur-sm flex items-center justify-center p-4 font-sans text-ink ${overlayClassName}`}
    >
      <div className="bg-paper border-2 border-ink rounded-3xl p-6 md:p-8 w-full max-w-md shadow-[8px_8px_0_0_var(--color-ink)] console-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-semibold text-ink">
            {lifeguard ? "Edit lifeguard" : "Add lifeguard"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-ink-soft hover:text-ink hover:bg-ink/5 rounded-xl transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
            aria-label="Close"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.16em] text-ink-soft mb-2">
              Full name
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-soft" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass(!!errors.name)}
                placeholder="Lifeguard name"
              />
            </div>
            {errors.name && (
              <p className="text-signal text-xs mt-1.5">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.16em] text-ink-soft mb-2">
              Contact number
            </label>
            <div className="relative">
              <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-soft" />
              <input
                type="tel"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className={inputClass(!!errors.contact_number)}
                placeholder="+65 9123 4567"
              />
            </div>
            {errors.contact_number && (
              <p className="text-signal text-xs mt-1.5">
                {errors.contact_number}
              </p>
            )}
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.16em] text-ink-soft mb-2">
              Status
            </label>
            <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-sand/60 border border-ink/12">
              <button
                type="button"
                onClick={() => setIsActive(true)}
                className={`py-2.5 rounded-lg text-sm font-medium transition-all min-h-[44px] ${
                  isActive ? "bg-sea text-white" : "text-ink-soft hover:text-ink"
                }`}
              >
                Active
              </button>
              <button
                type="button"
                onClick={() => setIsActive(false)}
                className={`py-2.5 rounded-lg text-sm font-medium transition-all min-h-[44px] ${
                  !isActive
                    ? "bg-signal text-white"
                    : "text-ink-soft hover:text-ink"
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
              className="flex-1 px-6 py-3 border border-ink/25 text-ink hover:bg-ink hover:text-paper rounded-xl transition-all font-semibold text-sm min-h-[48px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-ink text-paper hover:bg-signal rounded-xl transition-all font-semibold text-sm min-h-[48px]"
            >
              {lifeguard ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
