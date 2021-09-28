import Typography from 'typography'
import GitHubTheme from 'typography-theme-github'

GitHubTheme.overrideThemeStyles = () => {
  return {
    a: {
      boxShadow: `none`,
      textDecoration: `none`,
      color: `#0687f0`,
      fontFamily: 'ridi-batang',
    },
    'a.gatsby-resp-image-link': {
      boxShadow: `none`,
      textDecoration: `none`,
      fontFamily: 'ridi-batang',
    },

    'a:hover': {
      textDecoration: `none`,
    },

    h1: {
      fontWeight: 800,
      lineHeight: 1.2,
      fontFamily: 'ridi-batang',
    },

    h2: {
      fontWeight: 700,
      lineHeight: 1.2,
      marginTop: '56px',
      marginBottom: '20px',
      fontFamily: 'ridi-batang',
    },

    h3: {
      fontFamily: 'ridi-batang',
    },

    p: {
      fontSize: '16px',
      lineHeight: 1.8,
      fontWeight: 200,
      fontFamily: 'ridi-batang',
    },

    ul: {
      marginBottom: '6px',
      fontFamily: 'ridi-batang',
    },

    li: {
      marginBottom: '2px',
      fontSize: '17px',
      fontFamily: 'ridi-batang',
    },
  }
}

const typography = new Typography(GitHubTheme)

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
  typography.injectStyles()
}

export default typography
export const rhythm = typography.rhythm
export const scale = typography.scale
