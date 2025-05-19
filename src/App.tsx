import React from 'react';

import { RouterProvider } from 'react-router-dom';
import router from './Routes/Router/Router';
import "./styles/style.scss"
import Provider from './Provider';
import { Toaster } from 'react-hot-toast';

const App: React.FC = () => {

    return (
        <>
            <Provider>
                <RouterProvider router={router} />
            </Provider>
            <Toaster/>
        </>
    );
};

export default App;
