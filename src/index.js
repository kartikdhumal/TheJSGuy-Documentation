// src/index.jsx or src/main.jsx (depending on your project structure)

import React, { createContext, useState, lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import appStore from './utils/appStore';
import App from './App';

// Existing Imports
import Package from './Components/Package';
import Component from './Components/Component';
import DOM from './Components/DOM';
import HooksFAQ from './Components/Hooks';
import ReactRouter from './Components/ReactRouter';
import PropsDrilling from './Components/PropsDrilling';
import ReactRedux from './Components/ReactRedux';
import ContextAPI from './Components/ContextAPI';
import TemplateLiteral from './Components/TemplateLiteral';
import Testing from './Components/Testing';
import QNA from './Components/QNA';
import Improvement from './Components/Improvement';
import JWTAuth from './Components/JWTAuth';
import ArrayMethods from './Components/ArrayMethods';
import AsyncAwait from './Components/AsyncAwait';
import AsyncEventLoop from './Components/AsyncEventLoop';
import BindFunction from './Components/BindFunction';
import Callback from './Components/Callback';
import Closures from './Components/Closures';
import Destructing from './Components/Destructing';
import DOMManipulation from './Components/DOMManipulation';
import EqualityComparison from './Components/EqualityComparison';
import Errors from './Components/Errors';
import ES6 from './Components/ES6';
import Functions from './Components/Functions';
import HigherOrder from './Components/HigherOrder';
import HigherOrderFunctions from './Components/HigherOrderFunctions';
import Hoisting from './Components/Hoisting';
import Javascript from './Components/JavascriptEngine';
import JavascriptEngine from './Components/JavascriptEngine';
import Modules from './Components/Modules';
import ObjectMethods from './Components/ObjectMethods';
import OOPS from './Components/OOPS';
import PerfomanceOptimization from './Components/PerfomanceOptimization';
import Promises from './Components/Promises';
import ScopeChain from './Components/ScopeChain';
import Shadowing from './Components/Shadowing';
import StringMethods from './Components/StringMethods';
import ThisKeywords from './Components/ThisKeywords';
import Variables from './Components/Variables';
import WebAPIs from './Components/WebAPIs';
import DataStrcture from './Components/DataStrcture';
import MongoDB from './Components/MongoDB';
import DSA from './Components/DSA';
import NodeIntroduction from './Components/NodeJS/Introduction';
import NodeModules from './Components/NodeJS/Modules';
import NodeFileSystem from './Components/NodeJS/FileSystem';
import NodeExpress from './Components/NodeJS/Express';
import NodeMiddleware from './Components/NodeJS/Middleware';
import NodeRouting from './Components/NodeJS/Routing';
import NodeMongoDB from './Components/NodeJS/MongoDB';
import NodeAuth from './Components/NodeJS/Authentication';
import NodeAPIs from './Components/NodeJS/RestAPI';
import NodeDeployment from './Components/NodeJS/Deployment';
import ErrorBoundary from './ErrorBoundary/ErrorBoundary';
import Debouncing from './Components/Debouncing';
import ErrorBoundaryInfo from './Components/ErrorBoundaryInfo';
import PropsInfo from './Components/PropsInfo';
import ReactBestPractises from './Components/ReactBestPractises';
import Networking from './Components/Networking';
import OperatingSystem from './Components/OperatingSystem';
import IMPQueries from './Components/IMPQueries';

const LazyLoading = lazy(() => import('./Components/LazyLoading'));

export const userContext = createContext();
export const todoContext = createContext();

export const myRouter = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/array-methods',
    element: <ArrayMethods />,
  },
  {
    path: '/async-await',
    element: <AsyncAwait />,
  },
  {
    path: '/asynchronous-eventloop',
    element: <AsyncEventLoop />,
  },
  {
    path: '/bind-function',
    element: <BindFunction />,
  },
  {
    path:'/networking',
    element: <Networking/>
  },
  {
     path:'/operatingsystem',
     element:<OperatingSystem/>
  },
  {
    path: '/callback',
    element: <Callback/>,
  },
  {
    path: '/closures',
    element: <Closures />,
  },
  {
    path: '/destructuring',
    element: <Destructing />, // Ensure the component name matches 'Destructuring'
  },
  {
    path: '/equality-comparison',
    element: <EqualityComparison />,
  },
  {
    path: '/dom-manipulation',
    element: <DOMManipulation />,
  },
  {
    path: '/errors',
    element: <Errors />,
  },
  {
    path: '/es6',
    element: <ES6 />,
  },{
     path: '/datastructure',
     element: <DataStrcture/>
  },{
     path: '/props',
     element: <PropsInfo/>
  },{
      path:'/bestpractises',
      element: <ReactBestPractises/>
  },
  {
    path: '/functions',
    element: <Functions />,
  },
  {
    path: '/higher-order-functions',
    element: <HigherOrderFunctions />, // Assuming HigherOrderFunctions component exists
  },
  {
    path: '/hoisting',
    element: <Hoisting />,
  },{
    path:'/mongodb',
    element:<MongoDB/>
  },
  {
    path: '/javascript',
    element: <Javascript />,
  },
  {
    path: '/javascript-engine',
    element: <JavascriptEngine />,
  },
  {
    path: '/modules',
    element: <Modules />,
  },
  {
   path:'/dsa',
   element:<DSA/>
  },
  {
   path:'/impqueries',
   element:<IMPQueries/>
  },
  {
    path: '/object-methods',
    element: <ObjectMethods />,
  },
  {
    path: '/oops',
    element: <OOPS />,
  },
  {
    path: '/performance-optimization',
    element: <PerfomanceOptimization />,
  },
  {
    path: '/promise-apis',
    element: <Promises />,
  },
  {
    path: '/scope-chain',
    element: <ScopeChain />,
  },
  {
    path: '/shadowing',
    element: <Shadowing />,
  },
  {
    path: '/string-methods',
    element: <StringMethods />,
  },
  {
    path: '/this-keyword',
    element: <ThisKeywords />,
  },
  {
    path: '/variables',
    element: <Variables />,
  },
  {
    path: '/web-apis',
    element: <WebAPIs />,
  },
  {
    path: '/nodejs-introduction',
    element: <NodeIntroduction />,
  },
  {
    path: '/nodejs-modules',
    element: <NodeModules />,
  },
  {
    path: '/nodejs-filesystem',
    element: <NodeFileSystem />,
  },
  {
    path: '/nodejs-express',
    element: <NodeExpress />,
  },
  {
    path: '/nodejs-middleware',
    element: <NodeMiddleware />,
  },
  {
    path: '/nodejs-routing',
    element: <NodeRouting />,
  },
  {
    path: '/nodejs-mongodb',
    element: <NodeMongoDB />,
  },
   {
    path: '/errorboundary',
    element: <ErrorBoundaryInfo />,
  },
  {
    path: '/nodejs-apis',
    element: <NodeAPIs />,
  },
  {
    path: '/nodejs-deployment',
    element: <NodeDeployment />,
  },
  // Existing Routes
  {
    path: '/package',
    element: <Package />,
  },
  {
    path: '/component',
    element: <Component />,
  },
  {
    path: '/dom',
    element: <DOM />,
  },
  {
    path: '/hooks',
    element: <HooksFAQ />,
  },
  {
    path: '/router',
    element: <ReactRouter />,
  },
  {
    path: '/propsdrilling',
    element: <PropsDrilling />,
  },
  {
    path: '/context',
    element: <ContextAPI />,
  },
  {
    path: '/templateliteral',
    element: <TemplateLiteral />,
  },
  {
    path: '/redux',
    element: <ReactRedux />,
  },
  {
    path: '/testing',
    element: <Testing />,
  },
  {
    path: '/jwtauth',
    element: <JWTAuth />,
  },
  {
    path: '/qna',
    element: <QNA />,
  },
  {
    path: '/improvement',
    element: <Improvement />,
  },
  {
    path: '/debouncing',
    element: <Debouncing />,
  },
  {
    path: '/lazyloading',
    element: (
      <Suspense fallback={<h1>Loading...</h1>}>
        <LazyLoading />
      </Suspense>
    ),
  },
]);

// Root Component
const Root = () => {
  const [todos, setTodos] = useState([]);

  const addTodo = (text) => {
    setTodos([...todos, { id: todos.length + 1, text, completed: false }]);
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const removeTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
     <Provider store={appStore}>
    <todoContext.Provider value={{ todos, addTodo, removeTodo, toggleTodo }}>
      <userContext.Provider value={{ name: 'Kartik Pandit', info: 'This is my React info' }}>
        <React.StrictMode>
          <ErrorBoundary>
            <RouterProvider router={myRouter} />
          </ErrorBoundary>
        </React.StrictMode>
      </userContext.Provider>
    </todoContext.Provider>
  </Provider>
  );
};

// Rendering the Root Component
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Root />);
