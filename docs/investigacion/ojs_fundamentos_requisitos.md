# Open Journal Systems (OJS): fundamentals and technical requirements, as of 31 October 2026

Reference server used for comparison: FreeBSD 14.0, Apache, PHP 8.3, MySQL 8.0.31, memory_limit 128M, upload 32M, post_max 64M, no Imagick.

Source caveat: forum.pkp.sfu.ca blocks automated fetches (bot protection). Claims citing forum threads come from search-result excerpts, not from reading the full thread, and are flagged "(excerpt)". PKP docs pages were read through a page summariser; composer.json, READMEs, release notes, git tags and the hosting price table were read as raw text.

## What is OJS, who maintains it, licence, adoption, and what does it do that a normal CMS does not?

### Takeaway
OJS is free, GPL-licensed software from the Public Knowledge Project (PKP) for running the whole editorial process of a scholarly journal, not only displaying its content. PKP claims 44,000+ journals in 148 countries.

### Cited Findings
- OJS is a scholarly publishing platform covering the "researcher-to-reader" workflow, from submission through peer review and production to publication. — [PKP OJS page](https://pkp.sfu.ca/software/ojs/)
- Released under the GNU General Public License; third parties may modify and redistribute it under that licence. — [OJS README, stable-3_5_0](https://raw.githubusercontent.com/pkp/ojs/stable-3_5_0/README.md)
- Adoption (PKP's own, self-reported figure): more than 44,000 journals in 148 countries, in 60+ languages. — [PKP OJS page](https://pkp.sfu.ca/software/ojs/)
- Workflow: guided author submission wizard; editors assign reviewers (anonymous or open), set due dates and get automated reminders; production stage with metadata; publication of articles and issues in PDF, HTML and other formats; distribution to discovery services and editorial statistics. — [PKP OJS page](https://pkp.sfu.ca/software/ojs/)
- Other features: several journals on one installation; multilingual publishing and metadata; deposit/indexing to Google Scholar, DOAJ, Crossref, DataCite, PubMed; preservation via PKP PN and CLOCKSS/LOCKSS; DOI, ORCID and ROR support; import/export tools; article-level statistics. — [PKP OJS page](https://pkp.sfu.ca/software/ojs/)
- 3.5 additions: reworked editorial dashboard with filtered views, role invitations, ORCID in core rather than a plugin, basic JATS support, Laravel components. — [OJS 3.5.0 release notes](https://github.com/pkp/ojs/blob/stable-3_5_0/docs/release-notes/README-3.5.0)

### Inferences
- A normal CMS publishes pages; OJS also manages confidential manuscripts, reviewer identities, role-based permissions, editorial decisions and an audit trail, and emits the scholarly metadata indexers need. That is also why it must send email reliably and protect a private files directory.
- The 44,000 figure counts PKP's own measure of usage and should not be read as 44,000 quality-vetted journals.

### Gaps
- No independent verification of the adoption figure was sought within this scope.

## What is the current stable/LTS version, the support policy, and which versions are end-of-life?

### Takeaway
Current line is OJS 3.5 LTS (supported to about Q2 2029). The newest build is 3.5.0-6, tagged on the research date, 31 Oct 2026, while the download page still showed 3.5.0-5. OJS 3.3 and 3.4 reach end of life around Q2 2027, and 3.2 and older are dead.

### Cited Findings
- Release notes in the repo: "OJS 3.5.0 LTS", git tag 3_5_0-6, release date 31 October 2026. — [Release notes 3_5_0-6](https://raw.githubusercontent.com/pkp/ojs/3_5_0-6/docs/release-notes/README-3.5.0)
- The download page, when read, listed 3.5.0-5 LTS (30 June 2026), 3.4.0-11 (18 Sept 2026) and 3.3.0-23 LTS (18 Sept 2026). — [PKP download page](https://pkp.sfu.ca/software/ojs/download/). Git tags 3_5_0-6 and 3_4_0-12 already exist. — [pkp/ojs tags](https://api.github.com/repos/pkp/ojs/tags?per_page=100)
- Policy: odd-numbered releases (3.3, 3.5) become LTS, supported at least 3 to 5 years, with direct LTS-to-LTS upgrade; older LTS is supported at least one year after the next LTS. Even-numbered releases are short-term support. — [PKP software releases](https://pkp.sfu.ca/software/releases/)
- Support table: 3.5 LTS supported, EOL Q2 2029; 3.4 STS supported, EOL Q2 2027; 3.3 LTS supported, EOL Q2 2027; 3.2 end of life since Q1 2023. — [PKP software releases](https://pkp.sfu.ca/software/releases/)
- Conflict on 3.3: the download page says supported "until at least January 1, 2027" — [download page](https://pkp.sfu.ca/software/ojs/download/); the releases page says Q2 2027 — [releases page](https://pkp.sfu.ca/software/releases/); the GitHub security page still shows stale estimates (3.5 "pre-release", 3.3 and 3.4 EOL 2026). — [pkp/ojs security](https://github.com/pkp/ojs/security)
- Conflict on 3.5 dates: 3.5.0 was announced in June 2025 — [PKP announcement](https://pkp.sfu.ca/2025/06/16/350-release-announcement/); it was designated LTS on 30 June 2026 — [PKP School post](https://pkp.sfu.ca/2026/07/02/re-launch-of-pkp-school-and-new-ojs-3-5-courses/). The releases table's "2026-07-01" therefore reflects LTS status, not first release.
- 3.1.x, 3.0.x, 2.x and 1.x are listed as not supported. — [pkp/ojs security](https://github.com/pkp/ojs/security)

### Inferences
- A new installation today should use the latest 3.5 LTS. 3.3 and 3.4 have under a year of life left, so starting on them means an imminent forced upgrade.
- 3.5.0-6 was only hours old at research time; check the download page for the official package and for any notice before installing.

### Gaps
- I did not find a published PKP announcement for 3.5.0-6.

## What are the exact requirements of the current version?

### Takeaway
PHP ^8.2; MySQL 5.7.22+, MariaDB (see conflict) or PostgreSQL 9.5+; Linux or BSD/Solaris/macOS/Windows; extensions including bcmath, gd, intl, mbstring, xml, zip, curl; private files directory outside the web root; scheduled tasks and job processing (built-in web runners exist); working SMTP with SPF and DMARC.

### Cited Findings
**PHP and OS**
- "PHP 8.2 or later"; OS: "Linux, or one of the following: BSD, Solaris, Mac OS X, Windows". — [README main](https://raw.githubusercontent.com/pkp/ojs/main/README.md)
- pkp-lib 3.5 composer.json: `"php": "^8.2"`, directly requires ext-bcmath, ext-gd, ext-intl, ext-mbstring, ext-xml, ext-zip, with `platform-check: true`. — [composer.json stable-3_5_0](https://raw.githubusercontent.com/pkp/pkp-lib/stable-3_5_0/composer.json)
- Full platform check in the README lists: bcmath, ctype\*, curl, dom, fileinfo, filter, ftp, gd, hash, intl, json, libxml, mbstring\*, openssl, pcre, phar, session, simplexml, spl, tokenizer, xml, xmlwriter, zip, zlib (\* can be provided by a Symfony polyfill). The note warns web and CLI PHP may use different php.ini files. — [README main](https://raw.githubusercontent.com/pkp/ojs/main/README.md)

**Database**
- MySQL 5.7.22+, PostgreSQL 9.5+, and MariaDB 10.3+ per the main-branch README — [README main](https://raw.githubusercontent.com/pkp/ojs/main/README.md); the stable-3_5_0 README says "MariaDB 4.1+" — [README stable-3_5_0](https://raw.githubusercontent.com/pkp/ojs/stable-3_5_0/README.md), as does the [admin guide](https://docs.pkp.sfu.ca/admin-guide/en/getting-started). 4.1 looks like a leftover from an old MySQL figure; treat 10.3+ as the safe value.

**Files**
- `files_dir` "must be outside of the web root". — [Admin guide, deploy](https://docs.pkp.sfu.ca/admin-guide/en/deploy) If in the web root, "anyone will be able to download submission files". — [Admin guide, security](https://docs.pkp.sfu.ca/admin-guide/en/securing-your-system)
- `public_files_dir` must be web-accessible, and relative to the base directory. — [config template](https://raw.githubusercontent.com/pkp/ojs/stable-3_5_0/config.TEMPLATE.inc.php)

**Scheduled tasks and jobs**
- 3.5 removed the Acron plugin and added a built-in task runner (`task_runner = On`, interval 60 s by default); for high-volume sites PKP recommends OS cron: `* * * * * php lib/pkp/tools/scheduler.php run`. — [Admin guide, scheduled tasks](https://docs.pkp.sfu.ca/admin-guide/en/deploy-scheduled-tasks); [release notes](https://raw.githubusercontent.com/pkp/ojs/3_5_0-6/docs/release-notes/README-3.5.0)
- Background jobs: built-in runner works without configuration but runs during web requests (no visits, no jobs), defaults 30 jobs, 30 s, 80% memory per request. Production recommendation is a worker (`php lib/pkp/tools/jobs.php work` under Supervisor) or cron (`jobs.php run`). — [Admin guide, jobs](https://docs.pkp.sfu.ca/admin-guide/en/deploy-jobs)

**Email and web**
- Most email is blocked unless the SMTP server has SPF and DMARC correctly configured; set `default_envelope_sender` on your domain, with `force_default_envelope_sender` and `force_dmarc_compliant_from` On. — [Admin guide, deploy](https://docs.pkp.sfu.ca/admin-guide/en/deploy)
- Options: SMTP preferred, sendmail fallback; PHPMailer described as last resort and insecure. Mailgun, SES, Postmark are not officially supported and need a plugin. DKIM is not mentioned. — [Admin guide, email](https://docs.pkp.sfu.ca/admin-guide/en/deploy-email)
- Also required/recommended: `base_url`, `allowed_hosts`, random `salt` and `api_key_secret`, SSL certificate with `force_ssl = On`, optional `restful_urls` with URL rewriting. — [Admin guide, deploy](https://docs.pkp.sfu.ca/admin-guide/en/deploy)
- The upgrade guide is written for a LAMP stack with Apache VirtualHost or `.htaccess`. — [Upgrade guide](https://docs.pkp.sfu.ca/dev/upgrade-guide/en/)

### Inferences
- Because `platform-check` is on, a missing required extension is likely to stop the application outright rather than degrade a feature. Verify with `composer -d lib/pkp check-platform-reqs` or the equivalent list against both web and CLI PHP.
- The web server is not named as a requirement in the README; Apache is simply the documented path.

### Gaps
- No official minimum for disk or RAM, and no official list of required Apache modules, was found. mod_rewrite is needed only by inference for `restful_urls`.

## Are PHP 8.3 and MySQL 8.0 supported? FreeBSD/Apache issues? Imagick? Memory and upload limits?

### Takeaway
On paper the reference server clears the version floors: PHP 8.3 and MySQL 8.0 fit, BSD is named, and Imagick is not a declared requirement. Check three things: ext-bcmath and the other extensions, limits (128M is adequate for normal running but not for upgrades, 32M caps file size), and the fact that FreeBSD 14.0 and MySQL 8.0 are themselves past end of life.

### Cited Findings
**PHP 8.3 / MySQL 8.0**
- PHP 8.3 satisfies `^8.2`. — [composer.json](https://raw.githubusercontent.com/pkp/pkp-lib/stable-3_5_0/composer.json) No official PKP statement listing tested PHP versions was found.
- Field reports (excerpt): upgrade to 3.5.0 on PHP 8.3 with MySQL 8.4; another on Debian 13 with PHP 8.4.14 and MariaDB 11.8.3. — [forum, performance thread](https://forum.pkp.sfu.ca/t/performance-issues-after-upgrading-to-ojs-3-5-0-0/96133). A university's OJS repo uses a PHP 8.3 image with external MySQL. — [Lehigh PR](https://github.com/lehigh-university-libraries/ojs/pull/17)
- Release notes record a fix for a TypeError on PHP 8.4, showing PHP 8.4 issues were still being fixed recently (#13139). — [Release notes 3_5_0-6](https://raw.githubusercontent.com/pkp/ojs/3_5_0-6/docs/release-notes/README-3.5.0)
- Older lines: 3.3 docs list only PHP 7.3 to 8.2, so 3.3 is not documented for PHP 8.3. — [3.3 README](https://raw.githubusercontent.com/pkp/ojs/stable-3_3_0/docs/README.md) 3.4's composer platform is PHP 8.0.2. — [3.4 composer.json](https://raw.githubusercontent.com/pkp/pkp-lib/stable-3_4_0/composer.json)
- bcmath: a user reported bcmath as unavailable on PHP 8.3 when upgrading; a community member replied it is available via distribution packages (excerpt). — [forum, 3.4 to 3.5 error](https://forum.pkp.sfu.ca/t/ojs-3-4-to-3-5-upgrade-error/96115)
- Known database bug: upgrade failing with SQL error 1064 on MariaDB/MySQL due to default-value quoting (#11529), listed in the release notes. — [Release notes](https://raw.githubusercontent.com/pkp/ojs/3_5_0-6/docs/release-notes/README-3.5.0)
- Performance: several users reported slow editorial pages after moving to 3.5.0; a fix for an N+1 query helped but one poster still found it slow (excerpt). — [forum, performance thread](https://forum.pkp.sfu.ca/t/performance-issues-after-upgrading-to-ojs-3-5-0-0/96133)

**Reference-server software lifecycle**
- FreeBSD 14.0 (releng/14.0) reached EOL on 30 Sept 2024; stable/14 runs to Nov 2028. MySQL 8.0 reached EOL on 30 Apr 2026, and its latest was 8.0.46, so 8.0.31 is many patches behind. PHP 8.3 has security support until 31 Dec 2027; latest 8.3.36. — [endoflife.date FreeBSD](https://endoflife.date/freebsd), [MySQL](https://endoflife.date/mysql), [PHP](https://endoflife.date/php)

**FreeBSD / Apache**
- BSD is named as a supported OS class. — [README](https://raw.githubusercontent.com/pkp/ojs/main/README.md) A search found no PKP thread about FreeBSD issues; this is absence of evidence, not proof of none.

**Imagick**
- Not in composer requirements, not in the platform check; `ext-gd` is required. — [composer.json](https://raw.githubusercontent.com/pkp/pkp-lib/stable-3_5_0/composer.json), [README](https://raw.githubusercontent.com/pkp/ojs/main/README.md) The config template has no ImageMagick or thumbnail setting. — [config template](https://raw.githubusercontent.com/pkp/ojs/stable-3_5_0/config.TEMPLATE.inc.php)

**Memory and upload**
- PKP's troubleshooting page says at least 16 MB, higher for upgrades. This figure reads as very old and should not guide 3.5. — [Admin guide, troubleshooting](https://docs.pkp.sfu.ca/admin-guide/en/troubleshooting)
- The upgrade guide runs `php -d memory_limit=2048M tools/upgrade.php upgrade` and says to raise PHP timeouts and memory during the upgrade. — [Upgrade guide](https://docs.pkp.sfu.ca/dev/upgrade-guide/en/)
- `job_runner_max_memory` defaults to 80% of the PHP limit, or a fixed value below `memory_limit`. — [Admin guide, jobs](https://docs.pkp.sfu.ca/admin-guide/en/deploy-jobs)
- Keep `job_runner_max_execution_time` (30) below PHP's `max_execution_time`. — [Admin guide, jobs](https://docs.pkp.sfu.ca/admin-guide/en/deploy-jobs)

### Inferences
| Item | Reference server | Verdict |
|---|---|---|
| PHP 8.3 | 8.3 | Meets ^8.2 (OJS 3.5). Would not be documented for 3.3 |
| MySQL 8.0.31 | 8.0.31 | Meets 5.7.22+, but MySQL 8.0 is EOL and this build is old |
| FreeBSD 14.0 | 14.0 | BSD allowed, but this release has been unpatched since 2024 |
| Apache | yes | Documented path; check .htaccess/mod_rewrite if pretty URLs are wanted |
| Imagick | absent | Appears fine; gd must be present |
| bcmath, intl, gd, zip, curl, etc. | unknown | **Must be checked**: the most likely blocker |
| memory_limit 128M | 128M | Probably fine for a small journal, but not officially specified; the CLI upgrade uses 2048M |
| upload 32M / post 64M | 32M/64M | Enough for typical manuscripts/PDFs; limits large galleys or video/datasets. post_max above upload is the correct relationship |
| files_dir outside web root | unknown | Requires a writable path above the document root. Shared hosts usually allow this, but it must be confirmed |
| Scheduled tasks | unknown | Built-in runner makes cron non-essential on a low-volume site |

- The uploaded-file ceiling in OJS is presumably set by PHP (`upload_max_filesize`, `post_max_size`), since the config template has no upload-size setting. I infer this; no PKP page says so.

### Gaps
- **No official recommended `memory_limit`, `upload_max_filesize`, `post_max_size` or `max_execution_time` for 3.5 was found.** Third-party guidance found was dated 2023 and targeted 3.3.
- Could not run a source-wide code search for Imagick (no GitHub CLI available), so optional use in code or plugins is not ruled out.
- No official statement that MySQL 8.0.x specifically is tested.

## How do installation and upgrade work? Is shell access needed?

### Takeaway
Installation works from a web form after unpacking a package, so FTP is feasible, and 3.5's built-in runners reduce the need for cron. Upgrades are documented only through the CLI, and PKP's guide assumes shell access. Treat shell access as strongly desirable, and effectively required for safe upgrades.

### Cited Findings
- Install: download the `.tar.gz`, unpack, create a files directory, open the site, complete the installer form pointing to that directory, log in, create the journal, run the Settings Wizard. — [Admin guide, getting started](https://docs.pkp.sfu.ca/admin-guide/en/getting-started)
- Upgrade guide steps: stop cron/workers; block visitors (OJS has no maintenance mode); back up DB, `files_dir`, public files, `config.inc.php`, `.htaccess`, plugins; test in a sandbox ("Do not skip this step"); swap in the new package; diff the config; `php tools/upgrade.php check`, then `upgrade`; test; reinstall plugins. — [Upgrade guide](https://docs.pkp.sfu.ca/dev/upgrade-guide/en/)
- The upgrade guide covers only the CLI route. OJS 2.x must step through 2.4.8-x and 3.2.1-x first. — [Upgrade guide](https://docs.pkp.sfu.ca/dev/upgrade-guide/en/)
- LTS-to-LTS upgrade 3.3 to 3.5 is direct. — [PKP releases](https://pkp.sfu.ca/software/releases/)
- Shared-hosting experience (excerpts): an old post says upgrade can be done without CLI — [forum](https://forum.pkp.sfu.ca/t/update-ojs-2-3-7-to-3/24165); a user could not find the database upgrade button on shared hosting — [forum](https://forum.pkp.sfu.ca/t/how-to-upgrade-ojs-on-shared-web-hosting/73878); another got a 500 after unpacking 3.5 over 3.3 via cPanel, and a moderator only pointed to the guide — [forum](https://forum.pkp.sfu.ca/t/how-to-upgrade-ojs-3-3-to-3-5-via-cpanel/97765).
- CLI-only admin tasks include merging spam users: `php tools/mergeUsers.php`. — [Admin guide, users](https://docs.pkp.sfu.ca/admin-guide/en/deploy-users)
- Some environments can't configure workers or cron, in which case the built-in runner is the fallback. — [Admin guide, jobs](https://docs.pkp.sfu.ca/admin-guide/en/deploy-jobs)

### Inferences
- FTP-only: initial install, plausible; routine running, plausible; upgrades and spam-account cleanup, risky or awkward. Upgrades can take long and exceed web timeouts; a CLI run avoids this.
- Without shell the sandbox rehearsal is much harder, and a failed upgrade is harder to recover.

### Gaps
- No current PKP-documented web-based upgrade procedure for 3.5 was found. Whether one still works in 3.5 is unverified.

## What are the main costs and operations: backups, upgrades, security incidents, spam, known attacks?

### Takeaway
The software is free, but the real cost is continuing administration: frequent patching, tested backups, email deliverability and spam control. OJS sites are an active target for gambling-spam compromises, typically on unpatched or poorly secured installs.

### Cited Findings
- Backups: automate DB and `files_dir`; daily for 7 days, weekly for 4 weeks, monthly for 12 months. — [Admin guide, security](https://docs.pkp.sfu.ca/admin-guide/en/securing-your-system)
- Other checklist items: restrict file permissions, SSL/TLS with renewal automation, server patching, antivirus on uploads, care with suspicious submissions. — [Admin guide, security](https://docs.pkp.sfu.ca/admin-guide/en/securing-your-system)
- Spam accounts: `require_validation = On`, reCAPTCHA or self-hosted ALTCHA, Honeypot plugin, disable self-registration by role; accounts cannot be deleted, only merged; `public_user_dir_size = 0` disables user uploads. — [Admin guide, users](https://docs.pkp.sfu.ca/admin-guide/en/deploy-users)
- Known attacks: Googlebot-only gambling spam ("cloaking"), so admins may not see it; poster advises cleaning files and upgrading (a community report, not a PKP advisory; excerpt). — [forum](https://forum.pkp.sfu.ca/t/possible-widespread-cloaking-attack-affecting-ojs-sites-googlebot-only-gambling-spam/97329)
- Other incident reports: gambling content and unauthorised control, with a PKP team member pointing to securing the installation (excerpt) — [forum](https://forum.pkp.sfu.ca/t/ojs-website-security-breach-unauthorized-control-and-gambling-content-injection/98477); recovery by rotating passwords and replacing core files with fresh copies (excerpt) — [forum](https://forum.pkp.sfu.ca/t/urgent-security-breach-hacking-incident-tadabbur-journal/97678).
- CVE-2024-56525: User-XML vulnerability before 3.3.0-21, linked to gambling hacks by a vendor that sells security services, so note its interest. — [OpenJournalTheme](https://openjournaltheme.com/user-xml-fatal-vulnerabilities-for-ojs-omp-ops-3-3-0-21-cve-2024-56525/)
- CVE-2024-24512: XSS in OJS 3.4 (aggregator summary). — [Feedly](https://feedly.com/cve/CVE-2024-24512)
- CVE-2026-111609: cross-journal subscription IDOR in OJS through 3.5.0-5, CVSS 5.1, requiring high privileges, published 16 Oct 2026. — [VulnCheck](https://www.vulncheck.com/advisories/pkp-open-journal-systems-through-3.5.0-5-cross-journal-subscription-idor-via-updatesubscription) A database snippet suggests versions before 3.5.0-6 are affected, unconfirmed by PKP. — [search result, Vulners](https://vulners.com/vulnrichment/VULNRICHMENT:CVE-2026-111609)
- 3.5.0-x release notes include hardening: restricting image upload types, checking cover images, and a login CSRF fix (#13335, #13344, #13512, #11978). — [Release notes](https://raw.githubusercontent.com/pkp/ojs/3_5_0-6/docs/release-notes/README-3.5.0)
- PKP disclosure: private report, fix target within a week, private mailing-list notice, about 2 weeks before public disclosure, then a notice on the download page. Its GitHub advisories page shows none published. — [pkp/ojs security](https://github.com/pkp/ojs/security)

### Inferences
- Budget for: monthly checks, upgrades with a sandbox rehearsal each time a security build appears, and restore tests. An unattended OJS is the main risk.
- Because cloaking shows spam only to Googlebot, monitoring should include Google Search Console or a `site:` search, not only viewing the site.
- Joining PKP's security notification list is worthwhile, since private notice comes before disclosure.

### Gaps
- No reliable count of compromised OJS sites exists in what I found; "widespread" comes from community and vendor sources.
- No staff-hour or annual self-hosting cost figures were found.

## What is the PKP Publishing Services hosted option, and its pricing?

### Takeaway
PKP|PS hosts OJS directly, from $925/journal/year for Basic to $3,000 for Enterprise, with hosting, upgrades, backups and security included. No low-income discount exists.

### Cited Findings
Price table, columns in page order (undated; the FAQ states USD for the Archived plan). — [PKP journal hosting](https://pkp.sfu.ca/hosting-services/hosting/journals/), [FAQ](https://pkp.sfu.ca/hosting-services/hosting/hostingfaq/)

| Option | Price per journal/year | Summary |
|---|---|---|
| Self-hosting | Free | Software, docs, forum support |
| Basic | $925 | Shared installation; default plugins and themes only; no one-on-one training; no full migration (manual Quick Submit only) |
| Professional | $1,650 | Standalone installation; custom plugins and theme; initial training; migration |
| Enterprise | $3,000 | Adds SSH and MySQL access, SSO, ongoing training, Crossref membership, DOAJ application support |
| Institutional | Quote | 3+ journals; landing page; free student journals with 5+ active |
| Archived | $450 | Inactive journals; no support |

- Hosted plans include installation, upgrades, backups, security, SSL, unlimited storage and publications. — [PKP journal hosting](https://pkp.sfu.ca/hosting-services/hosting/journals/)
- Older figure: a PKP page gave $850 for Basic, apparently superseded. — [PKP post, undated in excerpt](https://pkp.sfu.ca/?p=1918)
- Discounts for 5+, 10+, 20+ journals; none based on financial resources. Crossref sponsorship is available in eligible low-income countries. — [FAQ](https://pkp.sfu.ca/hosting-services/hosting/hostingfaq/)
- Servers in Canada; on-site and off-site backups; full data handover on cancellation; payment by PayPal, bank transfer, card, cheque; training in English, Spanish, Portuguese, Russian. — [FAQ](https://pkp.sfu.ca/hosting-services/hosting/hostingfaq/)

### Inferences
- The price-to-plan mapping comes from the order of six header columns and six price cells in the page's raw text; it is unambiguous there but was not visually confirmed in a browser.
- Downgrade from standalone to Basic is not possible, so the plan choice matters. — [FAQ](https://pkp.sfu.ca/hosting-services/hosting/hostingfaq/)

### Gaps
- The FAQ does not mention sanctions or country restrictions. Whether PKP (a Canadian university-based operation) can serve or bill a specific country, and whether payment rails work there, must be asked directly. No answer was found here.
