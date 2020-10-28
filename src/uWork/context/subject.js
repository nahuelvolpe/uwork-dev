import React, { useState } from 'react'

export const SubjectContext = React.createContext()

export const SubjectProvider = ({children}) => {
    
    const [subjectName, setSubjectName] = useState('')
    const [subjectId, setSubjectId] = useState('')

    return (
        <SubjectContext.Provider value={{
            subjectName,
            setSubjectName,
            subjectId,
            setSubjectId
        }}>
            {children}
        </SubjectContext.Provider>
    )
}