import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container, Navbar, Nav, NavItem } from 'react-bootstrap';
import AddBlob from './pages/addBlob';
import Blob from './pages/blob';

function App() {
  return (
    <div className="App">
      <div className=" my-3">
        <h2>Nhóm 22 - Hệ Quản Trị CSDL Đa Phương Tiện</h2>
        <h3>Ứng dụng PostgreSQL xử lý thông tin đa phương tiện</h3>
        <Router basename='blob-group-22-huit'>
          <Navbar bg="dark" variant="dark text-white ">
            <Container className='container'>
              <Nav.Link href="/blob">
                Blob
              </Nav.Link>
              <Nav.Link href="/addBlob">
                Add Blob
              </Nav.Link>
            </Container>
          </Navbar>
          <Routes>
            <Route path="/addBlob" element={<AddBlob />} />
            <Route path="/blob" element={<Blob />} />
          </Routes>
        </Router>

      </div>
    </div>
  );
}

export default App;
