import { React, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useRouter } from 'next/router'
import { useForm } from "react-hook-form";
import config from "../config";
import { useSetRecoilState } from 'recoil';
import { schemas, utils } from '../common';
import { joiResolver } from '@hookform/resolvers/joi';
import { jwtAccessState, jwtRefreshState, userIdState } from '../common/auth';
import Profile from '../components/Profile';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const defaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: ""
};

export default function SignUp() {
  const router = useRouter();
  const methods = useForm({ defaultValues: defaultValues, resolver: joiResolver(schemas.signup), mode: 'onChange' });
  const { handleSubmit, control, formState: { errors }, register } = methods;
  const { redirect } = router.query;
  const setJwtAccess = useSetRecoilState(jwtAccessState);
  const setJwtRefresh = useSetRecoilState(jwtRefreshState);
  const setUserId = useSetRecoilState(userIdState);

  const [serverError, setServerError] = useState(null)

  const signup = (data) => {
    fetch(config.api_endpoint + '/auth/register', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password
      })
    })
    .then((response) => {
      if (utils.success(response)) {
        response.json()
          .then((parsedResponse) => {
            // TODO: Check if the response was successful
      
            console.log('Parsed response: ', parsedResponse);
            setJwtAccess(parsedResponse.tokens.access.token);
            setJwtRefresh(parsedResponse.tokens.refresh.token);
            setUserId(parsedResponse.user.id);
      
            router.push(redirect || '/')
          });
      }
      else {
        response.json()
          .then((parsedError) => {
            setServerError(parsedError);
          });
      }
    })
  }

  return (
    <div className="is-flex is-flex-direction-column is-align-items-center">
      <Profile register={register} errors={errors} registration={true} />
      <button className="button is-black" onClick={handleSubmit(signup)}>Sign Up</button>
      <a href={'/signin'}>
        Already have an account? Sign in
      </a>
    </div>
  );
}