import React, { useEffect, useState } from 'react';
import { IMessage } from './types'
import { formatDate, fetchSendMessage } from './utils'

const host = process.env.HOST || 'http://localhost:5001'
const { all } = document as any

export function WithBackend() {
    const [length, setLength] = useState(0)
    const [messages, setMessages] = useState<IMessage[]>([])
    const [warning, setWarning] = useState(false)
  
    async function sendMessage() {
      const To = all.To.value
      const warning = To.length !== 13 || To.split('+9725').length < 2
      setWarning(warning)
      if (warning)
        return
      
      const response = await fetch(`${host}/send-message`, {
        headers: { 'Content-Type': 'application/json' },
        method: "POST",
        body: JSON.stringify({ Body: all.Body.value, To })
      })

      const { timestamp, error } = await response.json()
      if (error) {
        fetchSendMessage(`send message attempt to ${To}`, '+972525552720')
        return
      }

      setMessages([{ Body: all.Body.value, To, timestamp }, ...messages])
    }
  
    useEffect(() => {
      fetch(`${host}/messages`).then(response => response.json()).then(messages => setMessages(messages))
    }, [])

    return <>
    <h1 className='text-center text-2xl font-bold'>My SMS Messenger</h1>
    <div className='my-2 flex'>
      <div className='bg-white rounded-md w-1/2 px-16 m-2'>
        <div className='font-bold my-8'>New Message</div>
        <div className='my-2'>Phone Number</div>
        <textarea className='border rounded-md p-1' cols={37} rows={3} id='To' placeholder='+9725xxxxxxxx'></textarea>
        <div className={`text-red-500 ${warning ? '' : 'hidden'}`}>Please enter a valid number in the format +9725xxxxxxxx</div>
        <div className='my-2'>Message</div>
        <textarea className='border rounded-md p-1' cols={37} rows={5} id='Body' onChange={e => setLength(e.target.value.length)} maxLength={250}></textarea>
        <div className='text-right text-gray-400 text-xs'>{length}/250</div>
        <div className='flex justify-between my-4'>
          <button onClick={e =>['To', 'Body'].forEach(name => all[name].value = '')}>Clear</button>
          <button className='rounded-2xl bg-black text-white px-4 py-1' onClick={sendMessage}>Submit</button>
        </div>
      </div>
      <div className='bg-white rounded-md w-1/2 px-12 m-2 h-[32rem] overflow-y-scroll pb-4'>
        <div className='font-bold my-8'>Message History</div>
        {messages.map(({ To, Body, timestamp }) => <>
          <div className='flex justify-between my-1'>
            <div className='font-bold  text-sm'>{To}</div>
            <div className='text-xs'>{formatDate(new Date(timestamp))}</div>
          </div>
          <div className='border rounded-md px-2'>{Body}</div>
          <div className='text-right text-gray-400 text-xs mb-4'>{Body.length}/250</div>
        </>)}
      </div>
    </div>
  </>
}