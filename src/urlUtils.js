import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

export const queryStringAsObj = () => {
    const qStr = history.location.search.replace('?', '');
    if (qStr.length < 1) return {};
    const qSplit = qStr.includes('&') ? qStr.split('&') : [qStr];
    return qSplit.reduce((acc, i) => ({...acc, [i.split('=')[0]]: decodeURIComponent(i.split('=')[1])}), {});
};
const objToQueryString = props => Object.keys(props)
    .reduce(
        (acc, i) => `${acc.length < 1 ? '' : `${acc}&`}${i}=${encodeURIComponent(props[i])}`,
        ''
    );
export const updateParams = paramMap => {
    history.replace({
        pathname: history.location.pathname,
        search: objToQueryString(
            {
                ...queryStringAsObj(history.location.search.replace('?', '')),
                ...paramMap,
            }
        ),
    });
};
