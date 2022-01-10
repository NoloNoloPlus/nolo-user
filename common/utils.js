import { format } from 'date-format-parse'
import mergeRanges from 'merge-ranges';

const success = (response) => {
    return response.status >= 200 && response.status < 300;
}

const overallDateRanges = (instances, formatter) => {
    const overallRanges = []
    console.log('Instances:', instances)
    for (const instance of Object.values(instances)) {
        for (const dateRange of instance.dateRanges) {
            const newRange = {
                from: dateRange.from,
                to: dateRange.to,
                price: dateRange.price,
                discounts: dateRange.discounts.concat(instance.discounts)
            }

            overallRanges.push(newRange)
        }
    }

    overallRanges.sort((a, b) => a.from - b.from)

    if (formatter) {
        for (const range of overallRanges) {
            range.from = formatter(range.from)
            range.to = formatter(range.to)
        }
    }

    console.log('Overall date ranges:', overallRanges)

    return overallRanges
}

const formatBackendDate = (date) => format(date, 'YYYY-MM-DD')
const formatFrontendDate = (date) => format(date, 'MMM DD, YYYY')

const applyDiscounts = (price, discounts) => {
    console.log('Discounts', discounts)
    for (const discount of discounts) {
        console.log('Discount', discount)
        if (discount.type === 'percentage') {
            price *= 1 - discount.value;
        } else {
            price -= discount.value;
        }
    }

    return price
}

const mergeDateRanges = (dateRanges) => {
    let ranges = [];

    // Convert [22...24] into [22...25]
    for (const [from, to] of dateRanges) {
        //const newFrom = new Date(from)
        //newFrom.setDate(newFrom.getDate() - 1)
        const newTo = new Date(to)
        newTo.setDate(newTo.getDate() + 1)

        ranges.push([from, newTo])
    }

    // Merge the ranges
    ranges = mergeRanges(ranges)

    const finalRanges = [];

    // Reconvert [22...25] into [22...24]
    for (const [newFrom, newTo] of ranges) {
        //const finalFrom = new Date(newFrom)
        // finalFrom.setDate(finalFrom.getDate() + 1)
        const finalTo = new Date(newTo)
        finalTo.setDate(finalTo.getDate() - 1)

        finalRanges.push([newFrom, finalTo])
    }

    return finalRanges
}

const formatPrice = (price) => {
    if (price === undefined || price === null) {
        return '';
    }
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}

export default {
    applyDiscounts,
    formatBackendDate,
    formatFrontendDate,
    formatPrice,
    overallDateRanges,
    mergeDateRanges,
    success
}