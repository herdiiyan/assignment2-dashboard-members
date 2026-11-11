# Technical Design Specification: Dashboard Members (FE Assignment 2)

**Figma Reference:** `https://www.figma.com/design/P0NIrQu6tBCHt0IPt721VM/FE-Assignment-2?node-id=306-15`  
**Architecture:** Feature-Driven Development (FDD) + Clean Architecture + Atomic Design + Test-Driven Development (TDD)  
**Tech Stack:** Next.js 14+ (App Router), TypeScript, Tailwind CSS, Lucide React, Vitest, React Testing Library  
**API Stack:** Next.js Route Handlers + Web Standard Fetch API + Local JSON Storage (`data/members.json`)

---

## 1. Context & Business Goals

Implementasi Front-End untuk Dashboard Member yang mengelola data anggota organisasi/tim (CRUD: Create, Read, Update, Delete) dengan tampilan metrik KPI, pencarian real-time, bulk action selection, dialog konfirmasi, dan modal feedback sukses.

### Vertical Slices (Per-Feature):
1. **Foundation & Domain**: Entity, types, local JSON store, dan shared atomic design components.
2. **Read Flow**: Dashboard utama, 4 KPI Card, data table, dan live search.
3. **Multi-Selection & Export**: Multi-select checkbox dan Client-side CSV Export.
4. **Add Member**: Form validation + input form + modal feedback `Popup Success Add`.
5. **Edit Member**: Form input + metadata update + modal feedback `Popup Success Update`.
6. **Delete Member**: Single & Bulk delete + modal dialog konfirmasi + `Popup Success Delete (Single & Multiple)`.

---

## 2. Standar Response

Endpoint: `/api/members` dan `/api/members/[id]`

- **Format Sukses:**
  ```json
  {
    "success": true,
    "data": [ ... ],
    "metrics": {
      "totalMembers": 12,
      "activeNow": 8,
      "activePercentage": 67,
      "departmentsCount": 4,
      "pendingInvites": 2,
      "expiringSoon": 3
    },
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

## 3. Directory Structure (Clean Architecture + FDD)

Struktur direktori :

```
dashboar-members/
├── data/
│   └── members.json                       # Mock database lokal JSON
├── src/
│   ├── app/
│   │   ├── layout.tsx                     # Root Layout HTML & Fonts
│   │   ├── globals.css                    # Tailwind CSS imports
│   │   ├── page.tsx                       # Redirect ke /members
│   │   ├── members/
│   │   │   ├── page.tsx                   # Thin wrapper -> useMemberListController + MemberListTemplate
│   │   │   ├── new/page.tsx               # Thin wrapper -> useMemberFormController + MemberCreateTemplate
│   │   │   └── [id]/edit/page.tsx         # Thin wrapper -> useMemberFormController(id) + MemberEditTemplate
│   │   └── api/
│   │       └── members/
│   │           ├── member-storage.ts      # Node.js fs/promises storage helper untuk data/members.json
│   │           ├── route.ts               # GET (list & metrics), POST (create), DELETE (bulk)
│   │           └── [id]/route.ts          # GET (by id), PUT (update), DELETE (single)
│   │
│   ├── shared/
│   │   ├── atoms/                         # Atomic Design Atoms
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── card.tsx
│   │   │   └── __tests__/
│   │   │       └── atoms.test.tsx
│   │   ├── utils/
│   │   │   ├── cn.ts                      # Tailwind merge & clsx utility
│   │   │   ├── csv.ts                     # Client-side CSV export generator
│   │   │   └── __tests__/
│   │   │       └── csv.test.ts
│   │   └── types/
│   │       └── api-response.ts            # Standard envelope response type
│   │
│   └── feature/                           # Folder singular: "feature"
│       └── member/
│           ├── domain/
│           │   └── member.entities.ts     # Domain Entities, Department, Status, Metrics
│           │
│           ├── usecase/
│           │   ├── repositories/
│           │   │   └── member.repository.interface.ts  # IMemberRepository contract
│           │   ├── dtos/
│           │   │   └── member.dto.ts      # Input DTOs & Result DTOs
│           │   ├── get-member.usecase.ts  # Ambil data member + metrics sekaligus
│           │   ├── get-member-by-id.usecase.ts
│           │   ├── create-member.usecase.ts
│           │   ├── update-member.usecase.ts
│           │   ├── delete-member.usecase.ts
│           │   ├── bulk-delete-members.usecase.ts
│           │   └── __tests__/             # Unit tests usecase
│           │       ├── get-member.usecase.test.ts
│           │       ├── get-member-by-id.usecase.test.ts
│           │       ├── create-member.usecase.test.ts
│           │       ├── update-member.usecase.test.ts
│           │       ├── delete-member.usecase.test.ts
│           │       └── bulk-delete-members.usecase.test.ts
│           │
│           ├── infrastructure/
│           │   ├── member-api.repository.ts  # Implementasi IMemberRepository via fetch('/api/members')
│           │   │                             # Dilengkapi In-Flight Request Deduplication
│           │   └── __tests__/
│           │       └── member-api.repository.test.ts
│           │
│           ├── controller/
│           │   ├── use-member-list.controller.ts  # Custom Hook Controller untuk halaman list & tabel
│           │   ├── use-member-form.controller.ts  # Custom Hook Controller untuk form add & edit
│           │   └── __tests__/
│           │       ├── use-member-list.controller.test.ts
│           │       └── use-member-form.controller.test.ts
│           │
│           └── presentation/
│               ├── molecules/
│               │   ├── form-field.tsx
│               │   ├── member-badge.tsx
│               │   ├── member-cell-info.tsx
│               │   ├── metric-card.tsx
│               │   ├── search-input.tsx
│               │   └── table-action-buttons.tsx
│               ├── organisms/
│               │   ├── delete-modal.tsx
│               │   ├── member-empty-state.tsx
│               │   ├── member-form.tsx
│               │   ├── members-table.tsx
│               │   ├── members-toolbar.tsx
│               │   ├── metrics-grid.tsx
│               │   └── success-popup.tsx
│               └── templates/
│                   ├── member-list.template.tsx
│                   ├── member-create.template.tsx
│                   └── member-edit.template.tsx
```

---

## 4. Initial Seed Data (`data/members.json`)

```json
[
  {
    "id": "mem_01",
    "name": "Sarah Jenkins",
    "email": "sarah.jenkins@company.com",
    "role": "Staff Frontend Engineer",
    "department": "Engineering",
    "status": "Active",
    "employmentType": "Full-time",
    "bio": "Frontend architecture lead responsible for design system integration and core web vitals.",
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
