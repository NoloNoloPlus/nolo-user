import { atom, useRecoilState } from 'recoil'
import { recoilPersist } from 'recoil-persist'
const { persistAtom } = recoilPersist()



const jwtAccessState = atom({
  key: 'jwtAccess',
  default: null,
  effects_UNSTABLE: [persistAtom]
})

const jwtRefreshState = atom({
    key: 'jwtRefresh',
    default: null,
    effects_UNSTABLE: [persistAtom]
})

const userIdState = atom({
    key: 'userId',
    default: null,
    effects_UNSTABLE: [persistAtom]
})

const avatarUrlState = atom({
    key: 'avatarUrl',
    default: null,
    effects_UNSTABLE: [persistAtom]
})

const billingInfoState = atom({
    key: 'billingInfo',
    default: null,
    effects_UNSTABLE: [persistAtom]
})

const jwtAuthorizationHeader = (jwtAccess, jwtRefresh, setJwtAccess, setJwtRefresh) => {
    if (!jwtAccess) return null;

    // TODO: Check expiration and request a new one if necessary
    return `Bearer ${jwtAccess}`
}

export {
    avatarUrlState,
    billingInfoState,
    jwtAccessState,
    jwtRefreshState,
    userIdState,
    jwtAuthorizationHeader
}