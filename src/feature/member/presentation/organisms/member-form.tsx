import React from 'react';
import {
  User,
  Mail,
  Briefcase,
  Building2,
  CreditCard,
  ToggleLeft,
  ChevronDown,
  Save,
  Trash2,
} from 'lucide-react';
import { Department, MemberStatus, EmploymentType } from '../../domain/member.entities';
import { FormField } from '../molecules/form-field';
import { Input } from '@/shared/atoms/input';

export interface MemberFormData {
  name: string;
  email: string;
  role: string;
  department: Department;
  status: MemberStatus;
  employmentType: EmploymentType;
  bio: string;
}

export interface MemberFormProps {
  initialValues?: Partial<MemberFormData>;
  onSubmit: (data: MemberFormData) => Promise<void>;
  onCancel: () => void;
  onDelete?: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  generalInfoSubtitle?: string;
}

const DEPARTMENTS: Department[] = [
  'Engineering',
  'Design',
  'Product',
  'Marketing',
  'Sales',
  'HR',
  'Finance',
  'Operations',
];

const STATUS_OPTIONS: { value: MemberStatus; label: string }[] = [
  { value: 'Active', label: 'Active – Full Workspace Access' },
  { value: 'Pending', label: 'Pending – Invitation Sent' },
  { value: 'Inactive', label: 'Inactive – Access Suspended' },
];

const EMPLOYMENT_TYPE_OPTIONS: { value: EmploymentType; label: string }[] = [
  { value: 'Full-time', label: 'Full-time Permanent' },
  { value: 'Part-time', label: 'Part-time' },
  { value: 'Contract', label: 'Contract' },
  { value: 'Internship', label: 'Internship' },
];

export const MemberForm: React.FC<MemberFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  onDelete,
  isSubmitting = false,
  submitLabel = 'Save Changes',
  generalInfoSubtitle = 'Add personal records, contact credentials, and communication metadata.',
}) => {
  const [formData, setFormData] = React.useState<MemberFormData>({
    name: initialValues?.name || '',
    email: initialValues?.email || '',
    role: initialValues?.role || '',
    department: initialValues?.department || 'Design',
    status: initialValues?.status || 'Active',
    employmentType: initialValues?.employmentType || 'Full-time',
    bio: initialValues?.bio || '',
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Full name must be at least 2 characters long';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid work email address';
    }

    if (!formData.role.trim()) {
      newErrors.role = 'Job title is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(formData);
  };

  const figmaInputClass =
    'h-10 bg-[#eff4ff] border-0 rounded-[4px] pl-10 pr-3 text-sm text-[#0b1c30] placeholder:text-[#777587] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] focus:ring-2 focus:ring-[#4f46e5]';

  const figmaSelectClass =
    'w-full appearance-none h-10 bg-[#eff4ff] border-0 rounded-[4px] pl-10 pr-8 text-sm text-[#0b1c30] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] focus:outline-none focus:ring-2 focus:ring-[#4f46e5] cursor-pointer transition-all';

  return (
    <div className="bg-white rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] overflow-hidden w-full">
      <form onSubmit={handleSubmit}>
        {/* Section 1: General Information */}
        <div className="p-6 space-y-4">
          <div className="pb-2">
            <h2 className="text-[20px] font-semibold text-[#0b1c30] tracking-[-0.5px] leading-7">
              General Information
            </h2>
            <p className="text-xs text-[#464555] leading-4 mt-0.5">
              {generalInfoSubtitle}
            </p>
          </div>

          {/* Row 1: Full Name & Work Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Full Name"
              required
              error={errors.name}
              description="Displayed publicly across collaborative repositories."
            >
              <Input
                icon={<User className="w-4 h-4 text-[#464555]" />}
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Michael Phelps"
                className={figmaInputClass}
              />
            </FormField>

            <FormField
              label="Work Email"
              required
              error={errors.email}
              description="Used for SSO sign-in and security notifications."
            >
              <Input
                type="email"
                icon={<Mail className="w-4 h-4 text-[#464555]" />}
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="michael.phelps@acme.corp"
                className={figmaInputClass}
              />
            </FormField>
          </div>

          {/* Row 2: Account Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Account Status"
              description="Controls login eligibility across organization SSO."
            >
              <div className="relative flex items-center">
                <div className="absolute left-3.5 flex items-center pointer-events-none text-[#464555]">
                  <ToggleLeft className="w-4 h-4" />
                </div>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: e.target.value as MemberStatus,
                    }))
                  }
                  className={figmaSelectClass}
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 flex items-center pointer-events-none text-[#464555]">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </FormField>
          </div>
        </div>

        {/* Horizontal Divider */}
        <div className="h-px bg-[rgba(220,233,255,0.6)] w-full" />

        {/* Section 2: Work Details & Permissions */}
        <div className="p-6 space-y-4">
          <div className="pb-1">
            <h2 className="text-[20px] font-semibold text-[#0b1c30] tracking-[-0.5px] leading-7">
              Work Details &amp; Permissions
            </h2>
            <p className="text-xs text-[#464555] leading-4 mt-0.5">
              Manage departmental allocations, administrative scopes, and governance clearance.
            </p>
          </div>

          {/* Row 1: Job Title & Department */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Job Title" required error={errors.role}>
              <Input
                icon={<Briefcase className="w-4 h-4 text-[#464555]" />}
                value={formData.role}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, role: e.target.value }))
                }
                placeholder="Staff UI/UX Designer"
                className={figmaInputClass}
              />
            </FormField>

            <FormField label="Department" required>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 flex items-center pointer-events-none text-[#464555]">
                  <Building2 className="w-4 h-4" />
                </div>
                <select
                  value={formData.department}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      department: e.target.value as Department,
                    }))
                  }
                  className={figmaSelectClass}
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 flex items-center pointer-events-none text-[#464555]">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </FormField>
          </div>

          {/* Row 2: Employment Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Employment Type">
              <div className="relative flex items-center">
                <div className="absolute left-3.5 flex items-center pointer-events-none text-[#464555]">
                  <CreditCard className="w-4 h-4" />
                </div>
                <select
                  value={formData.employmentType}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      employmentType: e.target.value as EmploymentType,
                    }))
                  }
                  className={figmaSelectClass}
                >
                  {EMPLOYMENT_TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 flex items-center pointer-events-none text-[#464555]">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </FormField>
          </div>

          {/* Row 3: Bio & Administrative Notes */}
          <FormField label="Bio & Administrative Notes">
            <textarea
              value={formData.bio}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, bio: e.target.value }))
              }
              rows={3}
              placeholder="Mainly working on low fidelity and high fidelity design generation"
              className="w-full bg-[#eff4ff] border-0 rounded-[4px] p-3 text-sm text-[#0b1c30] placeholder:text-[#777587] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] focus:outline-none focus:ring-2 focus:ring-[#4f46e5] resize-y"
            />
          </FormField>
        </div>

        {/* Sticky / Pinned Bottom Form Actions Bar */}
        <div className="bg-[#eff4ff] px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            {onDelete && (
              <button
                type="button"
                onClick={onDelete}
                disabled={isSubmitting}
                className="bg-white hover:bg-red-50 text-[#ba1a1a] border border-[#c7c4d8]/30 h-9 px-3 rounded-[4px] text-sm font-medium flex items-center gap-1.5 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Member</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="bg-[#e5eeff] hover:bg-[#d8e5ff] text-[#464555] h-9 px-3 rounded-[4px] text-sm font-medium transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#4f46e5] hover:bg-[#4338ca] text-white h-9 px-4 rounded-[4px] text-sm font-medium flex items-center gap-1.5 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-colors disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Saving...' : submitLabel}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
