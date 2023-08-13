import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import reduxThunk from 'redux-thunk';
import { AchivementReducer } from './reducers/AchivementReducer';
import { ProcessTypeReducer } from './reducers/ProcessTypeReducer';
import { ReportType } from './reducers/ReportType'
import { RoleReducer } from './reducers/RoleReducer';
import { ActivityReducer } from './reducers/ActivityReducer';
import { baiTapGameXucXacReducer } from './reducers/baiTapGameXucXacReducer';
import { ConfigActivityReducer } from './reducers/ConfigActivityReducer';
import { FanpageReducer } from './reducers/FanpageReducer';
import { LoginReducer } from './reducers/LoginReducer';
import { HistoryReducer } from './reducers/HistoryReducer';
import { DonationReducer } from './reducers/DonatonReducer';
import { LoadingReducer } from './reducers/LoadingReducer';
import { UserReducer } from './reducers/UserReducer';
import { ModeratorReducer } from './reducers/ModeratorReducer';
import { ReportReducer } from './reducers/ReportReducer';
import { EndActivityReducer } from './reducers/EndActivityReducer';
import { ProfileReducer } from './reducers/ProfileReducer';
import { StatisticalReducer } from './reducers/StatisticalReducer';


const rootReducer = combineReducers({
    AchivementReducer,
    ProcessTypeReducer,
    ReportType,
    RoleReducer,
    ActivityReducer,
    baiTapGameXucXacReducer,
    ConfigActivityReducer,
    FanpageReducer,
    LoginReducer,
    HistoryReducer,
    DonationReducer,
    LoadingReducer,
    UserReducer,
    ModeratorReducer,
    ReportReducer,
    EndActivityReducer,
    ProfileReducer,
    StatisticalReducer,
})

let middleWare = applyMiddleware(reduxThunk);
let composeCustom = compose(middleWare, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export const store = createStore(rootReducer, composeCustom);