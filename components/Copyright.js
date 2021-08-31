import React from 'react';
import Typography from '@material-ui/core/Typography';
import { Link } from '@material-ui/core';

export default function Copyright() {
    return (
      <Typography variant="body2" color="textSecondary" align="center">
        {'Copyright © '}
        <Link color="inherit" href="https://github.com/NoloNoloPlus">
          Donno, Marro, Merli Inc.
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }