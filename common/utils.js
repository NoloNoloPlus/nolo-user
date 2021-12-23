import { format } from 'date-format-parse'

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
const formatFrontendDate = (date) => format(date, 'MMM d, YYYY')

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

export default {
    applyDiscounts,
    formatBackendDate,
    formatFrontendDate,
    overallDateRanges,
    success
}