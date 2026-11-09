#!/usr/bin/env python3
"""PakToolkit static site generator.
Reads seo-meta.csv (verbatim titles/meta/H1/schema per URL) + content.py,
renders all 22 launch pages into dist/. Run: python3 build.py
Source files live alongside this script; dist/ is pure output."""
import csv, json, os, shutil, html

HERE = os.path.dirname(os.path.abspath(__file__))
DIST = os.path.join(HERE, "dist")
BASE = "https://paktoolkit.top"
import sys
sys.path.insert(0, HERE)
from content import CATEGORIES, TOOLS, HOME_FAQS, TRUST

PRIORITY = {"/": "1.0"}

def load_meta():
    rows = {}
    with open(os.path.join(HERE, "seo-meta.csv"), newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            if "[BATCH 2]" in row["primary_keyword"]:
                continue  # Batch 2 pages are not part of the launch build
            url = row["url"]
            path = url[len(BASE):] or "/"
            rows[path] = row
    return rows

META = load_meta()

def esc(s): return html.escape(s, quote=True)

def ld(obj):
    return '<script type="application/ld+json">\n' + json.dumps(obj, indent=2, ensure_ascii=False) + "\n</script>"

def schema_for(path, row, extra=None):
    types = [t.strip() for t in row["schema_types"].split(",")]
    out = []
    url = row["url"]
    if "WebSite" in types:
        out.append(ld({"@context": "https://schema.org", "@type": "WebSite", "name": "PakToolkit", "url": BASE + "/"}))
        out.append(ld({"@context": "https://schema.org", "@type": "Organization", "name": "PakToolkit",
                       "url": BASE + "/", "logo": BASE + "/favicon.svg",
                       "description": "Free online tools for Pakistan — calculators, image and PDF tools that run in your browser."}))
    if "WebApplication" in types:
        slug = path.strip("/")
        tool = TOOLS[slug]
        out.append(ld({"@context": "https://schema.org", "@type": "WebApplication", "name": row["h1"], "url": url,
                       "applicationCategory": "UtilitiesApplication", "operatingSystem": "Any — browser",
                       "offers": {"@type": "Offer", "price": 0, "priceCurrency": "PKR"},
                       "description": row["meta_description"]}))
        crumbs = [{"@type": "ListItem", "position": 1, "name": "Home", "item": BASE + "/"},
                  {"@type": "ListItem", "position": 2, "name": CATEGORIES[tool["cat"]]["name"], "item": BASE + "/" + tool["cat"] + "/"},
                  {"@type": "ListItem", "position": 3, "name": tool["name"], "item": url}]
        out.append(ld({"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": crumbs}))
        if "FAQPage" in types:
            faqs = tool["faqs"]
            out.append(ld({"@context": "https://schema.org", "@type": "FAQPage",
                           "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faqs]}))
    if "ItemList" in types:
        cat = CATEGORIES[path.strip("/")]
        items = []
        for i, slug in enumerate(cat["tools"], 1):
            items.append({"@type": "ListItem", "position": i, "name": TOOLS[slug]["name"], "url": BASE + "/" + slug + "/"})
        out.append(ld({"@context": "https://schema.org", "@type": "ItemList", "name": row["h1"], "itemListElement": items}))
    if "BreadcrumbList" in types and "WebApplication" not in types:
        name = row["h1"]
        out.append(ld({"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": BASE + "/"},
            {"@type": "ListItem", "position": 2, "name": name, "item": url}]}))
    return "\n".join(out)

def head(row, path):
    title, desc, url = row["title"], row["meta_description"], row["url"]
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(title)}</title>
<meta name="description" content="{esc(desc)}">
<link rel="canonical" href="{esc(url)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="PakToolkit">
<meta property="og:title" content="{esc(title)}">
<meta property="og:description" content="{esc(desc)}">
<meta property="og:url" content="{esc(url)}">
<meta property="og:image" content="{BASE}/assets/og-image.svg">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{esc(title)}">
<meta name="twitter:description" content="{esc(desc)}">
<meta name="twitter:image" content="{BASE}/assets/og-image.svg">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/assets/style.css">
{schema_for(path, row)}
</head>"""

HEADER = """<header class="site"><div class="wrap header-in">
<a class="logo" href="/">Pak<span>Toolkit</span></a>
<nav class="mainnav">
<a href="/pakistan-calculators/">Pakistan Calculators</a>
<a href="/image-tools/">Image Tools</a>
<a href="/pdf-tools/">PDF Tools</a>
<a href="/everyday-calculators/">Everyday</a>
<a href="/about/">About</a>
</nav></div></header>"""

TABS = [("home", "/", "🏠", "Home"), ("calc", "/pakistan-calculators/", "🧮", "Calc"),
        ("image", "/image-tools/", "🖼️", "Image"), ("pdf", "/pdf-tools/", "📄", "PDF"),
        ("about", "/about/", "👤", "About")]
TAB_FOR_CAT = {"pakistan-calculators": "calc", "everyday-calculators": "calc",
               "image-tools": "image", "pdf-tools": "pdf", "cards-invitations": ""}

def tabbar(active):
    links = "".join(
        f'<a href="{href}"{" class=\"on\"" if key == active else ""}><span class="ic">{icon}</span>{label}</a>'
        for key, href, icon, label in TABS)
    return f'<nav class="tabbar">{links}</nav>'

def footer(active="", extra=""):
    return """<footer class="site"><div class="wrap">
<p><strong>PakToolkit</strong> — free online tools for Pakistan. Every tool runs in your browser; your files never leave your device.</p>
<p><a href="/about/">About</a> <a href="/contact/">Contact</a> <a href="/privacy-policy/">Privacy Policy</a> <a href="/terms/">Terms of Use</a> <a href="/disclaimer/">Disclaimer</a></p>
<p><a href="/pakistan-calculators/">Pakistan Calculators</a> <a href="/image-tools/">Image Tools</a> <a href="/pdf-tools/">PDF Tools</a> <a href="/everyday-calculators/">Everyday Calculators</a> <a href="/cards-invitations/">Cards &amp; Invitations</a></p>
</div></footer>
""" + tabbar(active) + """
<script src="/assets/tools.js" defer></script>
""" + extra + """
</body></html>"""

def card(slug):
    t = TOOLS[slug]
    search = esc(t["name"] + " " + t["blurb"])
    return f'<a class="card tool-card" data-search="{search}" href="/{slug}/"><div class="icon">{t["icon"]}</div><h3>{esc(t["name"])}</h3><p>{esc(t["blurb"])}</p></a>'

def faq_html(faqs):
    parts = []
    for q, a in faqs:
        parts.append(f"<details><summary>{esc(q)}</summary><p>{esc(a)}</p></details>")
    return "\n".join(parts)

def related(slug):
    tool = TOOLS[slug]
    rel = [s for s in CATEGORIES[tool["cat"]]["tools"] if s != slug]
    for s in TOOLS:
        if s != slug and s not in rel:
            rel.append(s)
    return rel[:3]

def tool_page(path, row):
    slug = path.strip("/")
    t = TOOLS[slug]
    cat = CATEGORIES[t["cat"]]
    steps = "\n".join(f"<li>{esc(s)}</li>" for s in t["steps"])
    rel_cards = "\n".join(card(s) for s in related(slug))
    disclaimer = '<p class="note">Disclaimer: figures from this calculator are estimates based on published rates. The official figure — from your DISCO bill, FBR or the relevant authority — is always final. See our <a href="/disclaimer/">Disclaimer</a>.</p>' if t["disclaimer"] else ""
    privacy = '<p class="privacy">🔒 Your files never leave your device.</p>' if t["cat"] in ("image-tools", "pdf-tools") else '<p class="privacy">🔒 Your numbers never leave your device — everything is calculated in your browser.</p>'
    body = f"""{head(row, path)}
<body>
{HEADER}
<main class="wrap">
<nav class="breadcrumb"><a href="/">Home</a> › <a href="/{t['cat']}/">{esc(cat['name'])}</a> › {esc(t['name'])}</nav>
<h1>{esc(row['h1'])}</h1>
<p>{esc(t['intro'])}</p>
<section class="toolbox">
{privacy}
{t['ui']}
</section>
<h2>How to use</h2>
<ol>{steps}</ol>
<h2>How it works</h2>
<p>{esc(t['works'])}</p>
<p><strong>Worked example:</strong> {esc(t['example'])}</p>
{t['extra']}
<h2>Frequently asked questions</h2>
{faq_html(t['faqs'])}
<h2>Related tools</h2>
<div class="grid">{rel_cards}</div>
{disclaimer}
</main>
{footer(TAB_FOR_CAT[t['cat']], '<script src="/assets/wedding.js" defer></script>' if slug == "wedding-invitation-maker" else "")}"""
    return body

def category_page(path, row):
    slug = path.strip("/")
    cat = CATEGORIES[slug]
    cards = "\n".join(card(s) for s in cat["tools"])
    return f"""{head(row, path)}
<body>
{HEADER}
<main class="wrap">
<nav class="breadcrumb"><a href="/">Home</a> › {esc(cat['name'])}</nav>
<h1>{esc(row['h1'])}</h1>
<p>{esc(cat['intro'])}</p>
<div class="grid">{cards}</div>
<p class="small">Every tool on PakToolkit is free, needs no sign-up, and runs in your browser — your files never leave your device.</p>
</main>
{footer(TAB_FOR_CAT[slug])}"""

def home_page(path, row):
    sections = []
    for cslug, cat in CATEGORIES.items():
        cards = "\n".join(card(s) for s in cat["tools"])
        sections.append(f'<section class="cat-section"><h2><a href="/{cslug}/">{esc(cat["name"])}</a></h2><div class="grid">{cards}</div></section>')
    return f"""{head(row, path)}
<body>
{HEADER}
<main class="wrap">
<div class="hero">
<h1>{esc(row['h1'])}</h1>
<p>Free online tools made for Pakistan — bijli bill, salary tax, MDCAT aggregate and zakat calculators, plus image and PDF tools. No sign-up, works on mobile, and your files stay on your device.</p>
<input class="searchbox" id="toolSearch" type="search" placeholder="Search tools… try “bijli”, “pdf” or “zakat”" aria-label="Search tools">
</div>
{''.join(sections)}
<section>
<h2>Why PakToolkit</h2>
<p><strong>Pakistan first:</strong> global tool sites do not have Pakistani tariff slabs, the MDCAT 10/40/50 formula or a Marla/Kanal converter. We do.</p>
<p><strong>Private by design:</strong> every tool runs inside your browser. Your images, PDFs and numbers are never uploaded to a server — we could not see them even if we wanted to.</p>
<p><strong>Free, no sign-up:</strong> open a tool and use it. No accounts, no watermarks, no “premium” lock on basic tools.</p>
<h2>Frequently asked questions</h2>
{faq_html(HOME_FAQS)}
</section>
</main>
{footer('home')}"""

def trust_page(path, row):
    slug = path.strip("/")
    title, sections = TRUST[slug]
    parts = []
    for h, p in sections:
        parts.append(f"<h2>{esc(h)}</h2><p>{esc(p)}</p>")
    mail = '<p>Email: <a href="mailto:sufyanbarret@gmail.com">sufyanbarret@gmail.com</a></p>' if slug == "contact" else ""
    return f"""{head(row, path)}
<body>
{HEADER}
<main class="wrap">
<nav class="breadcrumb"><a href="/">Home</a> › {esc(title)}</nav>
<h1>{esc(row['h1'])}</h1>
{''.join(parts)}
{mail}
</main>
{footer('about')}"""

def sitemap(urls):
    prio = {"/": "1.0", "/pakistan-calculators/": "0.9", "/image-tools/": "0.9", "/pdf-tools/": "0.9",
            "/everyday-calculators/": "0.8", "/about/": "0.5", "/contact/": "0.5",
            "/privacy-policy/": "0.4", "/terms/": "0.4", "/disclaimer/": "0.4"}
    lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for u in urls:
        p = u[len(BASE):] or "/"
        lines.append(f'  <url><loc>{u}</loc><priority>{prio.get(p, "0.8")}</priority></url>')
    lines.append("</urlset>")
    return "\n".join(lines) + "\n"

def main():
    if os.path.exists(DIST):
        shutil.rmtree(DIST)
    os.makedirs(os.path.join(DIST, "assets"))
    built = []
    for path, row in META.items():
        if path == "/":
            content, out = home_page(path, row), os.path.join(DIST, "index.html")
        elif path.strip("/") in CATEGORIES:
            content, out = category_page(path, row), os.path.join(DIST, path.strip("/"), "index.html")
        elif path.strip("/") in TOOLS:
            content, out = tool_page(path, row), os.path.join(DIST, path.strip("/"), "index.html")
        elif path.strip("/") in TRUST:
            content, out = trust_page(path, row), os.path.join(DIST, path.strip("/"), "index.html")
        else:
            raise SystemExit("No renderer for " + path)
        os.makedirs(os.path.dirname(out), exist_ok=True)
        with open(out, "w", encoding="utf-8") as f:
            f.write(content)
        built.append(row["url"])
    shutil.copy(os.path.join(HERE, "style.css"), os.path.join(DIST, "assets", "style.css"))
    shutil.copy(os.path.join(HERE, "tools.js"), os.path.join(DIST, "assets", "tools.js"))
    shutil.copy(os.path.join(HERE, "wedding.js"), os.path.join(DIST, "assets", "wedding.js"))
    shutil.copy(os.path.join(HERE, "favicon.svg"), os.path.join(DIST, "favicon.svg"))
    shutil.copy(os.path.join(HERE, "og-image.svg"), os.path.join(DIST, "assets", "og-image.svg"))
    shutil.copy(os.path.join(HERE, "robots.txt"), os.path.join(DIST, "robots.txt"))
    wn = os.path.join(HERE, "wedding-namuna.html")
    if os.path.exists(wn):  # noindex test page — copied, not a generated page
        os.makedirs(os.path.join(DIST, "wedding-namuna"), exist_ok=True)
        shutil.copy(wn, os.path.join(DIST, "wedding-namuna", "index.html"))
    # engine-test.html and imgly-test.html stay in the repo as dormant diagnostics (not copied to dist).
    # Engine comparison concluded 2026-11-09: BiRefNet-lite 512 (WASM + fp32) won and is integrated in tools.js.
    with open(os.path.join(DIST, "sitemap.xml"), "w", encoding="utf-8") as f:
        f.write(sitemap(built))
    print(f"Built {len(built)} pages into dist/")

if __name__ == "__main__":
    main()
