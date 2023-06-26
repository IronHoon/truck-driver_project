import React from 'react';
import {SafeAreaView} from 'react-native';
import AfterExam from '../../views/exam/AfterExam';
import {useRoute} from '@react-navigation/native';

const AfterExamPage = () => {
  const {
    //@ts-ignore
    params: {
      type,
      score,
      setProblemNum,
      setScore,
      setTimer,
      setRetry,
      real,
      level,
    },
  } = useRoute();
  return (
    <SafeAreaView style={{flex: 1}}>
      <AfterExam
        type={type}
        score={score}
        setProblemNum={setProblemNum}
        setScore={setScore}
        setTimer={setTimer}
        setRetry={setRetry}
        real={real}
        level={level}
      />
    </SafeAreaView>
  );
};

export default AfterExamPage;
