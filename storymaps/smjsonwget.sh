#!/bin/bash
source ../../variables.sh
wget -O designers.json https://uploads.knightlab.com/storymapjs/f16f101e1b9e4f19898b53b294e8d1dd/novrep-frontis/published.json
wget -O silkworms.json https://uploads.knightlab.com/storymapjs/f16f101e1b9e4f19898b53b294e8d1dd/novrep-vermis/published.json
wget -O printer.json https://uploads.knightlab.com/storymapjs/f16f101e1b9e4f19898b53b294e8d1dd/novrep-printer/published.json
wget -O indigenouswoman.json https://uploads.knightlab.com/storymapjs/f16f101e1b9e4f19898b53b294e8d1dd/novrep-america/published.json
wget -O alchemist.json https://uploads.knightlab.com/storymapjs/f16f101e1b9e4f19898b53b294e8d1dd/novrep-alchemist/published.json
wget -O syphiliticpatient.json https://uploads.knightlab.com/storymapjs/f16f101e1b9e4f19898b53b294e8d1dd/novrep-syphilitic/published.json
wget -O miller.json https://uploads.knightlab.com/storymapjs/f16f101e1b9e4f19898b53b294e8d1dd/novrep-miller/published.json
wget -O artist.json https://uploads.knightlab.com/storymapjs/f16f101e1b9e4f19898b53b294e8d1dd/novrep-artist/published.json
scp { *.html *.json storymap.js } $SERVER/novareperta/storymaps/