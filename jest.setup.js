import '@testing-library/jest-native/extend-expect';

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    Ionicons: (props) => <View testID="mock-ionicons" {...props} />,
    MaterialIcons: (props) => <View testID="mock-materialicons" {...props} />,
    FontAwesome: (props) => <View testID="mock-fontawesome" {...props} />,
  };
});
