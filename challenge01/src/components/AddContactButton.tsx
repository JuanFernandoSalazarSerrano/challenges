type AddContactButtonProps = {
  buttonMessage: string
  onClick: () => void
}

function AddContactButton({ buttonMessage, onClick }: AddContactButtonProps) {
  return (
    <button
      type="button"
      className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700
      hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300
      dark:focus:ring-blue-800 font-medium rounded-base text-sm px-4 py-2.5
      text-center leading-5"
      onClick={onClick}
    >
      {buttonMessage}
    </button>
  )
}

export default AddContactButton
