import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Copyright from '../components/Copyright';
import { useRouter } from 'next/router';
import { FormInputText, FormInputCheckbox } from '../components/form-elements'
import { useForm } from "react-hook-form";
import config from "../config";
import { jwtAccessState, jwtRefreshState, userIdState } from '../common/auth';
import { useSetRecoilState } from 'recoil';
import { schemas } from '../common';
import { RouteLink } from '../components';
import { joiResolver } from '@hookform/resolvers/joi';
import utils from '../common/utils';
import SelectInput from '@material-ui/core/Select/SelectInput';

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
  password: "",
  remember: true
};

export default function SignIn() {
  const router = useRouter();
  const classes = useStyles();
  const methods = useForm({ defaultValues: defaultValues, resolver: joiResolver(schemas.login), mode: 'onChange'});
  const { handleSubmit, control, formState: { errors } } = methods;
  const { redirect } = router.query;
  const setJwtAccess = useSetRecoilState(jwtAccessState);
  const setJwtRefresh = useSetRecoilState(jwtRefreshState);
  const setUserId = useSetRecoilState(userIdState);

  const [serverError, setServerError] = useState(null)

  const login = (data) => {
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

  const getRedirect = () => redirect ? `?redirect=${redirect}` : ''

  return (
    <div>
      <div className="is-flex is-flex-direction-column is-justify-content-center is-align-items-center">
        <h1 className="title is-1 mt-3">Sign in</h1>
        <div>
          <input className="input" type="email" placeholder="Email"/>
          <p>{errors.email?.message}</p>
          <input className="input" type="password" placeholder="Password"/>
          <p>{errors.password?.message}</p>
          <br></br>
          <button className="button is-black" onClick={handleSubmit(login)}>Sign In</button>
          {serverError ? <p>Error: {serverError.message}</p> : <></>}
          <div>
          <div>
            <RouteLink href={'/signup' + getRedirect()} variant="body2">
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