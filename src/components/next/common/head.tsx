import Head from 'next/head'

interface Props {
  title: string,
  ogUrl: string,
  ogImgPath: string,
  description: string,
}

const _Head: React.FC<Props> = ({title, ogUrl, ogImgPath, description}) => {

  return (
    <Head>
      <title>{title}</title>
      <link rel="icon" href="/favicon.ico" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />

      {/* OG */}
      <meta property="og:url" content={ogUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content="eden" />
      <meta property="og:image" key="ogImage" content={ogImgPath} />
      <meta name="twitter:card" key="twitterCard" content="summary_large_image" />
      <meta name="twitter:site" content="@aualrxse" />
    </Head>
  )
}

export default _Head