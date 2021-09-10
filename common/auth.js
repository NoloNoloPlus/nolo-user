import { atom, useRecoilState } from 'recoil'


const jwtAccessState = atom({
  key: 'jwtAccess',
  default: null
})

const jwtRefreshState = atom({
    key: 'jwtRefresh',
    default: null
})

const userIdState = atom({
    key: 'userId',
    default: null
})

const jwtAuthorizationHeader = (jwtAccess, jwtRefresh, setJwtAccess, setJwtRefresh) => {
    if (!jwtAccess) return null;

    // TODO: Check expiration and request a new one if necessary
    return `Bearer ${jwtAccess}`
}

export {
    jwtAccessState,
    jwtRefreshState,
    userIdState,
    jwtAuthorizationHeader
}