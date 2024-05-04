import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import Top from './Components/Top';
import {Container} from 'react-bootstrap'
import Bottom from './Components/Bottom';
import About from './Components/About';
import Menu from './Components/Menu';

function App() {
    return (
      <Container className="App">
        <Top/>
        <Menu/>
        <Bottom/>
      </Container>
    );
}

export default App;
