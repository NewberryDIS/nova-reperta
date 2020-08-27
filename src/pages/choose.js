import React, { useState } from 'react';
/** @jsx jsx */
import { css, jsx, Global } from '@emotion/core';
import styled from "@emotion/styled";
import { Travelers } from '../components/data';
import { Link } from "gatsby"
import { Helmet } from "react-helmet"
import Navbar from '../components/navbar-iotmw';
import Footer from '../components/footer';
import TwitterButton from '../components/twitter-iotmw';
import { OutboundLink } from 'gatsby-plugin-google-analytics';
import '../components/layout.css'

// // images
import designers from '../images/designers.png'
import silkworms from '../images/silkworms.png'
import printer from '../images/printer.png'
import indigenouswoman from '../images/indigenouswoman.png'
import artist from '../images/artist.png'
import alchemist from '../images/alchemist.png'
import syphilitic from '../images/syphilitic.png'
import miller from '../images/miller.png'
import background from '../images/background.jpg';

let breakPoints = [350, 500, 750];
const images = {
    'designers': designers, 
    'silkworms': silkworms, 
    'printer': printer, 
    'indigenouswoman': indigenouswoman, 
    'artist': artist, 
    'alchemist': alchemist, 
    'syphilitic': syphilitic, 
    'miller': miller
};
const Masonrycontainer = styled.div`
    width: 85%;
    margin: auto;
    margin-top: 10px;
    text-align: center;
    padding: 4px;
    color: #efefef;
`
const Masonrycss = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-content: stretch;
    width: 100%;
    margin: auto;
`
const Column = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-content: stretch;
    flex-basis: 235px;
    // width: 235px;
`
class Masonry extends React.Component {
    constructor(props) {
        super(props);
        this.state = { columns: 1 };
        this.onResize = this.onResize.bind(this);
    }
    componentDidMount() {
        this.onResize();
        window.addEventListener('resize', this.onResize);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.onResize);
    }
    getColumns(w) {
        return breakPoints.reduceRight((p, c, i) => {
            return c < w ? p : i;
        }, breakPoints.length) +1;
    }
    onResize() {
        const columns = this.getColumns(this.refs.Masonry.offsetWidth);
        if (columns !== this.state.columns) {
            this.setState({ columns: columns });
        }
    }
    mapChildren() {
        let col = [];
        const numC = this.state.columns;
        for (let i = 0; i < numC; i++) {
            col.push([]);
        }
        return this.props.children.reduce((p, c, i) => {
            p[i % numC].push(c);
            return p;
        }, col);
    }
    render() {
        return (
        <Masonrycss className="masonry" ref="Masonry">
            {this.mapChildren().map((col, ci) => 
                <Column className="column" key={ci}>
                    {col.map((child, i) => 
                        <div key={i}>{child}</div>
                    )}              
                </Column>
                )}
        </Masonrycss>
        )
    }
}

const tileCss = () => css`text-decoration: none;`
const buttoncss = () => css`
    cursor: pointer;
    text-decoration: none;
    display: block;
    padding: 10px;
    margin: 15px auto;
    background: rgba(0,0,0,1);;
    color:  rgba(255,255,255,0.75);
    font-family: 'Cinzel', serif;
    font-weight: 700;
    // font-family: eltic, serif;   
    font-size: 1rem;
    border: 1px solid transparent;
    text-transform: uppercase;
    -webkit-box-shadow: 10px 10px 30px 0px rgba(0,0,0,0.75);
    -moz-box-shadow: 10px 10px 30px 0px rgba(0,0,0,0.75);
    box-shadow: 10px 10px 30px 0px rgba(0,0,0,0.75);
    transition: all .15s ease-in-out;
    &:hover {
        background: white;
        color: black;
        font-weight: 700;
        border: 1px solid black;
        -webkit-box-shadow: 10px 10px 30px 0px rgba(0,0,0,0.95);
        -moz-box-shadow: 10px 10px 30px 0px rgba(0,0,0,0.95);
        box-shadow: 10px 10px 30px 0px rgba(0,0,0,0.95);
    }
`

const Tile = ({ content }) => {
    return (
    <div className="tile" css={css`
    * {text-decoration: none;}

        text-decoration: none;
        display: block;           
        border: 2px solid rgba(0,0,0,1); 
        background: rgba(255,255,255,0.85);
        box-shadow: 10px 10px 30px 0px rgba(0,0,0,0.75);
        background-attachment: fixed;
        background-position: center;
        color: #000;
        margin: 4px;
        border: 2px solid #27452B;
        flex-basis: 200px;
        padding: 10px;
        position: relative;
        transition: all .15s ease-in-out;
        & p {
            padding: 5px 10px 15px 10px;
        }
        &:before {
            content: "";
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: -1;
            -webkit-box-shadow: 10px 10px 50px 0px rgba(0,0,0,0.75);
            -moz-box-shadow: 10px 10px 50px 0px rgba(0,0,0,0.75);
            box-shadow: 10px 10px 50px 0px rgba(0,0,0,0.75);
        }
        &:hover {
            background: #fff;
            background-attachment: fixed;
            background-position: center;
            & .tilecap {
                color: rgba(255,255,255,1);
            }
        }
        & h2 {
            font-size: calc(12px + 1.1vw);
            padding: 0;
            margin: 0;
            overflow-wrap: normal;
            font-family: 'Cinzel', serif;
            font-weight: 700;
        }
        .fontname {
        }
        .desctext {
            font-size: 18px;
            font-weight: 400;
            font-family: 'Alegreya SC', serif;
        }
    `}>
            <img css={css`
                    padding: 5 25px 5px 25px;
                    width: 200px;
                    filter: drop-shadow(0 0 0.75rem #000);
                `} 
                src={images[content['image']]} alt="person"/>
            <h2>{content.name}</h2>
            <p className="desctext">{content.desc}</p>
            <button css={buttoncss} >Start Exploring</button>
        </div>
    )}
export default class Choose extends React.Component {
    render() {
        return ( <div className="choosewrapper">
            <Helmet>
                <meta charSet="utf-8" />
                <title>Nova Reperta Time Machine</title>
            </Helmet>
            <Global styles={css`
                body {
                    margin: 0;
                    padding: 0;
                    background: url('${background}');
                    background-size: cover;
                    background-position: center;
                    background-attachment: fixed;
                    position: relative;
                }
                .choosewrapper {
                    padding-top: 65px;
                    display: flex;
                    flex-direction: column;
                    min-height: 100vh;
                    align-content: space-between;
                }
            `}/>
            <Navbar location={this.props.location} />
            <TwitterButton />
            <div className="container" css={css`
                position: fixed;
                overflow: hidden;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                z-index: -1;
                
            `}></div>
                <Masonrycontainer>
                        <Masonry breakPoints={breakPoints}>
                            {Travelers.map((content, i) => content.button ? <OutboundLink css={tileCss} key={i} href="//publications.newberry.org/transcribe" target="_blank">  <Tile content={content}  /></OutboundLink> : <Link key={i} css={tileCss} to={'/' + content.id}>  <Tile content={content}  /></Link>)}
                        </Masonry>
                </Masonrycontainer>
                <Footer />
            </div>
        )
    }
}