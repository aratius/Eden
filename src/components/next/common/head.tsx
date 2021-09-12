import Head from 'next/head'

interface Props {
  title: string
}

const _Head: React.FC<Props> = ({title}) => {

  return (
    <Head>
      <title>{title}</title>
      <link rel="icon" href="/favicon.ico" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />

      {/* OG */}
      <meta property="og:url" content="https://eden.aualrxse.com/works/face" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="face" />
      <meta property="og:description" content="Touch his face and he'll be happy." />
      <meta property="og:site_name" content="face" />
      <meta property="og:image" key="ogImage" content="https://eden.aualrxse.com/face/og.png" />
      <meta name="twitter:card" key="twitterCard" content="summary_large_image" />
      <meta name="twitter:site" content="@aualrxse" />
    </Head>
  )
}

export default _Head