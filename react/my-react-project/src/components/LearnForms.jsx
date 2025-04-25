import {useState} from 'react'

const LearnForms = () => {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")

    const handleFirstName = (e) => {
        setFirstName(e.target.value)
    }

    const handleLastName = (e) => {
        setLastName(e.target.value)
    }
  return (
    <>
        <form action="">
            First name: <input type="text" name='firstName' onChange={handleFirstName} value={firstName} />
            <br /><br />
            Last name: <input type="text" name='lastName' onChange={handleLastName} value={lastName} />
        </form>
    </>
  )
}

export default LearnForms