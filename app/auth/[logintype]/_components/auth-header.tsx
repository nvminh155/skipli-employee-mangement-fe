import React from 'react'

interface AuthHeaderProps {
  title: string
  description: string
}

const AuthHeader = ({ title, description }: AuthHeaderProps) => {
  return (
    <div className='space-y-2 text-center'>
      <h1 className='text-2xl font-bold'>{title}</h1>
      <div className='text-gray-300'>{description}</div>
    </div>
  )
}

export default AuthHeader