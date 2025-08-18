import SharedNotificationSettings from '@/components/SharedNotificationSettings'
import React from 'react'

// return a div with class name w-3/5
// put a SharedNotificationSettings component inside the div, because it is the same as the teacher
const TeacherSettings = () => {
  return (
    <div className='w-3/5'>
        <SharedNotificationSettings 
        title="Teacher Settings"
        subtitle="Manage your teacher notification settings"
        />
    </div>
  )
}

export default TeacherSettings;