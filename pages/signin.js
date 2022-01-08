import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Copyright from '../components/Copyright';
import { useRouter } from 'next/router';
import { useForm } from "react-hook-form";
import config from "../config";
import { jwtAccessState, jwtRefreshState, userIdState } from '../common/auth';
import { useSetRecoilState } from 'recoil';
import { schemas } from '../common';
import { RouteLink } from '../components';
import { joiResolver } from '@hookform/resolvers/joi';
import utils from '../common/utils';
import ValidatedInput from '../components/ValidatedInput';

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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const defaultValues = {
  email: "",
  password: ""
};

export default function SignIn() {
  const router = useRouter();
  const classes = useStyles();
  const methods = useForm({ defaultValues: defaultValues, resolver: joiResolver(schemas.login), mode: 'onChange'});
  const { handleSubmit, formState: { errors }, register } = methods;
  const setJwtAccess = useSetRecoilState(jwtAccessState);
  const setJwtRefresh = useSetRecoilState(jwtRefreshState);
  const setUserId = useSetRecoilState(userIdState);

  const [serverError, setServerError] = useState(null)

  console.log(errors);

  const login = (data) => {
    console.log('Login data:', data);
    setServerError(null);
    fetch(config.api_endpoint + '/auth/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
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
      
            router.push('/')
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
    <div>
      <div className="is-flex is-flex-direction-column is-justify-content-center is-align-items-center">
        <h1 className="title is-1 mt-3">Sign in</h1>
        <div>
          <ValidatedInput name="email" type="email" label="Email" placeholder="Email" register={register} errors={errors} />
          <ValidatedInput name="password" type="password" label="Password" placeholder="Password" register={register} errors={errors} />
          <br></br>
          <button className="button is-black" onClick={handleSubmit(login)}>Sign In</button>
          {serverError ? <p>Error: {serverError.message}</p> : <></>}
          <div>
          <div>
            <RouteLink href={'/signup'} variant="body2">
              {"Don't have an account? Sign Up"}
            </RouteLink>
          </div>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <Copyright />
      </div>
    </div>
  );
}