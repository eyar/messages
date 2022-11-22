export function formatDate(target: Date) {
    const day = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][target.getDay()]
    const month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][target.getMonth()]
    const [date, time] = target.toISOString().split('T')
    const dateArr = date.split('-')
    return `${day}, ${dateArr[2]}-${month}-${dateArr[0].substring(2)} ${time.split('.')[0]} UTC` 
}

export function fetchSendMessage(message?: string, to?: string) {
    const body = new URLSearchParams();
    const { all } = document as any
    [['Body', message || all.Body.value], ['From', '+13466605059'], ['To', to || all.To.value]].forEach(([key, value]) => body.append(key, value))
    return fetch(`https://api.twilio.com/2010-04-01/Accounts/${process.env.REACT_APP_TWILIO_ACCOUNT_SID}/Messages.json`, {
        headers: {
          Authorization: `Basic ${process.env.REACT_APP_TWILIO_AUTHORIZATION}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: "POST",
        body
      })
}