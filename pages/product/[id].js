import { Box, Button, Link, Typography } from "@material-ui/core"
import React, { useEffect, useState } from "react"
import { useRouter } from 'next/router'
import config from "../../config"
import DateFnsUtils from '@date-io/date-fns'
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import { jwtAccessState, jwtAuthorizationHeader, jwtRefreshState, userIdState } from '../../common/auth'
import { useRecoilState } from "recoil"
import utils from "../../common/utils"
import { RouteLink } from "../../components"
import ProductBreakdown from "../../components/breakdowns/ProductBreakdown"
import { productPrice } from "../../common/price"

export default function ProductInfo() {
    const router = useRouter();
    const { id } = router.query;
    const [name, setName] = useState('Betsy')
    const [description, setDescription] = useState('Trattore sano e genuino')
    const [coverImage, setcoverImage] = useState('https://www.evo-tune.it/wp-content/uploads/2019/06/trattore.png')
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const [availability, setAvailability] = useState(null)
    const [quote, setQuote] = useState(null)
    const [availabilityQuote, setAvailabilityQuote] = useState(null);
    const [userId, setUserId] = useRecoilState(userIdState);
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
            setcoverImage(parsedResponse.coverImage);
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

    useEffect(() => {
        if (id && userId) {
            console.log('AUTH: ', jwtAuthorizationHeader(jwtAccess, jwtRefresh, setJwtAccess, setJwtRefresh))
            fetch(config.api_endpoint + '/products/' + id + '/rentability', {
                headers: {
                    pragma : 'no-cache',
                    'cache-control' : 'no-cache',
                    authorization : jwtAuthorizationHeader(jwtAccess, jwtRefresh, setJwtAccess, setJwtRefresh)
                }
            })
            .then((response) => response.json())
            .then((parsedResponse) => {
                console.log('Rentability response: ', parsedResponse)
                const newAvailability = [];

                for (const [instanceId, dateRanges] of Object.entries(parsedResponse)) {
                    console.log('DateRanges: ', dateRanges)
                    for (const dateRange of dateRanges) {
                        newAvailability.push([new Date(dateRange.from), new Date(dateRange.to)])
                    }
                }

                console.log('Parsed availability: ', newAvailability)
                setAvailability(newAvailability);
            })
        }
    }, [id, userId])

    useEffect(() => {
        if (!startDate || !endDate) return;

        fetch(config.api_endpoint + '/products/' + id + '/quote?from=' + utils.formatBackendDate(startDate) + '&to=' + utils.formatBackendDate(endDate), {
            headers: {
                pragma: 'no-cache',
                'cache-control' : 'no-cache',
                authorization : jwtAuthorizationHeader(jwtAccess, jwtRefresh, setJwtAccess, setJwtRefresh)
            },
        })
        .then((response) => response.json())
        .then((parsedResponse) => {
            console.log('Quote:')
            console.log(parsedResponse)
            setQuote(parsedResponse)
        })
    }, [startDate, endDate])

    useEffect(() => {
        if (!startDate || !endDate) return;

        fetch(config.api_endpoint + '/products/' + id + '/quote?from=' + utils.formatBackendDate(startDate) + '&to=' + utils.formatBackendDate(endDate) + '&ignoreAllRentals=true', {
            headers: {
                pragma: 'no-cache',
                'cache-control' : 'no-cache',
                authorization : jwtAuthorizationHeader(jwtAccess, jwtRefresh, setJwtAccess, setJwtRefresh)
            },
        })
        .then((response) => response.json())
        .then((parsedResponse) => {
            console.log('Availability quote:')
            console.log(parsedResponse)
            setAvailabilityQuote(parsedResponse)
        })
    }, [startDate, endDate])

    const differentPrices = () => {
        if (quote && availabilityQuote) {
            return productPrice(quote) !== productPrice(availabilityQuote)
        }
        return false;
    }

    const dateInRanges = (day, ranges) => {
        // First merge compatible ranges
        const mergedRanges = utils.mergeDateRanges(ranges);

        for (var range of mergedRanges) {
            const [start, end] = range;
            if (day >= start && day <= end) {
                return range;
            }
        }
        return null;
    }

    const startShouldDisableDate = (day) => {
        if (!availability) {
            return true;
        }
        if (endDate) {
            if (day > endDate) {
                return true;
            }
            const allowedRange = dateInRanges(endDate, availability);
            if (!allowedRange) {
                return true;
            }
            const [allowedStart, allowedEnd] = allowedRange;
            if (day < allowedStart) {
                return true;
            }
        }

        const matchingRange = dateInRanges(day, availability);

        if (!matchingRange) {
            return true;
        }

        return false;
    }

    const endShouldDisableDate = (day) => {
        if (!availability) {
            return true;
        }
        if (startDate) {
            if (day < startDate) {
                return true;
            }
            const allowedRange = dateInRanges(startDate, availability);
            if (!allowedRange) {
                return true;
            }
            const [allowedStart, allowedEnd] = allowedRange;
            if (day > allowedEnd) {
                return true;
            }
        }

        const matchingRange = dateInRanges(day, availability);

        if (!matchingRange) {
            return true;
        }

        return false;
    }

    const rent = () => {
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
                    [id]: {
                        instances: formattedInstances
                    }
                }
            })
        })
    }
    
    return (
        <div className="columns">
            <div className="column">
                <p className="title">{name}</p>
                <p className="subtitle">{description}</p>
                <img className="image" style={{width: '13em'}} src={coverImage} alt={name}/>
            </div>
            <div className="column">
                { userId ? (
                    <div className="mt-5">
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <p>From:</p>
                            <DatePicker value={startDate} onChange={setStartDate} shouldDisableDate={startShouldDisableDate} disablePast={true} clearable={true} variant='dialog'/>
                            <br></br>
                            <p>To:</p>
                            <DatePicker value={endDate} onChange={setEndDate} shouldDisableDate={endShouldDisableDate} disablePast={true} clearable={true} variant='dialog'/>
                        </MuiPickersUtilsProvider>
                        <br></br>
                        <button className="button is-link mt-2" onClick={rent} title='Rent' disabled={!startDate || !endDate}>Rent</button>
                        {quote ? <Typography>Price: {productPrice({...quote}, false)}€</Typography> : <></>}
                        {quote ? (
                            <div>
                                <p>Cost breakdown:</p>
                                <ProductBreakdown productInfo={productInfo} {...quote} />
                            </div>
                        ) : <></>}
                        {quote && quote.instances.length > 1 ? (<Typography>This accomodation requires switching instance mid-rental.</Typography>) : <></>}
                        {differentPrices() ? (
                            <Typography>Note: the most convenient offer was already taken. We apologize for the inconvenience. May the Sun God be with you.</Typography>
                        ) : <></>}
                    </div>
                ) : <RouteLink variant="body2" href={'/signin?redirect='}>Login to view availability</RouteLink>
                }
            </div>
        </div>
    )
}