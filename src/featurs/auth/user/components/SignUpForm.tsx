import React from 'react'
import { useForm } from 'react-hook-form'
import { IUserSignUpFormInput } from '../types/IformInput'

export default  function SignUpForm() {
    const {} = useForm< IUserSignUpFormInput  >()
  return (
    <div>SignUpForm</div>
  )
}

