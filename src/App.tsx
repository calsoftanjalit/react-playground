import { ErrorBoundary } from 'react-error-boundary';
import './App.scss';
import { GlobalErrorFallback } from './components/miscellaneous';
import { AppRoutes } from './routes/AppRoutes';

function App() {
  return   (  
  <ErrorBoundary
      FallbackComponent={GlobalErrorFallback}
      onReset={() => {
        window.location.href = '/';
      }}
    ><AppRoutes/>
  </ErrorBoundary> )
}

export default App;
