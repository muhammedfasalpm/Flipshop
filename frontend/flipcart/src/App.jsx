import { BrowserRouter } from "react-router-dom";

import Navbar from "./component/Navbar";
import Footer from "./component/Footer";

import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <AppRoutes/>

      <Footer />

    </BrowserRouter>
  );
}

export default App;