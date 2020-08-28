#!/bin/bash
source ../variables.sh
rm -rf .cache
rm -rf public
npm run build
cp -vnr storymaps/storymap.js public
cp -vnr storymaps/alchemist* public/alchemist/
cp -vnr storymaps/storymap.js public/alchemist/
cp -vnr storymaps/artist* public/artist/
cp -vnr storymaps/storymap.js public/artist/
cp -vnr storymaps/designers* public/designers/
cp -vnr storymaps/storymap.js public/designers/
cp -vnr storymaps/indigenouswoman* public/indigenouswoman/
cp -vnr storymaps/storymap.js public/indigenouswoman/
cp -vnr storymaps/miller* public/miller/
cp -vnr storymaps/storymap.js public/miller/
cp -vnr storymaps/printer* public/printer/
cp -vnr storymaps/storymap.js public/printer/
cp -vnr storymaps/silkworms* public/silkworms/
cp -vnr storymaps/storymap.js public/silkworms/
cp -vnr storymaps/syphiliticpatient* public/syphiliticpatient/
cp -vnr storymaps/storymap.js public/syphiliticpatient/
cp -vnr storymaps/*.html public
cp -vnr storymaps/*.html public/static
cp -vnr storymaps/*.json public
cp -vnr storymaps/*.json public/static
# macos (BSD sed) requires the '' after -i; remove for linux
find public/ -name 'index.html' -exec sed -i '' "/UA-5551324-4/s/$/ ga('send', 'pageview')\;/g" {} \;
scp -r public/* $SERVER/novareperta/