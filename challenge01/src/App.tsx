import { useState } from 'react'
import './App.css'
import ContactCard from './components/ContactCard'
import AddContactButton from './components/AddContactButton'
import {Contact} from '../src/models/contact'
import {CONTACTS} from './data/contact.data'
import ImagenComponent from './components/ImageComponent'

function App() {

  const [ArrayOfContacts, setArrayOfContacts] = useState<Contact[]>([])
  const [contactCount, setContactCount] = useState<number>(0)
  const [noMoreContactsMessage, setNoMoreContactsMessage] = useState<string | null>(null)

    const addContact = () => {
    if ((contactCount == 10)){ 
      setNoMoreContactsMessage("You dont have more contacts to add!")
    }
    else{
      setContactCount(contactCount + 1)
      setArrayOfContacts(prev => [...prev, CONTACTS[contactCount]])
    }
  }

  const deleteContact = () => {
    setArrayOfContacts(prev => prev.slice(0, -1))
    setContactCount(contactCount - 1)
    setNoMoreContactsMessage(null)
  }

  return (

    <>
<h1 className="mb-4 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
  Add to your {' '}
  <span className="underline underline-offset-4 decoration-8 decoration-blue-500">
    Contacts!
  </span>
</h1>
    <div className="grid grid-cols-3 gap-4 justify-items-center">
      {ArrayOfContacts.length === 0 ? (
        <p className="text-center text-4xl text-slate-600 m-52 decoration-8 decoration-blue-500 col-span-3">Your contact list is empty, add some contacts!</p>
      ) : (
        ArrayOfContacts.map(contact => (
          <ContactCard key={contact.id} contact={contact} />
        ))
      )}
      {noMoreContactsMessage != null && <p className="text-center text-4xl font-bold text-red-500 mb-4">{noMoreContactsMessage}</p>}
    </div>

      <AddContactButton
        buttonMessage="Add Contact!"
        onClick={addContact}
      />

      <AddContactButton
        buttonMessage="Delete Contact!"
        onClick={deleteContact}
      />

      <ImagenComponent/>

    </>
  )
}

export default App
