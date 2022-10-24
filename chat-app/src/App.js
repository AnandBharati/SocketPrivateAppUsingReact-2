import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import ChatWindow from './components/ChatWindow';
import Login from './components/Login';
import SharedLayout from './components/SharedLayout';
import {Provider} from 'react-redux'
import { myStore } from './redux/store';

function App() {
  return (
    <div className="App">
      <Provider store={myStore}>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<SharedLayout/>}>
                  <Route index element={<Login/>} />
                  <Route path='login' element={<Login/>} />
                  <Route path='chatwindow' element={<ChatWindow/>} />
              </Route>
            </Routes>
          </BrowserRouter>
          </Provider>
    </div>
  );
}

export default App;
