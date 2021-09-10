const getPath = () => {
    return window.location.pathname + window.location.search + window.location.hash;
}

const success = (response) => {
    return response.status >= 200 && response.status < 300;
}

export default {
    getPath,
    success
}