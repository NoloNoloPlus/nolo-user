import React, { useEffect, useState } from 'react';
import { alpha, makeStyles } from '@material-ui/core/styles';
import { useRouter } from 'next/router'
import { useRecoilState } from 'recoil';
import { avatarUrlState, jwtAccessState, jwtAuthorizationHeader, jwtRefreshState, userIdState } from '../common/auth';
import { utils } from '../common';

import config from '../config';

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

export default function Header({ update}) {
  const router = useRouter();

  const [userId, setUserId] = useRecoilState(userIdState);
  const [avatarUrl, setAvatarUrl] = useRecoilState(avatarUrlState);
  const [jwtAccess, setJwtAccess] = useRecoilState(jwtAccessState);
  const [jwtRefresh, setJwtRefresh] = useRecoilState(jwtRefreshState);
  const [isActive, setIsActive] = useState(false);

  const toggleActive = () => {
      setIsActive(!isActive);
  }

  const logout = () => {
    setUserId(null);
    setAvatarUrl(null);
    router.push('/');
  }

  const queryAvatarUrl = async () => {
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
      setAvatarUrl(body.avatarUrl);
    }
  }

  useEffect(queryAvatarUrl, [userId]);

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

            {
              userId ? (
                <div>
                </div>

              ) : <></>
            }

            {
              userId ? (
                <a className="navbar-item" onClick={() => router.push('/rentals')}>
                  Rentals
                </a>
              ) : <></>
            }
          </div>

          <div className="navbar-end">
            <div className="navbar-item">
              {
                userId && avatarUrl ? (
                  <div className="is-flex is-align-items-center" style={{cursor: 'pointer'}} onClick={() => router.push('/profile')}>
                    <figure className="image" style={{width: '40px', height: '40px'}}>
                      <img alt="Your Avatar Image" className="is-rounded" style={{maxHeight: '30em', height: '100%', objectFit: 'cover'}} src={avatarUrl}/>
                    </figure>
                    <p className="ml-2">Profile</p>
                  </div>
                  
                ) : userId ? <div className="is-flex is-align-items-center"  style={{cursor: 'pointer'}} onClick={() => router.push('/profile')}>
                              <figure className="image" style={{width: '40px', height: '40px'}}>
                                <img alt="Your Avatar Image" className="is-rounded" style={{maxHeight: '30em', height: '100%', objectFit: 'cover', cursor: 'pointer'}} src={'https://icons.iconarchive.com/icons/fasticon/dino/256/Caveman-icon.png'} onClick={() => router.push('/profile')}/>
                              </figure>
                              <p className="ml-2">Profile</p>
                            </div> : <></>
              }
            </div>
            <div className="navbar-item">
              <div className="buttons">
                {userId ? <a className="button is-danger" onClick={logout}>Log out</a> : <a className="button is-primary" onClick={() => router.push('/signin')}>Log in</a>}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
