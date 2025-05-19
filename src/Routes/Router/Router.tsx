import React from "react";
import { createHashRouter } from "react-router-dom"; 
import Login from "../../pages/Login/Login";
import Private from "./Private/Private";
import Home from "../../pages/Home/Home";
import ConfigureClient from "../../pages/ConfigureClient/ConfigureClient";
import MainLayout from "../../Layout/MainLayout";


const router = createHashRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                path: "/",
                element: <Private><Home /></Private>,
            },
            {
                path: "/configure-client",
                element: <Private><ConfigureClient /></Private>,
            }
        ]
    },
    {
        path: '/login',
        element: <Login />
    },

])

export default router;