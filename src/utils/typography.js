import Typography from 'typography'
import GitHubTheme from 'typography-theme-github'

GitHubTheme.overrideThemeStyles = () => {
  return {
    a: {
      boxShadow: `none`,
      textDecoration: `none`,
      color: `#0687f0`,
      fontFamily: 'nexon-lv1-gothic',
    },
    'a.gatsby-resp-image-link': {
      boxShadow: `none`,
      textDecoration: `none`,
      fontFamily: 'nexon-lv1-gothic',
    },

    'a:hover': {
      textDecoration: `none`,
    },

    h1: {
      fontSize: '30px',
      fontWeight: 600,
      lineHeight: 1.2,
      fontFamily: 'nexon-lv1-gothic',
    },

    h2: {
      fontWeight: 400,
      lineHeight: 1.2,
      marginTop: '56px',
      marginBottom: '20px',
      fontFamily: 'nexon-lv1-gothic',
    },

    h3: {
      fontSize: '20px',
      fontWeight: 400,
      fontFamily: 'nexon-lv1-gothic',
    },

    p: {
      fontSize: '16.5px',
      lineHeight: 1.7,
      fontWeight: 300,
      fontFamily: 'nexon-lv1-gothic',
    },

    ul: {
      fontSize: '16.5px',
      fontWeight: 300,
      marginBottom: '6px',
      fontFamily: 'nexon-lv1-gothic',
    },

    li: {
      fontWeight: 300,
      marginBottom: '2px',
      fontSize: '16px',
      fontFamily: 'nexon-lv1-gothic',
    },

    strong: {
      fontWeight: 400,
      color: '#333d4b',
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
