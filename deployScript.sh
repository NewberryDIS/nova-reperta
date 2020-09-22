#!/bin/bash
source ../variables.sh
rm -rf .cache
rm -rf public
npm run build
cp -vir storymaps/storymap.js public/
cp -vir storymaps/storymap.js public/static/
cp -vir storymaps/alchemist* public/alchemist/
cp -vir storymaps/storymap.js public/alchemist/
cp -vir storymaps/artist* public/artist/
cp -vir storymaps/storymap.js public/artist/
cp -vir storymaps/designers* public/designers/
cp -vir storymaps/storymap.js public/designers/
cp -vir storymaps/indigenouswoman* public/indigenouswoman/
cp -vir storymaps/storymap.js public/indigenouswoman/
cp -vir storymaps/miller* public/miller/
cp -vir storymaps/storymap.js public/miller/
cp -vir storymaps/printer* public/printer/
cp -vir storymaps/storymap.js public/printer/
cp -vir storymaps/silkworms* public/silkworms/
cp -vir storymaps/storymap.js public/silkworms/
cp -vir storymaps/syphiliticpatient* public/syphiliticpatient/
cp -vir storymaps/storymap.js public/syphiliticpatient/
cp -vir storymaps/*.html public
cp -vir storymaps/*.html public/static
cp -vir storymaps/*.json public
cp -vir storymaps/*.json public/static
# macos (BSD sed) requires the '' after -i; remove for linux
find public/ -name 'index.html' -exec sed -i '' "/UA-5551324-4/s/$/ ga('send', 'pageview')\;/g" {} \;
scp -r public/* $SERVER/novareperta/