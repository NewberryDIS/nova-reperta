import React, { useState } from 'react'
/** @jsx jsx */
import { css, jsx, Global } from '@emotion/core';
import styled from "@emotion/styled";
import { Link } from "gatsby"
import { Helmet } from "react-helmet"
import Navbar from '../components/navbar-iotmw';
import Footer from '../components/footer'
import background from '../images/background.png';
import '../components/layout.css'
import TwitterButton from '../components/twitter-iotmw';
import { OutboundLink } from 'gatsby-plugin-google-analytics';

import LogoJumbo from '../components/logo';


import frontispiece from '../images/frontispiece-c.png'
import silkworms from '../images/silkworms-c.png'
import printer from '../images/printer-c.png'
import america from '../images/america-c.png'

import argos from '../fonts/Argos-Regular.ttf.woff'
import bucephalus from '../fonts/Bucephalus.ttf.woff'
import deutsche from '../fonts/Deutsche-Uncialis.ttf.woff'
import eltic from '../fonts/Eltic.ttf.woff'
import foucault from '../fonts/Foucault.ttf.woff'
import livingstone from '../fonts/Livingstone.ttf.woff'
import onciale from '../fonts/Onciale-PhF.ttf.woff'
import ramsey from '../fonts/Ramsey-SD.ttf.woff'
import unzialish from '../fonts/UnZialish.ttf.woff'


const Text  = styled.div`
    font-family: 'Lato', sans-serif;
    font-size: calc(1vw + 15px);
    padding: 15px 30px ;
    a {
        color: black;
        font-weight: 900;
        text-decoration: none;
        // background-image: linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.75));
        background-image: linear-gradient(to bottom, transparent 1px, black 2px); 
        background-position: 0% 105%;
        background-repeat: no-repeat;
        background-size: 0% 2px;
        transition: background-size .2s;
        &:hover {
                background-size: 100% 5px;
        }
    }
`
const Splash = styled.div`
    margin: 5vh auto;
    padding: 30px;
    // border-radius: 3px;                        
    border: 2px solid rgba(0,0,0,1); 
    background: rgba(255,255,255,0.85);
    box-shadow: 10px 10px 30px 0px rgba(0,0,0,0.75);
    position: relative;
    .splashleft {
        // -webkit-text-fill-color: transparent;
        // -webkit-background-clip: text;
        // width: calc(100% - 80px);
        // @media (max-width: 800px) {width: 100%;} 
        transition: all .15s ease-in-out;
    }
    .chooseButton, .transcribeButton {
        transition: all .15s ease-in-out;
    }
    .chooseButton {
        display: block;
        margin: 15px auto;
        padding: 13px 20px;
        text-align: center;
        text-decoration: none;
        text-transform: uppercase;
        font-size: 2rem;
        background: #000;
        color:  rgba(255,255,255,0.75);
        box-shadow: 10px 10px 30px 0px rgba(0,0,0,0.75);
        border-radius: 6px; 
        border: 1px solid rgba(0,0,0, 0.5);
        &:hover {
            border: 1px solid #000;
            background-color: #fff;
            box-shadow: 10px 10px 30px 0px rgba(0,0,0,0.75);
            text-shadow: none;
            color: #000;
        }
        text-shadow:
            -1px -1px 0 #000,  
            1px -1px 0 #000,
            -1px 1px 0 #000,
            1px 1px 0 #000;
    }

    .transcribeButton {
        display: block;
        font-family: 'Lato', sans-serif;
        font-size: 1rem;
        color: black;
        text-decoration: none;
        padding: 15px 30px ;
        border: 1px solid rgba(0,0,0, 0.5);
        &:hover {
            border: 1px solid #000;
            background-color: #fff;
            box-shadow: 10px 10px 30px 0px rgba(0,0,0,0.75);
        }
        background: rgba(255,255,255,0.8);
        border-radius: 6px; 
        flex-basis: 1rem;
        text-align: center;
        flex-shrink: 0;
    }
    .ortext {
        display: block;
        text-align: center;
        overflow: hidden;
        white-space: nowrap; 
        span {
            position: relative;
            display: inline-block;
            text-transform: uppercase;
            font-style: italic;
        }
        span:before,
        span:after {
            content: "";
            position: absolute;
            top: 50%;
            width: 9999px;
            height: 1px;
            background: black;
        }
        span:before {
            right: 100%;
            margin-right: 15px;
        }
        span:after {
            left: 100%;
            margin-left: 15px;
        }
    }
    
`

const topFonts = [
    'argos', 
    'deutsche', 
    'eltic', 
    'foucault', 
    'livingstone', 
    'onciale', 
    'ramsey', 
    'unzialish'] 
const CirclePanel = styled.section`
    position: absolute;
    display: flex;
    // jen's alleged disappearing circlefaces 
    // flex-wrap: wrap;
    justify-content: flex-start;
    align-content: flex-start;
    flex-direction: column;
    right: 15vw;
    // left: 82.5vw;
    top: 10vh;
    @media (max-width: 800px) {
        display: none;
    } 
`
const CircleImage = styled.img`
    transition: all .15s ease-in-out;
    filter: drop-shadow(0 0 0.75rem #000);
    border: 10px solid rgba(251,251,251,0.85);;
    &:hover {
        filter: drop-shadow(0 0 1rem #000);
    }
    
    border-radius: 15vmin;
    width: 15vmin;
    min-width: 15vmin;
    height: 15vmin;
    @media (min-width: 800px) {
        flex-wrap: nowrap;
    } 
    @media (max-width: 800px) {
        flex-wrap: wrap;
    } 

`
const Main  = props => {

    const [topFont, setTopFont ] = useState(0)

    function topNext() {
        console.log(topFonts[topFont])
        let newIndex = (topFont + 1) > (topFonts.length - 1) ? 0 : topFont + 1
        setTopFont(newIndex)
    }
    return (
    <div css={css`
        background: url('${background}');
        background-size: cover;
        background-position: center;
        background-attachment: fixed;
        padding-top: 100px;
        position: relative;
        > div {
            width: 60vw;
        }
        min-height: 100vh;
    `} >
        <Helmet>
            <meta charSet="utf-8" />
            <title>Newberry's Nova Reperta Time Machine</title>
        </Helmet>
        <Global styles={css`
            * {
                // transition: all .15s ease-in-out;
            }
            html, body {
                margin: 0;
                padding: 0;
            }

            @font-face { font-family: argos;        src: url(${argos}) ; }
            @font-face { font-family: bucephalus;   src: url(${bucephalus}) ; }
            @font-face { font-family: deutsche;     src: url(${deutsche}) ; }
            @font-face { font-family: eltic;        src: url(${eltic}) ; }
            @font-face { font-family: foucault;     src: url(${foucault}) ; }
            @font-face { font-family: livingstone;  src: url(${livingstone}) ; }
            @font-face { font-family: onciale;      src: url(${onciale}) ; }
            @font-face { font-family: ramsey;       src: url(${ramsey}) ; }
            @font-face { font-family: unzialish;    src: url(${unzialish}) ; }
                .argos          { font-family: argos;       font-size: calc(4.5vw + 12px);}
                .argos-sm       { font-family: argos;       }
                .bucephalus     { font-family: bucephalus;  font-size: calc(4.5vw + 12px);}
                .bucephalus-sm  { font-family: bucephalus;  }
                .deutsche       { font-family: deutsche;    font-size: calc(7vw + 12px);}
                .deutsche-sm    { font-family: deutsche;    }
                .eltic          { font-family: eltic;       font-size: calc(4.5vw + 12px);}
                .eltic-sm       { font-family: eltic;       }
                .foucault       { font-family: foucault;    font-size: calc(6.5vw + 12px);}
                .foucault-sm    { font-family: foucault;    }
                .livingstone    { font-family: livingstone; font-size: calc(7vw + 12px);}
                .livingstone-sm { font-family: livingstone; }
                .onciale        { font-family: onciale;     font-size: calc(4.5vw + 12px);}
                .onciale-sm     { font-family: onciale;     }
                .ramsey         { font-family: ramsey;      font-size: calc(7vw + 12px);}
                .ramsey-sm      { font-family: ramsey;      }
                .unzialish      { font-family: unzialish;   font-size: calc(6vw + 12px);}
                .unzialish-sm   { font-family: unzialish;   }
        `} />
        <Navbar location={props.location} />
        <TwitterButton />
        <LogoJumbo topNext={topNext} font={topFonts[topFont]}/>
        <Splash>
            <div className="splashleft">
                <Text className="text">
                    Travel to the Renaissance through the Newberry’s engravings, maps, and books––using the Nova Reperta print series as a guide.
                </Text>
                <Text className="text">
                    A companion to Renaissance Invention: Stradanus’s Nova Reperta, a <OutboundLink href="https://www.newberry.org/renaissance-invention"  target="_blank" rel="noopener noreferrer">Newberry exhibition</OutboundLink> and <OutboundLink href="https://nupress.northwestern.edu/content/renaissance-invention"  target="_blank" rel="noopener noreferrer">Northwestern University publication</OutboundLink>.
                </Text>
                <Link to="/choose/" className={'chooseButton ' + topFonts[topFont] + '-sm'}>Choose Your Time Traveler</Link>
                <div className="ortext"><span>or</span></div>
                <OutboundLink className="transcribeButton"  href="https://archive.org/details/case_wing_z_412_85/page/n17/mode/2up" target="_blank" rel="noopener noreferrer">
                    Explore the full print series at our digital library
                    Unlock more stories from the past at our transcription crowdsourcing project:<br/>NEWBERRY TRANSCRIBE
                </OutboundLink>
            </div>
        </Splash>
            <CirclePanel>
                <CircleImage src={ frontispiece } alt=""/>
                <CircleImage src={ silkworms } alt=""/>
                <CircleImage src={ printer } alt=""/>
                <CircleImage src={ america } alt=""/>
            </CirclePanel>
        <Footer font={topFonts[topFont]} />
    </div>
)}
export default Main