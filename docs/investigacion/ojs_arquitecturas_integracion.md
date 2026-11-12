# Architectures for a scientific journal website integrated with OJS (as of 31 October 2026)

Evidence labels used below:
- **[code]** means read from PKP source code on the named branch.
- **[docs]** means PKP or vendor documentation.
- **[third-party]** means a non-PKP source.
- **[snippet]** means seen only in a search-result excerpt. forum.pkp.sfu.ca blocked direct fetching with a bot check, so all forum claims are snippet-level and need checking in a browser.

Nothing here was tested against a live OJS instance.

## Version baseline: which OJS applies?

### Takeaway
A new journal in late 2026 should assume OJS 3.5 LTS. 3.3 is near its support floor, and 3.6 is not released. The patch number for 3.5 differs between sources.

### Cited Findings
- The PKP download page lists 3.5.0-5 (LTS, 30 June 2026), 3.4.0-11 (stable, not labelled LTS, 18 Sept 2026) and 3.3.0-23 (LTS, supported until at least 1 Jan 2027) — [PKP download page](https://pkp.sfu.ca/software/ojs/download/)
- **Conflict:** the release notes on the stable branch already describe tag 3_5_0-6, dated 31 Oct 2026, which the download page does not list yet (it may simply not have updated) — [3.5.0 release notes](https://raw.githubusercontent.com/pkp/ojs/stable-3_5_0/docs/release-notes/README-3.5.0)
- The GitHub 3.6 milestone is due 31 Dec 2026, 66% complete in the excerpt seen [snippet] — [pkp-lib milestones](https://github.com/pkp/pkp-lib/milestones?direction=asc&sort=due_date&state=open)
- A third-party blog says the next LTS will be 3.7, not 3.6, that a 3.7 milestone was created on 28 Sept 2026, and that 3.6 may slip to early 2027. No PKP confirmation found [third-party] — [OJSBR](https://ojsbr.com/articles/news_ojs36)
- PKP describes 3.6 as adding continuous publication and enhanced article versioning — [PKP announcement](https://pkp.sfu.ca/2025/10/03/webinar-coming-in-ojs-3-6/)

### Inferences
- Target 3.5 LTS. Anything built on the API or theme layer should be retested before moving to 3.6 or 3.7.

### Gaps
- No official PKP release date for 3.6 was found.
- PHP and database requirements for 3.5 were not retrieved (the admin-guide URL tried returned 404).

## Option A: OJS as the whole site with a custom theme

### Takeaway
This is the only option where every indexing function keeps working with no extra work. A theme can change almost all of the public HTML, CSS and JS, but it remains PHP/Smarty inside OJS, and overrides must be maintained across upgrades.

### Cited Findings
- The theming guide covers OJS 3.0+ and has sections on LESS/CSS, Smarty templates, child themes, the Theme API and Theme Options API, and backend theming. Its example themes are Default, Bootstrap3, Classic, Health Sciences, Immersion, Manuscript and Pragma — [PKP Theming Guide](https://docs.pkp.sfu.ca/pkp-theming-guide/en/)
- A child theme is a regular theme plugin: a PHP class extending `ThemePlugin`, with `setParent()` called in `init()` — [Child themes](https://docs.pkp.sfu.ca/pkp-theming-guide/en/child-themes)
- Template lookup order is current theme, then parent theme, then application templates, then `lib/pkp/templates/`. To override, copy the file to the same relative path; uncopied templates still come from the parent — [Child themes](https://docs.pkp.sfu.ca/pkp-theming-guide/en/child-themes)
- LESS variables can be redefined (for example `@primary`), and `modifyStyle()` with `addLess` compiles into the parent stylesheet — [Child themes](https://docs.pkp.sfu.ca/pkp-theming-guide/en/child-themes)
- The Theme API offers `addStyle`, `modifyStyle`, `removeStyle`, `addScript`, `modifyScript`, `removeScript`, `addMenuArea` and `removeMenuArea`. Style contexts include `frontend`, `backend` and `htmlGalley`. Styles and scripts only appear where templates use `{load_stylesheet}` and `{load_script}` — [Theme API](https://docs.pkp.sfu.ca/pkp-theming-guide/en/theme-api)
- 3.5 release notes list few theme changes: base colour validation in the default theme (#11974) and a fatal error after upgrade when the theme plugin is missing (#11396) — [3.5.0 release notes](https://raw.githubusercontent.com/pkp/ojs/stable-3_5_0/docs/release-notes/README-3.5.0)
- Gallery compatibility (my parse of plugins.xml, 31 Oct 2026): Bootstrap3, Classic, Health Sciences, Manuscript, Immersion and Pragma all list 3.3, 3.4 and 3.5 — [PKP plugin gallery XML](https://pkp.sfu.ca/ojs/xml/plugins.xml)

### Inferences
- A theme can reproduce the look of an external design, but React components would not run as server-rendered pages. Any React would be client-side JS added with `addScript`.
- Copied templates are the upgrade risk. The guide does not say what happens when a parent template changes, so diff overrides at each upgrade.
- Non-journal institutional pages would have to live in OJS static pages or custom templates. This was not researched in depth.

### Gaps
- A list of which Smarty variables or templates changed between 3.3, 3.4 and 3.5 was not found.
- The theming guide is not clearly versioned per release. Its sub-pages state few version limits.

## Option B: headless or custom front-end on the OJS REST API

### Takeaway
On 3.5 the REST API cannot be read anonymously, including for published issues and articles. A headless front-end therefore needs a token held on a server or at build time, or a custom plugin endpoint. I found no production journal running this way, and replacing the OJS public pages would remove several signals indexers use.

### Cited Findings
**Authentication**
- 3.5 [code]: the issues controller requires `has.user` and `has.context`, and a role authorizer limited to manager, sub-editor, assistant, reviewer and author — [IssueController.php](https://raw.githubusercontent.com/pkp/ojs/stable-3_5_0/api/v1/issues/IssueController.php)
- 3.5 [code]: the `has.user` middleware returns HTTP 401 when there is no user — [HasUser.php](https://raw.githubusercontent.com/pkp/pkp-lib/stable-3_5_0/classes/middleware/HasUser.php)
- 3.5 [code]: GET submissions, a single submission and its publications all sit under the same middleware and five roles — [PKPSubmissionController.php](https://raw.githubusercontent.com/pkp/pkp-lib/stable-3_5_0/api/v1/submissions/PKPSubmissionController.php)
- 3.4 [docs, snippet]: only authenticated users can access the endpoints, by cookie or API token in an Authorization header. The page itself would not load through the fetch tool, so this comes from a search excerpt — [OJS 3.4 API docs](https://docs.pkp.sfu.ca/dev/api/ojs/3.4)
- 3.3 [code]: the issues handler's role list has no public role, but the parent handler was not read, so anonymous blocking is not confirmed from code — [IssueHandler.inc.php](https://raw.githubusercontent.com/pkp/ojs/stable-3_3_0/api/v1/issues/IssueHandler.inc.php)
- 3.1 [snippet, old]: a user reported 404 on API requests when not logged in — [PKP forum](https://forum.pkp.sfu.ca/t/ojs-3-1-use-of-the-api-key/38594)
- 3.5 [third-party]: a README tested on 3.5.0-5 states there is "no anonymous read access" and that the account needs a journal role — [ojs-mcp](https://github.com/thuanhuynhh/ojs-mcp)

**Are published items readable with a key?**
- Yes for issues, on 3.3 and 3.5 [code]: non-admins are forced to published issues, and asking for unpublished ones returns 403 — [3.5 IssueController](https://raw.githubusercontent.com/pkp/ojs/stable-3_5_0/api/v1/issues/IssueController.php); [3.3 IssueHandler](https://raw.githubusercontent.com/pkp/ojs/stable-3_3_0/api/v1/issues/IssueHandler.inc.php)
- Submissions are a workflow endpoint, 3.5 [code]: only site admin and manager see unassigned submissions; others are limited to their assignments — [PKPSubmissionController.php](https://raw.githubusercontent.com/pkp/pkp-lib/stable-3_5_0/api/v1/submissions/PKPSubmissionController.php)

**Configuration pitfalls**
- Without `api_key_secret` in config.inc.php, tokens fail with a 500. On Apache the `Authorization` header must be forwarded to PHP or every token request gets 401 [third-party, 3.5] — [ojs-mcp](https://github.com/thuanhuynhh/ojs-mcp)
- HTTP Basic auth on a site made API calls return 403 on 3.3.0-9/-10 — [pkp-lib #7751](https://github.com/pkp/pkp-lib/issues/7751)
- 3.5 moved API routing from Slim to Laravel (#7698) and removed the controller override mechanism (#11609), so older API extensions need rework — [3.5.0 release notes](https://raw.githubusercontent.com/pkp/ojs/stable-3_5_0/docs/release-notes/README-3.5.0)
- 3.5 lets plugins add custom API endpoints (#12050), extend entity endpoints (#9434) and attach authorization policies (#11631) — [3.5.0 release notes](https://raw.githubusercontent.com/pkp/ojs/stable-3_5_0/docs/release-notes/README-3.5.0)
- Example of plugin-level endpoints — [apiExample](https://github.com/touhidurabir/apiExample)

**Real examples**
- The only consumer found is a PHP sample app needing a token, install URL, journal name and API version. It is a demo, not a live journal — [ojs3-rest-api-webapp-sample](https://github.com/kaschioudi/ojs3-rest-api-webapp-sample)

**What is lost if OJS public pages are replaced**
- The Google Scholar plugin attaches to `ArticleHandler::view` (the OJS landing page) and adds tags through `TemplateManager::addHeader()`. The API does not emit them — [GoogleScholarPlugin.php, main branch](https://raw.githubusercontent.com/pkp/googleScholar/main/GoogleScholarPlugin.php)
- Scholar requires a PDF to be in the same subdirectory as the HTML abstract when linked by `citation_pdf_url` or `DC.identifier` — [Scholar inclusion guidelines](https://scholar.google.com/intl/en/scholar/inclusion.html)
- Scholar warns that JavaScript navigation hinders discovery, and asks for 301 redirects per article URL on a site move — [Scholar inclusion guidelines](https://scholar.google.com/intl/en/scholar/inclusion.html)
- EIFL says the standard OJS URL structure works well and that customised URLs slow indexing — [EIFL checklist v4, 2026](https://www.eifl.net/system/files/resources/202602/ojs_checklist_updated_2026.pdf)
- OJS logs usage from "requests to view and download public files" that it serves (3.3 to 3.5) — [Admin guide: statistics](https://docs.pkp.sfu.ca/admin-guide/en/statistics)

### Inferences
- A token cannot go in browser code, because it belongs to a role-bearing account. Fetch it at build time or through a server proxy.
- A custom plugin endpoint could expose published data without a login on 3.5. The base controller only adds its role policy when a user is present ([PKPBaseController.php](https://raw.githubusercontent.com/pkp/pkp-lib/stable-3_5_0/classes/core/PKPBaseController.php)), which suggests this is possible, but it is untested. It would also be custom code to maintain.
- The safest headless variant keeps OJS article and galley pages live and canonical, using the custom site only for browsing and marketing, with article links pointing to OJS. Scholar's same-subdirectory rule is a strong reason not to host abstracts on one host and PDFs on another.
- Page views on a custom front-end will not count in OJS statistics unless the reader reaches an OJS-served page or file.

### Gaps
- **Unverified:** the exact 3.3 and 3.4 anonymous behaviour, from a live request. Test `GET /api/v1/issues` logged out on the target instance.
- **Unverified:** CORS behaviour of the API. No source found.
- **Unverified:** whether galley file downloads work for an anonymous visitor via API. Normal public galley URLs should still work, but this was not confirmed from a source.
- No live, production headless OJS journal was found. This is absence of evidence from a small search, and the forum could not be browsed.
- The full OpenAPI pages for 3.4 and 3.5 did not render through the fetch tool, so a complete endpoint list is missing (only issues, submissions and base middleware were read).

## Option C: WordPress institutional site plus OJS in a subdomain or subfolder

### Takeaway
This separation leaves OJS intact, so indexers are unaffected, as long as OJS keeps serving its own article pages. I found no maintained WordPress plugin that displays OJS articles or harvests OAI-PMH, so that link would be custom code. SSO is possible through OpenID Connect on the OJS side.

### Cited Findings
- WordPress support threads report no plugin harvesting OAI-PMH into posts — [WordPress.org thread](https://wordpress.org/support/topic/oai-pmh)
- The kennisnet WordPress plugin does the reverse: it serves WordPress content as OAI-PMH, so it is a provider and not a harvester [snippet, via a GitHub mirror] — [WP-plugin-OAIPMH mirror](https://gh.r-mj.com/kennisnet/WP-plugin-OAIPMH)
- Omeka has a true OAI-PMH harvester, but it does not run on WordPress — [Omeka OaipmhHarvester](https://github.com/omeka/plugin-OaipmhHarvester)
- The OJS OpenID plugin supports Google, Apple ID, Microsoft Azure AD and ORCID, and custom OIDC providers such as Keycloak — [EIFL checklist v4, 2026](https://www.eifl.net/system/files/resources/202602/ojs_checklist_updated_2026.pdf)
- Gallery compatibility: `openid` lists 3.3, 3.4 and 3.5; `shibboleth` lists 3.3 only — [plugins.xml](https://pkp.sfu.ca/ojs/xml/plugins.xml)
- The same plugin can generate OJS API keys for external services [snippet] — [PsychOpen news](https://www.psychopen.eu/news/article/single-sign-on-plugin-developed-for-the-open-journal-system/)
- For subfolder or proxy setups, `base_url[index]` and `base_url[journalPath]` overrides are used to force correct URLs [snippet, old versions] — [forum: reverse proxy](https://forum.pkp.sfu.ca/t/ojs-3-behind-reverse-proxy-how-to-achieve/25055); [forum: base_url docs](https://forum.pkp.sfu.ca/t/documentation-on-base-url-setting/66674)
- A Docker/Apache subpath proxy user reported CSS and JS going to the domain root and returning 404, with no confirmed fix seen [snippet] — [forum thread](https://forum.pkp.sfu.ca/t/base-url-issue-when-deploying-ojs-using-docker-and-apache/77381)
- All OJS requests, API or not, are expected to pass through its `index.php` [snippet] — [forum: RESTful URLs](https://forum.pkp.sfu.ca/t/restful-urls-on-ojs3/51525)

### Inferences
- A subdomain (`revista.example.org`) looks simpler than a subfolder, because subpath proxying has reported problems and needs URL overrides. Sources are old, so test on 3.5.
- Shared login would mean an identity provider such as Keycloak, with WordPress also configured as an OIDC client. Editors and authors could then log into both. No guide for this exact pairing was found.
- To show recent articles in WordPress, a small custom script reading OJS `/oai` is the free-of-token route. OJS's RSS feed plugin may also serve (not verified).

### Gaps
- The wordpress.org plugin directory was not exhaustively searched, so a small plugin may exist. Scholar guidelines do not address subdomains.
- **Unverified:** subfolder behaviour on 3.5 specifically. All evidence is older forum excerpts.

## Option D: OAI-PMH harvesting into a static or custom site

### Takeaway
OAI-PMH is the one public read interface that needs no token, which makes it the cleanest source for a static listing of published articles. It supplies metadata for showing and linking articles, and should not replace OJS article pages for Scholar.

### Cited Findings
- Each journal has a public OAI interface at `/oai`, toggled by the `oai` setting in config.inc.php, and can be checked with the BASE and OAI-PMH validators — [EIFL checklist v4, 2026](https://www.eifl.net/system/files/resources/202602/ojs_checklist_updated_2026.pdf)
- 3.5 [code]: verbs implemented are `GetRecord`, `Identify`, `ListIdentifiers`, `ListMetadataFormats`, `ListRecords`, `ListSets`, with no auth in that class — [OAI.php](https://raw.githubusercontent.com/pkp/pkp-lib/stable-3_5_0/classes/oai/OAI.php)
- REST needs authentication and OAI does not [snippet] — [forum thread](https://forum.pkp.sfu.ca/t/how-to-harvest-metadata-of-individual-issue-with-oai/60240)
- A known failure mode is OAI returning `noRecordsMatch` while the site contains articles [snippet] — [EIFL 2023 checklist](https://eifl.net/system/files/resources/202312/ojs_checklist_updated_2023fin.pdf)
- A resumption-token bug was reported in the tracker (title only read, status not checked) — [pkp-lib #6962](https://github.com/pkp/pkp-lib/issues/6962)
- Scholar needs each paper on its own URL, with a full text or abstract visible with no click or login, and rejects pages with bare bibliographic data and no abstract — [Scholar inclusion guidelines](https://scholar.google.com/intl/en/scholar/inclusion.html)
- Listings must be reachable: every article within ten simple HTML links of the homepage, plus date browsing where JavaScript navigation is used — [Scholar inclusion guidelines](https://scholar.google.com/intl/en/scholar/inclusion.html)

### Inferences
- Harvest at build time or on a schedule, render list and issue pages, and link each article to its OJS landing page. Do not emit duplicate `citation_*` tags on the static copy, since two URLs for one paper could confuse indexing (reasoned, no source).
- New articles appear only after a rebuild, so publication needs a scheduled or triggered rebuild.
- `oai_dc` is flat, so issue grouping and galley links may need parsing. Confirm with a real `ListRecords` response.

### Gaps
- Which formats a default 3.5 install exposes was not read from a live endpoint. Check with `ListMetadataFormats`.
- No real journal site built this way was found.

## Which functions must stay on OJS for indexers?

### Takeaway
All of them should stay on OJS. A separate site can add discovery pages, but OJS should remain the canonical home of article pages, files, OAI, DOI deposit and statistics.

### Cited Findings
| Function | Where it lives | Version | Source |
|---|---|---|---|
| OAI-PMH | Generated by OJS at `/oai` | Checklist covers current OJS; code read on 3.5 | [EIFL](https://www.eifl.net/system/files/resources/202602/ojs_checklist_updated_2026.pdf); [OAI.php](https://raw.githubusercontent.com/pkp/pkp-lib/stable-3_5_0/classes/oai/OAI.php) |
| Google Scholar tags | Added only on the OJS landing-page view; plugin ships with OJS; skipped when the URL has a `version` argument | Main branch code; not tagged to a version | [GoogleScholarPlugin.php](https://raw.githubusercontent.com/pkp/googleScholar/main/GoogleScholarPlugin.php); [EIFL](https://www.eifl.net/system/files/resources/202602/ojs_checklist_updated_2026.pdf) |
| Required Scholar tags | Title, at least one author, date; journal name, volume, issue, first page for journals | Not version-specific | [Scholar](https://scholar.google.com/intl/en/scholar/inclusion.html) |
| JATS | Basic JATS support new in 3.5 (#10458, #10434, #7505); OAI JATS plugin exposes existing XML through OAI | 3.5; plugin 3.3–3.5 | [Release notes](https://raw.githubusercontent.com/pkp/ojs/stable-3_5_0/docs/release-notes/README-3.5.0); [oaiJats](https://github.com/pkp/oaiJats) |
| DOI deposit | DOI manager, Crossref plugin, DataCite and DOAJ handling in OJS | 3.5 | [Release notes](https://raw.githubusercontent.com/pkp/ojs/stable-3_5_0/docs/release-notes/README-3.5.0) |
| Usage statistics | JSON logs in `usageStats/usageEventLogs`, processed daily by scheduled task and jobs, with bot and double-click filtering | 3.3–3.5 docs | [Admin guide](https://docs.pkp.sfu.ca/admin-guide/en/statistics) |
| COUNTER | R5 TSV under Statistics > Counter R5, also via REST; COUNTER 4 reports also listed | Docs cover 3.3–3.5, unclear per version | [Admin guide](https://docs.pkp.sfu.ca/admin-guide/en/statistics) |

- Apache logs can backfill gaps with `convertApacheAccessLogFile.php`, but `base_url` must match the log URLs and reprocessing replaces that month's metrics — [Admin guide](https://docs.pkp.sfu.ca/admin-guide/en/statistics)
- Statistics depend on working scheduled tasks — [Admin guide](https://docs.pkp.sfu.ca/admin-guide/en/statistics)
- A forum user says OJS 3.4 should support COUNTER 5, which is not an official statement. A plugin guide says reports alone do not make a journal COUNTER-compliant [snippet, third-party] — [forum](https://forum.pkp.sfu.ca/t/is-current-ojs3-compliant-to-counter-5-standard/69411); [Openjournaltheme](https://openjournaltheme.com/ojs-plugin-ecosystem-guide-best-plugins/)
- Scholar tags must match the PDF in names and order, and not be duplicated across languages — [EIFL](https://www.eifl.net/system/files/resources/202602/ojs_checklist_updated_2026.pdf)

### Inferences
- Crossref DOIs should resolve to the OJS article page, which is the page carrying the tags and the logged usage. A DOI could technically target another URL, but that would split those signals.
- Because tags are queued through page headers, a custom theme must keep the header output in its templates. Check by viewing the source for `citation_` after any theme change, as EIFL recommends.

### Gaps
- **Unverified:** an official PKP statement on COUNTER R5 certification.
- I found no official list of which DOAJ or other indexer signals depend on OJS pages specifically. DOAJ's own rules were not read.

## Can a Lovable/React/TanStack site work with this, and how would it be deployed?

### Takeaway
Yes, as a separate front-of-house site next to OJS, not as a replacement for OJS. This project is SSR on Nitro with a Cloudflare default target. Serving it from Apache would require turning on static prerendering, with OJS data fetched at build time and no server functions.

### Cited Findings
- This repo uses `@lovable.dev/vite-tanstack-config`, whose comment says it includes Nitro "build-only using cloudflare as a default target", plus a custom SSR entry at `src/server.ts` — `C:/Users/Alpha/Documents/GitHub/ferreya-ferreter-a/vite.config.ts` (read locally)
- Vercel documents that Lovable projects use TanStack Start and Nitro, with zero-config detection needing `@lovable.dev/vite-tanstack-config` ^2.6.2 or higher — [Vercel: Lovable](https://vercel.com/docs/integrations/lovable?from=graph)
- A third-party guide says the Lovable stack is server-rendered and not a static site, and that projects can push to your own GitHub [third-party] — [SnapDeploy](https://snapdeploy.dev/blog/deploy-lovable-app-own-hosting-2026)
- TanStack static prerendering outputs one HTML file per page and is meant to allow hosting without SSR support. It is off by default — [Static prerendering](https://tanstack.com/start/latest/docs/framework/react/guide/static-prerendering)
- With `crawlLinks` on, linked pages are also prerendered. Parameterised routes such as `/users/$userId` are skipped by automatic discovery unless linked or listed in `pages` — [Static prerendering](https://tanstack.com/start/latest/docs/framework/react/guide/static-prerendering)
- SPA mode's initial HTML lacks rendered content until JS runs, and TanStack lists "Less SEO friendly" as a caveat. It uses a `/_shell.html` shell with host redirects, and server functions still need a server — [SPA mode](https://tanstack.com/start/latest/docs/framework/react/guide/spa-mode)
- TanStack hosting docs describe Nitro as an agnostic layer for many hosts, including a Cloudflare Workers path — [Hosting](https://tanstack.com/start/latest/docs/framework/react/guide/hosting)
- OJS is deployed with PHP/Apache- or nginx-style `index.php` routing [snippet] — [forum: nginx](https://forum.pkp.sfu.ca/t/ojs3-on-nginx-php7-0-fpm/28590)

### Inferences
| Deployment | Works? | Notes |
|---|---|---|
| Prerendered static files on Apache beside OJS | Yes in principle | Needs prerender config; article lists must be fetched at build from OAI or token-based API; rebuild on each issue; no server functions |
| SPA shell on Apache | Technically yes | Needs `.htaccess` rewrite to the shell (my inference; no source shows Apache config). Poor for discovery, so only for non-scholarly pages at most |
| Node (Nitro) on own server, or Cloudflare/Lovable hosting, with OJS on its own subdomain | Yes | Can hold a token server-side and fetch live, adds a running service, and the OJS server must be reachable from there |
| Inside OJS | No | Theme layer is PHP/Smarty; React can only be added as client JS |

- Mixing paths on one domain requires rules so OJS's `index.php` routes do not collide with the static site. A subdomain avoids this.
- Prerendering this repo as is was not tried. `src/server.ts` and any server-only code would need checking.
- Under the user's rule in `C:\Users\Alpha\.claude\CLAUDE.md`, any step that uses Lovable agent messages, publishing, Cloud, or a recurring job needs her explicit yes first. A rebuild schedule on Lovable's side would fall under that.

### Gaps
- I found no official Lovable documentation on static export or self-hosting. Check docs.lovable.dev.
- Whether `@lovable.dev/vite-tanstack-config` passes through prerender options cleanly is unverified.
- Hosting and connectivity constraints specific to Cuba were not in scope and were not researched.

## Useful OJS plugins

### Takeaway
Most key plugins list 3.5 in the gallery, and three important ones are absent because the function appears to have moved or the plugin lags: ORCID, JATS Template and Lens. Check the gallery inside the actual install before committing.

### Cited Findings
Gallery compatibility is from my parse of [plugins.xml](https://pkp.sfu.ca/ojs/xml/plugins.xml) on 31 Oct 2026. It reflects listings, not tests. The file has 101 plugins, 59 listing 3.5.

| Plugin | 3.3 | 3.4 | 3.5 | Note |
|---|---|---|---|---|
| PKP PN (`pln`) | Yes | Yes | Yes | Preservation network |
| OAI JATS (`oaiJats`) | Yes | Yes | Yes | Exposes existing JATS; README says 3.4.x, branches go to 3.5 ([repo](https://github.com/pkp/oaiJats)) |
| JATS Template (`jatsTemplate`) | Yes | Yes | **Not listed** | Generates basic fallback JATS; 3.5 has basic JATS in core |
| ORCID Profile (`orcidProfile`) | Yes | Yes | **Not listed** | 3.5 notes list ORCID integration as a feature (#10796, #10792), so it looks core there |
| Lens viewer (`lensGalleyBits`) | Yes | No | **Not listed** | Described as a viewer for monographs and articles |
| Inline HTML Galley | Yes | No | Yes | |
| Crossref Reference Linking | Yes | Yes | Yes | Requires Crossref DOIs and deposited references ([EIFL](https://www.eifl.net/system/files/resources/202602/ojs_checklist_updated_2026.pdf)) |
| OpenAIRE | Yes | Yes | Yes | Extends OAI per OpenAIRE guidelines v4 ([EIFL](https://www.eifl.net/system/files/resources/202602/ojs_checklist_updated_2026.pdf)) |
| OpenID | Yes | Yes | Yes | SSO |
| Texture | Yes | No | Yes | JATS editor |
| Scopus/Crossref Citations | Yes | Yes | **Not listed** | |
| Cariniana Preservation | Yes | Yes | Yes | |
| Portico, Hypothesis, Piwik (Matomo) | | | Yes | 3.5 listing confirmed, others not tabulated |

- **Crossref:** the plugin is updated in 3.5 notes (#10659, Crossref 5.4.0) but is not a gallery entry, so it appears to be bundled — [Release notes](https://raw.githubusercontent.com/pkp/ojs/stable-3_5_0/docs/release-notes/README-3.5.0)
- **DOAJ:** 3.5 fixes stop deposits dropping page numbers or affiliations (#13599) — [Release notes](https://raw.githubusercontent.com/pkp/ojs/stable-3_5_0/docs/release-notes/README-3.5.0)
- **ORCID on 3.5:** note #13283, "Restore degraded ORCID functionality in 3.5", is fixed only in 3.5.0-6. ORCID credentials moved from the config file into the database — [Release notes](https://raw.githubusercontent.com/pkp/ojs/stable-3_5_0/docs/release-notes/README-3.5.0)
- **JATS Template:** an issue reports abstract, DOI, issue and volume missing from its output, with some metadata handled in OAI JATS instead [snippet] — [pkp-lib #11200](https://github.com/pkp/pkp-lib/issues/11200)
- **Google Scholar and Dublin Core Indexing:** integrated in the install package — [EIFL](https://www.eifl.net/system/files/resources/202602/ojs_checklist_updated_2026.pdf)
- A third-party compatibility matrix exists — [Lepidus plugin list](https://pluginspkp.lepidus.com.br/en/)

### Inferences
- Plan on 3.5.0-6 or later if ORCID matters, once it is confirmed released.
- HTML galleys remain possible on 3.5 through Inline HTML Galley. Lens should not be assumed on 3.5.

### Gaps
- **Unverified:** whether a bundled Lens plugin ships with 3.5 (release notes do not mention it; the bundled plugin folder was not inspected).
- **Unverified:** 3.5 bundled status of Crossref, DOAJ, HTML Article Galley and PDF.js viewer. They were not found as gallery entries under my search, and absence from the gallery does not prove they are bundled.
- PKP PN's current operating terms and eligibility were not read. EIFL only lists it as recommended.
