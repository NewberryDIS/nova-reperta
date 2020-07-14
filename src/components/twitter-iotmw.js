import React from 'react';
import { OutboundLink } from 'gatsby-plugin-google-analytics';
/** @jsx jsx */
import { css, jsx } from '@emotion/core' 
import twicon from '../images/twicon.png';

const TwitterButton = () => (
    <p className="wrapper" css={css`
        width: 60px;
        height: 60px;
        position: absolute;
        top: 12px;
        right: 10px;
        &:hover {
            .twittericon img {
                filter: drop-shadow(0 0 0.25rem white)
                        invert(100%);
            }
            border: 2px solid rgba(0,0,0,1); 
            background: rgba(255,255,255,0.85);
            box-shadow: 10px 10px 30px 0px rgba(0,0,0,0.75);
        }
        img {
            transition: all .15s ease-in-out;
            margin: 0;
        }
    `}>
        <OutboundLink href="https://twitter.com/DigitalNewberry" rel="noopener noreferrer" target="_blank" className="twittericon">
            <img src={twicon} alt="twitter icon"/>
        </OutboundLink>
    </p>
)

export default TwitterButton