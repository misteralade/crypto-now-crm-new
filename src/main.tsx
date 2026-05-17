import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { ToastContainer } from 'react-toastify'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { HelmetProvider } from 'react-helmet-async'
import QueryClientProviderWrapper from './queries/ReactQuery'
import './styles.css'
import { persistor, store } from './store'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Create a new router instance
export const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const root = ReactDOM.createRoot(document.getElementById('root')!)
root.render(
  <StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={null}>
          <QueryClientProviderWrapper>
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
            <RouterProvider router={router} />
          </QueryClientProviderWrapper>
        </PersistGate>
      </Provider>
    </HelmetProvider>
  </StrictMode>,
)