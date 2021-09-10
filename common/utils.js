const getPath = () => {
    return window.location.pathname + window.location.search + window.location.hash;
}

export default {
    getPath
}