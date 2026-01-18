import Navbar from "../../component/user/Navbar/Navbar"
import Header from "../../component/user/Header/Header"
import ExploreMenu from "../../component/user/ExploreMenu/ExploreMenu"
import FoodDisplay from "../../component/user/FoodDisplay/FoodDisplay"
import "./user.css"
const index = () => {
  return (
    <div className="app">
      <Navbar />
      <Header />
      <ExploreMenu category={'All'} setCategory={() => { }} />
      <FoodDisplay category={'All'} />
    </div>
  )
}

export default index