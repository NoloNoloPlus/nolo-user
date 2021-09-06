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
import { useRouter } from 'next/router'
import { FormInputText } from '../components/form-elements';
import { useForm } from "react-hook-form";
import config from "../config";

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
  name: "",
  email: "",
  password: ""
};

export default function SignUp() {
  const router = useRouter();
  const classes = useStyles();
  const methods = useForm({ defaultValues: defaultValues });
  const { handleSubmit, reset, control, setValue, watch } = methods;

  const register = (data) => {
    fetch(config.api_endpoint + '/auth/register', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        password: data.password
      })
    })
    .then((response) => response.json())
    .then((parsedResponse) => {
      console.log('Parsed response: ', parsedResponse)
      router.push('/')
    })
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Container>
        <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormInputText
                name="name"
                control={control}
                label="Name"
                variant="outlined"
                required
                fullWidth
                id="name"/>
            </Grid>
            <Grid item xs={12}>
              <FormInputText
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                control={control}
              />
            </Grid>
            <Grid item xs={12}>
              <FormInputText
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                control={control}
              />
            </Grid>
          </Grid>
          <Button
            onClick={handleSubmit(register)}
            variant="contained"
            fullWidth
            color="primary"
            className={classes.submit}>
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="#" variant="body2" onClick={() => router.push('/signin')}>
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Container>
        
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}