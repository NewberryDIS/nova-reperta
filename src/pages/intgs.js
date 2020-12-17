import React from 'react'
import { Travelers } from '../components/data'
// import {server} from '../../../server'
function Intgs() {
    const scriptWriter = Travelers.map(d => {
        const storymapUrl = 'https://uploads.knightlab.com/storymapjs/f16f101e1b9e4f19898b53b294e8d1dd/' + d.storymapurl.substring(d.storymapurl.indexOf('8d1dd') + 6, d.storymapurl.indexOf('index.html')) + 'published.json'
        const wgetLine = 'wget -O '  + d.id + '.json ' + storymapUrl
        const scpLine = 'cp ' + d.id + '.json  ' + '/var/www/nova-reperta/static/'
        const scpLine = 'cp storymaps/' + d.id + '.html  ' + '/var/www/nova-reperta/static/'
        const returnLines = <div><br />{wgetLine}<br />{scpLine}</div>
        return returnLines
    })
    return (

        <div>{scriptWriter} </div>
    )
}
export default Intgs;