import { useState, useEffect } from "react";

import { useRecoilState } from "recoil";
import { jwtAccessState, jwtAuthorizationHeader, jwtRefreshState, userIdState } from "../common/auth";
import { useForm } from "react-hook-form";

import { schemas } from "../common";
import { joiResolver } from "@hookform/resolvers/joi";

import { utils } from "../common";
import config from "../config";
import Profile from "../components/Profile";

const defaultValues = {};

export default function ProfilePage () {
    const [userId, setUserId] = useRecoilState(userIdState);
    const [jwtAccess, setJwtAccess] = useRecoilState(jwtAccessState);
    const [jwtRefresh, setJwtRefresh] = useRecoilState(jwtRefreshState);
    const [message, setMessage] = useState(null);

    const { register, formState: { errors }, handleSubmit, watch, setValue } = useForm({ defaultValues: defaultValues, mode: 'onBlur', resolver: joiResolver(schemas.editUser)});

    console.log(errors)

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
            setMessage('Failed to update user info.')
        });

        await queryUserInfo();
        setMessage('User info updated successfully.');
    }

    useEffect(queryUserInfo, []);

    return (
        <div>
            <Profile errors={errors} register={register} />
            <div className="is-flex is-justify-content-center">
                <button className="button is-black" onClick={handleSubmit(updateUserInfo)}>Update</button>
            </div>
            
            <p>{message}</p>
        </div>
    )
}