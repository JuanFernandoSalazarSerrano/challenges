import profilePic from '../assets/images.jfif'
import locationIcon from '../assets/react.svg'
import { Contact } from '../models/contact'

type ContactCardProps = {
  readonly contact: Contact
}

function ContactCard({ contact }: ContactCardProps) {
  return (
    <main className="flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 p-6 m-10">
      <div className="w-full max-w-sm rounded-2xl bg-gradient-to-b from-blue-700/70 to-blue-900/80 backdrop-blur-xl shadow-2xl border border-blue-500/20 p-6 ">

        <img
          src={profilePic}
          alt="Profile"
          className="mx-auto mb-4 h-28 w-28 rounded-full object-cover ring-4 ring-blue-400/40"
        />

        <h1 className="text-center text-2xl font-semibold tracking-wide ">
          {contact.name} {contact.lastname}
        </h1>

        <div className="mt-2 flex items-center justify-center gap-2 text-sm bg-blue-700">
          <img src={locationIcon} alt="" className="h-4 w-4 opacity-70" />
          <span className="uppercase tracking-widest">{contact.email}</span>
        </div>

        <p className="mt-4 text-center text-sm">
          {contact.username}
        </p>

        <div className="mt-6 flex gap-3">
          <button className="flex-1 rounded-lg ">
            Message
          </button>
          <button className="flex-1 rounded-lg ">
            Following
          </button>
        </div>

        <div className="mt-6">
          <h2 className="mb-3 text-xs font-semibold tracking-widest text-blue-300">
            SKILLS
          </h2>

          <ul className="flex flex-wrap gap-2">
            {contact.skills.split(',').map((skill: string) => (
              <li
                key={skill.trim()}
                className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-200 ring-1 ring-blue-400/20"
              >
                {skill.trim()}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  )
}

export default ContactCard
