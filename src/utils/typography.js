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
      marginTop: '1rem',
      fontSize: '1.6rem',
      fontWeight: 600,
      lineHeight: 1.2,
      fontFamily: 'nexon-lv1-gothic',
      letterSpacing: '0.5px',
    },

    h2: {
      fontWeight: 500,
      lineHeight: 1.2,
      marginTop: '56px',
      marginBottom: '20px',
      fontFamily: 'nexon-lv1-gothic',
      letterSpacing: '0.5px',
    },

    h3: {
      fontWeight: 500,
      fontFamily: 'nexon-lv1-gothic',
    },
    // 포스트 안 폰트
    p: {
      lineHeight: 1.7,
      fontWeight: 400,
      fontFamily: 'nexon-lv1-gothic',
    },

    ul: {
      fontWeight: 400,
      marginBottom: '6px',
      fontFamily: 'nexon-lv1-gothic',
    },

    li: {
      fontWeight: 400,
      marginBottom: '2px',
      fontFamily: 'nexon-lv1-gothic',
    },

    strong: {
      //fontWeight: 500,
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
