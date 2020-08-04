import { useState } from 'react'
import styled from "@emotion/styled";
/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import { OutboundLink } from "gatsby-plugin-google-analytics";

const FooterSection = styled.div`
    margin: 5px;
    font-family: 'Alegreya SC', serif;
    font-weight: 100;
    & .lglink {
        color: black;
        font-weight: 900;
        text-decoration: none;

    cursor: pointer;
        // background-image: linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.75));
        background-image: linear-gradient(to bottom, transparent 1px, black 2px); 
        background-position: 0% 105%;
        background-repeat: no-repeat;
        background-size: 0% 2px;
        transition: background-size .2s;
        &:hover {
            &.smlink {
                background-size: 100% 2px;
            }
            &.lglink {
                background-size: 100% 4px;
            }
        }
    }
    padding: 15px 30px;
    border-radius: 6px; 
    &.middle, &.right, &.left p {
        font-size: 0.65rem;
    }
    &.left {
        flex: 1;
    }
    &.middle {
        flex: 2;
    }
    &.right {
        flex: 2;
    }
    .emphasis {
        color: black;
        font-weight: 900;
    }
    .witmimg {
        margin-bottom: 0;
        max-width: 200px;
        padding: 5px;
        float: left;
    }
    .witmbox {
        // padding: 5px;
        margin-bottom: 5px;
    }
`
// data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7

const FooterWrapper = styled.footer`
    background: white;
    -moz-box-shadow:    inset 0 0 10px #000000;
    -webkit-box-shadow: inset 0 0 10px #000000;
    box-shadow:         inset 0 0 10px #000000;
    display: flex;
    flex-direction: row;
    width: 100%;
    @media only screen and (max-width: 700px) {
        flex-direction: column;
    }
    .modal {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
    }
    .credits {
        .creditwrapper {
            position: relative;
            width: 75%;
            margin: auto;
        }
        overflow: auto;
        // display: none;
        position: fixed;
        top: 10vh;
        left: 20vw;
        right: 20vw;
        bottom: 10vh;
        padding: 50px 50px 30px 50px ;

        background: white;
        box-shadow: 0 0 10px #000000;
        font-family: 'Alegreya SC', serif;
        font-size: 16px;
        h2, h3, h4 {
            font-family: 'Alegreya SC', serif;
        }
        h2 {
            font-size: 30px;
        }
        h3 {
            margin: 20px  0 10px 0;
            font-size: 24px;
        }
        h4 {
            font-size: 20px;
            margin: 0 0 10px 0;
        }
        .creditline {
            display: flex;
        }

        .credit {
            flex-basis: 120px;
        }
        .credittext {
            margin: 15px 0;
        }
        .boldtext {
            font-weight: 700;
            display: inline;
        }
        .name {
            flex: 1;
        }
    }
`
const Footer = (props) => {

    const [ showCredits, setShowCredits ] = useState(false)
    return (
        <FooterWrapper width={props.width}>
            <FooterSection className="left">
                {showCredits ? <Credits setShowCredits={setShowCredits}/> : ''}
                <a className="lglink" target="_blank" rel="noopener noreferrer" href="mailto:renaissance@newberry.org">Contact Us</a>
                <br />
                <span  onClick={() => setShowCredits(true)} className="lglink">View credits</span>
            </FooterSection>
            <FooterSection className="middle">
                Except where otherwise noted, contextual content on this site is made available under a &nbsp;
                <OutboundLink className="lglink" target="_blank" rel="noopener noreferrer" href="https://creativecommons.org/share-your-work/public-domain/cc0/">
                    Creative Commons Public Domain license. &nbsp;
                </OutboundLink>
                    Digitized images and other media from the Newberry's collections are made available for any lawful purpose, commercial or non-commercial, without licensing or permission fees to the library, subject to the following terms and conditions:&nbsp;
                <OutboundLink className="lglink" target="_blank" rel="noopener noreferrer" href="https://www.newberry.org/rights-and-reproductions">
                    Newberry Rights and Reproductions Policy. 
                </OutboundLink>
            </FooterSection>
        </FooterWrapper>
    )
}
export default Footer
const Credits = ({ setShowCredits }) => (<div className="modal" onClick={() => setShowCredits(false)}><div className="credits" onClick={e => e.stopPropagation()}>
<Closebutton onClick={() => setShowCredits(false)}/>
    <div className="creditwrapper">
        <h2>Nova Reperta Time Machine Credits</h2>
        <div className="credittext">This site accompanies Renaissance Invention: Stradanus’s Nova Reperta, a Newberry exhibition (Fall 2020).</div>
        <div className="creditline"><div className="credit">Design: </div><div className="name"><span className="boldtext">Jen Wolfe</span> &amp; <span className="boldtext">Nicolas White</span></div></div>
        <div className="creditline"><div className="credit">Authors: </div><div className="name"><span className="boldtext">Lia Markey</span> (Designer, Indigenous Woman, Syphilitic Patient) <br /><span className="boldtext">Suzanne Karr Schmidt</span> (Silkworms, Alchemist, Artist) <br /><span className="boldtext">Christopher Fletcher</span> (Printer) <br /><span className="boldtext">Stephanie Reitzig</span> (Miller)</div></div>
        <div className="creditline"><div className="credit">Digitization: </div><div className="name"><span className="boldtext">Catherine Gass</span>, <span className="boldtext">Juan Molina Hernández</span>, <span className="boldtext">John Powell</span></div></div>
        <div className="creditline"><div className="credit">Editor: </div><div className="name"><span className="boldtext">Rebecca Fall</span></div></div>
        <div className="creditline"><div className="credit">Intern: </div><div className="name"><span className="boldtext">Stephanie Reitzig</span></div></div>
        <div className="credittext">The content for the “Nova Reperta Time Travelers” was adapted from texts in the Northwestern University publication, Renaissance Invention: Stradanus’s Nova Reperta (2020). We are grateful in particular to the following authors who contributed to this publication and in turn to the Time Machine: 
        <span className="boldtext"> Olivia Dill</span>, 
        <span className="boldtext"> Sven Dupré</span>, 
        <span className="boldtext"> Alessandra Foscati</span>, 
        <span className="boldtext"> Christine Göttler</span>, 
        <span className="boldtext"> Deborah Howard</span>, 
        <span className="boldtext"> Dirk Imhof</span>, 
        <span className="boldtext"> Elisa J. Jones</span>, 
        <span className="boldtext"> Luca Molà</span>, 
        <span className="boldtext"> Claire Ptaschinski</span>, 
        <span className="boldtext"> Sandra Racek</span>, 
        <span className="boldtext"> John Sullivan</span>, 
        <span className="boldtext"> Claudia Swan</span>, and 
        <span className="boldtext"> Madeleine Viljoen</span>. 
        We also wish to thank 
        <span className="boldtext"> Julia Siemon</span>, 
        <span className="boldtext"> Jonathan Tavares</span>, and 
        <span className="boldtext"> Floor Koeleman</span> for sharing their knowledge with us on particular images.</div>
        <div className="credittext">Caption for the opening image: <span className="boldtext">Ptolemy</span> (A.D. 100–170) and <span className="boldtext">Sebastian Münster</span> (1448–1552) <OutboundLink className="lglink" target="_blank" rel="noopener noreferrer" href="https://archive.org/details/baskes_g1005_1540/page/n95/mode/2up">Novarum Insularum</OutboundLink>, no. 17, from Geographia universalis Basel: <span className="boldtext">Heinrich Petrus</span>, 1540. Book with woodcuts, letterpress and hand illumination Roger S. Baskes Collection</div>
        <div className="credittext">For more information about the Nova Reperta series please also see <OutboundLink className="lglink" target="_blank" rel="noopener noreferrer" href="https://dcc.newberry.org/collections/nova-reperta">Renaissance Invention</OutboundLink> at Digital Collections for the Classroom.</div>
    </div>
</div></div>)


const Closebutton = styled.div`
    position: fixed;
    // margin-left: 15px;
    // right: 15px;
    // margin-top: 15px;
    width: 32px;
    height: 32px;
    opacity: 0.3;
    cursor: pointer;
    transition: opacity 0.1s ease;
    &:hover {
        opacity: 1;
    }
    &:before, &:after {
        position: absolute;
        left: 15px;
        content: ' ';
        height: 33px;
        width: 2px;
        // background-color: pink;
        background-color: #333;
    }
    &:before {
        transform: rotate(45deg);
    }
    &:after {
        transform: rotate(-45deg);
    }
`