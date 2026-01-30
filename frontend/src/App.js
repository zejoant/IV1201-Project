import {useEffect} from 'react';

function App() {
  const makeAPICall = async () => {
    try {
      const response = await fetch('https://iv1201-cors-backend-d64c08cc0cf7.herokuapp.com/cors', {mode: 'cors'});
      const data = await response.json(); 
      console.log({data});
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    makeAPICall();
  }, []);
  return (
    <div className="App">
      <h1>Test to see if the app is deployed and backend is connected to frontend</h1>
    </div>
  );
}

export default App;