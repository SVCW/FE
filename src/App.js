
import './App.css';
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { AdminTemplate } from "./templates/AdminTemplate/AdminTemplate";
import Achivement from './pages/Achivement/Achivement';
import ProcessType from './pages/ProcessType/ProcessType';
import ReportType from './pages/ReportType/ReportType';
import Login from './pages/Login/Login';
import { createBrowserHistory } from 'history'
import Role from './pages/Role/Role';
import Home from './pages/Home/Home';
import { UserTemplate } from './templates/UserTemplate/UserTemplate';
import Group from './pages/Groups/Group';
import GroupsDetail from './pages/GroupsDetail/GroupsDetail';
import Profile from './pages/Profile/Profile';
import Result from './pages/Result/Result';
import BaiTapGameXucXac from './pages/BaiTapGameXucXac/BaiTapGameXucXac';
// import FormComponent from './FormStep';
import MultiForm from './MultiForm';
import Test from './Test';
import DetailProcess from './pages/DetailProcess/DetailProcess';
import CreateFanpage from './pages/Fanpage/CreateFanpage';
// import MultiStepForm from './MultiStepForm';
// import MultiStepForm1 from './MultiStepForm1';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const history = createBrowserHistory()

function App () {

  return (
    <>
      <Router history={history}>
      <Switch>
        {/* <AboutUniversity /> */}
        {/* <SignIn /> */}
        {/* <Home /> */}

        <AdminTemplate exact path="/achivement" Component={Achivement} />
        <AdminTemplate exact path="/processtype" Component={ProcessType} />
        <AdminTemplate exact path="/reporttype" Component={ReportType} />
        <AdminTemplate exact path="/role" Component={Role} />
        {/* <AdminTemplate exact path="/table" Component={Admin} /> */}
        <UserTemplate exact path="/home" Component={Home} />
        <UserTemplate exact path="/groups" Component={Group} />
        <UserTemplate exact path="/fanpage/:id" Component={GroupsDetail} />
        <UserTemplate exact path="/groupsdetail" Component={GroupsDetail} />
        <UserTemplate exact path="/profile/:id" Component={Profile} />
        <UserTemplate exact path="/history" Component={Result} />
        <UserTemplate exact path="/detailprocess/:id" Component={DetailProcess} />
        <UserTemplate exact path="/createfanpage" Component={CreateFanpage} />
        <Route exact path="/test" component={MultiForm} />
        <Route exact path="/test1" component={Test} />
        {/* <Route exact path="/test1" component={MultiStepForm1} /> */}
        <UserTemplate exact path="/game" Component={BaiTapGameXucXac} />
        <Route exact path="/" component={Login} />

      </Switch>
    </Router>
    <ToastContainer/>
    </>
  );
}

export default App;
