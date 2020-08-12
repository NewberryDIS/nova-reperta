## Nova Reperta Time Machine

A series of StoryMaps using personal writings of historic figures.

A companion to Renaissance Invention: Stradanus’s Nova Reperta, a [Newberry exhibition<](https://www.newberry.org/renaissance-invention) and [Northwestern University](https://nupress.northwestern.edu/content/renaissance-invention) publication.

Uses React (Gatsby) and Emotion.  

### Index

No independent data source.  Pulls in <Navbar> from navbar-iotmw and <TwitterButton> from twitter-iotmw.  (Will rename these eventually!)  

### Choose

Pulls data from src/data.js, which exports an array of the objects.  These still contain the original, draft storymap links, so that these aren't lost, in case the content creators need to make modifications.  The addresses aren't actually used, since the storymaps are local.  Same Navbar and Twitter.

### TravTemplate

These pull data from the src/markdown-pages/*.md files.  This descrepancy means updates are required to be made in two places.  (Maybe a shell script for this in future projects?)

### Scripts

The storymaps/ folder contains 2 shell scripts: 

#### deployScript.sh

This is the upload script.  First, it deletes the cache and output folder (public/); and then builds the site.  Then it copies each .json and .html file to the corresponding folders - and also to the top level of the public folder, and the static folder.  Because overkill has never hurt anyone.  This script ends with a scp upload to the server, which sources a private file with the server name (while you can add your own server name to the script, it is recommended to keep that private).

#### htmlscript.sh 

takes the array of names and creates .html files for each.  The script contains a template which can be modified; rerunning this script is no problem; no modifications need to be made to the .html files.

#### smjsonwget.sh 

goes to the knightlab addresses and pulls down the json and renames it (you will have to edit urls and filenames).  The script also uploads the json to the webserver directly (by sourcing a private file with the server name; while you can add your own server name to the script, it is recommended to keep that private).
