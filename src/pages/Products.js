import React, {useEffect, useState} from "react"
import Product from "../components/Product"
import Header from "../components/Header"
import { Box } from "@material-ui/core"
import { useQueryParam, StringParam } from "use-query-params";

// Messo solo per avere dei dati
const initialProducts = [
    {
        name: 'Betsy',
        blurb: 'Trattore sano e genuino',
        imageUrl: 'https://www.evo-tune.it/wp-content/uploads/2019/06/trattore.png'
    }
]

const Products = ({location}) => {
    const [products, setProducts] = useState(initialProducts)
    // Use this to handle search queries
    const [query, setQuery] = useQueryParam('q', StringParam)

    useEffect(() => {
        // TODO: Qui è dove dovresti prendere i prodotti
    })

    return (
        <Box>
            <Header showLogin={true}/>
            <Box>
            {
                products.map((product, index) => 
                    <Product name={product.name} imageUrl={product.imageUrl} blurb={product.blurb} key={'product' + index}/>
                )
            }
            </Box>
        </Box>
        
    )
}

export default Products