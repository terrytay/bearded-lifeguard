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
  onSubmit: (data: { name: string; contact_number: string; is_active: boolean }) => void;
}

export default function LifeguardModal({ lifeguard, onClose, onSubmit }: LifeguardModalProps) {
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

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!contactNumber.trim()) {
      newErrors.contact_number = "Contact number is required";
    } else {
      // Basic Singapore phone number validation
      const phoneRegex = /^(\+65\s?)?\d{4}\s?\d{4}$/;
      const cleanNumber = contactNumber.replace(/\s/g, '');
      if (!phoneRegex.test(contactNumber) && !/^\d{8}$/.test(cleanNumber)) {
        newErrors.contact_number = "Invalid phone number format. Use 8-digit format or +65 XXXX XXXX";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Format phone number
      let formattedNumber = contactNumber.trim();
      if (!formattedNumber.startsWith('+65')) {
        const cleanNumber = formattedNumber.replace(/\s/g, '');
        if (cleanNumber.length === 8) {
          formattedNumber = `+65 ${cleanNumber.slice(0, 4)} ${cleanNumber.slice(4)}`;
        }
      }

      onSubmit({
        name: name.trim(),
        contact_number: formattedNumber,
        is_active: isActive,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-slate-900 to-indigo-900 border border-white/20 rounded-2xl md:rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <UserIcon className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white">
              {lifeguard ? "Edit Lifeguard" : "Add New Lifeguard"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <XMarkIcon className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          {/* Name Field */}
          <div>
            <label className="block text-white/80 text-sm md:text-base font-medium mb-2">
              Full Name *
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-white/50" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full pl-10 md:pl-12 pr-4 py-3 md:py-4 bg-white/10 border rounded-xl md:rounded-2xl focus:ring-2 focus:ring-blue-400/50 transition-all duration-200 text-white placeholder-white/50 backdrop-blur-sm text-sm md:text-base ${
                  errors.name 
                    ? "border-red-500/50 focus:border-red-400/50" 
                    : "border-white/20 focus:border-blue-400/50"
                }`}
                placeholder="Enter lifeguard's full name"
              />
            </div>
            {errors.name && (
              <p className="text-red-400 text-xs md:text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Contact Number Field */}
          <div>
            <label className="block text-white/80 text-sm md:text-base font-medium mb-2">
              Contact Number *
            </label>
            <div className="relative">
              <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-white/50" />
              <input
                type="tel"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className={`w-full pl-10 md:pl-12 pr-4 py-3 md:py-4 bg-white/10 border rounded-xl md:rounded-2xl focus:ring-2 focus:ring-blue-400/50 transition-all duration-200 text-white placeholder-white/50 backdrop-blur-sm text-sm md:text-base font-mono ${
                  errors.contact_number 
                    ? "border-red-500/50 focus:border-red-400/50" 
                    : "border-white/20 focus:border-blue-400/50"
                }`}
                placeholder="+65 9123 4567 or 91234567"
              />
            </div>
            {errors.contact_number && (
              <p className="text-red-400 text-xs md:text-sm mt-1">{errors.contact_number}</p>
            )}
          </div>

          {/* Active Status */}
          <div>
            <label className="block text-white/80 text-sm md:text-base font-medium mb-3">
              Status
            </label>
            <div className="flex items-center space-x-3">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  checked={isActive}
                  onChange={() => setIsActive(true)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border-2 mr-2 flex items-center justify-center ${
                  isActive 
                    ? "bg-emerald-500 border-emerald-500" 
                    : "border-white/30"
                }`}>
                  {isActive && <div className="w-2 h-2 bg-white rounded-full"></div>}
                </div>
                <span className="text-white text-sm md:text-base">Active</span>
              </label>
              
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  checked={!isActive}
                  onChange={() => setIsActive(false)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border-2 mr-2 flex items-center justify-center ${
                  !isActive 
                    ? "bg-red-500 border-red-500" 
                    : "border-white/30"
                }`}>
                  {!isActive && <div className="w-2 h-2 bg-white rounded-full"></div>}
                </div>
                <span className="text-white text-sm md:text-base">Inactive</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-4 pt-4 md:pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 md:py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl md:rounded-2xl transition-all duration-200 font-semibold text-sm md:text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 md:py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl md:rounded-2xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl text-sm md:text-base"
            >
              {lifeguard ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}