# NestJS - Copy Guide

How to add the new **NestJS** section to another copy of this project.
There are **2 things to copy** and **3 files to edit**.

---

## Step 1: Copy the new folder

Copy this whole folder into the same place in the other project:

```
src/Components/NestJS/
```

It contains 18 files:

```
Introduction.jsx          Modules.jsx              Controllers.jsx
Providers.jsx             RequestLifecycle.jsx     Middleware.jsx
PipesValidation.jsx       Guards.jsx               Interceptors.jsx
ExceptionFilters.jsx      Configuration.jsx        Database.jsx
Authentication.jsx        Advanced.jsx             Testing.jsx
MicroservicesWebSockets.jsx  BestPractices.jsx     Questions.jsx
```

## Step 2: Copy this guide (optional)

```
NESTJS.md   (project root)
```

---

## Step 3: Edit `src/index.js` (2 places)

**3a.** Find this line:

```javascript
import RedisQuestions from './Components/Redis/Questions';
```

Paste this **right below it**:

```javascript
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
```

**3b.** Find this line (inside `createBrowserRouter([...])`):

```javascript
  { path: '/redis-questions', element: <RedisQuestions /> },
```

Paste this **right below it**:

```javascript
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
```

---

## Step 4: Edit `src/utils/navbarData.js` (1 place)

Find the last card:

```javascript
  {
    title: 'Interview Questions',
```

Paste the `NestJS` card **right above it**. Copy it from `src/utils/navbarData.js` in this project (search for `title: 'NestJS'`).

---

## Step 5: Edit `src/data/interviewData.js` (1 place)

Find this line:

```javascript
  {
    title: "DSA - Array",
```

Paste the `NestJS` section **right above it**. Copy it from `src/data/interviewData.js` in this project (search for `title: "NestJS"`).
The `NestJS Questions` page reads its questions from here, and they also show on the main Interview Questions page.
