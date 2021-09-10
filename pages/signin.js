import React from 'react';
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
import { utils } from '../common';
import { RouteLink } from '../components';

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
  const methods = useForm({ defaultValues: defaultValues });
  const { handleSubmit, reset, control, setValue, watch } = methods;
  const { redirect } = router.query;
  const setJwtAccess = useSetRecoilState(jwtAccessState);
  const setJwtRefresh = useSetRecoilState(jwtRefreshState);
  const setUserId = useSetRecoilState(userIdState);

  const login = (data) => {
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
    .then((response) => response.json())
    .then((parsedResponse) => {
      // TODO: Check if the response was successful

      console.log('Parsed response: ', parsedResponse);
      setJwtAccess(parsedResponse.tokens.access.token);
      setJwtRefresh(parsedResponse.tokens.refresh.token);
      setUserId(parsedResponse.user.id);

      router.push(redirect || '/')
    })
  }

  const getRedirect = () => redirect ? `?redirect=${redirect}` : ''

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Container>
          <FormInputText
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            control={control}
          />
          <FormInputText
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            control={control}
          />
          <FormInputCheckbox name="remember" control={control} label="Remember me"/>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleSubmit(login)}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <RouteLink href={'/signup' + getRedirect()} variant="body2">
                {"Don't have an account? Sign Up"}
              </RouteLink>
            </Grid>
          </Grid>
        </Container>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}