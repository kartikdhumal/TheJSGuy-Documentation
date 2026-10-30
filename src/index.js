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
import StringCoercion from './Components/StringCoercion';
import ThisKeywords from './Components/ThisKeywords';
import Variables from './Components/Variables';
import WebAPIs from './Components/WebAPIs';
import DataStrcture from './Components/DataStrcture';
import MongoDB from './Components/MongoDB';
import DSABasics from './Components/DSABasics';
import DSABubbleSort from './Components/DSABubbleSort';
import DSASelectionSort from './Components/DSASelectionSort';
import DSAInsertionSort from './Components/DSAInsertionSort';
import DSAQuickSort from './Components/DSAQuickSort';
import DSAMergeSort from './Components/DSAMergeSort';
import DSAStack from './Components/DSAStack';
import DSAQueue from './Components/DSAQueue';
import DSALinkedList from './Components/DSALinkedList';
import DSADoublyLinkedList from './Components/DSADoublyLinkedList';
import DSATree from './Components/DSATree';
import DSAGraph from './Components/DSAGraph';
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
import NodeEventLoop from './Components/NodeJS/EventLoop';
import NodeBuffersStreams from './Components/NodeJS/BuffersStreams';
import NodeHTTPModule from './Components/NodeJS/HTTPModule';
import NodePathProcess from './Components/NodeJS/PathProcess';
import NodeErrorHandling from './Components/NodeJS/ErrorHandling';
import RequestResponse from './Components/NodeJS/RequestResponse';
import ExpressErrorHandling from './Components/NodeJS/ExpressErrorHandling';
import StaticCORS from './Components/NodeJS/StaticCORS';
import BodyValidation from './Components/NodeJS/BodyValidation';
import Security from './Components/NodeJS/Security';
import ErrorBoundary from './ErrorBoundary/ErrorBoundary';
import Debouncing from './Components/Debouncing';
import MemoryObjectReferences from './Components/MemoryObjectReferences';
import ErrorBoundaryInfo from './Components/ErrorBoundaryInfo';
import PropsInfo from './Components/PropsInfo';
import ReactBestPractises from './Components/ReactBestPractises';
import Networking from './Components/Networking';
import OperatingSystem from './Components/OperatingSystem';
import IMPQueries from './Components/IMPQueries';
import MySQLIntroduction from './Components/MySQLIntroduction';
import MySQLBasics from './Components/MySQLBasics';
import MySQLNormalization from './Components/MySQLNormalization';
import MySQLACID from './Components/MySQLACID';
import MySQLJoins from './Components/MySQLJoins';
import MySQLQueries from './Components/MySQLQueries';
import MySQLAggregate from './Components/MySQLAggregate';
import MySQLIndexes from './Components/MySQLIndexes';

// Redux
import ReduxIntroduction from './Components/Redux/Introduction';
import ReduxStore from './Components/Redux/Store';
import ReduxActions from './Components/Redux/Actions';
import ReduxReducers from './Components/Redux/Reducers';
import ReduxToolkit from './Components/Redux/ReduxToolkit';
import ReduxRTKQuery from './Components/Redux/RTKQuery';
import ReduxMiddleware from './Components/Redux/Middleware';
import ReduxSelectors from './Components/Redux/Selectors';
import ReduxReact from './Components/Redux/ReactIntegration';
import ReduxQuestions from './Components/Redux/Questions';

// Next.js
import NextJSIntroduction from './Components/NextJS/Introduction';
import NextJSAppRouter from './Components/NextJS/AppRouter';
import NextJSFileRouting from './Components/NextJS/FileRouting';
import NextJSServerClientComponents from './Components/NextJS/ServerClientComponents';
import NextJSDataFetching from './Components/NextJS/DataFetching';
import NextJSSSGSSRISR from './Components/NextJS/SSGSSRISR';
import NextJSDynamicRoutes from './Components/NextJS/DynamicRoutes';
import NextJSAPIRoutes from './Components/NextJS/APIRoutes';
import NextJSMiddleware from './Components/NextJS/Middleware';
import NextJSImage from './Components/NextJS/Image';
import NextJSEnv from './Components/NextJS/Env';
import NextJSMetadata from './Components/NextJS/Metadata';
import NextJSLoadingError from './Components/NextJS/LoadingError';
import NextJSCaching from './Components/NextJS/Caching';

// TypeScript
import TypeScriptIntroduction from './Components/TypeScript/Introduction';
import TypeScriptBasicTypes from './Components/TypeScript/BasicTypes';
import TypeScriptInterfaces from './Components/TypeScript/Interfaces';
import TypeScriptTypeAliases from './Components/TypeScript/TypeAliases';
import TypeScriptUnionLiteral from './Components/TypeScript/UnionLiteral';
import TypeScriptGenerics from './Components/TypeScript/Generics';
import TypeScriptEnums from './Components/TypeScript/Enums';
import TypeScriptTypeAssertions from './Components/TypeScript/TypeAssertions';
import TypeScriptUtilityTypes from './Components/TypeScript/UtilityTypes';
import TypeScriptTypeGuards from './Components/TypeScript/TypeGuards';
import TypeScriptConfig from './Components/TypeScript/Config';

// Redis & BullMQ
import RedisIntroduction from './Components/Redis/Introduction';
import RedisDataTypes from './Components/Redis/DataTypes';
import RedisExpiryEviction from './Components/Redis/ExpiryEviction';
import RedisCaching from './Components/Redis/Caching';
import RedisPersistence from './Components/Redis/Persistence';
import RedisPubSubStreams from './Components/Redis/PubSubStreams';
import RedisTransactionsLua from './Components/Redis/TransactionsLua';
import RedisLocksRateLimiting from './Components/Redis/LocksRateLimiting';
import RedisScaling from './Components/Redis/Scaling';
import RedisNodeJS from './Components/Redis/RedisNodeJS';
import BullMQIntroduction from './Components/Redis/BullMQIntroduction';
import BullMQJobsWorkers from './Components/Redis/BullMQJobsWorkers';
import BullMQAdvanced from './Components/Redis/BullMQAdvanced';
import RedisQuestions from './Components/Redis/Questions';

// NestJS
import NestJSIntroduction from './Components/NestJS/Introduction';
import NestJSModules from './Components/NestJS/Modules';
import NestJSControllers from './Components/NestJS/Controllers';
import NestJSProviders from './Components/NestJS/Providers';
import NestJSRequestLifecycle from './Components/NestJS/RequestLifecycle';
import NestJSMiddleware from './Components/NestJS/Middleware';
import NestJSPipesValidation from './Components/NestJS/PipesValidation';
import NestJSGuards from './Components/NestJS/Guards';
import NestJSInterceptors from './Components/NestJS/Interceptors';
import NestJSExceptionFilters from './Components/NestJS/ExceptionFilters';
import NestJSConfiguration from './Components/NestJS/Configuration';
import NestJSDatabase from './Components/NestJS/Database';
import NestJSAuthentication from './Components/NestJS/Authentication';
import NestJSAdvanced from './Components/NestJS/Advanced';
import NestJSTesting from './Components/NestJS/Testing';
import NestJSMicroservicesWebSockets from './Components/NestJS/MicroservicesWebSockets';
import NestJSBestPractices from './Components/NestJS/BestPractices';
import NestJSQuestions from './Components/NestJS/Questions';

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
   path: '/dsa',
   element: <DSABasics />,
  },
  {
    path: '/dsa-basics',
    element: <DSABasics />,
  },
  {
    path: '/dsa-bubble-sort',
    element: <DSABubbleSort />,
  },
  {
    path: '/dsa-selection-sort',
    element: <DSASelectionSort />,
  },
  {
    path: '/dsa-insertion-sort',
    element: <DSAInsertionSort />,
  },
  {
    path: '/dsa-quick-sort',
    element: <DSAQuickSort />,
  },
  {
    path: '/dsa-merge-sort',
    element: <DSAMergeSort />,
  },
  {
    path: '/dsa-stack',
    element: <DSAStack />,
  },
  {
    path: '/dsa-queue',
    element: <DSAQueue />,
  },
  {
    path: '/dsa-linked-list',
    element: <DSALinkedList />,
  },
  {
    path: '/dsa-doubly-linked-list',
    element: <DSADoublyLinkedList />,
  },
  {
    path: '/dsa-tree',
    element: <DSATree />,
  },
  {
    path: '/dsa-graph',
    element: <DSAGraph />,
  },
  {
   path:'/impqueries',
   element:<IMPQueries/>
  },
  {
    path: '/mysql-introduction',
    element: <MySQLIntroduction />,
  },
  {
    path: '/mysql-basics',
    element: <MySQLBasics />,
  },
  {
    path: '/mysql-normalization',
    element: <MySQLNormalization />,
  },
  {
    path: '/mysql-acid',
    element: <MySQLACID />,
  },
  {
    path: '/mysql-joins',
    element: <MySQLJoins />,
  },
  {
    path: '/mysql-queries',
    element: <MySQLQueries />,
  },
  {
    path: '/mysql-aggregate',
    element: <MySQLAggregate />,
  },
  {
    path: '/mysql-indexes',
    element: <MySQLIndexes />,
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
    path: '/string-coercion',
    element: <StringCoercion />,
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
  {
    path: '/nodejs-eventloop',
    element: <NodeEventLoop />,
  },
  {
    path: '/nodejs-buffers-streams',
    element: <NodeBuffersStreams />,
  },
  {
    path: '/nodejs-http',
    element: <NodeHTTPModule />,
  },
  {
    path: '/nodejs-path-process',
    element: <NodePathProcess />,
  },
  {
    path: '/nodejs-error-handling',
    element: <NodeErrorHandling />,
  },
  {
    path: '/nodejs-request-response',
    element: <RequestResponse />,
  },
  {
    path: '/nodejs-express-error-handling',
    element: <ExpressErrorHandling />,
  },
  {
    path: '/nodejs-static-cors',
    element: <StaticCORS />,
  },
  {
    path: '/nodejs-body-validation',
    element: <BodyValidation />,
  },
  {
    path: '/nodejs-security',
    element: <Security />,
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
    element: <ReduxIntroduction />,
  },
  {
    path: '/redux-introduction',
    element: <ReduxIntroduction />,
  },
  {
    path: '/redux-store',
    element: <ReduxStore />,
  },
  {
    path: '/redux-actions',
    element: <ReduxActions />,
  },
  {
    path: '/redux-reducers',
    element: <ReduxReducers />,
  },
  {
    path: '/redux-toolkit',
    element: <ReduxToolkit />,
  },
  {
    path: '/redux-rtk-query',
    element: <ReduxRTKQuery />,
  },
  {
    path: '/redux-middleware',
    element: <ReduxMiddleware />,
  },
  {
    path: '/redux-selectors',
    element: <ReduxSelectors />,
  },
  {
    path: '/redux-react',
    element: <ReduxReact />,
  },
  {
    path: '/redux-questions',
    element: <ReduxQuestions />,
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
    path: '/memory-object-references',
    element: <MemoryObjectReferences />,
  },
  // Next.js
  { path: '/nextjs-introduction', element: <NextJSIntroduction /> },
  { path: '/nextjs-app-router', element: <NextJSAppRouter /> },
  { path: '/nextjs-file-routing', element: <NextJSFileRouting /> },
  { path: '/nextjs-server-client-components', element: <NextJSServerClientComponents /> },
  { path: '/nextjs-data-fetching', element: <NextJSDataFetching /> },
  { path: '/nextjs-ssg-ssr-isr', element: <NextJSSSGSSRISR /> },
  { path: '/nextjs-dynamic-routes', element: <NextJSDynamicRoutes /> },
  { path: '/nextjs-api-routes', element: <NextJSAPIRoutes /> },
  { path: '/nextjs-middleware', element: <NextJSMiddleware /> },
  { path: '/nextjs-image', element: <NextJSImage /> },
  { path: '/nextjs-env', element: <NextJSEnv /> },
  { path: '/nextjs-metadata', element: <NextJSMetadata /> },
  { path: '/nextjs-loading-error', element: <NextJSLoadingError /> },
  { path: '/nextjs-caching', element: <NextJSCaching /> },
  // TypeScript
  { path: '/typescript-introduction', element: <TypeScriptIntroduction /> },
  { path: '/typescript-basic-types', element: <TypeScriptBasicTypes /> },
  { path: '/typescript-interfaces', element: <TypeScriptInterfaces /> },
  { path: '/typescript-type-aliases', element: <TypeScriptTypeAliases /> },
  { path: '/typescript-union-literal', element: <TypeScriptUnionLiteral /> },
  { path: '/typescript-generics', element: <TypeScriptGenerics /> },
  { path: '/typescript-enums', element: <TypeScriptEnums /> },
  { path: '/typescript-type-assertions', element: <TypeScriptTypeAssertions /> },
  { path: '/typescript-utility-types', element: <TypeScriptUtilityTypes /> },
  { path: '/typescript-type-guards', element: <TypeScriptTypeGuards /> },
  { path: '/typescript-config', element: <TypeScriptConfig /> },
  { path: '/redis', element: <RedisIntroduction /> },
  { path: '/redis-introduction', element: <RedisIntroduction /> },
  { path: '/redis-data-types', element: <RedisDataTypes /> },
  { path: '/redis-expiry-eviction', element: <RedisExpiryEviction /> },
  { path: '/redis-caching', element: <RedisCaching /> },
  { path: '/redis-persistence', element: <RedisPersistence /> },
  { path: '/redis-pubsub-streams', element: <RedisPubSubStreams /> },
  { path: '/redis-transactions-lua', element: <RedisTransactionsLua /> },
  { path: '/redis-locks-rate-limiting', element: <RedisLocksRateLimiting /> },
  { path: '/redis-scaling', element: <RedisScaling /> },
  { path: '/redis-nodejs', element: <RedisNodeJS /> },
  { path: '/bullmq-introduction', element: <BullMQIntroduction /> },
  { path: '/bullmq-jobs-workers', element: <BullMQJobsWorkers /> },
  { path: '/bullmq-advanced', element: <BullMQAdvanced /> },
  { path: '/redis-questions', element: <RedisQuestions /> },
  { path: '/nestjs', element: <NestJSIntroduction /> },
  { path: '/nestjs-introduction', element: <NestJSIntroduction /> },
  { path: '/nestjs-modules', element: <NestJSModules /> },
  { path: '/nestjs-controllers', element: <NestJSControllers /> },
  { path: '/nestjs-providers', element: <NestJSProviders /> },
  { path: '/nestjs-request-lifecycle', element: <NestJSRequestLifecycle /> },
  { path: '/nestjs-middleware', element: <NestJSMiddleware /> },
  { path: '/nestjs-pipes-validation', element: <NestJSPipesValidation /> },
  { path: '/nestjs-guards', element: <NestJSGuards /> },
  { path: '/nestjs-interceptors', element: <NestJSInterceptors /> },
  { path: '/nestjs-exception-filters', element: <NestJSExceptionFilters /> },
  { path: '/nestjs-configuration', element: <NestJSConfiguration /> },
  { path: '/nestjs-database', element: <NestJSDatabase /> },
  { path: '/nestjs-authentication', element: <NestJSAuthentication /> },
  { path: '/nestjs-advanced', element: <NestJSAdvanced /> },
  { path: '/nestjs-testing', element: <NestJSTesting /> },
  { path: '/nestjs-microservices-websockets', element: <NestJSMicroservicesWebSockets /> },
  { path: '/nestjs-best-practices', element: <NestJSBestPractices /> },
  { path: '/nestjs-questions', element: <NestJSQuestions /> },
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
