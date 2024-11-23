import  { useState } from 'react'
import SignUpFormPage from '../components/SignUpFormPage'
import SignUpOptions from '../components/SignUpOptions'

function SignUp() {
  const[ isFormVisible , setIsFormVisible] = useState<boolean>(false)
  return (
    <>
    {
      isFormVisible ? < SignUpFormPage setIsFormVisible={setIsFormVisible} /> : < SignUpOptions  setIsFormVisible={setIsFormVisible}/>
    }
    </>
  )
}

export default SignUp