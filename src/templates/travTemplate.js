import { graphql, Link } from 'gatsby';
/** @jsx jsx */
import { css, jsx, Global } from '@emotion/core'
import styled from "@emotion/styled";
import { Helmet } from "react-helmet"

import Navbar from '../components/navbar-iotmw';

import designers from '../images/designers.png'
import silkworms from '../images/silkworms.png'
import printer from '../images/printer.png'
import indigenouswoman from '../images/indigenouswoman.png'
import alchemist from '../images/alchemist.png'
import syphilitic from '../images/syphilitic.png'
import miller from '../images/miller.png'
import artist from '../images/artist.png'

const images = {
    'designers': designers,
    'silkworms': silkworms,
    'printer': printer,
    'indigenouswoman': indigenouswoman,
    'alchemist': alchemist,
    'syphilitic': syphilitic,
    'miller': miller,
    'artist': artist
}
const Maparea = styled.div` 
    position: sticky;
    height:100vh;
    flex: 1;
    display: flex;
    flex-direction: column;
    -webkit-box-shadow: 10px 10px 50px 0px rgba(0,0,0,0.75);
    -moz-box-shadow: 10px 10px 50px 0px rgba(0,0,0,0.75);
    box-shadow: 10px 10px 50px 0px rgba(0,0,0,0.75);
`
const Leftpanel = ( props ) => (
    <div className="leftPanel" css={css`
        @media only screen and (max-width: 900px) {
            display: none;
        }
        padding-top: 65px;
        // position: fixed;
        overflow-y: auto;
        flex-basis: 20%;
        background: #333;
        color: #e8e9ca;
        align-content: space-between;
        // display: flex;
        // flex-direction: column;
        background-size: 100%;
        background-attachment: fixed;
    `}>
        <div css={css`width: 80%; margin: 15% auto; flex-grow: 1;`} >
            <img css={css`display: block; margin: auto; max-width: 150px; filter: drop-shadow(0 0 0.25rem black);`} src={images[props.image]} alt="" />
            <p css={css`padding-top: 35px; font-size: calc(12px + 1vw); line-height: 2.25rem;font-family: 'Alegreya SC', serif; text-align: center;`} >{props.title}</p>
        <Link css={css`
                margin: 20px auto;
                font-family: 'Cinzel', serif;
                font-weight: 700;
                font-size: calc(10px + 0.5vw);
                color: white;
                display: block;
                text-decoration: none;
                padding: 15px 30px ;
                width: 100%;
                border: 0;
                &:hover {
                    background-color: white;
                    -webkit-box-shadow: 10px 10px 30px 0px rgba(0,0,0,0.75);
                    -moz-box-shadow: 10px 10px 30px 0px rgba(0,0,0,0.75);
                    box-shadow: 10px 10px 30px 0px rgba(0,0,0,0.75);
                    color: black;
                }
                background: rgba(0,0,0,0.15);
                border-radius: 6px; 
                flex-basis: 1rem;
                text-align: center;
                flex-shrink: 0;
        `} to="/choose">Swap Traveler</Link>
        </div>

    </div>
)
export default function Template({
    data, location // this prop will be injected by the GraphQL query below.
    }) {
    const { markdownRemark } = data // data.markdownRemark holds our post data
    const { frontmatter } = markdownRemark
    return (
        <div css={css`
            display: flex;
            align-items: stretch;
        `} >
        <Navbar location={location} />
            <Helmet>
                <meta charSet="utf-8" />
                <title>Nova Reperta Time Machine</title>
            </Helmet>
            <Global styles={css`
                * {
                    transition: all .15s ease-in-out;
                }
                body {
                    margin: 0 !important;
                }
            `} />
            <Leftpanel image={frontmatter.image} text={frontmatter.shorttext} title={frontmatter.title} />
            <Maparea>
            <iframe title={frontmatter.image} src={'/nova-reperta/static/' + frontmatter.image + '.html'}
                css={css`
                width: 100%;
                height: 100%;
                margin: 0;
                -webkit-box-shadow: inset 10px 10px 50px 0px rgba(0,0,0,0.75);
                -moz-box-shadow: inset 10px 10px 50px 0px rgba(0,0,0,0.75);
                box-shadow: inset 10px 10px 50px 0px rgba(0,0,0,0.75);
                color:  #e8e9ca;
                `} />
                {console.log('/static/' + frontmatter.image + '.html')}
                    
            </Maparea>
        </div>
    )
}
export const pageQuery = graphql`
    query($path: String!) {
        markdownRemark(frontmatter: { path: { eq: $path } }) {
        frontmatter {
            path
            title
            text
            image
            storymapurl
            shorttext
        }
    }
}
`
