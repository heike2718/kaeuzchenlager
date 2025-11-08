#!/usr/bin/env bash
set -euo pipefail

ROOT="${1:-.}"

# --- Helper: choose ripgrep if available ---
if command -v rg >/dev/null 2>&1; then
  G="rg --no-heading --line-number --color=never"
else
  G='grep -RIn --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=.git --exclude-dir=.nx --exclude-dir=.angular'
fi

html_scss_files=()
while IFS= read -r -d '' f; do html_scss_files+=("$f"); done < <(find "$ROOT/scr" -type f \( -name "*.html" -o -name "*.scss" \) \
  -not -path "*/node_modules/*" -not -path "*/dist/*" -not -path "*/.git/*" -print0)

styles="${ROOT%/}/src/styles.scss"
[ -f "$styles" ] || styles="${ROOT%/}/styles.scss"

fail=0

echo "=== 1) Alt-Utilities und alte Klassen in Templates/SCSS ==="
patterns=(
  '(^|[[:space:]"'\''])ml-[0-9]+'
  '(^|[[:space:]"'\''])mr-[0-9]+'
  '(^|[[:space:]"'\''])mb-[0-9]+'
  '(^|[[:space:]"'\''])m-[0-9]+'
  '\btoolbar-spacer\b'
  '\bnav-caption\b'
  '\bnav-item\b'
  '\bclass="page\b'
)
for p in "${patterns[@]}"; do
  if $G -E "$p" "${html_scss_files[@]}" | sed 's/^/  /'; then
    echo "-> Treffer für Pattern: $p"
    fail=1
  fi
done
echo

echo "=== 2) BEM-Selektoren im GLOBALEN styles.scss (sollten NICHT existieren) ==="
if [ -f "$styles" ]; then
  if $G -E '\.(?:[a-z0-9-]+__(?:[a-z0-9-]+)|[a-z0-9-]+--[a-z0-9-]+)\b' "$styles" | sed 's/^/  /'; then
    echo "-> BEM-Klassen in $styles gefunden. In die jeweilige Component-SCSS verschieben."
    fail=1
  else
    echo "  OK: keine BEM-Klassen im globalen Stylesheet."
  fi
else
  echo "  Hinweis: $styles nicht gefunden."
fi
echo

echo "=== 3) Globale Margin/Padding-Utilities inventarisieren (styles.scss) ==="
if [ -f "$styles" ]; then
  if $G -E '^\s*\.(m[trblxy]?-[0-9]+|p[trblxy]?-[0-9]+)\b' "$styles" | sed 's/^/  /'; then
    echo "-> Diese Utilities kannst du schrittweise durch gap/.u-stack/.u-cluster ersetzen."
  else
    echo "  OK: keine globalen m*/p*-Utilities definiert."
  fi
else
  echo "  Hinweis: $styles nicht gefunden."
fi
echo

echo "=== 4) Container, die sich für gap eignen (flex/grid) ==="
if $G -F 'display: flex' "${html_scss_files[@]}" | sed 's/^/  /'; then echo "-> Prüfe .ml-*/.mr-* in diesen Containern."; fi
if $G -F 'display: grid' "${html_scss_files[@]}" | sed 's/^/  /'; then echo "-> Prüfe .mb-* zwischen Grid-Kindern."; fi
echo

echo "=== 5) Direktprüfungen für bekannte Migrationen ==="
# Navbar
$G -E '\bnav__icon\b|\bnav__link\b|\bnav__toggle\b|\bnav__caption\b' "${html_scss_files[@]}" >/dev/null || {
  echo "  Hinweis: Neue Navbar-BEM-Klassen tauchen in Templates kaum auf. Prüfe, ob Klassen gesetzt sind."
}
# List/Card
$G -E '\bgt-list\b|\bgt-card\b' "${html_scss_files[@]}" >/dev/null || {
  echo "  Hinweis: gt-list/gt-card Klassen nicht gefunden. Prüfe die Umstellung."
}
echo

if [ $fail -ne 0 ]; then
  echo "Fertig mit Befunden. Bitte obige Stellen migrieren."
#  exit 1
else
  echo "Fertig. Keine kritischen Altlasten gefunden."
fi
