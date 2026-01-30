import { useState } from 'react'
import ApiClient from './ApiClient'
import AjouterProduit from './AjouterProduit'

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleProductAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="app-wrapper" style={{ paddingTop: '4rem' }}>
      
      <ApiClient refreshKey={refreshKey} />
      <AjouterProduit onProductAdded={handleProductAdded} />
    </div>
  )
}

export default App
