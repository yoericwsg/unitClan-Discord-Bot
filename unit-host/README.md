# Unit Host static preview

Public static product preview, built without Vercel or a local server.

## Open
Serve this directory from any static HTTPS host. The index page uses pinned browser ESM imports for React, Base UI, Sonner, Lucide, and CodeMirror. No build step is required.

## Available
- Landing page and four-scene animated concept tour.
- Deployment workspace with a three-project preview limit.
- Four Node.js/Python starter templates and a free template Studio.
- CodeMirror IDE, file creation, text import, optional export, and in-memory checkpoints.
- Discord-inspired sample guild/channel navigation, unsent message drafts, permission-state simulations, and preview roles.
- Bot identity composition with avatar and banner previews.
- Free-plan design: 10 GB memory pool, 100% CPU (one core), 10 GB storage pool, three deployments, three calendar months between renewals.

## Boundaries
This is not a functioning bot host. No compute, durable storage, account authentication, CAPTCHA, Discord OAuth, bot credentials, AI provider, or live Discord action is connected. Tokens are not collected. No localStorage, IndexedDB, service worker, analytics, or bot process is used. Browser normal caching remains browser-controlled.

Reloading clears preview state. Downloads happen only through user-selected Export/Download actions.

The template studio is deterministic, not an AI agent. The four generated bot templates were not run against live Discord. Live role management must check both bot and authenticated-user authority, channel overwrites, managed roles, and hierarchy on the backend. Discord identity updates must use supported current endpoints.

## Infrastructure needed next
A cloud backend must provide authenticated owner sessions, encrypted secrets, isolated Node/Python containers, lifecycle/log APIs, quotas, persistent file storage, backups, and server-side Discord permission enforcement. Static hosting cannot supply the advertised compute allowances.

## Design and investigation
Used the reverse-engineer-anything skill's target-routing and limitation guidance. REA analysis tools and CLI were not available in this chat, so no REA capture or Evidence ID is claimed. Public Bot-Hosting and Discord pages were inspected with browsing tools. No private dashboard or proprietary source was accessed.

The UI follows the library-first-ui skill: shadcn dashboard composition, Base UI dialogs, Sonner feedback, Lucide icons, and CodeMirror editing. Styling and product copy were authored for Unit Host.

References:
- https://bot-hosting.net/
- https://bot-hosting.net/blog/studio-ai-coding-agent
- https://ui.shadcn.com/blocks
- https://base-ui.com/react/components/dialog
- https://codemirror.net/examples/basic/
- https://docs.discord.com/developers/topics/permissions

See THIRD_PARTY.md for dependency licenses.

## Validation
The published preview returned HTTP 200. All authored JavaScript passed Acorn syntax parsing. Model checks covered runtime detection, file names, permission bits, three deployment slots, and calendar-month renewal clamping.

Observed in the live browser:
- CodeMirror JavaScript/Python rendering; edit, save, search, undo and redo.
- Nested file creation and checkpoint restore.
- Studio generated a third Python project and prevented a fourth deployment.
- Message drafts remained labelled NOT SENT; read-only mode locked chat, role assignments, and ban controls.
- Preview role creation/removal and identity name save.
- Mobile navigation dialog focus, Escape dismissal, and focus return.
- Responsive profile, chat, members and IDE layouts around 390 pixels.

Avatar/banner file imports and optional downloads were not exercised because no user-device files or storage were used. No live bot processes, Discord API calls, real account authentication, or durable backups were tested.

## Published preview
Cloud source: https://github.com/yoericwsg/unitClan-Discord-Bot/tree/unit-host-static/unit-host

The deployment uses a free GitHack HTTPS URL. No custom domain was registered. Netlify requires connector reauthentication, and GitHub Pages settings were unavailable without browser sign-in.
