# Scale OS — Profit Recovery Suite: TODO

## Phase 2: Global Design System & Layout
- [x] Quiet Luxury design tokens (color palette, typography, spacing) in index.css
- [x] Global navigation (top bar with logo, 3 sections: Simulator, Concierge, SOP)
- [x] iPad-optimized responsive layout (1024px primary breakpoint)
- [x] App.tsx routing for all pages

## Phase 3: Profit Restoration Simulator
- [x] Input form: number of admin staff, hours/week on manual tasks, business type selector
- [x] Calculation logic: CA minimum wage ($16.90), loaded cost ($25-30/hr), annual savings
- [x] Results dashboard: annual cost savings, hours freed, ROI percentage
- [x] Charts: Bar chart (before/after cost), Donut chart (time allocation), Area chart (12-month savings projection)
- [x] DB schema: simulation_results table
- [x] tRPC procedure: saveSimulation, getSimulation by token

## Phase 4: 24/7 AI Concierge
- [x] AI chat interface (custom, optimized for demo)
- [x] System prompt: South Bay business persona, empathetic, Scale OS benefits
- [x] Business type context: clinic, real estate, retail presets
- [x] Voice input: browser Web Speech API for microphone capture
- [x] AI responses via tRPC + invokeLLM
- [x] Mobile/iPhone optimized chat UI

## Phase 5: Save & Share
- [x] Contact save: tRPC procedure to store owner info with simulation
- [x] Shareable URL: generate unique token, store in DB, retrieve via /results/:token
- [x] Email/name input form on results page
- [x] Copy link button with toast confirmation

## Phase 6: No-Code SOP Page
- [x] Mika's SOP document rendered as elegant in-app page
- [x] Sections: Odoo Studio setup, AI integration, customer automation, inventory sync, compliance
- [x] Manus fix request template section
- [x] Print/PDF export button

## Phase 7: Final Polish
- [x] iPad viewport testing (1024x768, 1366x1024)
- [x] iPhone viewport testing (390x844)
- [x] Vitest tests for simulator calculation logic (5 tests passing)
- [x] Vitest tests for tRPC procedures (6 total tests passing)
- [x] Checkpoint save

## Phase 8: Implementation Guide アクセス制限
- [x] ナビゲーションから「Implementation Guide」リンクを削除（未ログイン時）
- [x] ログイン済みMikaのみ /sop ページにアクセス可能（未ログインはログインページへリダイレクト）
- [x] Profit Simulator・AI Conciergeは公開状態を維持

## Phase 9: 会社名変更・問い合わせボタン追加
- [x] フッターの会社名を「A-kanon International」に変更
- [x] ナビゲーションに「Contact」ボタンを追加（m.nonaka@akanon-intl.comへのmailtoリンク）
- [x] ホームページのCTAに問い合わせリンクを追加
