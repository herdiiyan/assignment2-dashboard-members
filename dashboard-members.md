# Technical Design Specification: Dashboard Members (FE Assignment 2)

**Figma Reference:** `https://www.figma.com/design/P0NIrQu6tBCHt0IPt721VM/FE-Assignment-2?node-id=306-15`  
**Architecture:** Feature-Driven Development (FDD) + Clean Architecture + Atomic Design + Test-Driven Development (TDD)  
**Tech Stack:** Next.js 14+ (App Router), TypeScript, Tailwind CSS, Lucide React, Vitest, React Testing Library  
**API Stack:** Next.js Route Handlers + Web Standard Fetch API + Node.js

---

## 1. Context & Business Goals

Implementasi Front-End untuk Dashboard Member yang mengelola data anggota organisasi/tim (CRUD: Create, Read, Update, Delete) dengan tampilan metrik KPI, pencarian real-time, bulk action selection, dialog konfirmasi, dan modal feedback sukses.

### Vertical Slices (Per-Feature):
1. Setup fondasi, entity, JSON store, dan shared atoms.
2. Read Flow (Dashboard utama, 4 KPI Card, dan live search).
3. Multi-select checkbox dan Client-side CSV Export.
4. Add Member + Form validation + Popup Success Add.
5. Edit Member + Form load + Popup Success Update.
6. Delete Member (Single & Bulk) + Modal Confirm + Popups.
7. Full verification test & visual alignment dengan Figma.
8. **Feedback Popups**:
   - `Popup Success Add` 
   - `Popup Success Update` 
   - `Popup Success Delete (Single)`
   - `Popup Success Delete (Multiple)`

---

## 2. Standar Response Envelope
- **Format Sukses:**
  ```json
  {
    "success": true,
    "data": { ... },
    "metrics": { ... },
    "message": "Operasi berhasil"
  }
  ```
- **Format Error:**
  ```json
  {
    "success": false,
    "error": "Deskripsi kesalahan validasi atau data tidak ditemukan",
    "statusCode": 400
  }
  ```

---

## 3. Directory Structure

```
assignment2/dashboar-members/
├── data/
│   └── members.json
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── members/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/edit/page.tsx
│   │   └── api/
│   │       └── members/
│   │           ├── route.ts
│   │           └── [id]/route.ts
│   │
│   ├── shared/
│   │   ├── atoms/
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── card.tsx
│   │   │   └── typography.tsx
│   │   ├── utils/
│   │   │   ├── cn.ts
│   │   │   └── csv.ts                        # Client-side CSV export utility
│   │   └── types/
│   │       └── api-response.ts
│   │
│   └── features/
│       └── members/
│           ├── domain/
│           │   └── member.entity.ts
│           │
│           ├── usecase/
│           │   ├── member.repository.ts
│           │   ├── get-members.usecase.ts
│           │   ├── get-member-by-id.usecase.ts
│           │   ├── create-member.usecase.ts
│           │   ├── update-member.usecase.ts
│           │   ├── delete-member.usecase.ts
│           │   ├── bulk-delete-members.usecase.ts
│           │   ├── get-member-metrics.usecase.ts
│           │   └── __tests__/
│           │       ├── get-members.usecase.test.ts
│           │       ├── create-member.usecase.test.ts
│           │       ├── update-member.usecase.test.ts
│           │       ├── delete-member.usecase.test.ts
│           │       └── get-member-metrics.usecase.test.ts
│           │
│           ├── controller/
│           │   ├── member.controller.ts
│           │   └── __tests__/
│           │       └── member.controller.test.ts
│           │
│           ├── infrastructure/
│           │   ├── member-json.repository.ts
│           │   ├── member-api.client.ts
│           │   └── __tests__/
│           │       └── member-json.repository.test.ts
│           │
│           └── presentation/
│               ├── atoms/
│               │   └── status-indicator.tsx
│               ├── molecules/
│               │   ├── search-input.tsx
│               │   ├── metric-card.tsx
│               │   ├── member-badge.tsx
│               │   ├── member-cell-info.tsx
│               │   ├── table-action-buttons.tsx
│               │   ├── form-field.tsx
│               │   └── __tests__/
│               │       ├── metric-card.test.tsx
│               │       └── search-input.test.tsx
│               ├── organisms/
│               │   ├── metrics-grid.tsx
│               │   ├── members-table.tsx
│               │   ├── members-toolbar.tsx
│               │   ├── member-form.tsx
│               │   ├── delete-modal.tsx
│               │   └── success-popup.tsx
│               ├── views/
│               │   ├── member-list-view.tsx
│               │   ├── member-create-view.tsx
│               │   └── member-edit-view.tsx
│               └── hooks/
│                   ├── use-members.ts
│                   ├── use-member-form.ts
│                   └── use-bulk-selection.ts
```

---

## 4. Initial Seed Data

Data awal di `data/members.json` memuat data:
```json
[
  {
    "id": "mem_01",
    "name": "Sarah Jenkins",
    "email": "sarah.jenkins@company.com",
    "role": "Staff Frontend Engineer",
    "department": "Engineering",
    "status": "Active",
    "joinedDate": "2024-01-15",
    "lastActive": "Just now",
    "avatarBgColor": "bg-indigo-100 text-indigo-700"
  },
  {
    "id": "mem_02",
    "name": "Alex Rivera",
    "email": "alex.rivera@company.com",
    "role": "Tech Lead",
    "department": "Engineering",
    "status": "Active",
    "joinedDate": "2023-08-20",
    "lastActive": "5 minutes ago",
    "avatarBgColor": "bg-emerald-100 text-emerald-700"
  },
  {
    "id": "mem_03",
    "name": "Michael Phelps",
    "email": "michael.phelps@company.com",
    "role": "Product Designer",
    "department": "Design",
    "status": "Active",
    "joinedDate": "2024-03-10",
    "lastActive": "1 hour ago",
    "avatarBgColor": "bg-purple-100 text-purple-700"
  },
  {
    "id": "mem_04",
    "name": "Jessica Taylor",
    "email": "jessica.t@company.com",
    "role": "Product Manager",
    "department": "Product",
    "status": "Pending",
    "joinedDate": "2026-11-01",
    "lastActive": "2 days ago",
    "avatarBgColor": "bg-amber-100 text-amber-700"
  },
  {
    "id": "mem_05",
    "name": "David Kim",
    "email": "david.kim@company.com",
    "role": "Backend Engineer",
    "department": "Engineering",
    "status": "Active",
    "joinedDate": "2024-05-12",
    "lastActive": "10 minutes ago",
    "avatarBgColor": "bg-blue-100 text-blue-700"
  }
]
```
