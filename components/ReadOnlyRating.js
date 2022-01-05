import React from 'react';
import { Rating } from 'react-simple-star-rating'

export default function ReadOnlyRating({ value }) {

  return (
    <Rating allowHover={false} allowHalfIcon={true} tooltipDefaultText={"Voto"} ratingValue={value} />
  )
}
