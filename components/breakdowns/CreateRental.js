import React, { useEffect, useState } from "react"
import config from "../../config"
import DateFnsUtils from '@date-io/date-fns'
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import { jwtAccessState, jwtAuthorizationHeader, jwtRefreshState, userIdState } from '../../common/auth'
import { useRecoilState } from "recoil"
import utils from "../../common/utils"
import { RouteLink } from "../../components"
import ProductBreakdown from "../../components/breakdowns/ProductBreakdown"
import { productPrice } from "../../common/price"
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

export default function CreateRental({ rentalId, productId, productInfo, onRent, rentLabel }) {
    const [jwtAccess, setJwtAccess] = useRecoilState(jwtAccessState);
    const [jwtRefresh, setJwtRefresh] = useRecoilState(jwtRefreshState);
    const [userId, setUserId] = useRecoilState(userIdState);
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const [availability, setAvailability] = useState(null)
    const [quote, setQuote] = useState(null)
    const [availabilityQuote, setAvailabilityQuote] = useState(null);

    useEffect(() => {
        if (productId && userId) {
            console.log('AUTH: ', jwtAuthorizationHeader(jwtAccess, jwtRefresh, setJwtAccess, setJwtRefresh))
            fetch(config.api_endpoint + '/products/' + productId + '/rentability' + (rentalId ? `?ignoreRental=${rentalId}` : ''), {
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
    }, [productId, userId])

    useEffect(() => {
        if (!startDate || !endDate) return;

        fetch(config.api_endpoint + '/products/' + productId + '/quote?from=' + utils.formatBackendDate(startDate) + '&to=' + utils.formatBackendDate(endDate) + (rentalId ? `&ignoreRental=${rentalId}` : ''), {
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

        fetch(config.api_endpoint + '/products/' + productId + '/quote?from=' + utils.formatBackendDate(startDate) + '&to=' + utils.formatBackendDate(endDate) + '&ignoreAllRentals=true', {
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
            endDate.setHours(0, 0, 0, 0);
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
            startDate.setHours(0, 0, 0, 0);
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

    return (
        <div>
            { userId ? (
                <div className="mt-5">
                    <h1 className="title has-text-centered">Select the date period for your rental</h1>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <div className="field is-horizontal">
                            <div className="field-label is-normal">
                                <label className="label">From</label>
                            </div>
                            <div className="field-body">
                                <div className="field">
                                    <p className="control">
                                        <DatePicker id="fromDate" value={startDate} onChange={setStartDate} shouldDisableDate={startShouldDisableDate} disablePast={true} clearable={true} variant='dialog'/>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="field is-horizontal">
                            <div className="field-label is-normal">
                                <label className="label">To</label>
                            </div>
                            <div className="field-body">
                                <div className="field">
                                    <p className="control">
                                        <DatePicker id="toDate" value={endDate} onChange={setEndDate} shouldDisableDate={endShouldDisableDate} disablePast={true} clearable={true} variant='dialog'/>
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                    </MuiPickersUtilsProvider>
                    <br></br>
                    
                    {quote ? (
                        <div>
                            <ProductBreakdown productInfo={productInfo} {...quote} />
                        </div>
                    ) : <></>}
                    <button className="button is-black my-2" onClick={() => onRent(quote)} title={rentLabel} disabled={!startDate || !endDate}>{rentLabel}</button>
                    {(quote && quote.instances.length > 1) ? (
                        <div className="notification is-info">
                            <p>This accomodation requires switching instance mid-rental.</p>
                        </div>
                    ) : <></>}
                    {differentPrices() ? (
                        <div className="notification is-warning">
                            <p>Note: the most convenient offer was already taken. We apologize for the inconvenience. May the Sun God be with you.</p>
                        </div>
                    ) : <></>}
                </div>
            ) : <RouteLink variant="body2" href={'/signin?redirect='}>Login to view availability</RouteLink>
            }
        </div>
    )
}