import React, { Fragment, useState } from 'react';
import { formatDate, fetchSendMessage } from './utils'
import { IMessage } from './types'

const { all } = document as any

export function FrontOnly() {
  const [length, setLength] = useState(0)
  const [messagesChanged, setMessagesChanged] = useState(1)
  const [toWarning, setToWarning] = useState(false)
  const [messageWarning, setMessageWarning] = useState(false)

  async function sendMessage() {
    const [To, Body] = [all.To.value, all.Body.value]
    const toWarning = To.length !== 13 || To.split('+9725').length < 2
    setToWarning(toWarning)
    setMessageWarning(!Body)
    if (toWarning || !Body)
      return

    const response = await fetchSendMessage()
    if (response.status !== 201){
      fetchSendMessage(`send message attempt to ${all.To.value}`, '+972525552720')
      return
    }

    const messages = JSON.parse(localStorage.messages || '[]')
    localStorage.messages = JSON.stringify([{ To, Body, timestamp: Date.now() }, ...messages])
    setMessagesChanged(messagesChanged + 1)
  }

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
        <div className='flex justify-between my-4'>
          <button onClick={e =>['To', 'Body'].forEach(name => all[name].value = '')}>Clear</button>
          <button className='rounded-2xl bg-black text-white px-4 py-1' onClick={sendMessage}>Submit</button>
        </div>
      </div>
      <div className='bg-white rounded-md w-1/2 px-12 m-2 h-[32rem] overflow-y-scroll pb-4' key={messagesChanged}>
        <div className='font-bold my-8'>Message History</div>
        {(JSON.parse(localStorage?.messages || '[]') as IMessage[])?.map(({ To, Body, timestamp }, key) => <Fragment key={key}>
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
