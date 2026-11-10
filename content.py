# -*- coding: utf-8 -*-
"""PakToolkit page content: tools, categories, trust pages.
Titles / meta / H1 come from seo-meta.csv in build.py — not repeated here."""

CATEGORIES = {
    "pakistan-calculators": {
        "name": "Pakistan Calculators",
        "intro": "These calculators are built only for Pakistan: the bijli bill calculator Pakistan users search for every month, salary tax for 2025-26, the MDCAT aggregate formula, zakat with the government-notified nisab, and the Marla/Kanal land converter. Every figure is calculated on your own phone or computer — nothing is sent anywhere.",
        "tools": ["bijli-bill-calculator", "marla-kanal-converter", "salary-tax-calculator-pakistan", "mdcat-aggregate-calculator", "zakat-calculator"],
    },
    "image-tools": {
        "name": "Image Tools",
        "intro": "Free image tools that run entirely in your browser: compress an image to an exact KB size for online forms, make a correct passport-size photo, or convert between JPG, PNG and WebP. Your images are never uploaded — the work happens on your device.",
        "tools": ["image-compressor-to-kb", "passport-size-photo-maker", "image-converter"],
    },
    "pdf-tools": {
        "name": "PDF Tools",
        "intro": "Merge, split and convert PDFs without uploading them anywhere. Most PDF websites send your documents to their servers; PakToolkit processes every PDF inside your browser, so private documents stay private.",
        "tools": ["merge-pdf", "split-pdf", "jpg-to-pdf"],
    },
    "everyday-calculators": {
        "name": "Everyday Calculators",
        "intro": "Small calculators for everyday questions — starting with an exact age and date difference calculator that gives your age in years, months and days, plus totals in days and weeks.",
        "tools": ["age-calculator"],
    },
    "cards-invitations": {
        "name": "Cards & Invitations",
        "intro": "Beautiful digital cards and invitations that you make in your browser and share on WhatsApp — a full wedding invitation maker with opening curtains, music, a live countdown and RSVP, and a Ramadan calendar maker in the local printing-press style with your own name band. Free, no sign-up, and everything is created on your own device.",
        "tools": ["wedding-invitation-maker", "ramadan-calendar-maker"],
    },
}

def _tool(slug, cat, name, icon, blurb, intro, ui, steps, works, example, faqs, disclaimer, extra=""):
    return dict(slug=slug, cat=cat, name=name, icon=icon, blurb=blurb, intro=intro, ui=ui,
                steps=steps, works=works, example=example, faqs=faqs, disclaimer=disclaimer, extra=extra)

TOOLS = {}

TOOLS["bijli-bill-calculator"] = _tool(
    "bijli-bill-calculator", "pakistan-calculators", "Bijli Bill Calculator", "💡",
    "Estimate your electricity bill from units, slab by slab, with GST.",
    "Use this bijli bill calculator Pakistan households rely on to estimate a monthly electricity bill from the units on your meter. Pick your consumer category, enter the units, and see the full slab-wise breakdown before the real bill arrives.",
    """
<label for="b-units">Units consumed (kWh)</label>
<input id="b-units" type="number" min="0" value="350">
<label for="b-cat">Consumer category</label>
<select id="b-cat">
  <option value="nonprotected" selected>Non-protected</option>
  <option value="protected">Protected (up to 200 units)</option>
  <option value="lifeline">Lifeline (up to 100 units)</option>
</select>
<div class="row2">
<div><label for="b-gst">GST % (editable)</label><input id="b-gst" type="number" step="0.1" value="18"></div>
<div><label for="b-extra">FPA / extra charges per unit, Rs (editable)</label><input id="b-extra" type="number" step="0.01" value="0"></div>
</div>
<p class="small">FPA is charged <strong>per unit</strong> — copy the small per-unit FPA rate from your bill, not the total FPA amount printed on it.</p>
<h3>Slab rates (Rs/unit — editable)</h3>
<p class="small">Base tariff per S.R.O. 279(I)/2026. Rates are editable because upper-slab figures can vary slightly between DISCO publications.</p>
<div id="b-rates"></div>
<button class="btn" id="b-calc" type="button">Calculate my bill</button>
<div class="result" id="b-result"></div>
""",
    ["Read the units consumed from your meter or last bill and type them in.",
     "Select your consumer category — Non-protected, Protected or Lifeline — and adjust GST or FPA only if you know your latest figures.",
     "Press Calculate to see the slab-wise breakdown and the estimated total."],
    "The bill is progressive: the first block of units is charged at the lowest rate, the next block at a higher rate, and so on — you never pay the top rate on all units. This calculator uses the base tariff per S.R.O. 279(I)/2026, before FPA (Fuel Price Adjustment), quarterly adjustments and fixed charges, so it is an estimate only and your DISCO bill (LESCO, IESCO, K-Electric and others) is final. Protected consumers lose protected status above 200 units, and lifeline rates stop applying above 100 units; the calculator applies those rules automatically and tells you when it does.",
    "Example: 350 units, Non-protected = 100 × Rs 22.44 + 100 × Rs 28.91 + 100 × Rs 33.10 + 50 × Rs 37.99 = Rs 10,344.50 base; plus 18% GST = Rs 12,206.51, about Rs 12,207.",
    [("How is a bijli bill calculated in Pakistan?", "Your units are split into slabs. Each slab is charged at its own rate, the amounts are added, extra charges such as FPA are added, and then 18% GST is applied on the total."),
     ("What is the difference between protected and non-protected consumers?", "Protected consumers use 200 units or less over the qualifying period and pay much lower slab rates. If consumption goes above 200 units, protected status is lost and all units are charged at non-protected rates."),
     ("What is FPA in an electricity bill?", "FPA is Fuel Price Adjustment — a monthly per-unit charge (sometimes a refund) that passes fuel cost changes to consumers. It changes month to month, so it is an editable field here and defaults to zero."),
     ("Why is my real bill different from this estimate?", "The real bill can include FPA, quarterly tariff adjustments, fixed charges, meter rent, TV fee and arrears, which vary by month and DISCO. This tool estimates from the base tariff per S.R.O. 279(I)/2026 only."),
     ("Does this work for LESCO, IESCO and K-Electric?", "Yes — the same notified national tariff structure applies across DISCOs, though small publication differences can occur, which is why the slab rates on this page are editable.")],
    True)

TOOLS["marla-kanal-converter"] = _tool(
    "marla-kanal-converter", "pakistan-calculators", "Marla / Kanal Converter", "🏠",
    "Convert Marla, Kanal, square feet, square yards, metres and acres instantly.",
    "This marla to kanal converter handles every land unit used in Pakistan property dealing. Enter any value, choose its unit, and get Marla, Kanal, square feet, square yards (gaj), square metres and acres in one table.",
    """
<label for="a-value">Area value</label>
<input id="a-value" type="number" min="0" value="1">
<label for="a-from">From unit</label>
<select id="a-from">
  <option value="kanal" selected>Kanal</option><option value="marla">Marla</option>
  <option value="sqft">Square Feet</option><option value="sqyard">Square Yard (Gaj)</option>
  <option value="sqm">Square Metre</option><option value="acre">Acre</option>
</select>
<button class="btn" id="a-calc" type="button">Convert</button>
<div class="result" id="a-result"></div>
""",
    ["Type the area you know, for example 10 in Marla.",
     "Choose the unit of that value from the list.",
     "Press Convert and read every other unit in the result table."],
    "All conversions go through square feet: 1 Marla = 272.25 sq ft, 1 Kanal = 20 Marla (5,445 sq ft), 1 Acre = 8 Kanal, 1 square yard = 9 sq ft and 1 square metre = 10.7639 sq ft. Note: in a few areas a smaller Marla of 225 sq ft is used locally — if your documents use that standard, confirm with your local records.",
    "Example: 1 Kanal = 20 Marla = 5,445 square feet = 605 square yards = about 505.86 square metres.",
    [("How many Marla are in one Kanal?", "There are exactly 20 Marla in 1 Kanal, using the standard Marla of 272.25 square feet."),
     ("How many square feet are in one Marla?", "One standard Marla is 272.25 square feet (16.5 × 16.5 feet). Some localities historically use a 225 sq ft Marla, so check your property documents."),
     ("How many Kanal are in one Acre?", "One acre equals 8 Kanal, which is 160 Marla or 43,560 square feet."),
     ("What is a Gaj in land measurement?", "Gaj is the local name for a square yard. One square yard equals 9 square feet, so 1 Marla is 30.25 Gaj."),
     ("Is 5 Marla a common plot size?", "Yes — 5 Marla (1,361.25 sq ft), 10 Marla and 1 Kanal are the most common residential plot sizes in Pakistan.")],
    False,
    """<h3>Quick conversion table</h3>
<table><tr><th>Unit</th><th>Marla</th><th>Square Feet</th></tr>
<tr><td>1 Marla</td><td>1</td><td>272.25</td></tr>
<tr><td>5 Marla</td><td>5</td><td>1,361.25</td></tr>
<tr><td>10 Marla</td><td>10</td><td>2,722.5</td></tr>
<tr><td>1 Kanal</td><td>20</td><td>5,445</td></tr>
<tr><td>1 Acre</td><td>160</td><td>43,560</td></tr></table>""")

TOOLS["salary-tax-calculator-pakistan"] = _tool(
    "salary-tax-calculator-pakistan", "pakistan-calculators", "Salary Tax Calculator 2025-26", "🧾",
    "Income tax on your salary with the 2025-26 slabs, plus the Section 4AB surcharge.",
    "This salary tax calculator Pakistan employees can trust uses the Finance Act 2025 slabs for tax year 2025-26. Enter your monthly or annual salary and see the tax, the Section 4AB surcharge where it applies, and your take-home pay.",
    """
<label for="t-monthly">Monthly salary (Rs)</label>
<input id="t-monthly" type="number" min="0" value="100000">
<label for="t-annual">OR annual salary (Rs) — leave monthly if you prefer</label>
<input id="t-annual" type="number" min="0" placeholder="Optional — overrides monthly × 12">
<button class="btn" id="t-calc" type="button">Calculate tax</button>
<div class="result" id="t-result"></div>
""",
    ["Enter your gross monthly salary — or your annual salary in the second box.",
     "Press Calculate tax.",
     "Read your annual and monthly tax, any surcharge, and your take-home salary."],
    "Salaried tax for 2025-26 is slab-based: no tax up to Rs 600,000 a year; 1% on the part between Rs 600,000 and Rs 1,200,000; then fixed amounts plus 11%, 23%, 30% and 35% on the parts in the higher slabs. On top of this, Section 4AB adds a surcharge of 9% of the tax when annual taxable income exceeds Rs 10,000,000 — the calculator shows it as its own line. These are the 2025-26 slabs under the Finance Act 2025; tax is normally withheld monthly by your employer.",
    "Example: a monthly salary of Rs 100,000 is Rs 1,200,000 a year. Tax = 1% of the Rs 600,000 above the exempt slab = Rs 6,000 per year, just Rs 500 a month; take-home is Rs 99,500 a month.",
    [("What is the tax-free salary limit in Pakistan for 2025-26?", "Salaried income up to Rs 600,000 per year (Rs 50,000 per month) is exempt from income tax in tax year 2025-26."),
     ("How much tax is deducted on a Rs 100,000 monthly salary?", "Rs 100,000 a month is Rs 1,200,000 a year, which gives a tax of Rs 6,000 per year — Rs 500 per month."),
     ("What is the Section 4AB surcharge?", "When annual taxable income exceeds Rs 10,000,000, an extra surcharge of 9% of the calculated income tax is charged under Section 4AB. This calculator shows it as a separate line."),
     ("Are salaried and non-salaried tax slabs the same?", "No. Salaried individuals have their own slab table, which is more favourable at lower incomes. This calculator uses the salaried table only."),
     ("Is this the final tax I will pay?", "It is an accurate estimate on salary alone. Other income, tax credits, deductible allowances and adjustments by your employer or in your annual return can change the final figure.")],
    True)

TOOLS["mdcat-aggregate-calculator"] = _tool(
    "mdcat-aggregate-calculator", "pakistan-calculators", "MDCAT Aggregate Calculator", "🩺",
    "Your MDCAT aggregate from Matric, FSc and MDCAT marks — 10/40/50 formula.",
    "This MDCAT aggregate calculator works out your merit aggregate exactly the way admissions do: 10% Matric, 40% FSc and 50% MDCAT. Enter obtained and total marks for each and see your aggregate percentage instantly.",
    """
<div class="row2"><div><label for="m-mat-o">Matric — obtained marks</label><input id="m-mat-o" type="number" min="0" value="900"></div>
<div><label for="m-mat-t">Matric — total marks</label><input id="m-mat-t" type="number" min="1" value="1100"></div></div>
<div class="row2"><div><label for="m-fsc-o">FSc — obtained marks</label><input id="m-fsc-o" type="number" min="0" value="950"></div>
<div><label for="m-fsc-t">FSc — total marks</label><input id="m-fsc-t" type="number" min="1" value="1100"></div></div>
<div class="row2"><div><label for="m-md-o">MDCAT — obtained marks</label><input id="m-md-o" type="number" min="0" value="170"></div>
<div><label for="m-md-t">MDCAT — total marks</label><input id="m-md-t" type="number" min="1" value="200"></div></div>
<button class="btn" id="m-calc" type="button">Calculate aggregate</button>
<div class="result" id="m-result"></div>
""",
    ["Enter your Matric obtained and total marks.",
     "Enter your FSc obtained and total marks, then your MDCAT marks.",
     "Press Calculate aggregate to see your merit percentage and each part's contribution."],
    "Aggregate = (Matric % × 10%) + (FSc % × 40%) + (MDCAT % × 50%). Each exam is first converted to a percentage, then weighted. Because MDCAT carries half the total weight, a small MDCAT improvement moves the aggregate more than the same improvement in Matric.",
    "Example: Matric 900/1100 (81.82%), FSc 950/1100 (86.36%), MDCAT 170/200 (85%) gives 8.18 + 34.55 + 42.50 = 85.23% aggregate.",
    [("What is the MDCAT aggregate formula?", "Matric counts 10%, FSc counts 40% and MDCAT counts 50%. Each is taken as a percentage of its total marks before weighting."),
     ("How much MDCAT score do I need for a good aggregate?", "It depends on your Matric and FSc marks, but because MDCAT is 50% of the aggregate, most students need 85% or above in MDCAT to stay competitive for public-sector colleges."),
     ("Does this calculator work for all provinces?", "The 10/40/50 weighting is the standard formula used for MDCAT admissions across Pakistan. Always confirm the current year's policy with the admitting university."),
     ("Can I use marks from improvement exams?", "Yes — enter whichever final marks appear on your result cards; the formula is the same.")],
    False)

TOOLS["zakat-calculator"] = _tool(
    "zakat-calculator", "pakistan-calculators", "Zakat Calculator", "🌙",
    "Zakat at 2.5% on cash, gold, silver and savings, checked against the notified nisab.",
    "This zakat calculator Pakistan Muslims can use before Ramadan or at their yearly Zakat date adds up your cash, gold, silver and other assets, deducts liabilities, checks the total against the government-notified nisab, and calculates 2.5% Zakat if nisab is reached.",
    """
<label for="z-cash">Cash in hand + bank balances (Rs)</label><input id="z-cash" type="number" min="0" value="0">
<label for="z-gold">Value of gold owned (Rs)</label><input id="z-gold" type="number" min="0" value="0">
<label for="z-silver">Value of silver owned (Rs)</label><input id="z-silver" type="number" min="0" value="0">
<p class="small">Gold and silver are entered as rupee values — if you know the weight instead, value = weight in tola × the current price per tola.</p>
<label for="z-other">Other zakatable assets — savings, business stock, money owed to you (Rs)</label><input id="z-other" type="number" min="0" value="0">
<label for="z-liab">Liabilities — debts you must repay (Rs)</label><input id="z-liab" type="number" min="0" value="0">
<label for="z-nisab">Nisab (Rs — editable)</label><input id="z-nisab" type="number" min="0">
<p class="small">Government-notified nisab for 1447 AH (Ramadan 2026): Rs 503,529 — based on 52.5 tola silver; editable.</p>
<button class="btn" id="z-calc" type="button">Calculate Zakat</button>
<div class="result" id="z-result"></div>
""",
    ["Add up your cash, bank balances, and the current value of gold and silver you own.",
     "Add other zakatable assets, subtract debts you must repay, and check the nisab figure.",
     "Press Calculate Zakat — if your net assets reach nisab, Zakat is 2.5% of the net amount."],
    "Zakat is 2.5% (one-fortieth) of net zakatable wealth held for a full lunar year, payable when that wealth reaches the nisab — the value of 52.5 tola silver (or 7.5 tola gold). Personal items such as your home, car and household goods are not zakatable. The nisab field uses the Government-notified nisab for 1447 AH (Ramadan 2026): Rs 503,529, based on 52.5 tola silver, and stays editable for later years.",
    "Example: net assets of Rs 1,000,000 are above the Rs 503,529 nisab, so Zakat due = 2.5% × 1,000,000 = Rs 25,000.",
    [("What is the nisab for Zakat in 2026?", "The Government-notified nisab for 1447 AH (Ramadan 2026) is Rs 503,529, based on the value of 52.5 tola silver. If your net zakatable assets are below this, Zakat is not due."),
     ("How much Zakat is charged on cash and savings?", "2.5% of the total net amount, once it reaches nisab and a lunar year has passed over it."),
     ("Is Zakat due on the house I live in and my car?", "No. Your residence, personal car and household items are not zakatable. Zakat applies to cash, gold, silver, savings and trade goods beyond personal use."),
     ("Should I deduct my debts?", "Yes — money you genuinely owe and must repay is deducted before checking nisab and calculating the 2.5%."),
     ("When should Zakat be paid?", "Many people choose a fixed date in Ramadan each year. What matters is that a full lunar year (hawl) has passed over the wealth.")],
    True)

TOOLS["image-compressor-to-kb"] = _tool(
    "image-compressor-to-kb", "image-tools", "Image Compressor to KB", "🗜️",
    "Shrink a JPG or PNG to an exact KB size for online forms — without uploading it.",
    "Need to compress image to KB size for a job application, admission form or portal that rejects big files? Choose your photo, set the target size in KB, and this tool recompresses it on your own device until it fits.",
    """
<label for="c-file">Choose an image (JPG / PNG)</label><input id="c-file" type="file" accept="image/*">
<label for="c-target">Target size (KB)</label><input id="c-target" type="number" min="10" value="200">
<button class="btn" id="c-go" type="button">Compress image</button>
<p id="c-status"></p>
<div class="result" id="c-result"></div>
""",
    ["Choose the image from your phone or computer.",
     "Type the target size in KB — for example 200, the limit on many Pakistani online forms.",
     "Press Compress and download the smaller JPG when it is ready."],
    "The tool first lowers the JPEG quality step by step; if the target is still not reached, it gradually reduces the image dimensions as well. Everything runs in your browser with the Canvas API — the image is never uploaded to any server.",
    "Example: a 3 MB phone photo usually compresses to under 200 KB at good readable quality, small enough for NADRA-style and university admission portals.",
    [("Why do online forms ask for images under 200 KB or 100 KB?", "Portals limit file sizes to keep uploads fast and storage small. Photos straight from a phone camera are often 2–5 MB, so they must be compressed first."),
     ("Will compressing reduce my photo quality?", "A little, but at typical form sizes (200 KB) the result stays clear. Documents and ID photos remain readable; very small targets like 20 KB will look softer."),
     ("Is my image uploaded to your server?", "No. Compression happens inside your browser on your device. Your files never leave your device."),
     ("Which formats can I compress?", "Any image your browser can open — JPG, PNG, WebP and most phone formats. The output is always a JPG, which gives the smallest size.")],
    False)

TOOLS["passport-size-photo-maker"] = _tool(
    "passport-size-photo-maker", "image-tools", "Passport Size Photo Maker", "🪪",
    "Turn any photo into a correct 35 × 45 mm passport-size photo, ready to print or upload.",
    "This passport size photo maker online tool crops your picture to the official 35 × 45 mm ratio and exports it at 413 × 531 pixels (300 DPI) — the size used for Pakistani passports, CNIC-related forms and most visa applications. It can also remove the background of your photo and replace it with plain white or blue, and make a 4-copy print sheet for the studio.",
    """
<p class="note">📸 For the best result, choose a clear, front-facing photo in good light. The tool uses a photo-grade AI model to remove the background — even a busy background — and replace it with white or blue (pick below), keeping hair edges clean. The first time you use it, the AI model downloads once (about 190 MB, so use Wi-Fi if you can); after that it stays cached, runs right on your device, and your photo is never uploaded. Tip: take earphones and loose wires off before the photo — thin wires can confuse the AI.</p>
<label for="p-file">Choose your photo</label><input id="p-file" type="file" accept="image/*">
<label for="p-zoom">Zoom (1 = whole photo, higher = closer face crop)</label>
<input id="p-zoom" type="range" min="1" max="2.5" step="0.05" value="1">
<label for="p-bg">Background</label>
<select id="p-bg">
<option value="white" selected>White — remove my background</option>
<option value="blue">Blue — remove my background</option>
<option value="keep">Keep the original background</option>
</select>
<p id="p-preload" class="note" style="display:none"></p>
<button class="btn" id="p-go" type="button">Make passport photo</button>
<button class="btn secondary" id="p-sheet" type="button">Make print sheet (4 copies, 4 × 6 inch)</button>
<p id="p-status"></p>
<div id="p-result"></div>
""",
    ["Choose a clear front-facing photo — a plain wall behind you gives the cleanest background removal.",
     "Adjust the zoom slider so your face fills the frame the way you want, and pick White, Blue or Keep original as the background.",
     "Press Make passport photo and download the 413 × 531 px JPG. For the studio, also make the print sheet — 4 copies on one 4 × 6 inch page."],
    "Passport photos are 35 mm wide and 45 mm high. At print quality (300 DPI) that is 413 × 531 pixels. The tool centre-crops your picture to the 35:45 ratio — keeping the face area — and places it on a white background at exactly that size.",
    "Example: a normal selfie cropped with zoom 1.4 usually frames the head and shoulders correctly for a 35 × 45 mm print.",
    [("What is the passport photo size in Pakistan?", "35 × 45 mm, which is 413 × 531 pixels at 300 DPI. This is the size this tool produces."),
     ("Can I use this photo for online forms?", "Yes — the JPG is sized for both printing and uploading. If a form also has a KB limit, run the result through our Image Compressor to KB tool."),
     ("What background should a passport photo have?", "A plain white background is the standard requirement (some forms ask for blue). This tool removes your photo's background with a photo-grade AI matting model — it works on busy backgrounds too, not just plain walls, and keeps hair edges clean — and replaces it with white or blue. The AI model downloads once (about 190 MB) and then runs entirely on your device; your photo is never uploaded."),
     ("Is my photo uploaded anywhere?", "No. The crop is made in your browser; your files never leave your device.")],
    False)

TOOLS["image-converter"] = _tool(
    "image-converter", "image-tools", "Image Converter", "🔄",
    "Convert images between JPG, PNG and WebP formats in your browser.",
    "Use this image converter jpg to png, PNG to JPG or anything to WebP — without installing an app. Choose a file, pick the output format, and download the converted image, all on your own device.",
    """
<label for="v-file">Choose an image</label><input id="v-file" type="file" accept="image/*">
<label for="v-format">Convert to</label>
<select id="v-format"><option value="image/jpeg">JPG</option><option value="image/png">PNG</option><option value="image/webp">WebP</option></select>
<button class="btn" id="v-go" type="button">Convert image</button>
<p id="v-status"></p>
<div class="result" id="v-result"></div>
""",
    ["Choose the image you want to convert.",
     "Select the output format — JPG, PNG or WebP.",
     "Press Convert and download the new file."],
    "The image is drawn onto a browser canvas and re-encoded in the chosen format. JPG gives the smallest files for photos, PNG keeps sharp edges and transparency, and WebP usually gives the best size-to-quality balance. Transparent areas become white when converting to JPG, because JPG has no transparency.",
    "Example: a 1.2 MB PNG screenshot typically converts to a JPG of about 150–250 KB at quality 0.92.",
    [("Which format is smallest for photos?", "WebP is usually smallest, with JPG close behind and universally accepted. PNG is best for screenshots, logos and images with transparency."),
     ("Why did my transparent image get a white background?", "JPG and (in this tool) flattened WebP do not keep transparency in the same way; transparent pixels are placed on white. Choose PNG output to keep transparency."),
     ("Is there a file size limit?", "There is no server limit because nothing is uploaded. Very large images (50 MP+) may be slow on older phones."),
     ("Are my images uploaded?", "No. Conversion happens in your browser; your files never leave your device.")],
    False)

TOOLS["merge-pdf"] = _tool(
    "merge-pdf", "pdf-tools", "Merge PDF", "📎",
    "Combine several PDFs into one file — privately, in your browser.",
    "Merge PDF online free without handing your documents to a stranger's server. Select two or more PDFs, press Merge, and download one combined file. The files are joined inside your browser in the order you selected them.",
    """
<label for="mp-files">Choose PDF files (2 or more)</label>
<input id="mp-files" type="file" accept="application/pdf" multiple>
<button class="btn" id="mp-go" type="button">Merge PDFs</button>
<p id="mp-status"></p>
<div id="mp-result"></div>
""",
    ["Select all the PDF files you want to combine.",
     "Check the file names shown — pages will be added in that order.",
     "Press Merge PDFs and download the combined file."],
    "When you press Merge, a small open-source PDF library (pdf-lib) is loaded on demand and runs entirely in your browser tab. Each source PDF's pages are copied into one new document. Nothing is uploaded, stored or tracked.",
    "Example: combine a CNIC scan PDF, a degrees PDF and an experience letter PDF into one file for a job application portal that accepts a single upload.",
    [("Is it safe to merge private documents here?", "Yes — the merging happens on your device. Your PDFs are never uploaded to a server, so bank statements, ID documents and certificates stay private."),
     ("In what order are the PDFs merged?", "In the order the files are listed after selection. On most phones and computers that is the order you tapped them."),
     ("Is there a limit on file size or pages?", "Only your device's memory. Typical application documents (a few MB each) merge quickly."),
     ("Why did merging fail?", "A file may be corrupted, password-protected, or the PDF library could not load because of a connection problem. You will see a clear message — fix the file or connection and try again.")],
    False)

TOOLS["split-pdf"] = _tool(
    "split-pdf", "pdf-tools", "Split PDF", "✂️",
    "Extract the pages you need from a PDF into a new, smaller file.",
    "Split PDF online free by extracting only the pages you need. Enter a page range like 1-3, 5 and download a new PDF with just those pages — processed privately in your browser, never uploaded.",
    """
<label for="sp-file">Choose a PDF file</label><input id="sp-file" type="file" accept="application/pdf">
<label for="sp-range">Pages to extract (e.g. 1-3, 5, 8-10)</label>
<input id="sp-range" type="text" value="1-3" placeholder="1-3, 5">
<button class="btn" id="sp-go" type="button">Extract pages</button>
<p id="sp-status"></p>
<div id="sp-result"></div>
""",
    ["Choose the PDF you want to split.",
     "Type the pages to keep, using ranges and commas — for example 1-3, 5.",
     "Press Extract pages and download the new smaller PDF."],
    "A PDF library (pdf-lib) loads on demand in your browser, reads the page count, copies only the pages in your range into a fresh document, and offers it as a download. Invalid page numbers are ignored safely, and the tool tells you if no valid pages remain.",
    "Example: from a 20-page bank statement, extract pages 1-2 only for an application that asks for the summary pages.",
    [("How do I write the page range?", "Use commas for separate pages and hyphens for ranges: 1-3, 5, 8-10 extracts pages 1, 2, 3, 5, 8, 9 and 10."),
     ("Is my PDF uploaded to a server?", "No. Splitting happens in your browser on your device."),
     ("Can I split a password-protected PDF?", "No — protected files must be unlocked first with their password in another app."),
     ("Will the extracted PDF keep its quality?", "Yes. Pages are copied exactly as they are — no re-compression or quality loss.")],
    False)

TOOLS["jpg-to-pdf"] = _tool(
    "jpg-to-pdf", "pdf-tools", "JPG to PDF Converter", "🖼️",
    "Images to PDF — and PDF pages back to JPG — in one private tool.",
    "This jpg to pdf converter does both directions: turn one or more JPG/PNG images into a single PDF, or render every page of a PDF into JPG images. Everything happens in your browser — no uploads, no sign-up.",
    """
<h3>Mode 1 — Images to PDF</h3>
<label for="j-files">Choose images (JPG / PNG)</label>
<input id="j-files" type="file" accept="image/jpeg,image/png" multiple>
<button class="btn" id="j-go" type="button">Convert images to PDF</button>
<p id="j-status"></p>
<div id="j-result"></div>
<h3>Mode 2 — PDF to JPG</h3>
<label for="pj-file">Choose a PDF file</label>
<input id="pj-file" type="file" accept="application/pdf">
<button class="btn secondary" id="pj-go" type="button">Convert PDF pages to JPG</button>
<p id="pj-status"></p>
<div id="pj-result"></div>
""",
    ["For images to PDF: select your images and press Convert images to PDF — each image becomes one page, in order.",
     "For PDF to JPG: select a PDF and press Convert PDF pages to JPG.",
     "Download the PDF, or each page's JPG from the links that appear."],
    "Images-to-PDF uses pdf-lib (loaded on demand): each image is embedded on a page of its own size. PDF-to-JPG uses pdf.js (also loaded on demand) to render every page at double size and save it as a JPG. Both run fully in your browser.",
    "Example: photograph three pages of a form, convert them to one PDF, and upload that single file to an application portal.",
    [("Can I put several images into one PDF?", "Yes — select multiple images and they become consecutive pages of one PDF, in selection order."),
     ("What quality are the PDF-to-JPG images?", "Pages are rendered at 2× scale, which is sharp enough for sharing and re-uploading to forms."),
     ("Are my files uploaded?", "No. Both conversions run in your browser; your files never leave your device."),
     ("Which image types work for images-to-PDF?", "JPG and PNG. Other formats can be converted first with our Image Converter tool.")],
    False)

TOOLS["age-calculator"] = _tool(
    "age-calculator", "everyday-calculators", "Age & Date Difference Calculator", "🎂",
    "Exact age in years, months and days — plus the difference between any two dates.",
    "This age calculator gives your exact age — not just the year count, but years, months and days, with totals in days and weeks. It also has a date difference mode for finding the exact gap between any two dates.",
    """
<h3>Your exact age</h3>
<label for="dob">Date of birth</label><input id="dob" type="date" value="2000-01-01">
<label for="age-at">Age at date</label><input id="age-at" type="date">
<button class="btn" id="age-go" type="button">Calculate age</button>
<div class="result" id="age-result"></div>
<h3>Difference between two dates</h3>
<label for="d1">First date</label><input id="d1" type="date" value="2024-01-01">
<label for="d2">Second date</label><input id="d2" type="date">
<button class="btn secondary" id="dd-go" type="button">Calculate difference</button>
<div class="result" id="dd-result"></div>
""",
    ["Enter your date of birth.",
     "Leave 'Age at date' as today, or pick any date — a job application deadline, for example.",
     "Press Calculate age for the exact figure in years, months, days and total days."],
    "The calculator counts full calendar years first, then full months, then the remaining days — the same method used on official forms. Total days are counted exactly between the two dates, and total weeks are whole weeks within that count.",
    "Example: born on 1 January 2000, your age on 1 January 2025 is exactly 25 years, 0 months, 0 days — 9,132 days in total, including leap days.",
    [("Why do forms ask for age in years, months and days?", "Many Pakistani government job and admission forms set age limits like '25 years on the closing date'. An exact years-months-days figure shows immediately whether you are within the limit."),
     ("Does the calculator count leap years correctly?", "Yes — total days are counted from the actual calendar, so 29 February leap days are included."),
     ("Can I check my age on a future date?", "Yes. Set 'Age at date' to any future date, such as an application closing date."),
     ("What is the date difference mode for?", "It finds the exact gap between any two dates — useful for service duration, tenancy periods or counting days between events.")],
    False)

TOOLS["wedding-invitation-maker"] = _tool(
    "wedding-invitation-maker", "cards-invitations", "Wedding Invitation Maker", "💌",
    "Make a digital wedding invitation with opening curtains, music, countdown and WhatsApp RSVP.",
    "Create a beautiful digital wedding invitation — dawwat-nama — right on your phone. Fill in the names, dates and venue, choose a curtain, door or floral-arch opening, and share a link on WhatsApp: when your guest taps it, the doors open with music, a scratch card reveals the date, a live countdown runs, and they can RSVP back on WhatsApp. The cover carries one couple photo — your own (its background is removed by the same AI as our passport photo tool, then a small copy travels inside the link itself) or a built-in illustrated couple shot that matches your colour theme.",
    """
<label for="w-groom">Dulha (groom) — name in English</label>
<input id="w-groom" type="text" value="Muhammad Ahmed">
<label for="w-bride">Dulhan (bride) — name in English</label>
<input id="w-bride" type="text" value="Fatima Noor">
<div class="row2">
<div><label for="w-groom-u">Dulha ka naam Urdu mein (optional)</label><input id="w-groom-u" type="text" value="محمد احمد"></div>
<div><label for="w-bride-u">Dulhan ka naam Urdu mein (optional)</label><input id="w-bride-u" type="text" value="فاطمہ نور"></div>
</div>
<label for="w-host">Dawwat dene wale (hosts)</label>
<input id="w-host" type="text" value="Mr. &amp; Mrs. Muhammad Siddique">
<div class="row2">
<div><label for="w-groom-fam">Dulha ki family line</label><input id="w-groom-fam" type="text" value="son of Mr. &amp; Mrs. Muhammad Siddique"></div>
<div><label for="w-bride-fam">Dulhan ki family line</label><input id="w-bride-fam" type="text" value="daughter of Mr. &amp; Mrs. Tariq Mehmood"></div>
</div>
<div class="row2">
<div><label for="w-style">Khulne wala andaaz (opening style)</label>
<select id="w-style">
<option value="doors2" selected>Darwaza + Parda (do layers — pehle darwaze khulenge, phir parday)</option>
<option value="tieback">Bandha hua Parda (touch karne par fold ho jata hai)</option>
<option value="curtain">Surkh Parda (red curtains)</option>
<option value="doors">Sunahre Darwaze (golden doors)</option>
<option value="arch">Gulon wala Mehrab (floral arch)</option>
</select></div>
<div><label for="w-pal">Rang (colour theme)</label>
<select id="w-pal">
<option value="maroon" selected>Maroon &amp; Gold</option>
<option value="green">Sabz (emerald) &amp; Gold</option>
<option value="royal">Shahi Neela (royal blue) &amp; Gold</option>
</select></div>
</div>
<label for="w-tune">Mehman ke liye dhun (built-in tune)</label>
<select id="w-tune">
<option value="strings" selected>🎻 Taar wali dhun (plucked strings)</option>
<option value="bells">🔔 Ghanti wali dhun (soft bells)</option>
<option value="drone">🎶 Tanpura dhun (drone)</option>
<option value="none">Koi dhun nahi (no music)</option>
</select>
<h3>Program (events)</h3>
<div class="row2">
<div><label for="w-ev1-n">Event 1</label><input id="w-ev1-n" type="text" value="Mehndi"></div>
<div><label for="w-ev1-d">Date</label><input id="w-ev1-d" type="date" value="2026-12-18"></div>
</div>
<div class="row2">
<div><label for="w-ev1-t">Time</label><input id="w-ev1-t" type="text" value="7:00 PM"></div>
<div><label for="w-ev1-v">Jagah / note</label><input id="w-ev1-v" type="text" value="Royal Palm Marquee, Faisalabad"></div>
</div>
<div class="row2">
<div><label for="w-ev2-n">Event 2 (main)</label><input id="w-ev2-n" type="text" value="Barat"></div>
<div><label for="w-ev2-d">Date</label><input id="w-ev2-d" type="date" value="2026-12-19"></div>
</div>
<div class="row2">
<div><label for="w-ev2-t">Time</label><input id="w-ev2-t" type="text" value="7:00 PM"></div>
<div><label for="w-ev2-v">Jagah / note</label><input id="w-ev2-v" type="text" value="Royal Palm Marquee, Faisalabad"></div>
</div>
<div class="row2">
<div><label for="w-ev3-n">Event 3 (optional)</label><input id="w-ev3-n" type="text" value="Walima"></div>
<div><label for="w-ev3-d">Date</label><input id="w-ev3-d" type="date" value="2026-12-20"></div>
</div>
<div class="row2">
<div><label for="w-ev3-t">Time</label><input id="w-ev3-t" type="text" value="7:00 PM"></div>
<div><label for="w-ev3-v">Jagah / note</label><input id="w-ev3-v" type="text" value="Royal Palm Marquee, Faisalabad"></div>
</div>
<p class="small">The Barat (event 2) is treated as the main event — the scratch card, countdown and calendar file use its date. Leave event 3's name empty to skip it.</p>
<label for="w-venue">Venue (main jagah)</label>
<input id="w-venue" type="text" value="The Royal Palm Marquee">
<label for="w-addr">Venue ka pata (address)</label>
<input id="w-addr" type="text" value="Main Boulevard, Faisalabad">
<div class="row2">
<div><label for="w-dress">Dress code (optional)</label><input id="w-dress" type="text" value="Formal"></div>
<div><label for="w-rsvp">RSVP WhatsApp number</label><input id="w-rsvp" type="text" value="0300 1234567"></div>
</div>
<button class="btn" id="w-makelink" type="button">💌 Invitation ka link banayein</button>
<div class="result" id="w-linkresult"></div>
<h3>Apni dhun (sirf apne preview ke liye)</h3>
<p class="small">Mehman ke link mein built-in dhun chalegi — apni MP3 mehman ke link mein nahi ja sakti. Lekin jab aap "Preview — mehman ki nazar se" kholte hain to wahan apni MP3 sun sakte hain.</p>
<button class="btn" id="w-mp3btn" type="button">🎵 Apni MP3 chunein</button>
<input id="w-mp3file" type="file" accept="audio/*" style="display:none">
<div id="w-mp3name" class="small"></div>
<h3>Cover photo — dulha-dulhan ki Aik photo</h3>
<p class="small">Har card mein couple ki Aik hi photo lagti hai — main cover par, jahan se invitation khulta hai. Apni photo ka background AI se remove hoga (wahi engine jo hamare Passport Photo tool mein hai — ~190 MB model pehli dafa download hota hai), phir photo ki chhoti compressed copy link ke andar mehman tak jati hai. Photo kisi server par upload nahi hoti.</p>
<label for="w-photo">Couple ki photo chunein</label>
<input id="w-photo" type="file" accept="image/*">
<label for="w-photobg">Photo ka naya background</label>
<select id="w-photobg">
<option value="gold" selected>Sunehra (golden glow)</option>
<option value="maroon">Maroon sajawat</option>
<option value="garden">Sabz bagh (garden green)</option>
<option value="sky">Halka neela (soft sky)</option>
</select>
<button class="btn" id="w-photogo" type="button">✂️ Background remove karein</button>
<div id="w-photostatus" class="small"></div>
<div class="result" id="w-photoresult"></div>
<h3>Ya tayyar couple shot chunein</h3>
<p class="small">Apni photo istemal nahi karna chahte to template se milta hua aik tayyar couple shot cover par laga dein — jo rang (palette) upar chuna hai, usi ka shot aam taur par sab se acha lagta hai. Agar apni photo tayyar ki hui hai aur yahan koi shot nahi chuna to cover par apni photo lagegi.</p>
<div id="w-shots"></div>
""",
    ["Fill in the couple's names, the hosts, the event dates and the venue — the sample names show you exactly what to type.",
     "Choose an opening style (curtains, golden doors or a floral arch), a colour theme and a built-in tune, then press the link button.",
     "Share the link on WhatsApp. Guests tap to open: the doors open with music, they scratch to reveal the date, watch the live countdown and RSVP back to your WhatsApp number.",
     "Optionally add the couple's photo as the cover — the AI removes its background — or pick a built-in couple shot that matches your colour theme."],
    "Everything happens on your device. Your details travel inside the invitation link itself (compressed into the web address), not to any server — PakToolkit never sees your names, dates or photos. The guest's phone rebuilds the invitation from the link. One cover photo can travel inside the link: it is shrunk to a small cover-sized copy and encoded into the link itself, so guests see it on the cover the moment the invitation opens — it is never uploaded anywhere. The music in a guest's link is one of the built-in tunes, generated by the phone itself; your own MP3 can be used in your own preview.",
    "Example: Ahmed and Fatima's invitation opens with red curtains, their names in Nastaleeq, a scratch card revealing 'Saturday, 19 December 2026 — Barat, 7:00 PM', a live countdown, and an RSVP button that messages the host's WhatsApp.",
    [("Is the wedding invitation maker free?", "Yes — completely free, no sign-up and no watermark. Make as many invitations as you like."),
     ("How do guests open the invitation?", "You send them a link on WhatsApp. Tapping it opens the invitation in their browser — curtains or doors open with music, and they can scratch to reveal the date, save it to their calendar and RSVP on WhatsApp."),
     ("Can I use my own song in the invitation?", "In your own preview, yes — pick any MP3 from your phone and it plays when you preview the invitation. In the link you send guests, a built-in tune is used instead, because a song file is far too large to travel inside a link."),
     ("How does the couple's photo reach my guests?", "Your photo sits on the invitation's cover. A small, cover-sized copy of it is encoded into the invitation link itself, so guests see it as soon as the invitation opens — nothing is uploaded to any server. If you prefer not to use a personal photo, pick one of the built-in illustrated couple shots instead."),
     ("Is my data uploaded anywhere?", "No. The maker runs entirely in your browser. Your details are compressed into the link itself, and your photo is processed on your device by the same on-device AI as our passport photo tool."),
     ("Can I change the dates or names later?", "Yes — just edit the form and make a new link. Old links keep showing the old details, so send the new link to your guests.")],
    False)

TOOLS["ramadan-calendar-maker"] = _tool(
    "ramadan-calendar-maker", "cards-invitations", "Ramadan Calendar Maker", "🌙",
    "Make a printable Ramadan calendar with your city Sehri & Iftar times and your own shop or name band — free design included.",
    "Use this Ramadan calendar maker to create a beautiful Ramadan calendar for your city in the style of the printed calendars every Pakistani home and shop knows: a ready design with a band — a patti — in the middle for your own shop, business or family name, phone numbers and address. Pick your city, set the first day of Ramadan, fill your band, and the maker computes all 30 days of Sehri and Iftar times on your device using the University of Islamic Sciences, Karachi method, arranged in the three ashras (Rahmat, Maghfirat, Najaat) with each ashra's dua. Download it as a picture for WhatsApp or print it on A4. All three designs are completely free.",
    """
<label for="r-city">Sheher (city) — auqaat is sheher ke honge</label>
<select id="r-city"></select>
<label for="r-start">Pehla Roza (first day of Ramadan)</label>
<input id="r-start" type="date" value="2027-02-08">
<p class="small">Ramadan 1448 ka pehla roza mutawaqqa tor par 8 February 2027 hai. Chaand ke elan ke baad tareekh aik din badalna ho to yahan badal dein — puri table khud dobara ban jayegi.</p>
<h3>Aap ki patti (your name band)</h3>
<label for="r-name">Naam — dukaan / business / shakhs</label>
<input id="r-name" type="text" value="صدیق برادرز جنرل سٹور">
<label for="r-svc">Kaam / services ki line (optional)</label>
<input id="r-svc" type="text" value="کریانہ، روزمرہ اشیاء اور رمضان پیکج کی خصوصی سہولت">
<div class="row2">
<div><label for="r-ph1">Phone / mobile 1</label><input id="r-ph1" type="text" value="0300-1234567"></div>
<div><label for="r-ph2">Phone / mobile 2 (optional)</label><input id="r-ph2" type="text" value="0321-7654321"></div>
</div>
<label for="r-addr">Pata / area (optional)</label>
<input id="r-addr" type="text" value="مین بازار، فیصل آباد">
<h3>Header ki tasveer chunein</h3>
<div id="r-photos" class="rphotos"></div>
<p class="small">Tasaveer Wikimedia Commons se, muft license ke saath: Roza-e-Rasool ﷺ — TheHadiRahim (CC0) · Khana Kaaba — Adli Wahid (CC BY-SA 4.0) · Badshahi Masjid — Zapata1000 (CC BY-SA 4.0) · Data Darbar — Guilhem Vellut (CC BY 2.0).</p>
<h3>Design chunein</h3>
<div id="r-designs" class="rdesigns"></div>
<div class="row2">
<button id="r-png" class="btn" type="button">🖼️ Tasveer (PNG) download</button>
<button id="r-print" class="btn" type="button">🖨️ Print / PDF</button>
</div>
<div id="r-status" class="result" role="status"></div>
<h3>Calendar — live preview</h3>
<div id="r-sheet"></div>
""",
    ["Pick your city and check the first day of Ramadan — 8 February 2027 is the expected date for 1448, and you can shift it by a day after the moon announcement.",
     "Fill your patti: your shop, business or family name in big letters, an optional line about your work, up to two phone numbers and your area.",
     "Choose any of the three free designs — green, royal blue or maroon — whichever suits your shop or family.",
     "Download the calendar as a picture and share it on WhatsApp, or print it on A4 and put it on the wall — just like the press-printed calendars, without the press."],
    "Everything is computed inside your browser. The maker uses the standard solar calculation behind the University of Islamic Sciences, Karachi method (Fajr at 18 degrees, Iftar at sunset) for the latitude and longitude of your chosen city, so all 30 days update instantly when you change the city or the start date. Your name, numbers and address are typed straight into the design on your own device — nothing is uploaded or stored anywhere.",
    "Example: a Faisalabad general store makes a calendar headed 'Siddique Brothers General Store' with its two mobile numbers and 'Main Bazaar, Faisalabad' on the band; the table shows 1 Ramadan on Monday 8 February 2027 with Sehri 5:33 AM and Iftar 5:48 PM, and the shop sends the picture to all its customers on WhatsApp before Ramadan begins.",
    [("Is the Ramadan calendar maker free?", "Yes — completely free, with no sign-up and no watermark. All three designs (green, royal blue and maroon) and all four header photos are free for everyone."),
     ("How accurate are the Sehri and Iftar times?", "They are computed with the University of Islamic Sciences, Karachi method — the same basis as most printed Pakistani calendars — for your city's exact location. They match published Faisalabad timetables to the minute. Still, treat your local mosque's announcement as final, especially for the first and last fasts."),
     ("What if Ramadan starts a day earlier or later?", "Just change the 'Pehla Roza' date — the whole 30-day table, the weekdays and the ashra blocks rebuild instantly around the new start date."),
     ("I follow Fiqh Jafria. Are these times for me?", "The printed times follow the Hanafi (Karachi) method. For Fiqh Jafria, Sehri ends about 10 minutes earlier and Iftar is about 10 minutes after the shown Maghrib time — the calendar's footer notes this too."),
     ("Can I put my shop's name and phone number on the calendar?", "That is exactly what the patti (band) is for — your name in big Nastaleeq letters, your work line, two phone numbers and your area, just like the calendars printing presses make. Type them in and the preview updates as you type."),
     ("Is my information uploaded anywhere?", "No. The maker runs entirely in your browser; your name, numbers and address never leave your device.")],
    False)

HOME_FAQS = [
    ("Are PakToolkit tools really free?", "Yes. Every tool on PakToolkit is free to use, with no sign-up and no account. Open a tool and use it — that is all."),
    ("Are my files uploaded to your server?", "No. Every tool runs inside your browser on your own device. Your images, PDFs and numbers never leave your device, and we cannot see them."),
    ("Why does PakToolkit focus on Pakistan?", "Global tool sites do not offer a bijli bill calculator with Pakistani tariff slabs, MDCAT aggregate, salary tax 2025-26 or a Marla/Kanal converter. PakToolkit starts with the tools Pakistan actually searches for, plus universal image and PDF tools."),
    ("Do the calculators give final official figures?", "They give accurate estimates from published rates. For money matters, the official figure — your DISCO bill, FBR assessment or the notified nisab — is always final. Each calculator page explains its basis."),
]

TRUST = {
    "about": ("About PakToolkit", [
        ("What PakToolkit is", "PakToolkit is a free online tools website made for Pakistan, live at paktoolkit.top. It brings together two kinds of tools: Pakistan-specific calculators that global websites simply do not offer — a bijli (electricity) bill calculator using the notified tariff, a salary tax calculator for 2025-26, an MDCAT aggregate calculator, a zakat calculator using the government-notified nisab, and a Marla/Kanal land converter — and universal image and PDF tools (compress to KB, passport-size photo maker, image converter, merge/split PDF, JPG to PDF) that everyone needs."),
        ("How it works", "Every tool runs 100% inside your browser. There is no server processing your files, no upload, no account and no sign-up. When you compress a photo or merge a PDF on PakToolkit, the work happens on your own phone or computer and your file never travels anywhere."),
        ("Who runs it", "PakToolkit is an independent Pakistani project, run by the same maker behind mrjobs.top, a free job board for Pakistan. Tool ideas and corrections from visitors directly shape what gets built next — send yours through the Contact page."),
    ]),
    "contact": ("Contact PakToolkit", [
        ("Get in touch", "For suggestions, corrections (especially if a rate or slab looks out of date), or a new tool you wish existed, write to us at sufyanbarret@gmail.com. We read every message."),
        ("What to include", "Tell us which tool you used, what you entered, and what you expected. For calculator corrections, a link to the official source (NEPRA, FBR, your DISCO or a board/university notice) helps us fix things fastest."),
        ("Response time", "PakToolkit is run by a small team, so replies can take a few days. Urgent calculator errors reported with an official source are fixed on priority."),
    ]),
    "privacy-policy": ("Privacy Policy", [
        ("The short version", "PakToolkit tools run in your browser. We do not upload, receive, store or sell your files or the numbers you enter into calculators. There are no user accounts on PakToolkit."),
        ("Your files and inputs", "Images, PDFs and documents you open in a tool are processed locally on your device by JavaScript in the page. They are never transmitted to us or to any third party by the tools themselves. Closing the tab removes everything."),
        ("What the website itself loads", "PakToolkit pages are static files. PDF tools load open-source libraries (pdf-lib and pdf.js) from a public CDN (jsDelivr) only when you use those tools; those libraries run locally in your browser. Standard web hosting logs (such as IP address and page requested) may be kept by the hosting provider for security and are not used to identify individual tool usage."),
        ("Cookies and analytics", "PakToolkit does not set advertising cookies of its own. If privacy-friendly analytics are added in future, this policy will be updated here first."),
        ("Changes", "If this policy changes, the new version will be published on this page. Questions about privacy can be sent via the Contact page."),
    ]),
    "terms": ("Terms of Use", [
        ("Using the tools", "PakToolkit tools are provided free of charge for personal and business use, as-is. You may use the files and results they produce for any lawful purpose."),
        ("Accuracy", "Calculators use published rates and formulas that we work to keep current, but rates, slabs and rules change through official notifications. Results are estimates for guidance; official figures from the relevant authority (your electricity DISCO, FBR, an admitting university, or the notified nisab) are always final. PakToolkit is not responsible for decisions taken solely on the basis of an estimate."),
        ("Your responsibility", "You are responsible for the files you process and for checking results before submitting them to any official portal. Do not use these tools for unlawful purposes."),
        ("Availability", "We aim to keep PakToolkit online and fast, but uninterrupted availability is not guaranteed. Tools may be updated, improved or removed without notice."),
    ]),
    "disclaimer": ("Disclaimer", [
        ("Estimates, not official figures", "Every calculator on PakToolkit — bijli bill, salary tax, zakat, MDCAT aggregate and the rest — provides an estimate calculated from published rates, slabs and formulas. The official document always wins: your DISCO-issued electricity bill, an FBR assessment, a university merit list or a government notification overrides anything shown here."),
        ("Rates change", "Electricity tariffs, tax slabs and the zakat nisab are revised through official notifications from time to time. We update PakToolkit after such changes and, where a figure can vary, we make it editable on the page itself so you can match your latest official document."),
        ("No professional advice", "Nothing on PakToolkit is legal, tax, religious or financial advice. For personal decisions — especially zakat and tax — consult a qualified scholar or professional alongside the official sources."),
    ]),
}
