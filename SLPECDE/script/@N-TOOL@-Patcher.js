export function Rules() {
    if (localStorage.getItem('rules') === 'false') {
        localStorage.removeItem('rules');
    }
}
export function ADM_RPE() {
    if (localStorage.getItem('EnesCDE_ADM:RPE') === 'false') {
        localStorage.removeItem('EnesCDE_ADM:RPE');
    }
}
