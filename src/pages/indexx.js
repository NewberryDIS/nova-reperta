import React from 'react'
/** @jsx jsx */
import { css, jsx, Global } from '@emotion/core';
import styled from "@emotion/styled";
import cat1 from '../images/cat-1.png';
import cat27 from '../images/cat-27.png';
import cat44 from '../images/cat-44.png';
import plate2 from '../images/plate-2.png';
import plate5 from '../images/plate-5.png';

const Main = () => (
    <div>
        <Global styles={css`
        * {
            transition: all .15s ease-in-out;
        }
        body {
            overflow: auto;
            margin: 0;
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
        }
        .pageWrapper {
            position: relative;
        }
        .backdrop {
            background: url('${cat27}') center; 16th
            background-attachment: fixed;
            margin: auto;
            padding: 40px;
            width: 100%;
            position: relative;
        }
        
        .text {
            margin-top: 40px;
            width: 75vw;
            margin: 0 auto;
            padding: 20px;
            border: 4px solid rgba(0,0,0,0.5);
            border-radius: 1vw;
        }
        h1, h3 {
            margin: 0;
            text-transform: uppercase;
            font-family: 'EB Garamond', serif;
            animation:  glow 10s infinite;
        }
        .text h1{
            font-weight: 700;
            font-size: calc(7vw + 20px);
            line-height: 4.5vw;
        }
        .text h3 {
            font-size: calc(4vw + 12px);
            margin: 0 0 10px 0;
            line-height: calc(3vw + 12px);
        }
        .screen {
            color: black;
            mix-blend-mode: screen;
            background-color: rgba(251, 251, 251, 0.85);
        }
        .bodytext {
            color: rgba(20,20,20,1)
            padding: 20px;
            font-family: 'Lato', sans-serif;
            font-size: calc(1vw + 15px);
            padding: 15px 30px;

        }

@keyframes glow {
    0% {
      text-shadow:  0 0 0 rgba(20,20,20, 0.85);
    }
    
    50% {
        text-shadow: 0px 0px 10px rgba(20,20,20, 0.85),
                     0px 0px 10px rgba(20,20,20, 0.85);
    }
    90% {
        text-shadow: 0px 0px 5px rgba(20,20,20, 0.85),
                     0px 0px 5px rgba(20,20,20, 0.85);
    }
    0% {
      text-shadow:  0 0 0 rgba(20,20,20, 0.85);
    }
  }
        `} />
        <div>
            <div class="backdrop">
                <p class="text screen">
                    <h1 className="">Nova Reperta</h1>
                    <h3>Time Machine</h3>
                    <p className="bodytext">
                        Travel to the Renaissance through the Newberry’s engravings, maps, and books&mdash;using the Nova Reperta print series as a guide. 
                    </p>
                    <p className="bodytext">
                        A companion to the Renaissance Invention: Stradanus’s Nova Reperta,a Newberry exhibition and Northwestern University publication (2020).
                    </p>
                </p>
                <CirclePanel>
                    <CircleImage src={ cat1 } alt=""/>
                    <CircleImage src={ plate2 } alt=""/>
                    <CircleImage src={ plate5 } alt=""/>
                    <CircleImage src={ cat44 } alt=""/>
                </CirclePanel>
            </div>
        </div>
    </div>
)

export default Main


const CirclePanel = styled.div`
    position: absolute;
    display: flex;
    @media (min-width: 800px) {
        justify-content: flex-start;
        flex-direction: column;
        right: 10vw;
        top: 0;
    } 
    @media (max-width: 800px) {
        justify-content: space-between;
        flex-direction: row;
        bottom: -150px;
        left: 0;
    } 
`
const CircleImage = styled.img`    
    flex: 1;
    filter: drop-shadow(0 0 0.75rem #000);
    &:hover {
        filter: drop-shadow(0 0 1rem #000);
    }
    @media (min-width: 800px) {
        width: 150px;
        height: 150px;
    } 
    @media (max-width: 800px) {
        width: calc(100% / 5);
    } 
`