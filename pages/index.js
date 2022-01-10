import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Products from './products'
import { useRouter } from 'next/router'


export default function Home() {
  const router = useRouter()
  return (
    <div style={{height: '100vh', overflow: 'hidden'}}>
      <div style={{filter: 'blur(3px)', position: 'absolute', height: '100vh', width: '100vw', zIndex: '0', backgroundImage: "url('https://img.wallpapersafari.com/desktop/1600/900/48/58/gJAN2E.png')"}}>
      </div>
      
      <div style={{position: 'absolute', height: '100vh', width: '100vw', zIndex: '1', overflow: 'hidden'}}>
        <div style={{height: '100vh', width: '100vw', position: 'relative'}}>
          <img style={{position: 'absolute', height: '120vh', overflow: 'hidden', objectFit: 'cover', right: '-4em', top: '2em', zIndex: '0'}} src="https://cdn.pixabay.com/photo/2020/07/10/21/24/prehistoric-5392213_960_720.png"></img>
        </div>
      </div>

      <div style={{position: 'absolute', height: '100vh', width: '100vw', backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.7), transparent)', zIndex: '1'}}>
      </div>
      
      <div className="is-flex is-flex-direction-column is-justify-content-center is-align-items-start ml-6 mt-6" style={{height: '50vh', width: '50%', minWidth: '15em'}}>
        <h1 className="title is-1" style={{color: 'black', zIndex: '2', width: '100vw'}}>Welcome to NoloNoloPlus!</h1>
        <h2 className="subtitle is-3" style={{color: 'black', zIndex: '2'}}>Rent the best in class hunting, farmer and magic tools</h2>
        <button className="button is-black" style={{zIndex: '2'}} onClick={() => router.push('/products')}>Catalogue</button>
      </div>
    </div>
  )
}
