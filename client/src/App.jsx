// import React from "react";
// import Pages from "./pages/index.jsx";

// function App() {
//   return (
//     <div className="p-4">
//       <Pages />
//     </div>
//   );
// }

// export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import DeliveryChallan from "./pages/DeliveryChallan";
import DCdetails from "./pages/DeliveryChallan/DCdetails";
import Pages from "./pages/index.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Pages />} />
        <Route path="/dc/:id" element={<DCdetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;