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
            <!-- Google Tag Manager -->
                <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                    })(window,document,'script','dataLayer','GTM-5C6HPXL');</script>
            <!-- End Google Tag Manager -->
        </head>
        <body>
        <!-- Google Tag Manager (noscript) -->
            <noscript><iframe src='https://www.googletagmanager.com/ns.html?id=GTM-5C6HPXL'
                height='0' width='0' style='display:none;visibility:hidden'></iframe></noscript>
        <!-- End Google Tag Manager (noscript) -->
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