import '../styles/globals.css'

import { RecoilRoot } from 'recoil';
import Header from '../components/Header';
import { Helmet } from 'react-helmet'

function MyApp({ Component, pageProps }) {
  return (
    <RecoilRoot>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css"></link>
      <Helmet>
        <title>NoloNoloPlus</title>
      </Helmet>
      <Header/>
      <Component {...pageProps} />
    </RecoilRoot>

    
  )
}

export default MyApp
