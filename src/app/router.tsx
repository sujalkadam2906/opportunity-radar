import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import { DiscoverPage } from '../pages/DiscoverPage';
import { SavedPage } from '../pages/SavedPage';
import { ApplicationsPage } from '../pages/ApplicationsPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <DiscoverPage />,
      },
      {
        path: 'saved',
        element: <SavedPage />,
      },
      {
        path: 'applications',
        element: <ApplicationsPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
