import * as React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from 'react-native-screens/native-stack';
import SplashPage from '../pages/SplashPage';
import LandingPage from '../pages/LandingPage';
import SignUpPage from '../pages/SignUpPage';
import InfiniteRankingPage from '../pages/infiniteRanking/InfiniteRankingPage';
import RankingPage from '../pages/infiniteRanking/RankingPage';
import InfiniteOxPage from '../pages/infiniteRanking/InfiniteOxPage';
import OxMainPage from '../pages/ox/OxMainPage';
import OxProblemPage from '../pages/ox/OxProblemPage';
import ExamMainPage from '../pages/exam/ExamMainPage';
import ExamProblemPage from '../pages/exam/ExamProblemPage';
import MainPage from '../pages/MainPage';
import ChartPage from '../pages/exam/ChartPage';
import MyInfoPage from '../pages/exam/MyInfoPage';
import AfterExamPage from '../pages/exam/AfterExamPage';
import {Platform} from 'react-native';

export type MainNavigatorRouteParams = {
  '/': undefined;
  '/main': {
    token: string;
  };
  '/landing': undefined;
  '/signup': {
    id: string;
    loginType: string;
  };
  '/infiniteRanking': undefined;
  '/infiniteRanking/ranking': undefined;
  '/infiniteRanking/ox': undefined;
  '/oxMain': undefined;
  '/oxMain/problem': {
    type: string;
    level: number;
  };
  '/examMain': {
    back?: boolean;
  };
  '/examMain/afterExam': {
    type: string;
    score: number;
    setProblemNum: (num: number) => void;
    setScore: (num: number) => void;
    setTimer?: (num: number) => void;
    level: number;
    real?: boolean;
  };
  '/examMain/chart': undefined;
  '/examMain/problem': {
    type: string;
    level: number;
  };
  '/examMain/chart/myInfo': {
    avg: number;
  };
};

export type MainNavigationProp = NativeStackNavigationProp<
  MainNavigatorRouteParams,
  '/'
>;

const Stack = createNativeStackNavigator<MainNavigatorRouteParams>();

function MainNavigator() {
  var platform = Platform.OS === 'ios';
  return (
    <Stack.Navigator
      initialRouteName={'/'}
      screenOptions={{
        headerShown: false,
        stackAnimation: 'slide_from_right',
      }}>
      <Stack.Screen name="/" component={SplashPage} />
      <Stack.Screen name="/landing" component={LandingPage} />
      <Stack.Screen name="/main" component={MainPage} />
      <Stack.Screen name="/signup" component={SignUpPage} />
      <Stack.Screen name="/infiniteRanking" component={InfiniteRankingPage} />
      <Stack.Screen name="/infiniteRanking/ranking" component={RankingPage} />
      <Stack.Screen name="/infiniteRanking/ox" component={InfiniteOxPage} />
      <Stack.Screen name="/oxMain" component={OxMainPage} />
      <Stack.Screen name="/oxMain/problem" component={OxProblemPage} />
      <Stack.Screen name="/examMain" component={ExamMainPage} />
      <Stack.Screen name="/examMain/afterExam" component={AfterExamPage} />
      <Stack.Screen name="/examMain/chart" component={ChartPage} />
      <Stack.Screen name="/examMain/problem" component={ExamProblemPage} />
      <Stack.Screen name="/examMain/chart/myInfo" component={MyInfoPage} />
    </Stack.Navigator>
  );
}

export default MainNavigator;
