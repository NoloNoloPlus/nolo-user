import React from 'react';
import { useRouter } from 'next/router'


export default function Product(props) {
  const router = useRouter();

  return (
    <div className="card mb-4" style={{width: '20em'}}>
      <div className="card-image">
        <figure className="image is-4by3" style={{overflow: 'hidden'}}>
          <img src={props.coverImage} alt={props.name} style={{width: '100%', height: 'auto'}}/>
        </figure>
      </div>
      <div className="card-content">
        <p className="title is-4">{props.name}</p>
        <p>{props.blurb}</p>
        <button className="button is-info" size="small" color="primary" onClick={() => router.push('product/' + props.id)}>
          More info
        </button>
      </div>
      
    </div>
  );
}