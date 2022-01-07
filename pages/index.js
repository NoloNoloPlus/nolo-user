import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Products from './products'
import { useRouter } from 'next/router'


export default function Home() {
  const router = useRouter()
  return (
    <div>
      <div style={{filter: 'blur(3px)', position: 'absolute', height: '100vh', width: '100vw', zIndex: '0', backgroundImage: "url('https://img.wallpapersafari.com/desktop/1600/900/48/58/gJAN2E.png')"}}>
      </div>
      <img style={{position: 'absolute', height: '120vh', overflow: 'hidden', right: '-4em', top: '2em', zIndex: '0'}} src="https://cdn.pixabay.com/photo/2020/07/10/21/24/prehistoric-5392213_960_720.png"></img>
      <div className="is-flex is-flex-direction-column is-justify-content-center is-align-items-start ml-6" style={{height: '50vh', width: '50%', minWidth: '15em'}}>
        <h1 className="title is-1" style={{color: 'black', zIndex: '2'}}>Welcome to NoloNoloPlus!</h1>
        <h2 className="subtitle is-3" style={{color: 'black', zIndex: '2'}}>Rent the best in class hunting, farmer and magic tools</h2>
        <button className="button is-black" onClick={() => router.push('/products')}>Catalogue</button>
      </div>
    </div>
  )
}
