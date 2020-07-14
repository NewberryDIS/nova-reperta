module.exports = {
  siteMetadata: {
    title: `Newberry Nova Reperta Time Machine`,
    description: `Travel through time with the Newberry`,
    author: `c2lknt`,
  },
  pathPrefix: `/nova-reperta`, 
  plugins: [
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: "UA-5551324-4",
        head: true,
      },
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/markdown-pages`,
        name: `markdown-pages`,
      },
    },
    `gatsby-transformer-remark`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/Newberry_N.svg`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: `gatsby-plugin-prefetch-google-fonts`,
      options: {
        fonts: [
          {
            family: `Lato`,
            variants: [`100i`,`300i`,`400`]
          },
          {
            family: `EB Garamond`,
            variants: [`700`]
          }, 
          {
            family: `Ultra`,
            variants: [`400`, `700`]
          },
          { family: 'IM Fell DW Pica SC' },
          { family: 'Old Standard TT' },
          { family: 'Cormorant Upright' },
          { family: 'Goudy Bookletter 1911' },
          { family: 'Uncial Antiqua' },
        ],
      },
    }
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
