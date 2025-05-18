// App.js
import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import About from './Pages/About';
import Group from './Pages/Group'

 
const App = () => {
   return (
      <>
         <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/:id" element={<Group />} />
            <Route path="/about" element={<About />} />
         </Routes>
      </>
   );
};
 
export default App;