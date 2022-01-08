import { useState } from "react";
import EditRentalModal from "./EditRentalModal";
import config from "../../config"
import { jwtAccessState, jwtAuthorizationHeader, jwtRefreshState } from '../../common/auth'
import { useRecoilState } from "recoil"
import utils from "../../common/utils"

export default function EditRentalButton({ rentalId, productId, productInfo }) {
    const [isOpen, setIsOpen] = useState(false);
    const [jwtAccess, setJwtAccess] = useRecoilState(jwtAccessState);
    const [jwtRefresh, setJwtRefresh] = useRecoilState(jwtRefreshState);

    const editRental = (quote) => {
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

        fetch(config.api_endpoint + '/rentals/' + rentalId + '/preprocessed', {
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
        <div>
            <button className="button is-primary is-outlined is-fullwidth" onClick={() => setIsOpen(true)}>
                Edit Rental
            </button>
            <EditRentalModal rentalId={rentalId} productId={productId} productInfo={productInfo} isOpen={isOpen} setIsOpen={setIsOpen} onRent={editRental} />
        </div>
    )
}