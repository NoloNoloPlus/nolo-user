import { useState, useEffect } from "react";

import { useRecoilState } from "recoil";
import { avatarUrlState, billingInfoState, jwtAccessState, jwtAuthorizationHeader, jwtRefreshState, userIdState } from "../common/auth";
import { useForm } from "react-hook-form";

import { useRouter } from "next/router";

import { schemas } from "../common";
import { joiResolver } from "@hookform/resolvers/joi";

import { utils } from "../common";
import config from "../config";
import Profile from "../components/Profile";

const defaultValues = {};

export default function ProfilePage () {
    const router = useRouter();
    const [userId, setUserId] = useRecoilState(userIdState);
    const [avatarUrl, setAvatarUrl] = useRecoilState(avatarUrlState);
    const [billingInfo, setBillingInfo] = useRecoilState(billingInfoState);
    const [jwtAccess, setJwtAccess] = useRecoilState(jwtAccessState);
    const [jwtRefresh, setJwtRefresh] = useRecoilState(jwtRefreshState);
    const [message, setMessage] = useState(null);

    const { register, formState: { errors }, handleSubmit, watch, setValue } = useForm({ defaultValues: defaultValues, mode: 'onBlur', resolver: joiResolver(schemas.editUser)});

    useEffect(() => {
        if (!userId) {
            router.push('/signin');
        }
    }, [userId]); 

    const removeExtraFields = (obj) => {
        delete obj.id;
        delete obj.isEmailVerified;
        delete obj.role;
        delete obj.address.id;
        delete obj.address.street.id;
    }

    const queryUserInfo = async () => {
        const response = await fetch(config.api_endpoint + '/users/' + userId, {
            headers: {
                pragma: 'no-cache',
                'cache-control' : 'no-cache',
                authorization : jwtAuthorizationHeader(jwtAccess, jwtRefresh, setJwtAccess, setJwtRefresh)
            }
        });

        if (utils.success(response)) {
            const body = await response.json();
            console.log('Response:')
            console.log(body)
            removeExtraFields(body);
            for (const [key, value] of Object.entries(body)) {
                setValue(key, value);
            }
        }
    }

    const updateUserInfo = async (data) => {
        await fetch(config.api_endpoint + '/users/' + userId, {
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: {
                pragma: 'no-cache',
                'cache-control' : 'no-cache',
                'content-type': 'application/json',
                authorization : jwtAuthorizationHeader(jwtAccess, jwtRefresh, setJwtAccess, setJwtRefresh)
            }
        }).catch((error) => {
            console.log(error);
            setMessage({ type: 'error', message: 'Failed to update user info.' })
        });

        await queryUserInfo();
        setAvatarUrl(data.avatarUrl);
        setBillingInfo({
            firstName: data.firstName,
            lastName: data.lastName,
            company: data.company,
            address: data.address
        });
        setMessage({ type: 'success', message: 'User info updated successfully.' });
    }

    useEffect(queryUserInfo, []);

    return (
        <div>
            <Profile errors={errors} register={register} />
            <div className="is-flex is-justify-content-center">
                <button className="button is-black" onClick={handleSubmit(updateUserInfo)}>Update</button>
            </div>
            {
                message ? (
                    <div className={'notification ' + (message.type == 'success' ? 'is-success' : 'is-danger')}>
                        <p>{message.message}</p>
                    </div>
                ) : <></>
            }
        </div>
    )
}