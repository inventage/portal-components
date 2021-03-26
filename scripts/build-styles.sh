#!/usr/bin/env bash

##
# Bash script to convert .css files to .css.ts files.
#
# Inspiration taken from https://github.com/PolymerLabs/lit-mail/blob/master/scripts/build-styles.sh
set -e

# @see https://github.com/koalaman/shellcheck/wiki/SC2207
cssfiles=()
while IFS='' read -r line; do cssfiles+=("$line"); done < <(find components -name "*.css")

echo "${cssfiles[*]}"
echo ""

for file in "${cssfiles[@]}"; do
  cssfile=${file/.css/-css.ts}
  css=$(cat "$file")
  printf "Generating %s…\n" "$cssfile"
  printf "import { css } from 'lit-element';

export const styles = css\`
%s
\`;" "$css" > "$cssfile"
  echo ""
done
