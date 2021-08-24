import React, {useEffect, useState} from "react"
import Product from "../components/Product"
import Header from "../components/Header"
import { Box } from "@material-ui/core"
import { useQueryParam, StringParam } from "use-query-params";
import config from "../config";

// Messo solo per avere dei dati
const initialProducts = [
    {
        name: 'Betsy',
        blurb: 'Trattore sano e genuino',
        imageUrl: 'https://www.evo-tune.it/wp-content/uploads/2019/06/trattore.png'
    }
]

const truncate = (input, maxLength) => input.length > maxLength ? `${input.substring(0, maxLength - 3)}...` : input;

const Products = ({location}) => {
    const [products, setProducts] = useState(initialProducts)
    // Use this to handle search queries
    const [query, setQuery] = useQueryParam('q', StringParam)

    useEffect(() => {
        // TODO: Qui è dove dovresti prendere i prodotti
        fetch(config.api_endpoint + '/products?keywords=' + (query || ''), {
            headers: {
                pragma: 'no-cache',
                'cache-control' : 'no-cache'
            }
        })
            .then((response) => {
                return response.json()
            })
            .catch((error) => {
                console.log(error)
            })
            .then((parsedResponse) => {
                const parsedProducts = parsedResponse.results;
                console.log(parsedResponse)
                const newProducts = [];
                for (let parsedProduct of parsedProducts) {
                    newProducts.push({
                        name: parsedProduct.name,
                        id: parsedProduct.id,
                        blurb: truncate(parsedProduct.description, 50),
                        coverImage: parsedProduct.coverImage
                    })
                }

                setProducts(newProducts);
            })
    }, [query])

    return (
        <Box>
            <Header showLogin={true}/>
            <Box>
            {
                products.map((product, index) => 
                    <Product name={product.name} coverImage={product.coverImage} blurb={product.blurb} id={product.id} key={'product' + index}/>
                )
            }
            </Box>
        </Box>
        
    )
}

export default Products