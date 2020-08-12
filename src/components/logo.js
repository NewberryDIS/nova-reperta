import React, { useState } from 'react'
/** @jsx jsx */
import { css, jsx, Global } from '@emotion/core';
import styled from "@emotion/styled";

const LogoJumbo = props => {
    return (
        <Fonter ><div className="mainbox">
            <h1 >Nova Reperta</h1>
            <h2 >Time Machine</h2>
        </div>
        </Fonter>
    )
}
export default LogoJumbo

const Fonter = styled.div`
margin: 0 auto;
padding: 0;

border: 2px solid rgba(0,0,0,1);

.mainbox {

    margin: auto;
    color: black;
    padding: 30px 30px 10px 30px;
    @media (max-width: 800px) { padding: 30px 30px 10px 30px; } 
    @media (max-width: 800px) { padding: 10px; } 

    // border: 4px solid rgba(0,0,0,0.5);
    // border-radius: 1vw;
    // background-color: rgba(0,0,0, 0.85);
    background-color: rgba(251, 251, 251, 0.85);
    mix-blend-mode: screen;
    h1, h2 {
        text-transform: uppercase;
        color: black;
        font-family: 'Cinzel', serif;
        font-weight: 700;
        text-align: center;
    }
    h1 {
        margin: 0 0 10px 0;
        line-height: calc(4.5vw + 12px);
        font-size: calc(7vw + 12px);
    }
    h2 {
        // font-family: 'Alegreya SC', serif;
        margin: 0 0 10px 0;
        font-size: calc(4vw + 12px);
        line-height: calc(1.5vw + 12px);
    }
}
    `