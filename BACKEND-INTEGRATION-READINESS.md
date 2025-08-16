# Backend Integration Readiness (APIs to complete the frontend)

A concise, mock-first API spec and backend task list so the frontend can switch from mocks to real endpoints with minimal churn.

## Principles

- Auth: Sign-In With Ethereum (SIWE) or equivalent message-signing flow. Backend issues a short-lived JWT + refresh token.
- Transport: REST over HTTPS for all CRUD; Server-Sent Events (SSE) or WebSocket for long-running tasks (AI, uploads, minting).
- Data: Stable shapes; cursor pagination; idempotent create where practical; consistent error schema.
- Security: Bearer JWT, CORS-allow frontend origin, rate-limits, audit logging by wallet address.

---

## 1) Authentication & Session

- POST /auth/nonce
  - Desc: Issue a one-time nonce for the wallet address to sign.
  - Body: { address: string }
  - Resp: { nonce: string, expiresIn: number }

- POST /auth/verify
  - Desc: Verify the signature over the nonce (SIWE); issue tokens.
  - Body: { address: string, signature: string, nonce: string }
  - Resp: { accessToken: string, refreshToken: string, user: { address: string, did: string } }

- POST /auth/refresh
  - Desc: Rotate access token.
  - Body: { refreshToken: string }
  - Resp: { accessToken: string, refreshToken: string }

- POST /auth/logout
  - Desc: Invalidate refresh token (server-side) and end session.
  - Auth: Bearer
  - Resp: { success: true }

- GET /auth/session
  - Desc: Current session info for diagnostics.
  - Auth: Bearer
  - Resp: { address: string, roles?: string[], issuedAt: string, expiresAt: string }

---

## 2) User Profile & Settings (optional but recommended)

- GET /me
  - Auth: Bearer
  - Resp: { address, displayName?, email?, preferences?: { notifications?: boolean } }

- PATCH /me
  - Auth: Bearer
  - Body: partial fields from above
  - Resp: updated profile

---

## 3) Wallet & Chain Support

- GET /chains
  - Desc: Supported chains and RPC health.
  - Resp: { items: [{ chainId: number, name: string, isTestnet: boolean, explorer: string }] }

- GET /wallet/diagnostics
  - Auth: Bearer
  - Resp: { latestActivityAt?: string, lastIp?: string }

---

## 4) Consents & Access Management

- GET /consents
  - Auth: Bearer
  - Query: status?=active|pending|revoked, cursor?, limit?
  - Resp: { items: Consent[], nextCursor?: string }

- GET /consents/history
  - Auth: Bearer
  - Query: cursor?, limit?
  - Resp: { items: ConsentEvent[], nextCursor?: string }

- GET /consents/pending
  - Auth: Bearer
  - Resp: { items: ConsentRequest[] }

- POST /consents
  - Desc: Grant a consent to a requester/party.
  - Auth: Bearer
  - Body: { subjectId: string, permissions: string[], expiryHours?: number }
  - Resp: { consentId: string, status: 'active'|'pending', txHash?: string }

- PATCH /consents/{consentId}
  - Desc: Revoke or update expiry/permissions.
  - Auth: Bearer
  - Body: { action: 'revoke'|'update', permissions?: string[], expiryHours?: number }
  - Resp: { consentId, status, txHash?: string }

- POST /consents/{consentId}/approve
  - Auth: Bearer
  - Resp: { consentId, status: 'active', txHash?: string }

- POST /consents/{consentId}/deny
  - Auth: Bearer
  - Resp: { consentId, status: 'denied' }

- POST /consents/nft
  - Desc: Mint an NFT representing consent (optional feature).
  - Auth: Bearer
  - Body: { subjectId: string, permissions: string[], expiryHours: number }
  - Resp: { tokenId: string, txHash: string, metadataCid: string }

Models
- Consent: { consentId, subjectId, grantee: string, permissions: string[], status: 'active'|'pending'|'revoked'|'denied', expiryAt?: string, createdAt: string }
- ConsentEvent: { id, consentId, type: 'created'|'approved'|'revoked'|'denied', txHash?: string, timestamp: string }
- ConsentRequest: { requestId, requester: string, permissions: string[], reason?: string, createdAt: string }

---

## 5) Emergency Access & Contacts

- GET /emergency/contacts
  - Auth: Bearer
  - Resp: { items: Contact[] }

- POST /emergency/contacts
  - Auth: Bearer
  - Body: ContactCreate
  - Resp: Contact

- PUT /emergency/contacts/{contactId}
  - Auth: Bearer
  - Body: ContactUpdate
  - Resp: Contact

- DELETE /emergency/contacts/{contactId}
  - Auth: Bearer
  - Resp: { success: true }

- POST /emergency/breakglass
  - Desc: Trigger emergency access; records an immutable audit event.
  - Auth: Bearer
  - Body: { reason: string }
  - Resp: { txHash: string, activatedAt: string }

- GET /emergency/audit
  - Auth: Bearer
  - Query: cursor?, limit?
  - Resp: { items: EmergencyEvent[], nextCursor?: string }

Models
- Contact: { id, name, phone, relation, wallet?: string, createdAt }
- ContactCreate: { name, phone, relation, wallet?: string }
- ContactUpdate: partial ContactCreate
- EmergencyEvent: { id, actor: string, reason: string, txHash?: string, createdAt }

---

## 6) Medical Records Management

Uploads
- POST /records/upload-init
  - Desc: Issue a pre-signed URL (S3/GCS) or return an IPFS pin token.
  - Auth: Bearer
  - Body: { filename: string, contentType: string, size: number }
  - Resp: { uploadUrl?: string, formData?: object, ipfsAuth?: { endpoint: string, headers: object }, uploadId: string, expiresIn: number }

- POST /records/upload-complete
  - Desc: Finalize an upload and register the record metadata.
  - Auth: Bearer
  - Body: { uploadId: string, cid?: string, storage: 's3'|'ipfs', meta: RecordMetaCreate }
  - Resp: Record

Metadata & Listing
- GET /records
  - Auth: Bearer
  - Query: q?, type?, fromDate?, toDate?, cursor?, limit?
  - Resp: { items: Record[], nextCursor?: string }

- GET /records/{recordId}
  - Auth: Bearer
  - Resp: Record

- POST /records/{recordId}/share
  - Desc: Create a share link/permission for a recipient.
  - Auth: Bearer
  - Body: { recipient: string, permissions: string[], expiryHours?: number }
  - Resp: { shareId: string, url?: string, txHash?: string }

Models
- Record: { id, owner: string, type: string, title: string, size: number, cid?: string, url?: string, createdAt, updatedAt, checksums?: { sha256?: string } }
- RecordMetaCreate: { type: string, title: string, size: number, checksums?: { sha256?: string } }

---

## 7) AI Health Assistant (proxy to LLM)

- POST /ai/summary
  - Auth: Bearer
  - Body: { prompt: string, permissions: string[] }
  - Resp: { text: string, sources: string[], confidence: number, createdAt: string, usage?: { tokens: number, model: string, durationMs: number } }

- POST /ai/chat
  - Auth: Bearer
  - Body: { messages: { role: 'system'|'user'|'assistant', content: string }[], stream?: boolean }
  - Resp: { id: string, messages: [...], usage? } or stream via SSE at /ai/chat/stream

- GET /ai/chat/stream?id={id}
  - Auth: Bearer
  - SSE streaming chunks: { delta: string, done?: boolean }

Notes
- Backend holds provider keys (OpenAI, Azure OpenAI); never expose keys to the browser.

---

## 8) Activity & Audit

- GET /activity/recent
  - Auth: Bearer
  - Query: cursor?, limit?
  - Resp: { items: Activity[], nextCursor?: string }

- GET /audit/logs
  - Auth: Bearer
  - Query: action?, from?, to?, cursor?, limit?
  - Resp: { items: AuditLog[], nextCursor?: string }

Models
- Activity: { id, type: 'record.upload'|'consent.update'|'emergency.trigger'|string, summary: string, createdAt: string }
- AuditLog: { id, actor: string, action: string, resource?: string, txHash?: string, createdAt: string, meta?: object }

---

## 9) Jobs & Long-running Tasks (optional)

- POST /jobs
  - Auth: Bearer
  - Body: { type: 'mint.nft'|'ai.chat'|'upload.finalize', payload: object }
  - Resp: { jobId: string, status: 'queued'|'running'|'succeeded'|'failed' }

- GET /jobs/{jobId}
  - Auth: Bearer
  - Resp: { jobId, status, result?: object, error?: { code: string, message: string } }

- GET /jobs/{jobId}/stream
  - Auth: Bearer
  - SSE stream of status updates

---

## 10) Error Schema & Pagination

- Errors: HTTP status + body { code: string, message: string, details?: object, retryable?: boolean }
- Pagination: cursor-based, consistent keys: cursor, nextCursor, limit (default 20, max 100)
- Dates: ISO8601 UTC

---

## 11) Smart Contract & Web3 (if backend mediates on-chain)

Deliver:
- Contract addresses per chain (Sepolia): consent, break-glass, records registry
- ABIs versioned
- Indexer or event listener that hydrates API responses with on-chain txHash and status
- Optional relayer for gas-abstracted actions

---

## 12) Webhooks (optional)

- POST {frontend}/webhooks/upload-complete
  - Body: { uploadId, recordId }

- POST {frontend}/webhooks/mint-complete
  - Body: { tokenId, txHash }

---

## 13) Configuration & Envs (backend)

- DATABASE_URL
- JWT_SECRET, JWT_EXPIRES_IN, REFRESH_EXPIRES_IN
- OPENAI_API_KEY (or Azure equivalents)
- IPFS_PINNING: endpoint, key/secret (if used)
- RPC_URL_SEPOLIA (and other chains)
- RATE_LIMIT_* (burst, window)
- CORS_ALLOWED_ORIGINS (include the frontend URL)

---

## 14) Definition of Done (backend)

- All endpoints above implemented with auth, validation, and rate limits.
- Consistent error schema; health check at GET /healthz => { ok: true }.
- Seed/mock data for demo accounts; stable IDs.
- Minimal tests: auth flow, consents CRUD, records upload-init/complete, AI summary.
- API docs published (OpenAPI/Swagger) and a Postman collection.
- Contract addresses/ABIs delivered; envs documented.

---

## 15) Mapping to Frontend Calls

- Wallet connect/session → /auth/*
- Dashboard recent activity → /activity/recent
- Records list/upload/share → /records/*
- AI assistant → /ai/summary, /ai/chat (and /ai/chat/stream for streaming)
- Consents tabs/history/actions → /consents/*
- Emergency contacts/audit/break-glass → /emergency/*

This surface matches the current frontend service layers and page flows so we can swap mocks for real endpoints quickly.
