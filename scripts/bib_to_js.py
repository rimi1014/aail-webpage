#!/usr/bin/env python3
"""
Converts data/publications.bib -> data/publications.js
Pure Python — no external dependencies required.
Run automatically by GitHub Actions when publications.bib is pushed.
"""

import re
import sys
import os


MONTHS = {
    '1': 'January', '2': 'February', '3': 'March', '4': 'April',
    '5': 'May', '6': 'June', '7': 'July', '8': 'August',
    '9': 'September', '10': 'October', '11': 'November', '12': 'December',
    'jan': 'January', 'feb': 'February', 'mar': 'March', 'apr': 'April',
    'may': 'May', 'jun': 'June', 'jul': 'July', 'aug': 'August',
    'sep': 'September', 'oct': 'October', 'nov': 'November', 'dec': 'December',
}

TYPE_ORDER = {'preprint': 0, 'journal': 1, 'conference': 2}


# ─── BibTeX Parser ────────────────────────────────────────────────

def _read_braced(text, pos):
    """Read a {…} value starting at pos (pos points to '{')."""
    depth = 0
    start = pos + 1
    i = pos
    while i < len(text):
        c = text[i]
        if c == '{':
            depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0:
                return text[start:i], i + 1
        i += 1
    return text[start:], len(text)


def _read_quoted(text, pos):
    """Read a "…" value starting at pos (pos points to '"')."""
    i = pos + 1
    start = i
    while i < len(text):
        c = text[i]
        if c == '\\':
            i += 2
            continue
        if c == '"':
            return text[start:i], i + 1
        i += 1
    return text[start:], len(text)


def parse_bibtex(text):
    """Parse BibTeX text; return list of entry dicts."""
    entries = []
    i = 0
    n = len(text)

    while i < n:
        # Skip whitespace
        while i < n and text[i].isspace():
            i += 1
        # Skip line comments
        if i < n and text[i] == '%':
            while i < n and text[i] != '\n':
                i += 1
            continue
        if i >= n:
            break

        if text[i] != '@':
            i += 1
            continue

        i += 1  # skip '@'

        # Read entry type
        type_start = i
        while i < n and (text[i].isalpha() or text[i] == '_'):
            i += 1
        entry_type = text[type_start:i].lower().strip()

        # Skip junk before '{'
        while i < n and text[i] != '{':
            i += 1
        if i >= n:
            break
        i += 1  # skip '{'

        # Skip whitespace
        while i < n and text[i].isspace():
            i += 1

        # Read entry key (ends at comma or whitespace)
        key_start = i
        while i < n and text[i] not in (',', '}', ' ', '\t', '\n', '\r'):
            i += 1
        key = text[key_start:i].strip()

        # Skip to comma after key
        while i < n and text[i] in (' ', '\t', '\n', '\r'):
            i += 1
        if i < n and text[i] == ',':
            i += 1

        # Parse fields
        entry = {'ENTRYTYPE': entry_type, 'ID': key}

        while i < n:
            # Skip whitespace
            while i < n and text[i].isspace():
                i += 1
            if i >= n:
                break

            # End of entry
            if text[i] == '}':
                i += 1
                break

            # Read field name
            fname_start = i
            while i < n and text[i] not in ('=', ' ', '\t', '\n', '\r', '}'):
                i += 1
            fname = text[fname_start:i].strip().lower()

            if not fname:
                i += 1
                continue

            # Skip to '='
            while i < n and text[i] in (' ', '\t', '\n', '\r'):
                i += 1
            if i >= n or text[i] != '=':
                continue
            i += 1  # skip '='

            # Skip whitespace
            while i < n and text[i].isspace():
                i += 1
            if i >= n:
                break

            # Read value
            if text[i] == '{':
                value, i = _read_braced(text, i)
            elif text[i] == '"':
                value, i = _read_quoted(text, i)
            else:
                val_start = i
                while i < n and text[i] not in (',', '}', '\n', '\r'):
                    i += 1
                value = text[val_start:i].strip()

            # Normalise whitespace in value
            value = ' '.join(value.split())
            if fname:
                entry[fname] = value

            # Skip comma
            while i < n and text[i].isspace():
                i += 1
            if i < n and text[i] == ',':
                i += 1

        if key and entry_type not in ('comment', 'string', 'preamble'):
            entries.append(entry)

    return entries


# ─── Text helpers ─────────────────────────────────────────────────

def clean_latex(text):
    """Convert common LaTeX markup to plain Unicode."""
    if not text:
        return ''
    subs = [
        ('---', '—'), ('--', '–'),
        ('``', '“'), ("''", '”'),
        ('\\&', '&'), ('\\%', '%'), ('\\$', '$'),
        ('\\"a', 'ä'), ('\\"o', 'ö'), ('\\"u', 'ü'),
        ('\\"A', 'Ä'), ('\\"O', 'Ö'), ('\\"U', 'Ü'),
        ("\\'e", 'é'), ("\\'a", 'á'), ("\\'o", 'ó'), ("\\'i", 'í'),
        ('\\`e', 'è'), ('\\`a', 'à'),
        ('\\ss', 'ß'), ('\\Pi', 'Π'), ('\\pi', 'π'),
    ]
    for src, dst in subs:
        text = text.replace(src, dst)
    text = re.sub(r'\\text\w+\{([^}]*)\}', r'\1', text)
    text = re.sub(r'\\emph\{([^}]*)\}', r'\1', text)
    text = re.sub(r'\{([^{}]*)\}', r'\1', text)
    text = re.sub(r'\\[a-zA-Z]+\s*', '', text)
    text = re.sub(r'[{}]', '', text)
    return text.strip()


def format_authors(author_str):
    """Abbreviate BibTeX author string for display."""
    if not author_str:
        return ''
    parts = re.split(r'\s+and\s+', author_str, flags=re.IGNORECASE)
    result = []
    for raw in parts:
        author = clean_latex(raw.strip())
        if not author:
            continue
        # Standard BibTeX format: "Last, First Middle"
        # But skip if already abbreviated like "N. Cho"
        if ',' in author and not re.match(r'^[A-Z][-\.]', author):
            halves = author.split(',', 1)
            last = halves[0].strip()
            first_tokens = halves[1].strip().split() if len(halves) > 1 else []
            initials = []
            for tok in first_tokens:
                if '-' in tok:
                    initials.append('-'.join(
                        (x[0] + '.') for x in tok.split('-') if x
                    ))
                elif tok and not tok.endswith('.'):
                    initials.append(tok[0] + '.')
                else:
                    initials.append(tok)
            result.append(f"{' '.join(initials)} {last}".strip())
        else:
            result.append(author)
    return ', '.join(result)


# ─── Venue builder ────────────────────────────────────────────────

def build_venue(entry):
    """Build the HTML venue string from BibTeX entry fields."""
    etype = entry.get('ENTRYTYPE', '').lower()

    # Explicit override: venue = {<em>...</em>, Vol. X, ...}
    if 'venue' in entry:
        return entry['venue']

    if etype == 'article':
        journal = clean_latex(entry.get('journal', ''))
        volume  = clean_latex(entry.get('volume', ''))
        number  = clean_latex(entry.get('number', ''))
        pages   = clean_latex(entry.get('pages', '')).replace('--', '–')
        parts   = [f'<em>{journal}</em>'] if journal else []
        if volume: parts.append(f'Vol. {volume}')
        if number: parts.append(f'No. {number}')
        if pages:  parts.append(f'pp. {pages}')
        return ', '.join(p for p in parts if p)

    if etype in ('inproceedings', 'conference', 'proceedings'):
        booktitle = clean_latex(entry.get('booktitle', ''))
        address   = clean_latex(entry.get('address', ''))
        parts     = [booktitle] if booktitle else []
        if address: parts.append(address)
        return ', '.join(p for p in parts if p)

    # misc / unpublished / techreport → preprint
    eprint = entry.get('eprint', '')
    if eprint:
        month_raw  = entry.get('month', '').strip()
        year_raw   = entry.get('year', '').strip()
        month_name = MONTHS.get(month_raw.lower(), month_raw.capitalize()) if month_raw else ''
        date_str   = ' '.join(p for p in [month_name, year_raw] if p)
        return f'arXiv:{eprint}' + (f', {date_str}' if date_str else '')

    note = entry.get('note', '') or entry.get('howpublished', '')
    return clean_latex(note)


# ─── Entry → publication dict ─────────────────────────────────────

def entry_to_pub(entry):
    etype = entry.get('ENTRYTYPE', '').lower()

    if etype == 'article':
        pub_type = 'journal'
    elif etype in ('inproceedings', 'conference', 'proceedings'):
        pub_type = 'conference'
    else:
        pub_type = 'preprint'

    if 'aail_type' in entry:
        pub_type = entry['aail_type'].strip()

    year    = clean_latex(entry.get('year', ''))
    title   = clean_latex(entry.get('title', ''))
    authors = format_authors(entry.get('author', ''))
    venue   = build_venue(entry)

    url = entry.get('url', '') or ''
    doi = entry.get('doi', '') or ''
    if not url and doi:
        url = doi if doi.startswith('http') else f'https://doi.org/{doi}'

    return {
        'type':    pub_type,
        'year':    'Preprints' if pub_type == 'preprint' else year,
        'title':   title,
        'authors': authors,
        'venue':   venue,
        'url':     url,
    }


# ─── JS formatter ─────────────────────────────────────────────────

def js_esc(s):
    return s.replace('\\', '\\\\').replace('"', '\\"')


def format_pub_js(pub):
    lines = [
        f'  {{ type: "{js_esc(pub["type"])}", year: "{js_esc(pub["year"])}"',
        f'    title: "{js_esc(pub["title"])}"',
        f'    authors: "{js_esc(pub["authors"])}"',
        f'    venue: "{js_esc(pub["venue"])}"',
    ]
    if pub.get('url'):
        lines.append(f'    url: "{js_esc(pub["url"])}" ' + '}')
    else:
        lines[-1] += ' }'
    return ',\n'.join(lines[:-1]) + ',\n' + lines[-1]


def sort_key(pub):
    t = TYPE_ORDER.get(pub['type'], 99)
    try:
        y = -int(pub['year'])
    except (ValueError, TypeError):
        y = -9999
    return (t, y)


# ─── Main conversion ──────────────────────────────────────────────

def convert(bib_path, js_path):
    with open(bib_path, encoding='utf-8') as f:
        content = f.read()

    raw_entries = parse_bibtex(content)

    pubs = []
    for entry in raw_entries:
        try:
            pubs.append(entry_to_pub(entry))
        except Exception as exc:
            key = entry.get('ID', '?')
            print(f'Warning: skipping "{key}": {exc}', file=sys.stderr)

    pubs.sort(key=sort_key)

    sections = {
        'preprint':   ('── Preprints ──────────────────────────────────────────────', []),
        'journal':    ('── Journal Papers ─────────────────────────────────────────', []),
        'conference': ('── Conference Papers ──────────────────────────────────────', []),
    }
    for pub in pubs:
        t = pub.get('type', 'journal')
        if t in sections:
            sections[t][1].append(pub)

    bar = '══' * 31
    out = [
        f'// {bar}',
        '//  PUBLICATIONS DATA — AUTO-GENERATED from data/publications.bib',
        '//  ⚠️  이 파일을 직접 수정하지 마세요.',
        '//  논문 추가/수정은 data/publications.bib 파일을 편집하세요.',
        '//  변경 후 update.bat (Windows) 또는 update.sh (Mac/Linux) 실행.',
        f'// {bar}',
        '',
        'const PUBLICATIONS = [',
        '',
    ]

    for sec_key in ['preprint', 'journal', 'conference']:
        label, sec_pubs = sections[sec_key]
        if not sec_pubs:
            continue
        out.append(f'  // {label}')
        for pub in sec_pubs:
            out.append(format_pub_js(pub) + ',')
            out.append('')

    out += ['];', '']

    with open(js_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(out))

    print(f'Converted {len(pubs)} publications -> {os.path.basename(js_path)}')


if __name__ == '__main__':
    root     = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    bib_path = os.path.join(root, 'data', 'publications.bib')
    js_path  = os.path.join(root, 'data', 'publications.js')

    if not os.path.exists(bib_path):
        print(f'Error: {bib_path} not found', file=sys.stderr)
        sys.exit(1)

    convert(bib_path, js_path)
