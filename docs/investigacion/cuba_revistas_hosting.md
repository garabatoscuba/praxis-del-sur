# Cuban scientific journals on .cu: platforms, rules and hosting limits (as of 31 October 2026)

Evidence labels used throughout:
- **[Observed]**: I measured it on 2026-10-31 with curl, DNS or a public API. These are single measurements from one outside-Cuba vantage point, not uptime statistics. Reachability from inside Cuba was not tested.
- **[Primary]**: official or rule-making text, or the provider's own page.
- **[Secondary]**: press, journal letter, aggregator or search result.
- **[Possibly outdated]**: the source is old or could not be confirmed as still in force.

## Which Cuban journals run OJS, and on what versions?

### Takeaway
OJS is the de facto standard, especially in health (ECIMED/Infomed) and at universities, and most journals sit on their own subdomain inside Cuba. The versions I could see are almost all OJS 3.3.0.x; I found one on 3.5.

### Cited Findings
- ECIMED adopted OJS as its editorial platform; a 2023 letter counts 108 serials in the health register, 82 active journals, 60 CITMA-certified and 15 active in Scopus — [Rev Cubana Inf Cienc Salud 2023;34:e2557](https://acimed.sld.cu/index.php/acimed/article/download/2557/pdf/14707)
- *Universidad y Sociedad* (Cienfuegos) has reportedly published on OJS since 2009 — [search summary of the journal article, not read in full](https://rus.ucf.edu.cu/index.php/rus/article/view/64)
- DOAJ lists 118 journals with publisher country Cuba. In the 50 records the API returned, 47 journal URLs are on .cu hosts; the 3 exceptions are revistasgeotech.com, gecontec.org and revistacubanadefisica.org **[Observed]** — [DOAJ API](https://doaj.org/api/search/journals/bibjson.publisher.country:CU?pageSize=100)

**Site probe, 2026-10-31 [Observed].** The version comes from the page's `generator` meta tag. Network owner and city come from [ipinfo.io](https://ipinfo.io/), which is a geolocation estimate.

| Site | Result | OJS version | Network / city |
|---|---|---|---|
| [revenfermeria.sld.cu](https://revenfermeria.sld.cu/) | 200 | 3.3.0.18 | ETECSA AS27725, Havana (190.92.127.122) |
| [revmedmilitar.sld.cu](https://revmedmilitar.sld.cu/) | 200 | 3.3.0.18 | same IP |
| [revcocmed.sld.cu](https://revcocmed.sld.cu/) | 200 | 3.3.0.18 | same IP |
| [acimed.sld.cu](https://acimed.sld.cu/) | 200, 5.4 s | 3.3.0.18 | same IP |
| [revibiomedica.sld.cu](https://revibiomedica.sld.cu/) | 200, 6.1 s | 3.3.0.18 | same IP |
| [rcci.uci.cu](https://rcci.uci.cu/) (UCI) | 403 to default curl; 200 in 16.5 s with a browser user agent | 3.3.0.19 | ETECSA, Havana |
| [rus.ucf.edu.cu](https://rus.ucf.edu.cu/) (Cienfuegos) | 200 | 3.3.0.18 | ETECSA, Cienfuegos |
| [revistas.unah.edu.cu](https://revistas.unah.edu.cu/) | 200 | 3.3.0.14 | IP 200.55.142.22; owner not looked up |
| [rcc.cujae.edu.cu](https://rcc.cujae.edu.cu/index.php/rcc/index) | 200 | 3.3.0.22 | IP 152.207.142.22; owner not looked up |
| [apye.esceg.cu](https://apye.esceg.cu/index.php/apye) | 200 | 3.3.0.6 | IP 181.225.235.169; owner not looked up |
| [sustagri.reduc.edu.cu](https://sustagri.reduc.edu.cu/index.php/agrisost/index) | 200 | 3.5.0.5 | IP 190.6.81.57; owner not looked up |
| [revistas.uclv.edu.cu](https://revistas.uclv.edu.cu/) (UCLV) | 200 | no tag on the home page; not confirmed as OJS | ETECSA, Havana |
| [santiago.uo.edu.cu](https://santiago.uo.edu.cu/) (Oriente) | 200 | no tag on the home page | ETECSA, Santiago |
| [revistas.uh.cu](https://revistas.uh.cu/) (UH) | **Failed**: timeout, then 502 in 16 s | unknown | ETECSA, Havana |
| [a3manos.uh.cu](https://a3manos.uh.cu/index.php/a3manos/) (UH) | **Failed**: 403 | unknown | same IP as revistas.uh.cu |
| [rcm.insmet.cu](http://rcm.insmet.cu/index.php/rcm) | **Failed**: 503 | unknown | IP 200.55.163.234 |
| revistas.udg.co.cu, ekotemas.cu, revistas.unica.cu, revistas.reduc.edu.cu | **Failed**: no response or no resolution; hostnames partly guessed | unknown | n/a |
| [scielo.sld.cu](https://scielo.sld.cu/) | 200 by curl with TLS checks off; WebFetch failed with "self signed certificate" | SciELO platform, not OJS | ETECSA, Havana |

Other technical failures: `www.revmedmilitar.sld.cu` presents a `*.sld.cu` certificate that does not match the hostname, and `www.sld.cu/wp-content/...` failed with "certificate has expired" **[Observed]**.

### Inferences
- The five sld.cu journal sites I checked share one IP and one OJS version, which suggests a centrally run ECIMED/Infomed installation. I did not confirm this with ECIMED.
- 3.3.0.x is the practical baseline. A new journal on the current OJS line would be ahead of nearly every peer checked, so it would have fewer local examples to copy.
- Several universities run separate servers, so a new journal would probably depend on its own institution's IT rather than on a national service.

### Gaps
- There is no official national count of Cuban journals on OJS. The 2023 ECIMED figures cover health only.
- Versions may be hidden or stale where the generator tag is absent. This is a small hand-picked sample, not a census.

## What must a Cuban scientific journal comply with (CITMA, ISSN, RNPS, hosting)?

### Takeaway
The legal sequence is RNPS registration, then ISSN from IDICT, then optional CITMA certification, which matters because it counts for academic promotion. A hosting-location rule may also apply through Decreto-Ley 370, but I could not confirm that it is still in force.

### Cited Findings
- Serials authorised to be edited and circulate in Cuba must be in the Registro Nacional de Publicaciones Seriadas. The legal basis cited is MINCULT Resolución 81/1987, plus **Resolución 56/1999 on approving the distribution of a serial over the Internet** — [Health-system procedure, CNICM](https://files.sld.cu/rededitores/files/2020/05/v2-Procedimiento-aprobaci%C3%B3n-o-cancelaci%C3%B3n-pub-seriadas.pdf) **[Primary for the health sector; document metadata dated 2019; possibly outdated]**
- The journal's director handles RNPS registration with the Dirección de Publicaciones Periódicas of the Instituto Cubano del Libro, signs the contract and pays. The director then requests the ISSN from IDICT once the RNPS certificate is issued. In the health system, a serial may not circulate without both numbers — [same procedure](https://files.sld.cu/rededitores/files/2020/05/v2-Procedimiento-aprobaci%C3%B3n-o-cancelaci%C3%B3n-pub-seriadas.pdf)
- New health journals also go through a CNICM advisory council and editorial committee, and the Minister accepts or rejects them — [same procedure](https://files.sld.cu/rededitores/files/2020/05/v2-Procedimiento-aprobaci%C3%B3n-o-cancelaci%C3%B3n-pub-seriadas.pdf)
- IDICT assigns ISSNs for Cuban serials through the international centre — [EcuRed](https://www.ecured.cu/ISSN); IDICT's role is also acknowledged by the [ISSN International Centre](https://www.issn.org/visit-at-the-instituto-de-informacion-cientifica-y-tecnologica-idict-in-havana-cuba/)
- CITMA Resolución 59/2003 (Gaceta Oficial no. 27, 31 Jul 2003) governs certification. Article 3 covers print or electronic serials, and the requirements are in article 20. The certification officially recognises a serial's scientific-technological character nationwide — [Rev Cubana Inf Cienc Salud 2023;34:e2476](https://acimed.sld.cu/index.php/acimed/article/download/2476/pdf)
- As of that 2023 letter, no Cuban student journal held the certification, even though the authors say some meet the requirements — [same letter](https://acimed.sld.cu/index.php/acimed/article/download/2476/pdf)
- Certification has direct career value: a Universidad de Ciencias Médicas de La Habana resolution places CITMA-certified journals in Group 4 for teaching-rank changes — [Resolución Rectoral 17/2013](https://instituciones.sld.cu/cirah/files/2020/12/NormativasPublicacionesCientificas.pdf) **[Possibly outdated; one institution]**
- Decreto-Ley 370, art. 68(f), makes it a violation to host a site on servers abroad unless it is a mirror or replica of a main site on servers in Cuba. MINCOM said in 2019 that for natural persons this refers to national service platforms and applications, not blogs, personal or informational sites — [DPL News, 2019](https://dplnews.com/ministerio-de-comunicaciones-aclara-duda-sobre-hospedaje-de-sitios-web-en-el-extranjero/) **[Possibly outdated]**
- Critics noted that the wording does not itself exclude those cases and could apply to natural and legal persons alike — [DPL News](https://dplnews.com/ciudadania-pide-cambios-en-la-redaccion-de-normativa-sobre-informatizacion-en-cuba/) **[Secondary]**
- Decreto-Ley 35 is the telecom and IT legal framework per MINCOM, and one jurist called it an extension of DL 370, which is an opinion and not a repeal provision — [MINCOM](https://www.mincom.gob.cu/es/printpdf/5636); [Diario de Cuba](https://diariodecuba.com/cuba/1629720182_33568.html) **[Secondary; pages seen only through search summaries]**

### Inferences
- Any state or institutional journal should assume its main site must be in Cuba, with any foreign copy framed as a mirror, until a Cuban lawyer or MINCOM says otherwise. MINCOM's clarification addressed natural persons only, so it gives an institution little comfort.
- The DOAJ exceptions above show that some Cuba-linked journals do live on foreign hosts. That shows practice, not legality.
- CITMA certification requires an established record: a journal that reported obtaining it cites sustained periodicity, indexing and a permanent identifier, per a search summary of Cuban journal texts (exact document not opened, so treat as unverified). A new journal should therefore not expect it from launch.

### Gaps
- **I could not read the text of Resolución 59/2003 article 20.** The copy at [legislacion.sld.cu](http://legislacion.sld.cu/index.php?P=DownloadFile&Id=206) was not retrieved, and citma.gob.cu was reachable (200) but I did not find the rule there. Validity period and fees are also unverified.
- Not confirmed: whether DL 370 is still in force, whether later rules changed the hosting clause, and whether Res. 56/1999 still applies or has its own hosting requirement. The Gaceta Oficial was not consulted.
- I did not obtain non-health procedures. The university and CITMA routes may differ from the CNICM process above.

## .cu domain: who can register, and must the site be hosted in Cuba?

### Takeaway
Cuban legal and resident natural persons, and foreign legal entities, can register. The CUBANIC norms sections I read contain no explicit rule requiring hosting in Cuba, though CUBANIC can refuse at its discretion after consulting the authorities.

### Cited Findings
All from the [CUBANIC Norms](https://www.nic.cu/docum_det.php?doc_id=1&opt=1) **[Primary]**, issued under [MINCOM Res. 20/2022](https://www.nic.cu/), applicable from 1 May 2022, unless marked otherwise:
- CITMATEL runs CUBANIC and the .cu primary and secondary servers (1.1). Generic categories are edu, gob, org, inf, net, com and nat (1.2).
- **Eligible: Cuban and foreign legal persons, and natural persons resident in Cuba** (2.2). Non-resident individuals are therefore not eligible.
- CUBANIC may refuse with "last decision", after consulting competent authorities (2.5), and the same reservation applies to renewal and transfer (5.2, 8.3).
- A domain is a one-year renewable registration, not property (2.3, 2.7). Administrative, technical and financial contacts are required (2.10).
- Not granted: generic terms, geographic terms or demonyms, the country's name, or terms harmful to security, ethics or sovereignty, among others (3.3). Exceptions to some of these need national-authority approval (3.4).
- CUBANIC may ask for supporting documents, and these **explicitly include the RNPS certificate** (4.3.1c).
- The holder keeps the name regardless of Internet provider (6.2). A primary DNS server is required and a secondary is optional (6.5). A domain need not have a dedicated permanent connection (6.4).
- Suspension grounds include breaking the Norms, a competent authority's order, and failing "quality and stability in the service of the network, where this is a requirement" (9.2).
- Fees for those based in Cuba: 600 CUP/year for a second-level name, 350 CUP/year for third-level. Entities based abroad: 600 USD/year under .cu and 350 USD/year under .com.cu — [CUBANIC tariffs](https://www.nic.cu/docum_det.php?doc_id=3&opt=1)
- CUBANIC's own website resolves to Leaseweb Canada, Montréal (107.161.72.165) **[Observed; via Google DNS and ipinfo.io]**

### Inferences
- A journal name containing a generic word or a Cuban place name could be refused under 3.3 unless authorities approve it, so an RNPS-registered title and institutional subdomain are the safest route.
- The simplest route is a subdomain of an existing institution (for example `*.sld.cu` or `*.uh.cu`), which avoids CUBANIC altogether but ties the journal to that institution's DNS and IT.
- CUBANIC's Montréal hosting suggests location outside Cuba is at least not technically barred by the registry. It says nothing about DL 370, and geo-dependent DNS answers are possible.

### Gaps
- Sections after 9.3 and the application forms were not read in full (`form_det.php` returned 403 to curl). A hosting clause there cannot be fully excluded.
- Rules for edu.cu, gob.cu and org.cu eligibility were not found. Third-party registrars' simplified claims, such as [Marcaria's "no requirements"](https://whois.marcaria.com/es/am%C3%A9rica/cu-busqueda-de-dominio), conflict with the Norms and should not be relied on.
- [MINCOM's PDF of Res. 20/2022](https://www.mincom.gob.cu/sites/default/files/marcoregulatorio/r_20-22_dominios_aprobados_y_normas_del_cubanic_.pdf) returned 403 or an HTML block to my tools, so I used the CUBANIC site's version.

## Hosting in Cuba: providers, bandwidth, power and uptime

### Takeaway
Power is the dominant uptime risk in 2026: six national grid collapses were reported by August, and ETECSA says its equipment cannot run beyond 24 hours without grid power. Current figures for hosting offers and bandwidth are thin.

### Cited Findings
- Nearly all journal hosts I probed sit on ETECSA's AS27725; citma.gob.cu sits on RedCENIA AS10569 **[Observed]**.
- Six national grid collapses were reported in 2026 as of early August — [Infobae](https://www.infobae.com/america/america-latina/2026/08/03/crisis-en-cuba-la-isla-sufrio-un-nuevo-apagon-nacional-y-ya-acumula-seis-colapsos-de-su-sistema-electrico-en-2026/); [Local10](https://www.local10.com/espanol/2026/08/03/cuba-comienza-a-restablecer-el-servicio-electrico-tras-el-sexto-colapso-de-la-red-electrica-nacional-de-2026/)
- An ETECSA manager in Sancti Spíritus said the technology cannot be kept running more than 24 hours without grid power. The same article reports 47.5% of mobile base stations and 56.5% of telecom cabinets down during outages, blackouts over 16 hours a day, and a March 2026 event with a 65% fall in national traffic and nearly 29 hours to full restoration — [CiberCuba, 17 Jun 2026](https://en.cibercuba.com/noticias/2026-06-17-u1-e208933-s27061-nid332584-etecsa-admite-apagones-estan-dejando-telefonia-ni) **[Secondary; opposition-leaning outlet; the national percentages are not traced to a primary source]**
- Cloudflare Radar charts showed traffic near 30% of normal on 6 Nov 2024 and about 20% on 18 Oct 2024 during national blackouts — [Diario Las Américas](https://www.diariolasamericas.com/america-latina/plataformas-registraron-caida-internet-cuba-el-apagon-n5366459)
- Politically timed cuts are also reported — [CubaNet](https://www.cubanet.org/noticias/regimen-cubano-corta-internet-por-segunda-noche-consecutiva/); [CiberCuba, Jun 2026](https://en.cibercuba.com/noticias/2026-06-20-u1-e207888-s27061-nid332863-cubanos-denuncian-cortes-internet-medio-creciente) **[Secondary; contested, not independently verified here]**
- International capacity relies heavily on ALBA-1 (Santiago to La Guaira, 2013). In January 2026 traffic was reported normal, but there was speculation about access terms after Maduro's fall — [CiberCuba, Jan 2026](https://en.cibercuba.com/noticias/2026-01-14-u1-e207888-s27061-nid318529-podria-cambiar-conexion-internet-cuba-tras-caida). The design capacity is listed as 5.12 Tbps and the ARCOS extension as not activated — [Submarine Networks, undated](https://www.submarinenetworks.com/en/systems/brazil-us/alba-1) **[Possibly outdated]**
- Other routes are the Jamaica branch — [Havana Times](https://www.havanatimes.org/?p=93486) — and the Arimao cable to Martinique, reported in testing in 2019 — [Cuba Standard](https://cubastandard.com/?p=26078) **[Possibly outdated]**
- Average speed was reported at 7.21 Mbps, last in Latin America per Speedtest — [CiberCuba](https://en.cibercuba.com/noticias/2026-06-17-u1-e208933-s27061-nid332584-etecsa-admite-apagones-estan-dejando-telefonia-ni)
- ETECSA hosting is advertised as manageable free of charge from national access points — [MINCOM](https://www.mincom.gob.cu/en/noticia/etecsa-new-offers-website-hosting-service-natural-persons?page=4). Aggregator-listed plans include "Mediano" at 125 CUP/month and "Extrasitio" at 1,250 CUP/month — [WHTop](https://www.whtop.com/plans/etecsa.cu/127620); [WHTop](https://www.whtop.com/plans/etecsa.cu/127621) **[Unverified at etecsa.cu; possibly outdated]**
- At the 2019 launch for individuals, critics reported .nat-only domains, hosted sites restricted to ETECSA's network with no connection to external web services, old software, limited availability and undisclosed resources — [DPL News, 2019](https://dplnews.com/?p=9876) **[Possibly outdated]**. Its claim that .cu is reserved for state companies conflicts with [CUBANIC Norms 2.2](https://www.nic.cu/docum_det.php?doc_id=1&opt=1).

### Inferences
- A site hosted only in Cuba should be planned for multi-hour and occasionally day-long outages. Generator and UPS arrangements at the data centre, and at the editors' own connections, matter as much as the OJS configuration.
- Outages also affect the **editors and authors in Cuba**, so a foreign host would not remove the risk to the editorial workflow, only to readership abroad.
- A static reading mirror or external archive is the most useful mitigation for readers and indexers, and it matches DL 370's "mirror or replica" wording, subject to the legal gap above.
- Outbound-restricted shared plans could break OJS features that need outside calls (ORCID, Crossref, DOAJ, PKP PN, email). Check this before contracting.

### Gaps
- **No published uptime or SLA figures for any Cuban host were found.** No current official prices for ETECSA, Citmatel or RedCENIA hosting were found. **Nothing usable on DATACIMEX hosting or on national data centres' power backup was found.**
- No current figures for national versus international bandwidth, nor pricing differences between them.
- I found no Kentik or NetBlocks 2026 report; the Cloudflare Radar data came second-hand.

## US sanctions and external services: what is restricted, and do Cuban journals get DOIs?

### Takeaway
Crossref says it cannot accept membership applications from Cuban organisations, so Cuban journals mostly go without Crossref DOIs and a minority use Zenodo DOIs. For developer services the key distinction is usually individuals versus the Cuban government, and state universities may fall on the wrong side of it. The 2026 sanctions tightening makes older statements less safe.

### Cited Findings
**Sanctions framework**
- E.O. 14404 (1 May 2026) followed the emergency declared in E.O. 14380 (Feb 2026). OFAC's new 31 CFR part 516 is scheduled for publication on 30 Sep 2026 in abbreviated form, with more rules and general licences to come — [Federal Register 2026-19977](https://public-inspection.federalregister.gov/2026-19977.pdf) **[Primary]**
- GL 1 authorises transactions prohibited by E.O. 14404 where they are authorised or exempt under the CACR, does not widen the CACR, and is self-executing — [OFAC FAQ 1253, 7 May 2026](https://ofac.treasury.gov/faqs/1253) **[Primary]**
- CACR §515.578 is described as authorising export to Cuba of services incident to Internet communications, and eCFR showed one recent change whose content I could not see — [eCFR §515.578](https://www.ecfr.gov/current/title-31/subtitle-B/chapter-V/part-515/subpart-E/section-515.578) **[Seen only through a search summary; current text not verified]**
- A "limited wind-down authorization through October 30, 2026" was mentioned in legal summaries — [Search result, HSF Kramer](https://www.hsfkramer.com/notes/sanctions/2026-posts/ofac-expands-cuba-sanctions-and-tightens-financial-and-travel-restrictions) **[Fetch returned 403; scope not verified; date has just passed]**

**Crossref and DOIs**
- Crossref: "currently unable to accept applications for membership" from organisations based in, or with significant links to, Cuba, Iran and North Korea, and sponsors must also comply with sanctions — [Crossref sanctions page, last updated 14 Feb 2023 per the page](https://crossref.org/operations-and-sustainability/membership-operations/sanctions) **[Primary]**. A [mirrored copy](https://www-crossref-org.ezproxy.csu.edu.au/operations-and-sustainability/membership-operations/sanctions/) also lists Syria, so versions differ.
- A CNICM editorial, "¿Por qué Cuba no tiene DOI?" (2020), says attempts directly, through third parties and with SciELO-Brazil's help all failed, with partners citing fear of US fines. It also says DataCite pointed them back to Crossref for journal content, and that it would be prohibited to register DOIs in US servers for documents originating on Cuban servers, as relayed to collaborators — [Rev Cubana Inf Cienc Salud 2020;31(4):e1816, Medigraphic copy](https://www.medigraphic.com/pdfs/acimed/aci-2020/aci204a.pdf). This is the Cuban side's account, and the legal claim is not verified. At that time, the editorial says, Crossref's membership policy did not exclude Cuba.
- **Workaround in use:** *Revista Cubana de Reumatología* began assigning DOIs through Zenodo in 2018 (prefix 10.5281) — [REDIB record](https://redib.org/Record/oai_articulo1431485-revista-cubana-de-reumatología-hacia-nuevos-estándares-internacionales?lng=es). Current *Revista Cubana de Administración Pública y Empresarial* pages show `10.5281/zenodo.18556410` and similar DOIs **[Observed]** — [apye.esceg.cu](https://apye.esceg.cu/index.php/apye/issue/current)
- In DOAJ's first 50 Cuban records, three declare DOI (Telemática, Agrisost, APyE), others declare Handles or a Cu-ID scheme, and most declare none **[Observed]** — [DOAJ API](https://doaj.org/api/search/journals/bibjson.publisher.country:CU?pageSize=100)
- Crossref's member search for "cuba" returned a US-based publisher (Medical Education Cooperation with Cuba, Oakland, 717 DOIs) and "Revista Cubana de Informacion en Ciencias de la Salud" listed at Recife, Brazil, with 0 DOIs **[Observed]** — [Crossref API](https://api.crossref.org/members?query=cuba&rows=20). *Revista Cubana de Salud Pública* appears as a SciELO title with 413 DOIs **[Observed]** — [Crossref API](https://api.crossref.org/journals?query=Revista+Cubana&rows=30). I did not establish how those DOIs were issued.

**Developer and hosting services**
- GitHub: cloud services, free and paid, are "generally available to developers located in Cuba". SDNs, other blocked parties and certain government officials may be restricted, and use for or on behalf of sanctioned governments is generally not allowed — [GitHub and trade controls](https://docs.github.com/en/site-policy/other-site-policies/github-and-trade-controls) **[Primary; undated; may predate 2026 rules]**
- Cloudflare (Dec 2022): for Cuba among others, "except for government parties, some free and paid services are authorized" — [Cloudflare blog](https://blog.cloudflare.com/the-challenges-of-sanctioning-the-internet/); it also says it relies on OFAC general licences in such regions — [SEC 10-Q](https://www.sec.gov/Archives/edgar/data/1477333/000147733325000141/cloud-20250930.htm) **[Primary but dated]**
- Lovable: bars users located in, or acting for someone in, "a country or territory subject to comprehensive embargoes or sanctions"; it names no country — [Lovable Terms](https://lovable.dev/terms) **[Primary]**
- Vercel: users represent they are not sanctions targets, and the terms name no countries — [Vercel Terms](https://vercel.com/legal/terms). Vercel also offers customers a template firewall rule to block OFAC-sanctioned regions — [Vercel template](https://examples.vercel.com/templates/other/block-ofac-sanctioned-countries-firewall-rule) **[Primary]**
- Netlify: its public terms page has no sanctions text, and it refers to separate agreements I did not read — [Netlify Terms](https://www.netlify.com/legal/terms-of-use/). Supabase's terms page returned 403 to my tool, so its terms are **not verified**.
- Google Cloud: users reported 403s from Cuba on GCP-hosted services and the developer portal, with a relayed support reply citing an embargoed-country list, while Gmail, Search and YouTube reportedly worked and AWS-hosted services worked — [Google developer forum, 2023-24](https://discuss.google.dev/t/instance-non-reachable-from-cuba/133069) **[Anecdotal; current status unknown]**
- AWS: the only statement I found is a generic spokesperson remark about complying with sanctions — [CircleID, 2022](https://circleid.com/posts/20220307-why-over-compliance-with-sanctions-at-the-internet-infrastructure-level-can-have-devastating-effects)
- npm: I found no evidence of a Cuba-specific block. The 403 reports I found were network or IP issues — [npm/cli issue](https://github.com/npm/cli/issues/1358). A separate report concerns a package mirror from Cuba — [Lightrun](https://lightrun.com/answers/shiftkey-desktop-when-using-apt-to-install-the-application-from-cuba-the-repository-respond-with-403-error)

### Inferences
- Universities and ministries are state bodies, so a journal run by one may count as a "government party" for GitHub, Cloudflare and similar services, even where individual Cuban developers are allowed. This reading needs legal advice.
- On its terms, Lovable appears unavailable to anyone building from Cuba or for a party there. Vercel, Netlify and Supabase may carry similar risk, and there is the separate risk of **visitor** blocking if a site owner or platform applies a geo rule.
- For a site meant to work for Cuban readers, the safe design is self-hosted fonts, scripts and assets with no runtime dependency on Google, Cloudflare or other CDNs. Build dependencies can be vendored. This is a precaution: **no block on Google Fonts or major JS CDNs was confirmed.**
- Zenodo DOIs are a real, used option, but they identify a Zenodo deposit and not a journal-controlled Crossref record, so they lack Crossref-side citation linking and metadata services. A foreign co-publisher is the other theoretical route, but Crossref's "significant links" wording and sponsor compliance language make it uncertain.

### Gaps
- **No live tests from a Cuban IP were possible.** All statements about blocks are from documents or anecdote. Test on site from ETECSA connections before relying on any service.
- Effects of part 516 and E.O. 14404 on §515.578 and on informational-materials provisions were not established. HSF, Steptoe and Thompson Hine pages returned 403, and part 516 itself appears aimed at blocking provisions. No lawyer has reviewed this.
- Crossref's position after the 2026 rules: the page I read was last updated in 2023.
- Not established: Supabase's terms, AWS's and Google Fonts' behaviour from Cuba, and whether DataCite or mEDRA would accept Cuban journals today beyond the 2020 anecdote.

## Payment limits for foreign services

### Takeaway
Reliable current sources are scarce. The practical assumption is that paying foreign SaaS from a Cuban institution is difficult, and that dollar payments through US banks are out, as CUBANIC itself states from the other direction.

### Cited Findings
- CUBANIC tells foreign customers that US banks can never be used for payments to Cuba. It accepts transfers only in EUR, GBP, CAD or CHF, plus online card payment, and entities in Cuba pay in CUP by cheque or transfer — [CUBANIC payment page](https://www.nic.cu/docum_det.php?doc_id=4&opt=1) **[Primary]**
- Most US-issued cards do not work in Cuba — [Directorio Cubano](https://www.directoriocubano.info/noticias/economia/puedo-usar-mi-tarjeta-de-credito-internacional-en-cuba/) **[Secondary; undated]**
- Stripe's 2016 Cuba expansion was Atlas for entrepreneurs, not a general payments service in Cuba — [Reuters via StreetInsider](https://www.streetinsider.com/Reuters/Stripe+expands+payments+service+to+Cuba+to+support+startups/11432880.html) **[Possibly outdated]**
- Crossref's 2020 fee for the lowest tier was 275 USD/year per the Cuban editorial, which reported that using intermediaries doubled or tripled the cost — [Medigraphic copy](https://www.medigraphic.com/pdfs/acimed/aci-2020/aci204a.pdf) **[Possibly outdated]**

### Inferences
- A paid foreign service would normally need a foreign payer. If that payer acts for a Cuban state body, sanctions exposure moves to the payer, and such a setup should have legal review.
- Choosing free, self-hosted software such as OJS removes most recurring foreign payments, which helps explain why OJS fits this environment. This explanation is my own, not a sourced finding.

### Gaps
- I found no current source on whether Cuban cards (MLC, Clásica) work at foreign online merchants, or on the 2026 state of PayPal or Stripe for people in Cuba.

## Indexing: SciELO Cuba, Latindex, DOAJ, Redalyc, Scopus and platform choice

### Takeaway
No index I checked mandates a specific platform. They do penalise unavailable sites and poor metadata, so reliability and metadata matter more than the software brand. DOIs help but are evidently not an absolute barrier in Cuba.

### Cited Findings
- **DOAJ:** requires a dedicated URL and homepage "accessible from any location", a unique URL per article, a confirmed ISSN, and immediate free access. DOIs and archiving are recommended, not mandatory. No platform or uptime percentage is specified, but unavailability is a rejection ground and post-acceptance reports can trigger re-evaluation — [DOAJ guide](https://doaj.org/apply/guide/) **[Primary]**
- **SciELO Cuba:** criteria dated 2020 require scientific character, relevance, operational and financial sustainability, and adoption of communication standards; popularising journals are not evaluated — [summary in e2476](https://acimed.sld.cu/index.php/acimed/article/download/2476/pdf), citing [criterios_2021.pdf](http://scielo.sld.cu/pdf/criterios_2021.pdf), which I did not read. As of the 2022 report, 26 journals (34.6%) were late — [SciELO Cuba report](https://www.sld.cu/wp-content/uploads/2023/09/Informe-SciELO-Cuba_20221125.pdf) **[Search summary; certificate expired on fetch]**. That implies about 75 titles.
- **Scopus:** content, regularity and online availability are evaluated. Baseline checks reportedly include full text online, an English-language homepage and a functional, professionally maintained website — [Scholastica](https://blog.scholasticahq.com/post/how-to-get-journals-indexed-scopus/); [Scopus FAQ copy, 2021](https://www.anmb.ro/buletinstiintific/eng/ScopusFAQContentSelectionProcess20210928.pdf) **[Secondary or dated]**
- **DOI claim conflict:** the 2020 Cuban editorial says WoS, Scopus and SciELO make DOI mandatory — [Medigraphic copy](https://www.medigraphic.com/pdfs/acimed/aci-2020/aci204a.pdf). However, 15 Cuban health journals were active in Scopus in 2023 — [e2557](https://acimed.sld.cu/index.php/acimed/article/download/2557/pdf/14707) — while the same 2020 source says Cuba lacks DOIs, so the claim looks overstated or at least not universally enforced.
- **Latindex Catálogo 2.0:** 38 characteristics for online journals, checked only against the official website, including interoperability protocols and search tools — [Latindex methodology v5](https://latindex.unam.mx/latindex/documentos/pdfs/Catalogo_2.0_metodologia_v5.pdf). Sources differ on the threshold (7 basic characteristics plus a minimum total) — [UCR summary](https://ucrindex.ucr.ac.cr/wp-content/uploads/2023/03/criterios-Latindex-2.0-2023.pdf) **[Search summary]**

### Inferences
- OJS fits these checks well out of the box through OAI-PMH, per-article URLs, search and author-guideline pages. A custom platform would have to rebuild these and would be unfamiliar to Cuban evaluators and editors.
- HTTPS faults like those observed (expired, self-signed, mismatched certificates) and frequent 5xx errors directly threaten the DOAJ "accessible from any location" test. Certificate monitoring and an external mirror are cheap protection.
- An English homepage layer matters for Scopus ambitions.

### Gaps
- **Redalyc's current requirements were not researched successfully.** No platform-specific rule was found, but I did not read its criteria.
- The full SciELO Cuba criteria PDF and Scopus's current official text were not read directly. Whether SciELO Cuba currently requires DOIs or XML (JATS) is unconfirmed, which is important since SciELO's own production model may need it.
