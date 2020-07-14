import React, { Fragment } from 'react';
import styled from "@emotion/styled";
import { Link } from 'gatsby'
import logob from '../images/Newberry_N.svg';
import { OutboundLink } from 'gatsby-plugin-google-analytics';
/** @jsx jsx */
import { css, jsx } from '@emotion/core' 

import paper from '../images/paper.png';


const Navchunk = styled.div`
    z-index: 2;
    position: fixed;
    top: 5px;
    left: 7px;
    margin: 7px 0 0 5px;
    height: 60px;
    padding: 0 5px;
    display: inline-flex;
    border-radius: 8px;
    font-family: 'Lato', sans-serif;
    flex-direction: row;
    transition: all .15s ease-in-out;
    & a {
        transition: all .15s ease-in-out;
        text-decoration: none;
        &:hover {
            filter: drop-shadow(0 0 0.25rem white);
        }
    }
        -webkit-box-shadow: 10px 10px 50px 0px rgba(0,0,0,0.75);
        -moz-box-shadow: 10px 10px 50px 0px rgba(0,0,0,0.75);
        box-shadow: 10px 10px 50px 0px rgba(0,0,0,0.75);
        border: 2px solid white;
        // background: rgba(0,0,0,0.65);
        background-image: url(${paper});
        background: #641818;
        // background: #284883;
        & .nav-textlink {
            color: white;
        }
        & .nav-n-logo img {
            filter: invert(100%);
        }
    & .nav-n-logo {
        padding: 4px 0 4px 7px;
        width: 50px;
    }
    & .nav-textlink {
        padding: 7px;
        display: flex;
        flex-direction: column;
        align-content: stretch;
        height: 40px;
        line-height: 40px;
    }
    & img {
        transition: all .15s ease-in-out;
        margin: 3px 0 0 0;
        background: url('${logob}');
        height: 40px;
        width: 40px;
        background-size: cover;
    }
    #nav-chooselink {
        @media only screen and (min-width: 900px) {
            display: none;
        }
    }
`
const Navchun = styled.div`

.navwrapper {
    margin: auto;
    padding: 40px;
    position: relative;
    
}
.navbox {
    z-index: 200;
    position: fixed;
    top: 5px;
    left: 7px;
    height: 60px;
    display: inline-flex;
    flex-direction: row;
    transition: all .15s ease-in-out;

    font-family: 'Goudy Bookletter 1911',serif;
    font-weight: 900;
    font-size: 1.5rem;

    margin: 25px auto;


    border: 4px solid rgba(0,0,0,0.5);
    border-radius: 1vw;
}
.texteffect {
    color: black;
    mix-blend-mode: screen;
}

.zero    { font-family: 'Cormorant Upright' , serif;         }
.one     { font-family: 'Goudy Bookletter 1911' , serif;     }

a {
    height: 100%;
    text-align: center;
    text-decoration: none;
    text-transform: uppercase;
    line-height: 055px;
    padding: 0 15px;
}
.hovereffect {
    background-color: rgba(251, 251, 251, 0.85);
    &:hover {
        background-color: rgba(251, 251, 251, 0.5);
    }
    img {
        // filter: invert(100%); 
        &:hover {
            filter: invert(100%); 
        }
    }
    a {
        color: black;
        &:hover {
            color: white;
        }
    }
}
`
export default class Navbar extends React.Component {
    render(){
        return(
            <Navchun className="navwrapper" >
                <div className="navbox texteffect hovereffect">
                    <OutboundLink href="http://www.newberry.org" >
                        <img alt="Newberry Logo" src={logob}/>
                    </OutboundLink>
                    { this.props.location.pathname === '/indexx' ? 
                            <Link to="/" className="nav-textlink" id="nav-homelink">
                                &gt; Digital Newberry
                            </Link> 
                    : 
                        this.props.location.pathname === '/time-machine/choose/' ? 
                        <Link to="/" className="nav-textlink" id="nav-homelink">
                            &gt; Time Machine
                        </Link> 
                    : 
                        <Fragment>
                            <Link to="/" className="nav-textlink" id="nav-homelink">
                                &gt; Time Machine
                            </Link>
                            <Link to="/choose" className="nav-textlink" id="nav-chooselink">
                                &gt; Swap Traveler
                            </Link>
                        </Fragment>
                    }
                </div>
            </Navchun>
        )
    }
}