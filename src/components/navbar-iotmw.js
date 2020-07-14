import React from 'react'
import styled from "@emotion/styled"
import logob from '../images/Newberry_N.svg'
/** @jsx jsx */
import { css, jsx } from '@emotion/core'

const Navchunk = styled.div`
    border: 2px solid transparent;
    position: relative;
    // border-radius: 8px;
    width: 223px;
    padding-top: 9px;
    padding-left: 4px;
    font-family: 'Lato', sans-serif;
    display: flex;
    transition: all .15s ease-in-out;
    & a {
        transition: all .15s ease-in-out;
        text-decoration: none;
        &:hover {
            filter: drop-shadow(0 0 0.25rem black);
        }
    }
    &:hover {
        border: 2px solid rgba(0,0,0,1); 
        background: rgba(255,255,255,0.85);
        box-shadow: 10px 10px 30px 0px rgba(0,0,0,0.75);
        & a {
            color: rgba(0,0,0,1);
        }
        &.navleft img {
            filter: invert(0%);
        }
    }
    &.navleft img {
        filter: invert(100%);
        transition: all .15s ease-in-out;
        flex: 1;
        margin: 3px 0 0 0;
        background: url('${logob}');
        height: 40px;
        width: 40px;
        background-size: cover;
    }
    &::before {
        content: "";
        display: inline-block;
        vertical-align: middle;
        height: 100%;
    }
`
export default class Navbar extends React.Component {
    render(){
        return(
            <header css={css`position: fixed;
                    z-index: 3;
                    top: 0px;
                    left: 5px;
                    `}>
                <div className="navbar" css={css`
                    margin: 5px auto 0 auto;
                    height: 60px;
                    line-height: 40px;
                    `}>
                    <Navchunk onClick={this.props.handleClick} className="navleft" css={css`
                        position: relative;
                    `}>
                        <div css={css`padding: 0 7px;`}>
                            <a href="http://www.newberry.org"><img alt="Newberry Logo" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" /></a>
                            <a href="http://www.newberry.org/digital-newberry/"
                                css={css`
                                    flex: 3;
                                    position: absolute;
                                    top: 0;
                                    bottom: 0;
                                    left: 70px;
                                    right: 0;
                                    height: 30%;
                                    margin: auto;
                                    color: rgba(0,0,0,0);
                                    vertical-align: middle;
                                    height: 40px;
                                    font-size: 0.85rem;
                                    line-height: 40px;
                                `}>
                                &gt; Digital Newberry
                            </a>
                        </div>
                    </Navchunk>
                </div>
            </header>
        )
    }
}