import { StudentFeatures, TeacherFeatures } from './Features'
import UserInfo from '../components/UserInfo'

const Sidebar = () => {
  return (
    <>
      <UserInfo />
      <TeacherFeatures />
      {/* <StudentFeatures /> */}
    </>
  )
}

export default Sidebar
