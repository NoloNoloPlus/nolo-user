import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import { alpha, makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import { Button } from '@material-ui/core';
import { useRouter } from 'next/router'
import { useRecoilState } from 'recoil';
import { jwtAccessState, jwtRefreshState, userIdState } from '../common/auth';
import { utils } from '../common';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

export default function Header(props) {
  const router = useRouter();
  const classes = useStyles();

  const [search, setSearch] = useState(router.query.q || '')
  const [userId, setUserId] = useRecoilState(userIdState);
  const [jwtAccess, setJwtAccess] = useRecoilState(jwtAccessState);
  const [jwtRefresh, setJwtRefresh] = useRecoilState(jwtRefreshState);
  const [isActive, setIsActive] = useState(false);

  const toggleActive = () => {
      setIsActive(!isActive);
  }

  const logout = () => {
    setUserId(null);
    router.push('/');
  }

  const executeSearch = (event) => {
    event.preventDefault()
    console.log('Searching')
    router.push('/?q=' + encodeURI(search))
  }

  const getRedirect = () => router.pathname == '/' ? '' : '?redirect=' 

  return (
    <div>
      <nav className="navbar is-black" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <a className="navbar-item" onClick={() => router.push('/')}>
            <img src="https://github.com/NoloNoloPlus/nolo-office/blob/main/images/NologoExtended.png?raw=true" width="62" height="32"/>
          </a>

          <a role="button" className={isActive ? "navbar-burger is-active" : "navbar-burger"} onClick={toggleActive} aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div id="navbarBasicExample" className={isActive ? "navbar-menu is-active" : "navbar-menu"}>
          <div className="navbar-start">
            <a className="navbar-item" onClick={() => router.push('/products')}>
              Products
            </a>

            <a className="navbar-item" onClick={() => router.push('/rentals')}>
              Rentals
            </a>

          </div>

          <div className="navbar-end">
            <div className="navbar-item">
              <div className="buttons">
                {userId ? <a className="button is-danger" onClick={logout}>Log out</a> : <a className="button is-primary" onClick={() => router.push('/signin' + getRedirect())}>Log in</a>}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
