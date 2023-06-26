import React from 'react';
import {ActivityIndicator, Text, View} from 'react-native';
import tw from 'twrnc';

type SwrContainerProps<T> = {
  error?: any;
  data: T;
  loadingIndicator?: React.ReactNode;
  errorView?: React.ReactNode;
  children?: React.ReactElement;
};

function DefaultError({error}: any) {
  // console.warn(error?.response.data || error);
  return (
    <View style={tw`bg-red-100 p-6`}>
      <Text>Error : {error}</Text>
    </View>
  );
}

function DefaultIndicator() {
  return <ActivityIndicator size="small" color="#0000ff" />;
}

const SwrContainer = ({
  error,
  data,
  loadingIndicator,
  errorView,
  children,
}: SwrContainerProps<any>) => {
  if (error)
    return errorView ? <>{errorView}</> : <DefaultError error={error} />;
  if (!data)
    return loadingIndicator ? (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        {loadingIndicator}
      </View>
    ) : (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <DefaultIndicator />
      </View>
    );
  return <>{children}</>;
};

export default SwrContainer;
