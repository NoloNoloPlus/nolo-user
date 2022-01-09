import React, { useEffect, useState } from "react"
import { useRouter } from 'next/router'
import config from "../../config"
import { jwtAccessState, jwtAuthorizationHeader, jwtRefreshState, userIdState } from '../../common/auth'
import { useRecoilState } from "recoil"
import utils from "../../common/utils"
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import CreateRental from "../../components/breakdowns/CreateRental"

export default function ProductInfo() {
    const router = useRouter();
    const { id } = router.query;
    const [name, setName] = useState('Betsy')
    const [description, setDescription] = useState('Trattore sano e genuino')
    const [images, setImages] = useState([])
    const [jwtAccess, setJwtAccess] = useRecoilState(jwtAccessState);
    const [jwtRefresh, setJwtRefresh] = useRecoilState(jwtRefreshState);
    const [productInfo, setProductInfo] = useState({})

    useEffect(() => {
        if (!id) {
            return;
        }

        fetch(config.api_endpoint + '/products/' + id, {
            headers: {
                pragma: 'no-cache',
                'cache-control' : 'no-cache'
            }
        })
        .then((response) => response.json())
        .then((parsedResponse) => {
            setName(parsedResponse.name);
            setDescription(parsedResponse.description);
            setImages([...parsedResponse.otherImages, parsedResponse.coverImage]);
        })
    }, [id])

    useEffect(() => {
        if (!id) {
            return;
        }

        fetch(config.api_endpoint + '/products/' + id, {
            headers: {
                pragma: 'no-cache',
                'cache-control' : 'no-cache'
            }
        })
        .then((response) => response.json())
        .then((parsedResponse) => {
            console.log('Received update for id ' + id)
            setProductInfo(parsedResponse)
        })
    }, [id])

    const rent = (quote) => {
        const formattedInstances = {};

        for (const [instanceId, instance] of Object.entries(quote.instances)) {
            formattedInstances[instanceId] = {
                dateRanges: []
            }
            for (let i = 0; i < instance.dateRanges.length; i++) {
                formattedInstances[instanceId].dateRanges.push({
                    from: utils.formatBackendDate(instance.dateRanges[i].from),
                    to: utils.formatBackendDate(instance.dateRanges[i].to)
                })
            }
        }

        fetch(config.api_endpoint + '/rentals/', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              authorization : jwtAuthorizationHeader(jwtAccess, jwtRefresh, setJwtAccess, setJwtRefresh)

            },
            body: JSON.stringify({
                products: {
                    [productId]: {
                        instances: formattedInstances
                    }
                }
            })
        })
    }

    return (
        <div className="columns">
            <div className="column p-6">
                <p className="title has-text-centered">{name}</p>
                <p className="subtitle has-text-centered">{description}</p>
                <div>
                    <Carousel showThumbs={false}>
                        {
                            images.map((image, i) => (
                                <div key={i}>
                                    <img src={image} alt={name} style={{height: '16em', width: 'auto'}}/>
                                    <p></p>
                                </div>
                            ))
                        }
                    </Carousel>
                </div>
                
            </div>
            <div className="column p-6" style={{backgroundColor: '#f8f0e3', minHeight: '100vh'}}>
                <CreateRental  productId={id} productInfo={productInfo} rentLabel="Request Rental" onRent={rent} />
            </div>
            
        </div>
    )
}