import  { useState } from 'react'
import SignUpForm from '../components/SignUpFormPage'
import SignUpOptions from '../components/SignUpOptions'

function SignUp() {
  const[ isFormVisible , setIsFormVisible] = useState<boolean>(false)
  return (
    <>
    {
      isFormVisible ? < SignUpForm setIsFormVisible={setIsFormVisible} /> : < SignUpOptions  setIsFormVisible={setIsFormVisible}/>
    }
    </>
  )
}

export default SignUp