#!/bin/bash
nameArray=(designers silkworms printer indigenouswoman alchemist syphilitic miller artist)
for n in "${nameArray[@]}"
do
    touch $n.html
    echo "<!DOCTYPE html>
        <html lang='en'>
        <head>
            <title>Nova Reperta Time Machine</title>
            <script type='text/javascript' src='storymap.js'></script>
            <link href='https://cdn.knightlab.com/libs/storymapjs/latest/css/fonts/font.oldstandard.css' rel='stylesheet' class='lazyload' charset='utf-8'>
            <link href='https://cdn.knightlab.com/libs/storymapjs/latest/css/fonts/font.emoji.css' rel='stylesheet' class='lazyload' charset='utf-8'>
            <link rel='stylesheet' href='https://cdn.knightlab.com/libs/storymapjs/latest/css/storymap.css'>

        </head>
        <body>
            <div id='mapdiv' ></div>
            <style>
                body, html, .mapdiv {
                    margin: 0;
                    padding: 0;
                    width:  100%;
                    height: 100%;
                }
            </style>
<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src='https://www.googletagmanager.com/gtag/js?id=UA-5551324-4'></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'UA-5551324-4',{});

  gtag('event', 'storymap_click', {
    'event_label': 'nova_reperta',
    'event_category': 'StoryMapJS'
  });
// <!-- End Google Analytics -->
                var storymap_data = '$n.json';
                var storymap_options = {};
                var storymap = new VCO.StoryMap('mapdiv', storymap_data, storymap_options);
                window.onresize = function(event) {
                    storymap.updateDisplay(); 
                }
            </script>
        </body>
        </html>" > $n.html
done