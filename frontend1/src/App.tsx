import { BrowserRouter, Routes, Route } from "react-router-dom";

import Review from "./page/admin/dashboard/index"
import Home from "./page/user/product"
import Example from "./page/example/index"
import Navbar from "./component/navbar"

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Review />} />
        <Route path="/example" element={<Example />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
