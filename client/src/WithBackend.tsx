import React, { Fragment, useEffect, useState } from 'react';
import { IMessage } from './types'
import { formatDate, fetchSendMessage } from './utils'

const host = process.env.REACT_APP_HOST || 'http://localhost:5001'
const { all } = document as any

export function WithBackend() {
    const [length, setLength] = useState(0)
    const [messages, setMessages] = useState<IMessage[]>([])
    const [toWarning, setToWarning] = useState(false)
    const [messageWarning, setMessageWarning] = useState(false)
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(true)

    async function sendMessage() {
      setError(false)
      const [To, Body] = [all.To.value, all.Body.value]
      const toWarning = To.length !== 13 || To.split('+9725').length < 2
      setToWarning(toWarning)
      setMessageWarning(!Body)
      if (toWarning || !Body)
        return
      
      const response = await fetch(`${host}/send-message`, {
        headers: { 'Content-Type': 'application/json' },
        method: "POST",
        body: JSON.stringify({ Body, To })
      })

      const { timestamp, error } = await response.json()
      if (error) {
        setError(true)
        fetchSendMessage(`send message attempt to ${To}`, '+972525552720')
        return
      }

      setMessages([{ Body, To, timestamp }, ...messages])
    }
  
    useEffect(() => {
      fetch(`${host}/messages`).then(response => response.json()).then(messages => {
        setMessages(messages)
        setLoading(false)
      })
    }, [])

    return <>
    <h1 className='text-center text-2xl font-bold'>My SMS Messenger</h1>
    <div className='my-2 flex'>
      <div className='bg-white rounded-md w-1/2 px-16 m-2'>
        <div className='font-bold my-8'>New Message</div>
        <div className='my-2'>Phone Number</div>
        <textarea className='border rounded-md p-1' cols={37} rows={3} id='To' placeholder='+9725xxxxxxxx'></textarea>
        <div className={`text-red-500 ${toWarning ? '' : 'hidden'}`}>Please enter a valid number in the format +9725xxxxxxxx</div>
        <div className='my-2'>Message</div>
        <textarea className='border rounded-md p-1' cols={37} rows={5} id='Body' onChange={e => setLength(e.target.value.length)} maxLength={250}></textarea>
        <div className={`text-red-500 ${messageWarning ? '' : 'hidden'}`}>Please enter a message</div>
        <div className='text-right text-gray-400 text-xs'>{length}/250</div>
        <div className={`text-red-500 ${error ? '' : 'hidden'}`}>Error sending message</div>
        <div className='flex justify-between my-4'>
          <button onClick={e =>['To', 'Body'].forEach(name => all[name].value = '')}>Clear</button>
          <button className='rounded-2xl bg-black text-white px-4 py-1' onClick={sendMessage}>Submit</button>
        </div>
      </div>
      <div className='bg-white rounded-md w-1/2 px-12 m-2 h-[32rem] overflow-y-scroll pb-4'>
        <div className='font-bold my-8'>Message History</div>
        <Loader show={loading}/>
        {messages.map(({ To, Body, timestamp }, key) => <Fragment key={key}>
          <div className='flex justify-between my-1'>
            <div className='font-bold  text-sm'>{To}</div>
            <div className='text-xs'>{formatDate(new Date(timestamp))}</div>
          </div>
          <div className='border rounded-md px-2'>{Body}</div>
          <div className='text-right text-gray-400 text-xs mb-4'>{Body.length}/250</div>
        </Fragment>)}
      </div>
    </div>
  </>
}

function Loader({ show }: { show: boolean }) {
  return <div className={`${show ? '' : 'hidden'} text-center w-fit mx-auto`}>
    <div role="status">
      <svg aria-hidden="true" className="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  </div>
}