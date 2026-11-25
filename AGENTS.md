<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

- Keep mentor directory enrichment, filtering and request validation in a browser-safe data module; this preserves the original shared homepage examples.
- Authenticated mentorship requests persist through a server function that revalidates the shared request schema; fictional mentors are never contacted.
- Account assessments persist atomically through a database function that calculates scores from quiz answers; guest browser results remain a clearly labeled local-only demo. Self-reported skills stay lower-weighted.
- Lovable Cloud provides the backend; use its generated clients and TanStack Start server functions so data access stays inside the project's supported architecture.

- Public directory pages use shared loader/query options with anonymous read-only access; private queries use authenticated server functions keyed by account identity to prevent cross-user caching.
- One root account provider owns the auth subscriber and cache teardown; public pages offer inline sign-in notices rather than exposing private records to visitors.
