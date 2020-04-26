/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';
import { ChatScreen } from '../pantallas/ChatScreen';

import requestGuido from '../networking/ChotuveRequestsNew';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  renderer.create(<App />);
});

it('mi propio primer test', () => {
  let myChatScreen = renderer.create(<ChatScreen />).getInstance();

  expect(myChatScreen.change(2)).toEqual(20);
});

test('the data are some movies', () => {
  return requestGuido.fetchData().then((data) => {
    console.log(data);
    expect(data).toBe(data);
  });
});
