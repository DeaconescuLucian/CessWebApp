export const log_in = (user) =>
{
    return{
        type: 'LOG_IN',
        payload: user
    }
}

export const log_out = () =>
{
    return{
        type: 'LOG_OUT'
    }
}

export const set_user = (info) =>
{
    return{
        type: 'SET_USER',
        payload: info
    }
}

