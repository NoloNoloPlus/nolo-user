import '../styles/globals.css'

import { RecoilRoot } from 'recoil';
import Header from '../components/Header';

function MyApp({ Component, pageProps }) {
  return (
    <RecoilRoot>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css"></link>
      <Header/>
      <Component {...pageProps} />
    </RecoilRoot>

    
  )
}

export default MyApp
